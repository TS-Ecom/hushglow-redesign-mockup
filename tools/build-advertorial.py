import json,re,subprocess,html,sys
THEME='/Users/ivancodik/Desktop/Shopify Projects GIT/hushglow'
CDN='https://hushglow.com/cdn/shop/files/'
VID='https://hushglow.com/cdn/shop/videos/c/vp/'

def load(tpl):
    raw=subprocess.run(['git','-C',THEME,'show','origin/live:templates/page.'+tpl+'.json'],
                       capture_output=True,text=True).stdout
    return json.loads(re.sub(r'^\s*/\*.*?\*/\s*','',raw,flags=re.S))

def img(v, w=None):
    u=CDN+(v or '').split('/')[-1]
    return u+('?width=%d'%w if w else '')

def build(tpl, videos, out_name, page_title):
    d=load(tpl)
    H=d['sections']['adv_header']['settings']
    M=d['sections']['adv_main']['settings']
    S=d['sections']['adv_sticky']['settings']
    main=d['sections']['adv_main']
    order=main.get('block_order',list(main['blocks']))
    vi=iter(videos)

    parts=[]
    for bk in order:
        b=main['blocks'][bk]; t=b['type']; st=b.get('settings',{})
        if t=='image_with_text':
            pos=st.get('media_position','left')
            if st.get('media_type')=='video' and st.get('video'):
                v=next(vi)
                media=(f'<video class="advb__media" muted loop playsinline preload="none" '
                       f'poster="{CDN}preview_images/{v["poster"]}?width=900" data-src="{VID}{v["src"]}"></video>')
            else:
                media=f'<img class="advb__media" loading="lazy" decoding="async" src="{img(st.get("image"),900)}" alt="">'
            parts.append(f'''      <div class="advb advb--{pos}">
        <div class="advb__ph">{media}</div>
        <div class="advb__tx">
          <h2>{st.get("title","")}</h2>
          {st.get("content","")}
        </div>
      </div>''')
        elif t=='offer':
            parts.append(f'''      <div class="advoffer" style="background:{st.get("background","#f5eee4")}">
        <div class="advoffer__ph"><img loading="lazy" decoding="async" src="{img(st.get("image"),900)}" alt=""></div>
        <div class="advoffer__tx">
          <p class="advoffer__t">{st.get("title","")}</p>
          <p class="advoffer__s">{st.get("subtitle","")}</p>
          {st.get("description","")}
          <a class="advoffer__btn" href="product-hush-foundation-cushion.html"
             style="background:{st.get("button_background","#750b10")};color:{st.get("button_color","#fff")}">{st.get("button_label","")}</a>
          <p class="advoffer__note">{st.get("button_text","")}</p>
        </div>
      </div>''')
        elif t=='review':
            ver='<span class="advrev__v">Verified</span>' if st.get('verified') else ''
            parts.append(f'''      <div class="advrev">
        {st.get("content","")}
        <p class="advrev__by"><b>{st.get("author","")}</b>{ver}</p>
      </div>''')

    title=M.get('title','')
    # the accent colour applies to the second sentence of the headline, as on the live page
    m=re.match(r'^(.*?[.!?])\s+(.*)$', title)
    head = (f'{m.group(1)} <em>{m.group(2)}</em>' if m else title)

    doc=f'''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(page_title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/adv.css?v=2">

<!-- Advertorial, rebuilt 1:1 from page.{tpl}.json on the live theme.
     Deliberately self-contained: these pages carry no site header, no footer and no cart
     drawer, so they must not pull the storefront stylesheet either — they are paid-traffic
     landers and every kilobyte is paid for. -->

<div class="advann" style="background:{H.get("announcement_bg")};color:{H.get("announcement_color")}">
  <span>{H.get("announcement_text","")}</span>
  <span class="advann__t" style="background:{H.get("timer_bg")};color:{H.get("timer_color")}">
    <b data-adv-h>09</b>:<b data-adv-m>57</b>:<b data-adv-s>43</b>
  </span>
</div>

<header class="advhead" style="background:{H.get("header_bg")}">
  <img src="{img(H.get("logo"),440)}" alt="Beauty Times" style="width:{H.get("logo_width",220)}px">
</header>

<main class="advmain">
  <p class="advmeta">
    <span class="advbadge" style="background:{M.get("badge_background")};color:{M.get("badge_color")}">{M.get("badge_text","")}</span>
    <span class="advread">{M.get("time_text","")}</span>
  </p>
  <h1 class="advtitle" style="--accent:{M.get("title_accent_color","#b8302f")}">{head}</h1>
  <div class="advdesc">{M.get("description","")}</div>

  <div class="advauthor">
    <img src="{img(M.get("review_image"),120)}" alt="">
    <span class="advauthor__n"><b>{M.get("review_title","").strip()}</b><i>{M.get("review_subtitle","")}</i></span>
    <span class="advauthor__v">Verified</span>
    <span class="advauthor__s">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
  </div>

{chr(10).join(parts)}
</main>

<div class="advsticky" style="background:{S.get("wrapper_background")}">
  <a class="advsticky__btn" href="product-hush-foundation-cushion.html"
     style="background:{S.get("button_bg")};color:{S.get("button_color")}">{S.get("button_label","")}</a>
  <p class="advsticky__p" style="color:{S.get("bottom_label_color")}">
    <img src="{img(S.get("bottom_image"),120)}" alt="">{S.get("bottom_label","")}</p>
</div>

<script src="../js/adv.js?v=1"></script>
'''
    open('html/'+out_name,'w',encoding='utf-8').write(doc)
    return len(doc), len(parts)

if __name__=='__main__':
    vids=[{'src':'8e11541ff3e74515a39c210438a4680b/8e11541ff3e74515a39c210438a4680b.SD-480p-0.9Mbps-88706989.mp4','poster':'8e11541ff3e74515a39c210438a4680b.thumbnail.0000000000_1100x.jpg'},
          {'src':'b8a1e2727a5b482192e7f0581fad7247/b8a1e2727a5b482192e7f0581fad7247.SD-480p-0.9Mbps-88706360.mp4','poster':'b8a1e2727a5b482192e7f0581fad7247.thumbnail.0000000000_1100x.jpg'},
          {'src':'a26d9ac5135a4d2eb313da1962d644a5/a26d9ac5135a4d2eb313da1962d644a5.SD-480p-0.9Mbps-88706234.mp4','poster':'a26d9ac5135a4d2eb313da1962d644a5.thumbnail.0000000000_1100x.jpg'},
          {'src':'934e59c59f324126a8b2abbd8dad976b/934e59c59f324126a8b2abbd8dad976b.SD-480p-0.9Mbps-88812799.mp4','poster':'934e59c59f324126a8b2abbd8dad976b.thumbnail.0000000000_1100x.jpg'}]
    n,b=build('adv-presell',vids,'adv-best-foundation-review.html',
              'I Tried 7 Foundations. Only 1 Made My Mature Skin Look Younger.')
    print('written',n,'bytes,',b,'blocks')
