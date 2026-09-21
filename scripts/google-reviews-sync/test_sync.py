"""
Local, offline unit checks for sync.py's pure logic (no network, no credentials,
no Shopify). Run:   py test_sync.py
"""
import contextlib
import io
import json
import sys
import unittest
from unittest import mock

import config
import probe_shopify
import shopify_client
import sync


def review(stars, text="great", name="Priya Sharma"):
    r = {"starRating": stars, "reviewer": {"displayName": name}}
    if text is not None:
        r["comment"] = text
    return r


class NameFormatting(unittest.TestCase):
    def check(self, raw, expected):
        self.assertEqual(sync.format_reviewer_name(raw), expected, raw)

    def test_examples_from_real_data(self):
        self.check("Sakshi kachharae", "Sakshi K.")
        self.check("AASHVI SHAH", "Aashvi S.")
        self.check("ASHITA CHORDIA", "Ashita C.")
        self.check("juee vora", "Juee V.")
        self.check("ravneet bijan", "Ravneet B.")
        self.check("Karishma Abhishek Sindhu", "Karishma S.")
        self.check("S Kaur", "S K.")
        self.check("Sim K", "Sim K.")
        self.check("Kiran", "Kiran")
        self.check("Simran Jobanputra", "Simran J.")

    def test_mixed_case_left_alone(self):
        self.check("DeShawn mcDonald", "DeShawn M.")
        self.check("Priya D'Souza", "Priya D.")

    def test_hyphen_apostrophe_and_unicode(self):
        self.check("anne-marie o'brien", "Anne-Marie O.")
        self.check("élodie ñandú", "Élodie Ñ.")
        self.check("ÉLODIE ÑANDÚ", "Élodie Ñ.")
        self.check("Priya ’Sharma", "Priya S.")  # leading punctuation on last word skipped

    def test_no_letters_and_empty(self):
        self.check("", sync.ANONYMOUS_NAME)
        self.check("   ", sync.ANONYMOUS_NAME)
        self.check(None, sync.ANONYMOUS_NAME)
        self.check("A Google User", sync.ANONYMOUS_NAME)
        self.check("Priya \U0001F49C", "Priya")  # last word has no letters
        self.check("  Priya    Sharma  ", "Priya S.")


class RatingAndSelection(unittest.TestCase):
    def setUp(self):
        self._min, self._max = config.MIN_STAR_RATING, config.MAX_REVIEWS
        config.MIN_STAR_RATING, config.MAX_REVIEWS = 4, 5

    def tearDown(self):
        config.MIN_STAR_RATING, config.MAX_REVIEWS = self._min, self._max

    def test_enum_mapping(self):
        for name, n in {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5}.items():
            self.assertEqual(sync.star_rating_value({"starRating": name}), n)
        self.assertEqual(sync.star_rating_value({"starRating": "STAR_RATING_UNSPECIFIED"}), 0)
        self.assertEqual(sync.star_rating_value({}), 0)

    def test_filter_and_order_and_cap(self):
        reviews = [
            review("FIVE", text=None),          # no text  -> excluded
            review("ONE", text="awful"),         # too low  -> excluded
            review("FIVE", text="   "),          # blank    -> excluded
            review("FOUR", text="good", name="a b"),
            review("THREE", text="meh"),         # too low  -> excluded
            review("FIVE", text="one"), review("FIVE", text="two"),
            review("FIVE", text="three"), review("FIVE", text="four"),
        ]
        b = sync.classify_reviews(reviews)
        self.assertEqual((len(b["no_text"]), len(b["below_min_rating"]), len(b["eligible"])), (2, 2, 5))
        payload = sync.transform_reviews({"reviews": reviews, "average_rating": 4.699999809, "total_review_count": 67})
        self.assertEqual([r["quote"] for r in payload["reviews"]], ["good", "one", "two", "three", "four"])
        self.assertEqual(payload["reviews"][0]["reviewer_name"], "A B.")

    def test_totals_come_from_google_unchanged(self):
        payload = sync.transform_reviews({"reviews": [review("ONE", "bad")], "average_rating": 4.699999809, "total_review_count": 67})
        self.assertEqual(payload["rating_number"], "4.7")
        self.assertEqual(payload["rating_count"], 67)
        self.assertEqual(payload["rating_label"], "4.7 · 67 Google Reviews")
        self.assertEqual(payload["reviews"], [])  # fewer than 5 eligible degrades to fewer cards (here 0)

    def test_fewer_than_max_degrades(self):
        payload = sync.transform_reviews({"reviews": [review("FIVE", "a"), review("FOUR", "b")], "average_rating": 5, "total_review_count": 2})
        self.assertEqual(len(payload["reviews"]), 2)

    def test_payload_reviews_carry_numeric_rating(self):
        payload = sync.transform_reviews({"reviews": [review("FIVE", "a"), review("FOUR", "b"), review("THREE", "c")], "average_rating": 5, "total_review_count": 3})
        self.assertEqual([(r["quote"], r["rating"]) for r in payload["reviews"]], [("a", 5), ("b", 4)])
        for r in payload["reviews"]:
            self.assertIsInstance(r["rating"], int)
            self.assertGreaterEqual(r["rating"], config.MIN_STAR_RATING)

    def test_threshold_is_configurable(self):
        config.MIN_STAR_RATING = 5
        payload = sync.transform_reviews({"reviews": [review("FOUR", "a"), review("FIVE", "b")], "average_rating": 5, "total_review_count": 2})
        self.assertEqual([r["quote"] for r in payload["reviews"]], ["b"])


