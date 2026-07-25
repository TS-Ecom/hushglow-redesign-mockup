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

Header (announcement + head + mega menu panels + mobile menu), trust bar and footer are
copied verbatim from `html/index.html` into every new page until real templating exists.
When changing them, change them on every page in the same commit.

## Cross-page links

Wire real relative links (`product-cushion.html`, `index.html`, …) as soon as the target
page exists — the prototype must be browsable like a real site. Until then leave `href="#"`.

## Design system (locked)

Tokens live in `css/shared.css` `:root` and mirror
`../design/hushglow-design-foundation.html` (LOCKED v1.2):

- Colors: paper `#FAF8F6`, cream `#F5ECE1`, sand, taupe, line, ink `#211A17`,
  ink-soft, berry `#8C3A46` (single accent), gold `#A8823F` (rare)
- Type: Poppins only (400/500/600), loaded from Google Fonts
- Radius: 0px everywhere — buttons, cards, media (sharp corners are the brand)
- Caps rule: banner/hero headlines, collection-style section headings and ALL button
  labels are uppercase; statement headings (image-with-text) stay in title case
- Struck-through compare-at prices are berry, never brighter than the current price
- Breakpoint: 749/750px, single DOM, mobile styles inside `@media (max-width:749px)`

Hover system (desktop only): solid buttons -> `#3d332d`; outline -> fills ink with paper
text; berry -> `#7a2f3b`; paper -> cream; card photo zoom 1.045/500ms or crossfade to the
second photo when the product has one; nav underline slide-in 250ms; no shadows, no lifts.
Touch devices get no hover states. `focus-visible`: 2px ink outline, 2px offset.

## Process

- Design approval flow: Ivan reviews first, then the client. Only build new pages after
  the structure/content is agreed in chat.
- Section customizer settings are NOT part of these prototypes — they are agreed with the
  developer separately, right before the dev task is written.
- Keep everything self-contained and framework-free: vanilla HTML/CSS/JS, no build step.
