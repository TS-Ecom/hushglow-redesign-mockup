"""Rebuild a family-B advertorial as a static page, pixel-perfect.

Nothing here is styled by eye. The CSS is lifted out of the {% style %} blocks of
adv-header.liquid / adv-main.liquid / adv-sticky.liquid on origin/live and the Liquid
interpolations are resolved against the template's own settings. The markup mirrors the
sections tag for tag, including the two copies of the block title (one shown on mobile
above the media, one on desktop inside the text column) and the per-block indent rules.

Usage: python3 tools/build-advertorial.py <template-suffix> <out-name> ["<page title>"]
"""
import re, json, subprocess, sys, html

THEME = '/Users/ivancodik/Desktop/Shopify Projects GIT/hushglow'
FILES = 'https://hushglow.com/cdn/shop/files/'
VIDEOS = 'https://hushglow.com/cdn/shop/videos/c/vp/'

def git(path):
    r = subprocess.run(['git', '-C', THEME, 'show', 'origin/live:' + path],
                       capture_output=True, text=True)
    if r.returncode:
        raise SystemExit('not on origin/live: ' + path)
    return r.stdout

def template(suffix):
    raw = git('templates/page.' + suffix + '.json')
    return json.loads(re.sub(r'^\s*/\*.*?\*/\s*', '', raw, flags=re.S))

def style_block(section):
    s = git('sections/' + section + '.liquid')
    m = re.search(r'\{%-?\s*style\s*-?%\}(.*?)\{%-?\s*endstyle\s*-?%\}', s, re.S)
    return m.group(1) if m else ''

def resolve(css, st):
    """Resolve the handful of Liquid expressions these style blocks use."""
    def one(m):
        expr = m.group(1).strip()
        mm = re.match(r'^st\.(\w+)(?:\s*\|\s*times:\s*([\d.]+))?$', expr)
        if not mm:
            return ''
        v = st.get(mm.group(1), '')
        if mm.group(2):
            try:
                v = round(float(v) * float(mm.group(2)))
            except (TypeError, ValueError):
                pass
        return str(v)
    # rewrite the section-scoped id selectors FIRST: resolving {{ section.id }} to nothing
    # beforehand would leave dead "#AdvMain-" selectors and silently drop every rule on them
    css = re.sub(r'#shopify-section-\{\{\s*section\.id\s*\}\}', '.advSection', css)
    css = re.sub(r'#(AdvHeader|AdvMain|AdvSticky)-\{\{\s*section\.id\s*\}\}', r'.\1', css)
    css = re.sub(r'\{\{(.*?)\}\}', one, css)
    if '{{' in css:
        raise SystemExit('unresolved Liquid left in CSS: ' + css[css.index('{{'):][:80])
    return css.strip()

def asset(url, width=None):
    """shopify://shop_images/NAME -> the file on the CDN."""
    name = (url or '').split('/')[-1]
    return FILES + name + ('?width=%d' % width if width else '')