class TranslatedComments(unittest.TestCase):
    HINDI = "आउटफिट बहुत पसंद आया"

    def test_translated_with_original_uses_original(self):
        c = "(Translated by Google) Loved the outfit!\n\n(Original) " + self.HINDI
        self.assertEqual(sync.review_text(c), self.HINDI)
        self.assertTrue(sync.has_translation_prefix(c))

    def test_translated_without_original_falls_back_to_text_after_prefix(self):
        self.assertEqual(sync.review_text("(Translated by Google) Loved the outfit!"), "Loved the outfit!")
        self.assertEqual(sync.review_text("  (Translated by Google)   Loved it  "), "Loved it")

    def test_original_marker_with_empty_original_uses_translated_text(self):
        self.assertEqual(sync.review_text("(Translated by Google) Loved it\n\n(Original) "), "Loved it")

    def test_normal_comment_unchanged(self):
        for c in ["Absolutely loved it!", "  padded  ", "Mentions (Original) design but no prefix", "Not (Translated by Google) at start"]:
            self.assertEqual(sync.review_text(c), c.strip())
            self.assertFalse(sync.has_translation_prefix(c))
        self.assertEqual(sync.review_text(None), "")
        self.assertEqual(sync.review_text(""), "")

    def test_marker_strings_never_published(self):
        reviews = [
            review("FIVE", "(Translated by Google) Nice\n\n(Original) Bien"),
            review("FIVE", "(Translated by Google) Only translated"),
            review("FIVE", "(Translated by Google) \n\n(Original) "),  # nothing left -> no text
        ]
        payload = sync.transform_reviews({"reviews": reviews, "average_rating": 5, "total_review_count": 3})
        self.assertEqual([r["quote"] for r in payload["reviews"]], ["Bien", "Only translated"])
        for r in payload["reviews"]:
            self.assertNotIn("Translated by Google", r["quote"])
            self.assertNotIn("(Original)", r["quote"])
        self.assertEqual(len(sync.classify_reviews(reviews)["no_text"]), 1)


class FakeResponse:
    def __init__(self, status=200, body=None, text=None):
        self.status_code = status
        self._body = body if body is not None else {}
        self.text = text if text is not None else json.dumps(self._body)

    def json(self):
        return self._body


