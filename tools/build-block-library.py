"""Assemble the family-A block library.

One page carrying one instance of every block used across the 19 family-A advertorials,
lifted out of the live pages with its own scoped <style> so each block renders exactly as
it does today. Nothing is restyled here: the point of the page is to agree these designs,
so it has to show what is actually running."""
import re, os, html

SRC = '/private/tmp/claude-501/-Users-ivancodik/3500217f-c054-46a0-a8c5-aa3436e505cb/scratchpad/src/'
VOID = {'img','br','hr','input','meta','link','source','path','circle','rect','use','col','area'}

def outer(s, start):
    """Balanced-tag scan from the '<' at start; returns the element's outerHTML."""
    m = re.match(r'<(\w[\w-]*)\b[^>]*?(/?)>', s[start:])
    if not m:
        return None
    tag = m.group(1)
    if m.group(2) == '/' or tag in VOID:
        return s[start:start + m.end()]
    depth, i = 1, start + m.end()
    pat = re.compile(r'<(/?)' + re.escape(tag) + r'\b[^>]*?(/?)>', re.I)
    while True:
        mm = pat.search(s, i)
        if not mm:
            return None
        if mm.group(1):
            depth -= 1
        elif mm.group(2) != '/':
            depth += 1
        i = mm.end()
        if depth == 0:
            return s[start:i]

def by_section(page, key):
    s = open(SRC + page + '.html', encoding='utf-8').read()
    m = re.search(r'<(?:div|section)\b[^>]*id="shopify-section-template--\d+__' + re.escape(key) + r'"', s)
    return outer(s, m.start()) if m else None

def by_class(page, prefix):
    """Find an AI block by its class prefix and return the wrapper that carries its <style>.

       Shopify renders these theme blocks with a hashed class and no usable id, so the class
       prefix is the only stable handle. The enclosing .shopify-block is the element that
       holds the block's own scoped stylesheet, so that is what has to be lifted."""
    s = open(SRC + page + '.html', encoding='utf-8').read()
    hit = s.find('class="' + prefix)
    if hit < 0:
        return None
    # most of these sit straight inside their section; only one is wrapped in a
    # .shopify-block, so take whichever container starts closest before the match
    keep = None
    for w in re.finditer(r'<div\b[^>]*(?:class="shopify-block"|id="shopify-section-template--\d+__)[^>]*>', s):
        if w.start() > hit:
            break
        keep = w.start()
    if keep is None:
        return None
    frag = outer(s, keep)
    # only accept it if the wrapper really contains the block we were looking for
    return frag if frag and ('class="' + prefix) in frag else None

# The one block on this page that is deliberately not the store's: the Bestsellers row is
# rebuilt with our own section and product card, because that component is already agreed
# and every other product row on the prototype uses it.
CARDS = [
    ('Foundation Cushion', 'product-hush-foundation-cushion', '1_1296_1296___Ivory_2.webp', '', '(1264)', '$39.99', '$70.99', 'Save 44%'),
    ('Multi-Effect Blush Stick', 'product-blush-stick', '1_1296_1296__1_f0399e93-04db-49d1-8887-d7e1110acf2e.webp', 'New', '(312)', '$32.99', '', ''),
    ('Pore-Blurring Primer Stick', 'product-pore-blurring-primer-stick', '38.jpg', '', '(674)', '$19.99', '$40.99', 'Save 51%'),
]

def _card(nm, page, img, tag, stars, now, was, save):
    return ('      <a class="p-card" href="%s.html">\n'
            '        <div class="ph">%s<img loading="lazy" decoding="async" class="main" src="%s%s?width=800" alt="%s"></div>\n'
            '        <div class="nm">%s</div>\n'
            '        <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;<span>%s</span></div>\n'
            '        <div class="pr"><span class="price-now">%s</span>%s%s</div>\n'
            '        <div class="atc">Add to Cart</div>\n'
            '      </a>' % (page,
                            ('<span class="ptag">%s</span>' % tag) if tag else '',
                            FILES_CDN, img, nm, nm, stars, now,
                            ('<span class="price-was">%s</span>' % was) if was else '',
                            ('<span class="save">%s</span>' % save) if save else ''))