def build(suffix, out_name, page_title, videos):
    d = template(suffix)
    H = d['sections']['adv_header']['settings']
    M = d['sections']['adv_main']['settings']
    S = d['sections']['adv_sticky']['settings']
    main = d['sections']['adv_main']
    order = main.get('block_order', list(main['blocks']))

    css = '\n\n'.join(
        '/* ---------- %s.liquid ---------- */\n%s' % (sec, resolve(style_block(sec), st))
        for sec, st in (('adv-header', H), ('adv-main', M), ('adv-sticky', S)))

    STARS = '<span class="adv-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
    VERIFIED_SVG = ('<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">'
                    '<circle cx="10" cy="10" r="10" fill="#1d9bf0"/>'
                    '<path d="M5.8 10.2l2.6 2.6 5.4-5.4" stroke="#fff" stroke-width="1.8" '
                    'stroke-linecap="round" stroke-linejoin="round"/></svg>')

    blocks, indents, vi = [], [], iter(videos)
    for n, bk in enumerate(order, 1):
        b = main['blocks'][bk]
        t, st = b['type'], b.get('settings', {})
        bid = 'AdvBlock-%d' % n
        indents.append('#%s{margin-top:%spx}' % (bid, st.get('indent_mob', 0)))
        indents.append('@media screen and (min-width:750px){#%s{margin-top:%spx}}'
                       % (bid, st.get('indent_desk', 0)))
        if t == 'image_with_text':
            title = st.get('title', '')
            if st.get('media_type') == 'video' and st.get('video'):
                v = next(vi)
                media = ('<video muted loop playsinline preload="none" '
                         'poster="%spreview_images/%s?width=1100" data-src="%s%s"></video>'
                         % (FILES, v['poster'], VIDEOS, v['src']))
            else:
                media = ('<img loading="lazy" decoding="async" src="%s" alt="%s">'
                         % (asset(st.get('image'), 1100), html.escape(title, quote=True)))
            blocks.append(
                '  <div id="%s">\n'
                '    <div class="adv-media-text adv-media-text--%s">\n'
                '      <h2 class="adv-media-text__title adv-media-text__title--mobile">%s</h2>\n'
                '      <div class="adv-media-text__media">%s</div>\n'
                '      <div class="adv-media-text__text">\n'
                '        <h2 class="adv-media-text__title adv-media-text__title--desktop">%s</h2>\n'
                '        <div class="adv-media-text__content">%s</div>\n'
                '      </div>\n'
                '    </div>\n'
                '  </div>'
                % (bid, st.get('media_position', 'left'), title, media, title, st.get('content', '')))
        elif t == 'offer':
            blocks.append(
                '  <div id="%s">\n'
                '    <div class="adv-offer" style="background-color: %s;">\n'
                '      <div class="adv-offer__image"><img loading="lazy" decoding="async" src="%s" alt="%s"></div>\n'
                '      <div class="adv-offer__text">\n'
                '        <h2 class="adv-offer__title">%s</h2>\n'
                '        <p class="adv-offer__subtitle">%s</p>\n'
                '        <div class="adv-offer__description">%s</div>\n'
                '        <a href="product-hush-foundation-cushion.html" class="adv-offer__button" '
                'style="background-color: %s; color: %s;">%s</a>\n'
                '        <p class="adv-offer__note">%s</p>\n'
                '      </div>\n'
                '    </div>\n'
                '  </div>'
                % (bid, st.get('background', ''), asset(st.get('image'), 900),
                   html.escape(st.get('title', ''), quote=True), st.get('title', ''),
                   st.get('subtitle', ''), st.get('description', ''),
                   st.get('button_background', ''), st.get('button_color', ''),
                   st.get('button_label', ''), st.get('button_text', '')))
        elif t == 'review':
            ver = '<span class="adv-review__verified">Verified</span>' if st.get('verified') else ''
            blocks.append(
                '  <div id="%s">\n'
                '    <div class="adv-review">\n'
                '      %s\n'
                '      <div class="adv-review__content">%s</div>\n'
                '      <div class="adv-review__footer"><span>&mdash; %s</span>%s</div>\n'
                '    </div>\n'
                '  </div>'
                % (bid, STARS, st.get('content', ''), st.get('author', ''), ver))

    author = ''
    if M.get('review_title') or M.get('review_image'):
        author = (
            '  <div class="adv-author">\n'
            '    <div class="adv-author__avatar"><img src="%s" alt="%s"></div>\n'
            '    <div>\n'
            '      <div class="adv-author__title">%s</div>\n'
            '      <div class="adv-author__subtitle">%s</div>\n'
            '    </div>\n'
            '    %s\n'
            '    %s\n'
            '  </div>\n'
            % (asset(M.get('review_image'), 160), html.escape(M.get('review_title', '').strip(), quote=True),
               M.get('review_title', '').strip(), M.get('review_subtitle', ''),
               ('<span class="adv-author__verified">%s Verified</span>' % VERIFIED_SVG)
               if M.get('review_verified') else '', STARS))

    timer = ('  <div class="adv-timer" data-adv-timer>\n'
             '    <span data-adv-hours>00</span><span class="adv-timer__sep">:</span>'
             '<span data-adv-minutes>00</span><span class="adv-timer__sep">:</span>'
             '<span data-adv-seconds>00</span>\n  </div>\n') if H.get('show_timer') else ''

    doc = '''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%s</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Rebuilt 1:1 from page.%s.json. The CSS below is lifted verbatim out of the
     adv-header / adv-main / adv-sticky sections on origin/live with their Liquid resolved
     against this template's settings, and the markup mirrors those sections tag for tag.
     Nothing here is eyeballed. Regenerate with tools/build-advertorial.py. -->
<style>
*{margin:0;padding:0}
body{font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  background:#fff;-webkit-font-smoothing:antialiased}
img,video{display:block;max-width:100%%}
a{text-decoration:none}

%s

/* per-block spacing, emitted by adv-main.liquid for each block */
%s

/* ---- our corrections on top of the lifted theme CSS ----
   Everything above this line is the store as it runs today. This is the only block that
   is not, and it exists because the author card is an inline-flex box with no width cap:
   it sizes to its content, will not shrink, and so runs 34px past a 320 or 360px screen
   and drags the whole page sideways. The live store does this too. Kept to the minimum
   needed to stop the sideways scroll; nothing else about the card changes. */
.adv-author{max-width:100%%;flex-wrap:wrap}
.adv-author__title,.adv-author__subtitle{min-width:0;overflow-wrap:break-word}
</style>

<div class="AdvHeader">
  <div class="adv-announcement">
    <div class="adv-announcement__inner">
      <span class="adv-announcement__label">%s</span>
%s    </div>
  </div>
  <div class="adv-header">
    <div class="adv-header__inner">
      <img class="adv-header__logo" src="%s" alt="Beauty Times">
    </div>
  </div>
</div>

<div class="AdvMain">
  <div class="adv-main">
    <div class="adv-main__meta">
      <span class="adv-main__badge">%s</span>
      <span class="adv-main__time">%s</span>
    </div>
    <h1 class="adv-main__title">%s</h1>
    <div class="adv-main__description">%s</div>
%s
%s
  </div>
</div>

<div class="AdvSticky">
  <div class="adv-sticky">
    <a href="product-hush-foundation-cushion.html" class="adv-sticky__button"
       style="background-color: %s; color: %s;">%s</a>
    <div class="adv-sticky__bottom">
      <img src="%s" alt="">
      <span style="color: %s">%s</span>
    </div>
  </div>
</div>

<script src="../js/adv.js?v=3"></script>
''' % (html.escape(page_title), suffix, css, '\n'.join(indents),
       H.get('announcement_text', ''), timer, asset(H.get('logo'), 900),
       M.get('badge_text', ''), M.get('time_text', ''), M.get('title', ''),
       M.get('description', ''), author, '\n'.join(blocks),
       S.get('button_bg', ''), S.get('button_color', ''), S.get('button_label', ''),
       asset(S.get('bottom_image'), 120), S.get('bottom_label_color', ''), S.get('bottom_label', ''))

    open('html/' + out_name, 'w', encoding='utf-8').write(doc)
    return len(doc), len(blocks)

