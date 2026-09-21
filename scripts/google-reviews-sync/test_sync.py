"""
Local, offline unit checks for sync.py's pure logic (no network, no credentials,
no Shopify). Run:   py test_sync.py
"""
import unittest

import config
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

    def test_threshold_is_configurable(self):
        config.MIN_STAR_RATING = 5
        payload = sync.transform_reviews({"reviews": [review("FOUR", "a"), review("FIVE", "b")], "average_rating": 5, "total_review_count": 2})
        self.assertEqual([r["quote"] for r in payload["reviews"]], ["b"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