class ShopifyAuth(unittest.TestCase):
    SECRET = "shpss_SUPERSECRET"
    TOKEN = "shpat_TOKENVALUE"

    def setUp(self):
        self._saved = (config.SHOPIFY_CLIENT_ID, config.SHOPIFY_CLIENT_SECRET, config.SHOPIFY_ADMIN_API_TOKEN, config.SHOPIFY_STORE_DOMAIN)
        config.SHOPIFY_CLIENT_ID, config.SHOPIFY_CLIENT_SECRET, config.SHOPIFY_ADMIN_API_TOKEN = "cid", self.SECRET, ""
        config.SHOPIFY_STORE_DOMAIN = "example.myshopify.com"
        shopify_client._reset_token_cache()

    def tearDown(self):
        (config.SHOPIFY_CLIENT_ID, config.SHOPIFY_CLIENT_SECRET, config.SHOPIFY_ADMIN_API_TOKEN, config.SHOPIFY_STORE_DOMAIN) = self._saved
        shopify_client._reset_token_cache()

    def test_is_configured_variants(self):
        self.assertTrue(shopify_client.is_configured())
        config.SHOPIFY_CLIENT_SECRET = ""
        self.assertFalse(shopify_client.is_configured())
        config.SHOPIFY_ADMIN_API_TOKEN = "legacy"
        self.assertTrue(shopify_client.is_configured())
        config.SHOPIFY_ADMIN_API_TOKEN = ""
        self.assertFalse(shopify_client.is_configured())

    def test_client_credentials_request_shape_and_cache(self):
        ok = FakeResponse(200, {"access_token": self.TOKEN, "scope": "write_products", "expires_in": 86399})
        with mock.patch.object(shopify_client.requests, "post", return_value=ok) as post:
            self.assertEqual(shopify_client.get_access_token(), self.TOKEN)
            self.assertEqual(shopify_client.get_access_token(), self.TOKEN)  # cached, no second call
            self.assertEqual(post.call_count, 1)
            args, kwargs = post.call_args
            self.assertEqual(args[0], "https://example.myshopify.com/admin/oauth/access_token")
            self.assertEqual(kwargs["data"], {"grant_type": "client_credentials", "client_id": "cid", "client_secret": self.SECRET})
        self.assertEqual(shopify_client.get_granted_scope(), "write_products")

    def test_expired_token_is_refreshed(self):
        ok = FakeResponse(200, {"access_token": self.TOKEN, "expires_in": 86399})
        with mock.patch.object(shopify_client.requests, "post", return_value=ok) as post:
            shopify_client.get_access_token()
            shopify_client._token_cache["expires_at"] = 0  # force expiry
            shopify_client.get_access_token()
            self.assertEqual(post.call_count, 2)

    def test_failure_message_never_contains_secret_or_token(self):
        bad = FakeResponse(400, {"error": "invalid_client"}, text='{"error":"invalid_client"}')
        with mock.patch.object(shopify_client.requests, "post", return_value=bad):
            with self.assertRaises(shopify_client.ShopifyWriteError) as cm:
                shopify_client.get_access_token()
        msg = str(cm.exception)
        self.assertIn("400", msg)
        self.assertIn("invalid_client", msg)
        self.assertNotIn(self.SECRET, msg)

    def test_static_token_fallback_and_priority(self):
        config.SHOPIFY_ADMIN_API_TOKEN = "legacy-static"
        with mock.patch.object(shopify_client.requests, "post", side_effect=AssertionError("no network expected")):
            config.SHOPIFY_CLIENT_ID = ""  # creds not set -> static token
            self.assertEqual(shopify_client.get_access_token(), "legacy-static")
        ok = FakeResponse(200, {"access_token": self.TOKEN, "expires_in": 86399})
        config.SHOPIFY_CLIENT_ID = "cid"  # creds set -> preferred over static
        with mock.patch.object(shopify_client.requests, "post", return_value=ok):
            self.assertEqual(shopify_client.get_access_token(), self.TOKEN)

    def test_not_configured_raises(self):
        config.SHOPIFY_CLIENT_ID = config.SHOPIFY_CLIENT_SECRET = config.SHOPIFY_ADMIN_API_TOKEN = ""
        with self.assertRaises(shopify_client.ShopifyAuthNotConfigured):
            shopify_client.get_access_token()

    def test_graphql_uses_fresh_token_header_and_surfaces_http_body(self):
        seq = [
            FakeResponse(200, {"access_token": self.TOKEN, "expires_in": 86399}),
            FakeResponse(403, {}, text="Access denied: required scope"),
        ]
        with mock.patch.object(shopify_client.requests, "post", side_effect=seq) as post:
            with self.assertRaises(shopify_client.ShopifyWriteError) as cm:
                shopify_client._graphql("query { shop { id } }")
            self.assertEqual(post.call_args_list[1].kwargs["headers"]["X-Shopify-Access-Token"], self.TOKEN)
        self.assertIn("403", str(cm.exception))
        self.assertIn("Access denied", str(cm.exception))
        self.assertNotIn(self.TOKEN, str(cm.exception))


