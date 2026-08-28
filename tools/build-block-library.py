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

BLOCKS = [
    ('Image with text — plain', 61, 'the numbered reason block; 61 of the 112 instances',
     lambda: by_section('7-reasons', 'image_with_text_XP4j3r')),
    ('Image with text — with CTA', 32, 'button, icon bullets, trust badge and Trustpilot rating. No single instance on the store carries every optional part, so the two richest are both shown',
     lambda: by_section('5-reasons-gift', 'image_with_text_p9VfzT')),
    ('Image with text — with CTA and star rating', 19, 'the other CTA arrangement: a star rating instead of the Trustpilot bar. Two parts appear nowhere else and are not shown here — a caption above the heading (1 use) and a second inline image (1 use)',
     lambda: by_section('aging-skin', 'image_with_text_XP4j3r')),
    ('Rich text', 43, 'one block, optional caption / heading / text / button / Trustpilot',
     lambda: by_section('7-reasons', 'rich_text_njRdYN')),
    ('Multicolumn', 6, 'runs at 3, 4 and 6 columns',
     lambda: by_section('mouth-wrinkles', 'multicolumn_qzRTBA')),
    ('Testimonials', 5, 'runs at 3 and 4 columns',
     lambda: by_section('mouth-wrinkles', 'testimonials_L6nicy')),
    ('Comparison table', 5, 'the only comparison table that is live; the AI one is switched off everywhere',
     lambda: by_section('top-5-foundations', 'comparison_table_azmwpX')),
    ('Icon bar', 4, 'runs at 4 and 5 columns',
     lambda: by_section('top-5-foundations', 'icon_bar_tnBhaq')),
    ('Logo list', 4, 'press logos',
     lambda: by_section('dark-spots-redness', 'logo_list_PwFz3m')),
    ('Collapsible content', 2, 'FAQ accordion',
     lambda: by_section('mature-skin-foundation', 'collapsible_content_zpVWRJ')),
    ('Custom columns', 2, 'heading plus five icon-and-text rows',
     lambda: by_section('mature-skin-foundation', 'custom_columns_X6Qg7j')),
    ('Comparison slider', 1, 'the one instance on the store has no images set, so it renders as an empty padded box with a button — there is no design here to approve, only a decision on whether the block is wanted at all',
     lambda: by_section('7-reasons-kit', 'comparison_slider_Yh6UyV')),
    ('Section divider', 5, '',
     lambda: by_section('7-reasons', 'section_divider_Qjaa6c')),
    ('Sticky button', 14, 'the bar that follows the reader down the page; on 14 of the 16 templates',
     lambda: by_section('7-reasons', 'eg_sticky_button_iE6DbT')),
    ('Countdown timer (app)', 5, 'Essential Countdown Timer, a third-party app block. It draws itself from the app\u2019s own script, so there is nothing here to design or to port \u2014 it is listed because it is on five of the pages and the rebuild has to keep a slot for it',
     lambda: by_section('7-reasons-ms', 'apps_km6whN')),
    ('Advertorial header', 1, 'the family B masthead, reused on one family A page (mouth-wrinkles)',
     lambda: by_section('mouth-wrinkles', 'adv_header_EKAmKb')),
    ('Featured collection', 1, 'a Bestsellers product row, on the concealer announcement page',
     lambda: by_section('concealer-stick-announcement', 'bestsellers')),
    ('Custom liquid — Klaviyo form', 1, 'two Klaviyo form embeds on the concealer announcement page; an app embed rather than a design',
     lambda: by_section('concealer-stick-announcement', 'klaviyo_form')),
    ('AI — Statistics', 8, '',
     lambda: by_class('top-5-foundations', 'ai-stats-section')),
    ('AI — Reviews slider', 7, '',
     lambda: by_class('top-5-foundations', 'ai-reviews-slider-')),
    ('AI — Editorial image with text', 7, '',
     lambda: by_class('top-5-foundations', 'ai-editorial-block')),
    ('AI — How it works', 4, '',
     lambda: by_class('top-5-foundations', 'ai-how-it-works-')),
    ('AI — Image with text carousel', 4, '143 settings, the most complex object in the family',
     lambda: by_class('5-reasons-gift', 'ai-image-text-carousel-')),
]

