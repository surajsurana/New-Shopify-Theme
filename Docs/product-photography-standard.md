# Product Photography Standard
**Status:** Adopted 2026-09-07 for all new photography. A full existing-catalog
audit was separately commissioned the same day to find genuine crop
problems in current photos (see `Docs/pending-tasks.md` item #27) -- this is
a targeted fix-what's-actually-broken pass, not a blanket reprocessing of
every existing image to the new 3000x4000 size.

---

## The standard

**One fixed size for every product photo: 3000 × 4000px, exactly 3:4 (portrait).**

No alternates, no per-shoot variation. Every product photo — front, back, side, closeup, detail — gets shot or cropped to this exact pixel size before upload. Chosen at the higher end of the reasonable range specifically because the product gallery already has a pinch/zoom feature; this gives it real image quality to zoom into rather than upscaling a smaller source.

## Why 3:4 specifically

Every image box on the live site — the product page's main image, the thumbnail rail, collection grid cards, search results, Journal cards — is already built around a fixed 3:4 crop box. This has been true for a while; it just wasn't visible as a real constraint until product photos with a meaningfully different ratio started getting cropped by it.

If a photo is shot/delivered at exactly 3:4, it will render on every one of those surfaces with **zero cropping, ever** — the box and the photo simply match. No CSS position tweaking, no per-image exceptions, no risk of a face or hem getting cut off by a mismatch nobody planned for.

## Framing guidance (matters even at 3:4)

Matching the ratio removes the *aspect-ratio* mismatch, but framing still matters for two reasons:

1. **Some site surfaces crop slightly tighter than others** (e.g. the small thumbnail rail vs. the large main stage image) even when the source is exactly 3:4, due to minor rounding/box differences. Leave a small buffer of headroom above the head — don't frame with the hairline touching the very top edge of the 3:4 frame.
2. **Full-length shots are inherently safer than close/bust shots.** A full-length composition naturally has generous headroom relative to the frame; a tight chest-up or bust shot has much less margin to begin with, so any crop (even a technically-correct one) reads as tighter. Where possible, prefer slightly looser framing over shoot even for close-up detail shots of embellishment/fabric.

## Scope

- **Applies to:** all new product photography from 2026-09-07 onward.
- **Does not apply retroactively** to the existing catalog. Legacy-tier and current-tier photos with inconsistent ratios stay as-is; individual crop problems are found and fixed one at a time as they're reported (see `Docs/pending-tasks.md` item #27 for the current example and process).
- **Not scoped here:** Client Diaries / editorial photography (different aspect ratios by design, per `Docs/client-diaries-build-spec.md`) — this standard is product-catalog photography only.
