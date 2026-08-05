# HushGlow Design — project rules

Static, multi-page design prototype of the new HushGlow theme (pre-Horizon). Built as real
HTML/CSS/JS pages, deployed to Vercel by the developer. This file is the source of truth for
how new pages are added. Follow it exactly.

## Structure

```
hushglow-design/
  CLAUDE.md
  html/   one file per page
  css/    shared.css + one file per page (same basename as the page)
  js/     shared.js  + one file per page (same basename as the page)
```

No local assets folder: every image and video is loaded from CDN
(`hushglow.com/cdn/...`, `cdn.shopify.com/...`). Do not download or commit media.

## Page naming

- `index.html` — homepage
- `product-<handle>.html` — product pages, one per product (e.g. `product-cushion.html`, `product-blush-stick.html`)
- `collection.html` (or `collection-<handle>.html` if several)
- `page-<name>.html` — static pages (e.g. `page-about-us.html`)

## Per-page files

Every page includes, in this order:

```html
<link rel="stylesheet" href="../css/shared.css">
<link rel="stylesheet" href="../css/<page>.css">
...
<script src="../js/shared.js"></script>
<script src="../js/<page>.js"></script>
```

The per-page CSS/JS basename always matches the HTML basename. Create both files even if
small; leave out the per-page JS include only when the page truly has no behavior.

## Shared vs page-specific

- `shared.css`: tokens, base/reset, buttons, announcement bar, header + mega menu,
  mobile fullscreen menu, trust bar, product card family (`.p-card`, `.stars`, `.pr`,
  `.atc`, `.ptag`), grids (`.grid3`/`.grid4`), section utils (`.section`, `.sec-h`,
  `.inner`), footer.
- `shared.js`: `menuToggle()` (mobile menu), footer payment icons.
- The moment a style or behavior is needed on a second page, move it from the page file
  into shared — never copy-paste between page files.

## Reused markup

Header (announcement + head + mega menu panels + mobile menu), trust bar, footer and the
cart drawer (`.cart-ovl` + `.cartdrawer`, opened by the bag icon via `cartToggle()`) are
copied verbatim from `html/index.html` into every new page until real templating exists.
When changing them, change them on every page in the same commit.

## Cross-page links

Wire real relative links (`product-cushion.html`, `index.html`, …) as soon as the target
page exists — the prototype must be browsable like a real site. Until then leave `href="#"`.

## Design system (v2 — client feedback 2026-08-05)

Tokens live in `css/shared.css` `:root`. v2 replaces the earlier foundation (LOCKED v1.2)
after the client review of the product page. The rule behind every change: the reader is a
woman of 60-70+ who must find the buy button instantly, and the colours must be the ones
already on hushglow.com — nothing invented.

- Colors (sampled from the live site): paper `#FFFFFF`, soft `#F7F7F8` (section fill),
  cream `#F1E9DE`, sand `#DBCFBC`, taupe `#C1B2A0`, line `#E6E6E6`, ink `#121212`,
  ink-soft `#5C5C5C`, berry `#862B28` (single accent), berry-deep `#5B1A1D`, gold (rare)
- Type: Poppins 400/500/600/**700**. Body 16px/1.75. No reading copy below 15px on either
  breakpoint; only chips, tags and icon glyphs go smaller, and never carry meaning alone
- Buttons are the heaviest element on screen: 16px+, weight 700, generous padding, and the
  primary CTA gets a shadow. Nothing near a CTA (ratings, guarantees) may outweigh it
- Radius: buttons stay 0px (the live site's buttons are 0 too); media `--radius` 2px,
  cards/chips `--r-card`/`--r-chip` 6px, swatches round. Sharp-everywhere is retired
- Selection is shown by fill + shadow, not by a grid of outlines (bundles, upsells, steps)
- Caps rule: banner/hero headlines, collection-style section headings and ALL button
  labels are uppercase; statement headings (image-with-text) stay in title case
- Struck-through compare-at prices are berry, never brighter than the current price
- Breakpoint: 749/750px, single DOM, mobile styles inside `@media (max-width:749px)`
- Card rows that overflow on mobile swipe horizontally with the next card peeking in
  (~78-80vw per card), never stack into a tall column

Hover system (desktop only): solid buttons -> `#333`; outline -> fills ink with paper
text; berry -> `#5B1A1D`; paper -> cream; card photo zoom 1.045/500ms or crossfade to the
second photo when the product has one; nav underline slide-in 250ms.
Touch devices get no hover states. `focus-visible`: 2px ink outline, 2px offset.

## Process

- Design approval flow: Ivan reviews first, then the client. Only build new pages after
  the structure/content is agreed in chat.
- Section customizer settings are NOT part of these prototypes — they are agreed with the
  developer separately, right before the dev task is written.
- Keep everything self-contained and framework-free: vanilla HTML/CSS/JS, no build step.
