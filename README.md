# HushGlow — design prototype

Static prototype of the rebuilt HushGlow storefront. Real HTML/CSS/JS, no build step, no
framework, deployed to Vercel. It exists to be reviewed in a browser and then rebuilt as a
Shopify theme — treat every page here as the spec for a set of sections.

    html/   one file per page
    css/    shared.css + one file per page
    js/     shared.js  + one file per page + viewport-lock.js

Open `html/index.html` over http (`python3 -m http.server 8877` from the repo root, then
<http://localhost:8877/html/index.html>). `file://` will not work — the pages load
sibling assets by relative path.

## Where things live

**`css/shared.css` and `js/shared.js` hold every block that appears on more than one
page.** That is most of them. A page file only holds what is unique to that one product.
The rule is absolute: the moment a style or behaviour is needed on a second page it moves
into shared rather than being copied. Two identical copies of a rule is a bug, not a
style — it means the next fix gets applied once and the other page silently drifts.

Page files are what is left after that:

| page | css | js | what is actually unique |
|---|---|---|---|
| hydrating-concealer | 9.7 KB | 3.6 KB | EIGHT SHADES gallery, Why Hush Glow table |
| hush-foundation-cushion | 7.7 KB | 0.4 KB | sale bar, subscription row |
| blush-stick | 1.8 KB | — | shade-gallery captions |
| the other six | < 0.6 KB | < 0.4 KB | nothing structural |

## Rules that the theme rebuild depends on

**Nothing is found by `id`.** Every widget scopes itself to its own container
(`.gal`, `.bundles`, `.upsells`, `.bslider`, `.cmpbox`, `.pstrip`, `.twrap`, `.swrow`) and
is wired with `querySelectorAll(...).forEach`. This is the one thing that must survive the
port: a Shopify section can be placed on a page twice, and anything reached by id would
leave the second copy dead. There are no `getElementById` calls in this repo.

**Data comes from the markup, not from arrays in JS.** The bundle's per-unit shade
pickers read the shade list off the buy box's own swatch row; the cart drawer reads the
product name and price off the sticky bar; the countdowns read nothing at all
(`data-countdown="hms" | "h" | "m" | "s"`); the trust ticker reads `data-items` off the
strip. In the theme all of these come from the same Liquid loop, so they cannot drift.

**One breakpoint: 749/750px.** Single DOM, mobile styles inside
`@media (max-width:749px)`. There is no separate mobile markup anywhere.

**The design tokens are in `:root` in `shared.css`** and are sampled from the live site.
See `CLAUDE.md` for the full design system, including the caps rule, the radius decision
and the hover system.

## Prototype-only code

Two blocks exist to make the prototype behave like a shop and should be deleted, not
ported:

- the cart drawer contents block in `shared.js` — the theme's cart section renders the
  real cart
- `js/viewport-lock.js` — holds the 390px composition on narrower phones so the layout is
  scaled rather than rearranged. Decide separately whether the theme wants this.

## Tools

`html/stress-test.html` loads any page in an iframe at a set width and multiplies every
computed font size the way Android's text-scaling setting does, then reports anything
whose content no longer fits its box. All ten pages are clean at 390 and 1440 at 130%.
Scrollable rails and off-stage panels are excluded by name — if you add a new rail, add
its class to the `rails` list or it will report as broken.

`html/why-variants.html`, `html/badge-variants.html`, `html/arrow-variants.html` and
`html/gift-variants.html` are design-option pages kept for reference. They are not part
of the site.

## Media

Every image and video is loaded from the live store's CDN. Nothing is downloaded or
committed. Video clips are per product and were read off the live pages — if you move a
clip to another page, check on the live site that it belongs there.