class Probe(unittest.TestCase):
    def setUp(self):
        self._saved = (config.SHOPIFY_CLIENT_ID, config.SHOPIFY_CLIENT_SECRET, config.SHOPIFY_ADMIN_API_TOKEN)
        config.SHOPIFY_CLIENT_ID, config.SHOPIFY_CLIENT_SECRET, config.SHOPIFY_ADMIN_API_TOKEN = "cid", "sec", ""
        shopify_client._reset_token_cache()

    def tearDown(self):
        config.SHOPIFY_CLIENT_ID, config.SHOPIFY_CLIENT_SECRET, config.SHOPIFY_ADMIN_API_TOKEN = self._saved
        shopify_client._reset_token_cache()

    def test_refuses_without_yes_probe_and_makes_no_calls(self):
        with mock.patch.object(shopify_client.requests, "post", side_effect=AssertionError("no network")), \
             mock.patch.object(sys, "argv", ["probe_shopify.py"]), contextlib.redirect_stdout(io.StringIO()) as out:
            self.assertEqual(probe_shopify.main(), 3)
        self.assertIn("--yes-probe", out.getvalue())

    def test_probe_key_is_never_the_real_metafield(self):
        self.assertNotEqual((probe_shopify.PROBE_NAMESPACE, probe_shopify.PROBE_KEY), (config.METAFIELD_NAMESPACE, config.METAFIELD_KEY))
        self.assertEqual(probe_shopify.PROBE_KEY, "sync_probe")

    def _run(self, responses):
        calls = []

        def fake_graphql(query, variables=None):
            calls.append(variables)
            r = responses.pop(0)
            if isinstance(r, Exception):
                raise r
            return r

        with mock.patch.object(shopify_client, "get_access_token", return_value="tok"), \
             mock.patch.object(shopify_client, "get_granted_scope", return_value="s1,s2"), \
             mock.patch.object(shopify_client, "_graphql", side_effect=fake_graphql), \
             contextlib.redirect_stdout(io.StringIO()) as out:
            code = probe_shopify.run_probe()
        return code, out.getvalue(), calls

    def test_happy_path_set_read_delete_only_probe_key(self):
        code, out, calls = self._run([
            {"shop": {"id": "gid://shopify/Shop/1"}},
            {"metafieldsSet": {"metafields": [{"key": "sync_probe"}], "userErrors": []}},
            {"shop": {"metafield": {"id": "x", "value": "probe", "type": "single_line_text_field"}}},
            {"metafieldsDelete": {"deletedMetafields": [{"key": "sync_probe"}], "userErrors": []}},
        ])
        self.assertEqual(code, 0)
        self.assertNotIn("google_reviews", json.dumps(calls))
        self.assertIn("sync_probe", json.dumps(calls))
        self.assertNotIn("tok", out.replace("token", ""))  # the token value itself is never printed

    def test_missing_scope_error_is_printed_verbatim_and_nothing_to_delete(self):
        err = [{"field": ["metafields"], "message": "Access denied for metafieldsSet. Required access: write_metafields", "code": "ACCESS_DENIED"}]
        code, out, calls = self._run([
            {"shop": {"id": "gid://shopify/Shop/1"}},
            {"metafieldsSet": {"metafields": [], "userErrors": err}},
        ])
        self.assertEqual(code, 2)
        self.assertIn("Required access: write_metafields", out)
        self.assertEqual(len(calls), 2)  # no read-back / delete attempted when nothing was written

    def test_cleanup_still_runs_if_readback_fails(self):
        code, out, calls = self._run([
            {"shop": {"id": "gid://shopify/Shop/1"}},
            {"metafieldsSet": {"metafields": [{"key": "sync_probe"}], "userErrors": []}},
            shopify_client.ShopifyWriteError("read denied"),
            {"metafieldsDelete": {"deletedMetafields": [{"key": "sync_probe"}], "userErrors": []}},
        ])
        self.assertEqual(code, 2)
        self.assertEqual(len(calls), 4)  # delete was still attempted
        self.assertIn("read denied", out)