FILES_CDN = 'https://hushglow.com/cdn/shop/files/'

OUR_BESTSELLERS = ('<section class="hgx-section">\n  <div class="inner">\n'
    '    <h2 class="hgx-h">Bestsellers</h2>\n'
    '    <div class="recgrid">\n'
    '      <a class="recbanner" href="#">\n'
    '        <img loading="lazy" decoding="async" src="' + FILES_CDN + '51.jpg?width=800" alt="">\n'
    '        <span class="recbanner-in"><b>Already Know What You Want?</b><i>Shop Now</i></span>\n'
    '      </a>\n      <div class="recrow">\n'
    + '\n'.join(_card(*c) for c in CARDS) +
    '\n      </div>\n    </div>\n  </div>\n</section>')

BLOCKS = [
    ('Image with text \u2014 plain, on grey', 70, 'the numbered reason block. 70 of the 112 instances sit on the grey surface; it appears there in two compositions, this one and the next',
     lambda: by_section('7-reasons', 'image_with_text_XP4j3r')),
    ('Image with text \u2014 with CTA, on grey', 70, 'the same grey surface carrying a button, icon bullets, trust badge and Trustpilot rating. No single instance on the store has every optional part, so the richest is shown',
     lambda: by_section('5-reasons-gift', 'image_with_text_p9VfzT')),
    ('Image with text \u2014 on white', 21, 'the same block on the white surface',
     lambda: by_section('mouth-wrinkles', 'image_with_text_Uex7Y7')),
    ('Image with text \u2014 brand colours, with star rating', 21, 'the per-section colour scheme: white ground, red button. This is also the arrangement that carries a star rating instead of the Trustpilot bar. Two parts appear nowhere else and are not shown \u2014 a caption above the heading (1 use) and a second inline image (1 use)',
     lambda: by_section('aging-skin', 'image_with_text_XP4j3r')),
    ('Rich text \u2014 on white', 20, 'optional caption / heading / text / button / Trustpilot, on the white surface',
     lambda: by_section('mouth-wrinkles', 'rich_text_PrNNgG')),
    ('Rich text \u2014 on grey', 10, 'the same block on grey, shown with every optional part switched on',
     lambda: by_section('7-reasons', 'rich_text_njRdYN')),
    ('Rich text \u2014 brand colours', 7, 'white ground with the red button; the offer close on most of the pages',
     lambda: by_section('top-5-foundations', 'rich_text_hpYCEP')),
    ('Rich text \u2014 black masthead', 6, 'the same section on the inverse scheme: black ground, caption over heading. This is the BEAUTY REVIEWS band that opens six of the advertorials',
     lambda: by_section('top-5-foundations', 'rich_text_kgj874')),
    ('Multicolumn \u2014 on white', 4, 'runs at 3, 4 and 6 columns',
     lambda: by_section('mouth-wrinkles', 'multicolumn_qzRTBA')),
    ('Multicolumn \u2014 brand colours', 2, 'the same block on the per-section scheme',
     lambda: by_section('mature-skin-foundation', 'multicolumn_4CwP8Y')),
    ('Testimonials \u2014 on white', 2, 'runs at 3 and 4 columns',
     lambda: by_section('mouth-wrinkles', 'testimonials_L6nicy')),
    ('Testimonials \u2014 on grey', 3, 'the same block on the grey surface',
     lambda: by_section('dark-spots-redness', 'testimonials_M6mtxA')),
    ('Comparison table \u2014 brand colours', 2, 'the only comparison table that is live; the AI one is switched off everywhere',
     lambda: by_section('top-5-foundations', 'comparison_table_azmwpX')),
    ('Comparison table \u2014 on white', 2, 'the same table on the white surface',
     lambda: by_section('mature-skin-foundation', 'comparison_table_CT6Jk9')),
    ('Comparison table \u2014 on grey', 1, 'the same table on the grey surface',
     lambda: by_section('top5-concealers', 'comparison_table_7cRyWY')),
    ('Icon bar', 4, 'runs at 4 and 5 columns',
     lambda: by_section('top-5-foundations', 'icon_bar_tnBhaq')),
    ('Logo list', 4, 'press logos',
     lambda: by_section('dark-spots-redness', 'logo_list_PwFz3m')),
    ('Collapsible content', 2, 'FAQ accordion',
     lambda: by_section('mature-skin-foundation', 'collapsible_content_zpVWRJ')),
    ('Custom columns', 2, 'heading plus five icon-and-text rows',
     lambda: by_section('mature-skin-foundation', 'custom_columns_X6Qg7j')),
    ('Comparison slider', 1, 'the one instance on the store has no images set, so it renders as an empty padded box with a button \u2014 there is no design here to approve, only a decision on whether the block is wanted at all',
     lambda: by_section('7-reasons-kit', 'comparison_slider_Yh6UyV')),
    ('Section divider', 5, '',
     lambda: by_section('7-reasons', 'section_divider_Qjaa6c')),
    ('Sticky button', 14, 'the bar that follows the reader down the page; on 14 of the 16 templates',
     lambda: by_section('7-reasons', 'eg_sticky_button_iE6DbT')),
    ('Countdown timer (app)', 5, 'Essential Countdown Timer, a third-party app block. It draws itself from the app\u2019s own script, so there is nothing here to design or to port \u2014 it is listed because it is on five of the pages and the rebuild has to keep a slot for it',
     lambda: by_section('7-reasons-ms', 'apps_km6whN')),
    ('Advertorial header', 1, 'the family B masthead, reused on one family A page (mouth-wrinkles)',
     lambda: by_section('mouth-wrinkles', 'adv_header_EKAmKb')),
    ('Featured collection', 1, 'a Bestsellers product row \u2014 our own section and product card, not the captured one',
     lambda: OUR_BESTSELLERS),
    ('Custom liquid \u2014 Klaviyo form', 1, 'two Klaviyo form embeds on the concealer announcement page; an app embed rather than a design',
     lambda: by_section('concealer-stick-announcement', 'klaviyo_form')),
    ('AI \u2014 Statistics', 8, '',
     lambda: by_class('top-5-foundations', 'ai-stats-section')),
    ('AI \u2014 Reviews slider', 7, '',
     lambda: by_class('top-5-foundations', 'ai-reviews-slider-')),
    ('AI \u2014 Editorial image with text', 7, '',
     lambda: by_class('top-5-foundations', 'ai-editorial-block')),
    ('AI \u2014 How it works', 4, '',
     lambda: by_class('top-5-foundations', 'ai-how-it-works-')),
    ('AI \u2014 Image with text carousel', 4, '143 settings, the most complex object in the family',
     lambda: by_class('5-reasons-gift', 'ai-image-text-carousel-')),
]