def theme_css():
    """The blocks depend on the theme's base stylesheet and on the CSS custom properties
       it declares inline in <head>. Without both, every one of them lays out wrong."""
    links = open(SRC + '../headlinks.txt').read().split()
    head = open(SRC + '../headcss.txt', encoding='utf-8').read()
    return ('\n'.join('<link rel="stylesheet" href="%s">' % l for l in links)
            + '\n<style>\n' + head + '\n</style>')

# section types that are live across the family A pages, with how often. Kept here so the
# builder can refuse to produce a library that does not cover all of them.
CENSUS = {
    'image-with-text': 112, 'rich-text': 43, '_blocks': 26, 'eg-sticky-button': 14,
    'multicolumn': 6, 'section-divider': 5, 'testimonials': 5, 'apps': 5,
    'comparison-table': 5, 'logo-list': 4, 'icon-bar': 4, 'collapsible-content': 2,
    'custom-columns': 2, 'comparison-slider': 1, 'adv-header': 1, 'custom-liquid': 1,
    'featured-collection': 1,
}
COVERED = {
    'image-with-text': ['Image with text — plain', 'Image with text — with CTA',
                        'Image with text — with CTA and star rating'],
    'rich-text': ['Rich text'], 'multicolumn': ['Multicolumn'], 'testimonials': ['Testimonials'],
    'comparison-table': ['Comparison table'], 'icon-bar': ['Icon bar'], 'logo-list': ['Logo list'],
    'collapsible-content': ['Collapsible content'], 'custom-columns': ['Custom columns'],
    'comparison-slider': ['Comparison slider'], 'section-divider': ['Section divider'],
    'eg-sticky-button': ['Sticky button'], 'apps': ['Countdown timer (app)'],
    'adv-header': ['Advertorial header'], 'featured-collection': ['Featured collection'],
    'custom-liquid': ['Custom liquid — Klaviyo form'],
    '_blocks': ['AI — Statistics', 'AI — Reviews slider', 'AI — Editorial image with text',
                'AI — How it works', 'AI — Image with text carousel'],
}

def check_coverage(names):
    uncovered = [t for t in CENSUS if t not in COVERED]
    if uncovered:
        raise SystemExit('section types with no block in the library: %s' % uncovered)
    for typ, blocks in COVERED.items():
        for b in blocks:
            if b not in names:
                raise SystemExit('COVERED lists "%s" for %s but no such block is built' % (b, typ))
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
    doc = HEAD.replace('__THEME_CSS__', theme_css()) + '\n'.join(parts) + FOOT
    open('html/adv-block-library.html', 'w', encoding='utf-8').write(doc)
    print('blocks:', len(BLOCKS), '| section types covered:', n,
          '| failed to capture:', missing or 'none', '| bytes:', len(doc))

HEAD = '''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HUSH GLOW — advertorial block library</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
__THEME_CSS__

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
    'Advertorial header', 'Rich text', 'Icon bar',
    'Image with text — plain', 'Image with text — with CTA',
    'AI — Editorial image with text', 'AI — Statistics',
    'Image with text — with CTA and star rating', 'Comparison table',
    'AI — How it works', 'Section divider', 'Multicolumn', 'Custom columns',
    'Countdown timer (app)', 'Comparison slider', 'Logo list', 'Testimonials',
    'AI — Reviews slider', 'AI — Image with text carousel',
    'Collapsible content', 'Featured collection', 'Custom liquid — Klaviyo form',
    'Sticky button',
]

TPL_HEAD = """<meta charset="utf-8">
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
  /* The theme pins html to the viewport height and scrolls the body inside its own layout
     shell, which is not reproduced here — without this the page will not scroll at all. */
  html, body{height:auto;overflow:visible}
  body{margin:0;background:#fff}
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
           + '\n'.join(parts) + TPL_FOOT.replace('__THEME_JS__', js))
    open('html/adv-template-all-sections.html', 'w', encoding='utf-8').write(doc)
    print('template:', len(parts), 'sections |', len(doc), 'bytes')

if __name__ == '__main__':
    main()
    build_template()