class LengthPreference(unittest.TestCase):
    def setUp(self):
        self._saved = (config.MIN_STAR_RATING, config.MAX_REVIEWS, config.PREFERRED_MIN_WORDS, config.PREFERRED_MAX_WORDS)
        config.MIN_STAR_RATING, config.MAX_REVIEWS, config.PREFERRED_MIN_WORDS, config.PREFERRED_MAX_WORDS = 4, 3, 8, 55

    def tearDown(self):
        config.MIN_STAR_RATING, config.MAX_REVIEWS, config.PREFERRED_MIN_WORDS, config.PREFERRED_MAX_WORDS = self._saved

    @staticmethod
    def words(n):
        return " ".join(["word"] * n)

    def quotes(self, reviews):
        return [sync.select_reviews([r for r in reviews], config.MAX_REVIEWS)]

    def test_preferred_length_beats_recency_and_order_stays_newest_first(self):
        reviews = [
            review("FIVE", self.words(3)),    # 0 newest, too short
            review("FIVE", self.words(10)),   # 1 preferred
            review("FIVE", self.words(70)),   # 2 too long
            review("FIVE", self.words(20)),   # 3 preferred
            review("FIVE", self.words(8)),    # 4 preferred (boundary)
            review("FIVE", self.words(30)),   # 5 preferred (older, cut by the cap)
        ]
        chosen = sync.select_reviews(reviews, 3)
        self.assertEqual([sync.word_count(r["comment"]) for r in chosen], [10, 20, 8])

    def test_tops_up_with_non_preferred_newest_first_when_not_enough_preferred(self):
        reviews = [review("FIVE", self.words(3)), review("FIVE", self.words(12)), review("FIVE", self.words(70)), review("FIVE", self.words(4))]
        chosen = sync.select_reviews(reviews, 3)
        # preferred = only the 12-word one; top up with the 3-word and 70-word (newest first); final order = newest first
        self.assertEqual([sync.word_count(r["comment"]) for r in chosen], [3, 12, 70])

    def test_boundaries_55_included_56_not_preferred(self):
        self.assertTrue(sync.is_preferred_length(review("FIVE", self.words(55))))
        self.assertFalse(sync.is_preferred_length(review("FIVE", self.words(56))))
        self.assertFalse(sync.is_preferred_length(review("FIVE", self.words(7))))

    def test_translated_original_is_what_gets_counted(self):
        c = "(Translated by Google) " + self.words(3) + "\n\n(Original) " + self.words(12)
        self.assertTrue(sync.is_preferred_length(review("FIVE", c)))

    def test_rating_number_is_one_decimal_string(self):
        self.assertEqual(sync.star_rating_to_number(5), "5.0")
        self.assertEqual(sync.star_rating_to_number(4), "4.0")
        self.assertEqual(sync.star_rating_to_number(4.699999809265137), "4.7")
        payload = sync.transform_reviews({"reviews": [review("FIVE", self.words(10))], "average_rating": 5, "total_review_count": 1})
        self.assertEqual(payload["rating_number"], "5.0")
        self.assertEqual(payload["rating_label"], "5.0 \u00b7 1 Google Reviews")


if __name__ == "__main__":
    unittest.main(verbosity=2)