# Classes the Bestsellers markup above uses. Only the rules that mention one of these are
# lifted out of the prototype's stylesheet.
CARD_CLASSES = ('hgx-section', 'hgx-h', 'inner', 'recgrid', 'recbanner', 'recbanner-in',
                'recrow', 'p-card', 'ph', 'ptag', 'nm', 'stars', 'pr', 'price-now',
                'price-was', 'save', 'atc', 'main')

def _rules(css):
    """Split a stylesheet into (selector, body) pairs, descending into @media.

       Comments are stripped first: shared.css puts one above almost every rule, and a
       selector read as "/* ... */\n@media ..." does not start with @media, so the whole
       mobile block was being swallowed as if it were one rule's declarations."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0:
            break
        sel = css[i:j].strip()
        d, k = 1, j + 1
        while k < n and d:
            if css[k] == '{':
                d += 1
            elif css[k] == '}':
                d -= 1
            k += 1
        body = css[j + 1:k - 1]
        if sel.startswith('@media') or sel.startswith('@supports'):
            out.append((sel, _rules(body)))
        elif sel:
            out.append((sel, body))
        i = k
    return out

def _scope(sel):
    """Put every selector under our own section, so the class names the prototype shares
       with the theme (.section, .stars, .inner, .pr) cannot reach the captured markup."""
    parts = []
    for part in sel.split(','):
        part = part.strip()
        if not part:
            continue
        parts.append(part if part.startswith('.hgx-section') else '.hgx-section ' + part)
    return ', '.join(parts)

def bestsellers_css():
    """The prototype's stylesheet is deliberately NOT linked on this page.

       It carries a global reset, its own body typography (including a page-wide
       letter-spacing) and html{overflow-x:clip}, and it would load after the theme — so it
       restyled all 29 captured sections and hid real horizontal overflow. Its .section rule
       alone was adding 64px of top padding and the page gutter to every one of them.

       Only the rules the Bestsellers block needs are lifted, each scoped to .hgx-section.
       The token block is kept as-is: those custom properties are all ours by name."""
    css = open('css/shared.css', encoding='utf-8').read()
    root = re.search(r':root\{[^}]*\}', css)
    wanted = lambda sel: any(('.' + c) in sel for c in CARD_CLASSES)
    def emit(rules, indent=''):
        out = []
        for sel, body in rules:
            if isinstance(body, list):
                inner = emit(body, '  ')
                if inner:
                    out.append('%s{\n%s\n}' % (sel, inner))
            elif wanted(sel):
                out.append('%s%s{%s}' % (indent, _scope(sel), body.strip()))
        return '\n'.join(out)
    return (root.group(0) if root else '') + '\n' + emit(_rules(css))

def theme_css():
    """The blocks depend on the theme's base stylesheet and on the CSS custom properties
       it declares inline in <head>. Without both, every one of them lays out wrong."""
    links = open(SRC + '../headlinks.txt').read().split()
    head = open(SRC + '../headcss.txt', encoding='utf-8').read()
    return ('\n'.join('<link rel="stylesheet" href="%s">' % l for l in links)
            + '\n<style>\n' + head + '\n</style>')

# Every section that is live across the family A pages, counted by section type AND by the
# colour scheme it runs on, because the scheme is what decides how the section looks: the
# same rich-text is a white band, a grey band, a red-button band or a black masthead. An
# earlier version of this file counted types only and shipped a library that was missing
# ten of these. The builder now refuses to produce a library that does not cover all of them.
CENSUS = {
    ('image-with-text', 'background-2'): 70, ('image-with-text', 'background-1'): 21,
    ('image-with-text', 'custom'): 21,
    ('rich-text', 'background-1'): 20, ('rich-text', 'background-2'): 10,
    ('rich-text', 'custom'): 7, ('rich-text', 'inverse'): 6,
    ('_blocks', '(none)'): 26, ('eg-sticky-button', '(none)'): 14,
    ('section-divider', '(none)'): 5, ('apps', '(none)'): 5,
    ('multicolumn', 'background-1'): 4, ('multicolumn', 'custom'): 2,
    ('testimonials', 'background-2'): 3, ('testimonials', 'background-1'): 2,
    ('comparison-table', 'custom'): 2, ('comparison-table', 'background-1'): 2,
    ('comparison-table', 'background-2'): 1,
    ('logo-list', 'custom'): 4, ('icon-bar', 'background-1'): 4,
    ('collapsible-content', 'background-1'): 2, ('custom-columns', 'custom'): 2,
    ('comparison-slider', 'background-2'): 1, ('adv-header', '(none)'): 1,
    ('custom-liquid', 'background-1'): 1, ('featured-collection', 'background-2'): 1,
}
COVERED = {
    ('image-with-text', 'background-2'): ['Image with text \u2014 plain, on grey',
                                          'Image with text \u2014 with CTA, on grey'],
    ('image-with-text', 'background-1'): ['Image with text \u2014 on white'],
    ('image-with-text', 'custom'): ['Image with text \u2014 brand colours, with star rating'],
    ('rich-text', 'background-1'): ['Rich text \u2014 on white'],
    ('rich-text', 'background-2'): ['Rich text \u2014 on grey'],
    ('rich-text', 'custom'): ['Rich text \u2014 brand colours'],
    ('rich-text', 'inverse'): ['Rich text \u2014 black masthead'],
    ('multicolumn', 'background-1'): ['Multicolumn \u2014 on white'],
    ('multicolumn', 'custom'): ['Multicolumn \u2014 brand colours'],
    ('testimonials', 'background-1'): ['Testimonials \u2014 on white'],
    ('testimonials', 'background-2'): ['Testimonials \u2014 on grey'],
    ('comparison-table', 'custom'): ['Comparison table \u2014 brand colours'],
    ('comparison-table', 'background-1'): ['Comparison table \u2014 on white'],
    ('comparison-table', 'background-2'): ['Comparison table \u2014 on grey'],
    ('icon-bar', 'background-1'): ['Icon bar'],
    ('logo-list', 'custom'): ['Logo list'],
    ('collapsible-content', 'background-1'): ['Collapsible content'],
    ('custom-columns', 'custom'): ['Custom columns'],
    ('comparison-slider', 'background-2'): ['Comparison slider'],
    ('section-divider', '(none)'): ['Section divider'],
    ('eg-sticky-button', '(none)'): ['Sticky button'],
    ('apps', '(none)'): ['Countdown timer (app)'],
    ('adv-header', '(none)'): ['Advertorial header'],
    ('featured-collection', 'background-2'): ['Featured collection'],
    ('custom-liquid', 'background-1'): ['Custom liquid \u2014 Klaviyo form'],
    ('_blocks', '(none)'): ['AI \u2014 Statistics', 'AI \u2014 Reviews slider',
                            'AI \u2014 Editorial image with text', 'AI \u2014 How it works',
                            'AI \u2014 Image with text carousel'],
}

def check_coverage(names):
    uncovered = [k for k in CENSUS if k not in COVERED]
    if uncovered:
        raise SystemExit('section type / colour scheme pairs with no block in the library: %s'
                         % sorted(uncovered))
    stray = [k for k in COVERED if k not in CENSUS]
    if stray:
        raise SystemExit('COVERED claims pairs that are not on any live page: %s' % sorted(stray))
    for pair, blocks in COVERED.items():
        for b in blocks:
            if b not in names:
                raise SystemExit('COVERED lists "%s" for %s but no such block is built' % (b, pair))
    return len(CENSUS)

def main():
    parts, missing = [], []
    for i, (name, uses, note, get) in enumerate(BLOCKS, 1):
        try:
            frag = get()
        except Exception as e:
            frag = None
        if not frag:
            missing.append(name)
            frag = '<p style="padding:20px;color:#b00">could not capture this block</p>'
        parts.append(
            '<section class="lib__item">\n'
            '  <div class="lib__label">\n'
            '    <span class="lib__n">%02d</span>\n'
            '    <span class="lib__name">%s</span>\n'
            '    <span class="lib__uses">%d&times; across the advertorials</span>\n'
            '    %s\n'
            '  </div>\n'
            '  <div class="lib__block">\n%s\n  </div>\n'
            '</section>' % (i, html.escape(name), uses,
                            ('<span class="lib__note">%s</span>' % html.escape(note)) if note else '',
                            frag))
    n = check_coverage([b[0] for b in BLOCKS])
    doc = (HEAD.replace('__THEME_CSS__', theme_css())
               .replace('__BESTSELLERS_CSS__', bestsellers_css())
            + '\n'.join(parts) + FOOT)
    open('html/adv-block-library.html', 'w', encoding='utf-8').write(doc)
    print('blocks:', len(BLOCKS), '| section types covered:', n,
          '| failed to capture:', missing or 'none', '| bytes:', len(doc))

HEAD = '''<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HUSH GLOW — advertorial block library</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
__THEME_CSS__
<style>
__BESTSELLERS_CSS__
</style>

<!-- Every block used across the 19 family-A advertorials, one instance each, lifted out of
     the live pages with its own scoped <style> intact. Deliberately not restyled: the page
     exists so these designs can be agreed against what is actually running today.
     Regenerate with tools/build-block-library.py. -->
<style>
  body{margin:0;background:#f2f2f4;font-family:'Poppins',-apple-system,sans-serif;color:#121212}
  .lib__top{background:#121212;color:#fff;padding:26px 24px}
  .lib__top h1{margin:0 0 6px;font-size:20px;font-weight:600}
  .lib__top p{margin:0;font-size:14px;color:rgba(255,255,255,.72);max-width:88ch;line-height:1.6}
  .lib__item{margin:0 0 26px}
  .lib__label{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;
    padding:14px 24px;background:#e8e8ec;border-top:1px solid #d3d3da}
  .lib__n{font-size:12px;font-weight:700;color:#8a8a95;font-variant-numeric:tabular-nums}
  .lib__name{font-size:15px;font-weight:600}
  .lib__uses{font-size:13px;color:#6f6f7a}
  .lib__note{font-size:13px;color:#8a8a95;flex:1 1 100%}
  .lib__block{background:#fff;position:relative}
  /* the sticky bar and the announcement bar are fixed or sticky on a real page, which
     would take them out of flow here and leave an empty slot; inside the library they
     sit in place so they can actually be looked at */
  .lib__block [class*="sticky"],
  .lib__block .adv-announcement{position:static !important}
  .lib__empty{padding:18px 24px;font-size:13px;color:#8a8a95;background:#fafafa;
    border-top:1px dashed #d3d3da}
</style>

<div class="lib__top">
  <h1>Advertorial blocks &mdash; family A</h1>
  <p>Every block used across the 19 stacked-section advertorials, one instance each, shown exactly
     as it renders on the live store. Each is labelled with how often it is used. Blocks with
     optional parts are shown with all of them switched on, so approving the block approves every
     variation of it.</p>
</div>

'''

FOOT = '''
<script>
  /* the captured blocks bring their own scripts on the live site; here the sliders are
     static, which is enough to judge the design */
</script>
'''

# The order a real advertorial reads in, so the page can be judged as a page rather than
# as an inventory: masthead, hook, proof, the reasons, the offer, the social proof, the FAQ.
PAGE_ORDER = [
    'Advertorial header', 'Rich text \u2014 black masthead', 'Rich text \u2014 on white',
    'Icon bar',
    'Image with text \u2014 plain, on grey', 'Image with text \u2014 on white',
    'Image with text \u2014 with CTA, on grey',
    'AI \u2014 Editorial image with text', 'AI \u2014 Statistics',
    'Image with text \u2014 brand colours, with star rating',
    'Comparison table \u2014 brand colours', 'Comparison table \u2014 on white',
    'Comparison table \u2014 on grey',
    'AI \u2014 How it works', 'Section divider',
    'Multicolumn \u2014 on white', 'Multicolumn \u2014 brand colours', 'Custom columns',
    'Countdown timer (app)', 'Comparison slider', 'Logo list',
    'Testimonials \u2014 on white', 'Testimonials \u2014 on grey',
    'AI \u2014 Reviews slider', 'AI \u2014 Image with text carousel',
    'Collapsible content', 'Rich text \u2014 brand colours', 'Rich text \u2014 on grey',
    'Featured collection', 'Custom liquid \u2014 Klaviyo form',
    'Sticky button',
]

TPL_HEAD = """<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HUSH GLOW — advertorial template</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
__THEME_CSS__