if __name__ == '__main__':
    VIDS = [{'src': '8e11541ff3e74515a39c210438a4680b/8e11541ff3e74515a39c210438a4680b.SD-480p-0.9Mbps-88706989.mp4',
             'poster': '8e11541ff3e74515a39c210438a4680b.thumbnail.0000000000_1100x.jpg'},
            {'src': 'b8a1e2727a5b482192e7f0581fad7247/b8a1e2727a5b482192e7f0581fad7247.SD-480p-0.9Mbps-88706360.mp4',
             'poster': 'b8a1e2727a5b482192e7f0581fad7247.thumbnail.0000000000_1100x.jpg'},
            {'src': 'a26d9ac5135a4d2eb313da1962d644a5/a26d9ac5135a4d2eb313da1962d644a5.SD-480p-0.9Mbps-88706234.mp4',
             'poster': 'a26d9ac5135a4d2eb313da1962d644a5.thumbnail.0000000000_1100x.jpg'},
            {'src': '934e59c59f324126a8b2abbd8dad976b/934e59c59f324126a8b2abbd8dad976b.SD-480p-0.9Mbps-88812799.mp4',
             'poster': '934e59c59f324126a8b2abbd8dad976b.thumbnail.0000000000_1100x.jpg'}]
    n, b = build('adv-presell', 'adv-best-foundation-review.html',
                 'I tried 7 different foundations. Only 1 made me look younger. - Carolyn', VIDS)
    print('written', n, 'bytes,', b, 'blocks')