<!-- Every family A section on one page, in the order an advertorial actually reads, with
     no labels and nothing added — so it can be judged and resized like a real page.
     The theme's own script is loaded, which is what drives the carousels and the
     accordion; without it the sliders lay out as one long overflowing row.
     Regenerate with tools/build-block-library.py. -->
<style>
__BESTSELLERS_CSS__
</style>
<style>
  /* The theme pins html to the viewport height and scrolls the body inside its own layout
     shell, which is not reproduced here — without this the page will not scroll at all. */
  html, body{height:auto;overflow:visible}
  body{margin:0;background:#fff;font-family:'Poppins',-apple-system,sans-serif}

  /* ---- our changes on top of the captured theme CSS ----
     Kept in one place on purpose: everything above this line is the store as it runs
     today, everything below is a decision we have taken. */

  /* 1. Calls to action carry the border the storefront buttons carry. */
  .adv-cta a, .hg-button, a.button, .button--primary,
  [class*="ai-"] a[class*="button"], [class*="ai-"] a[class*="cta"]{
    border:2px solid currentColor !important;
    border-radius:var(--r-btn, 4px) !important;
  }

  /* 2. The trust badge under a button. Its icon and text fill the row, so the theme's
     justify-content:center has no slack to work with and the icon ends up pinned to the
     left edge, a long way from the centred text. Capping the line lets the pair centre
     together. This is how it behaves on the live store too, not something introduced here. */
  .hg-trust-badge{max-width:32ch;margin-left:auto;margin-right:auto}
  .hg-trust-badge__text{flex:0 1 auto}

  /* 3. AI Statistics. The theme switches it to three columns at 750px, but each column
     needs about 280px of its own, so between roughly 750 and 900 the row runs off the
     screen and the whole page scrolls sideways. This is the live store's behaviour, not
     something introduced here. Letting the three tracks share the row equally and trimming
     the side padding keeps the three columns and removes the overflow; above 900 nothing
     changes. */
  @media screen and (min-width:750px) and (max-width:900px){
    [class*="ai-stats-grid-"]{grid-template-columns:repeat(3,minmax(0,1fr)) !important}
    [class*="ai-stats-item-"]{padding-left:12px !important;padding-right:12px !important}
  }

  /* 4. Bestsellers uses our own section and product card, so it needs the page paddings
     the rest of the prototype gives it. */
  .hgx-section{padding:40px var(--pagepad, 60px)}
  .hgx-h{font-size:30px;font-weight:600;text-align:center;letter-spacing:.02em;margin:0 0 30px}
  @media screen and (max-width:749px){
    .hgx-section{padding:28px var(--pagepad, 18px)}
    .hgx-h{font-size:24px;margin-bottom:22px}
  }
</style>

"""

TPL_FOOT = """
<script src="__THEME_JS__"></script>
"""

def build_template():
    by_name = {name: get for name, uses, note, get in BLOCKS}
    missing = [n for n in PAGE_ORDER if n not in by_name]
    if missing:
        raise SystemExit('PAGE_ORDER names blocks that do not exist: %s' % missing)
    unplaced = [n for n in by_name if n not in PAGE_ORDER]
    if unplaced:
        raise SystemExit('these blocks are built but not placed on the template: %s' % unplaced)
    parts = []
    for name in PAGE_ORDER:
        frag = by_name[name]()
        if frag:
            parts.append(frag)
    js = open(SRC + '../secondary.txt').read().strip()
    doc = (TPL_HEAD.replace('__THEME_CSS__', theme_css())
                   .replace('__BESTSELLERS_CSS__', bestsellers_css())
           + '\n'.join(parts) + TPL_FOOT.replace('__THEME_JS__', js))
    open('html/adv-template-all-sections.html', 'w', encoding='utf-8').write(doc)
    print('template:', len(parts), 'sections |', len(doc), 'bytes')

if __name__ == '__main__':
    main()
    build_template()
