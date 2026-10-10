"""Prepare local reference photography/video for the requested beauty demo."""
from pathlib import Path
from io import BytesIO
from urllib.request import Request, urlopen
from urllib.parse import quote
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'public' / 'assets'
root.mkdir(parents=True, exist_ok=True)
base = 'https://cdn.prod.website-files.com/67f28d1d69b4c6d58d1cd1da/'
photos = {
    'gallery-lash': '680f8fc9c7d50b5964c6a1d6_Homepage 2 sub brands landscape-01.avif',
    'gallery-brow': '680ef52a6fd30b4b5834ff11_Homepage 2 sub brands-02.avif',
    'gallery-nail': '680f8fc98619cec721bb7be0_Homepage 2 sub brands landscape-02.avif',
    'gallery-wax': '680f8fc9f231182fa56d8bb8_Homepage 2 sub brands landscape-03.avif',
    'gallery-makeup': '680f8fc98572a00d8f060613_Homepage 2 sub brands landscape-04.avif',
    'gallery-body': '680f8fc98572a00d8f06062a_Homepage 2 sub brands landscape-05.avif',
    'texture-1': '67fc99641af666a7c4c891cb_EVER textureArtboard 6.avif',
    'texture-2': '67fc9963ec1abbe58913940b_EVER textureArtboard 5.avif',
    'texture-3': '67fc99648e532fe1d1c1dbbb_EVER textureArtboard 1.avif',
    'texture-4': '67fc99642ea14342e387c3b6_EVER textureArtboard 2.avif',
    'texture-5': '67fc9964ad82dcc3c1c1b803_EVER textureArtboard 3.avif',
    'texture-6': '67fc99642ea14342e387c395_EVER textureArtboard 4.avif',
    'model': '68039fa1a0e0fa652a7bf2e6_EVER MODEL.avif',
    'lash': '683533c09e4768d39e22f5c4_Eyelash-extension-super-real-Lash-Natural-sub-brands-Everlash.avif',
    'brow': '683533f53fb873b0cc28d6e4_Brow-Bomber-Threading-sub-brands-Everbrow.avif',
    'nail': '6835342015e08369e5cbc136_Nails-art-sub-brands-Evernails.avif',
    'wax': '683534383fd5947ee8bc5003_Waxing-Body-Face-brow-sub-brands-Everwax.avif',
    'makeup': '6835345cabdf9992a1a185ad_Semi-Permanent-Makeup-Lip-brow-eyeliner-sub-brands-Everspmu.avif',
    'body': '683534810bf28f079ff10218_Limfatik-Body-Massage sub-brands-Everbody.avif',
    'welcome': '680a05f1151954a6decd8b99_Homepage 7 CTA-02.avif',
}
media_base='https://cdn.prod.website-files.com/67f28d1d69b4c6d58d1cd1da%2F'
videos={
    'hero': media_base+quote('68353260ec4b1d80f6259cdd_Home-page-Beauty-in-every-detail-transcode.mp4'),
    'personal': media_base+quote('680efbd4b4c3114f43179289_Homepage 9 personalized services 1 (1)-transcode.mp4'),
}
posters={
    'hero-poster': media_base+quote('68353260ec4b1d80f6259cdd_Home-page-Beauty-in-every-detail-poster-00001.jpg'),
    'personal-poster': media_base+quote('680efbd4b4c3114f43179289_Homepage 9 personalized services 1 (1)-poster-00001.jpg'),
}
def fetch(url):
    with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=60) as response:
        return response.read()
def prepare(item):
    name,url,kind=item
    target=root/(name+('.mp4' if kind=='video' else '.webp'))
    if not target.exists():
        data=fetch(url)
        if kind=='video': target.write_bytes(data)
        else:
            photo=Image.open(BytesIO(data)).convert('RGB')
            photo.thumbnail((1600,1600))
            photo.save(target,'WEBP',quality=85)
    return f'- `{target.name}`: {url}'
items=[(name,base+quote(asset),'photo') for name,asset in photos.items()]
items += [(name,url,'photo') for name,url in posters.items()]
items += [(name,url,'video') for name,url in videos.items()]
with ThreadPoolExecutor(max_workers=4) as pool: sources=list(pool.map(prepare,items))
notes=['# Nguồn hình ảnh và video','','Ảnh/video tham khảo từ https://www.ever.co.id/ theo yêu cầu người dùng, dùng cho demo giao diện cục bộ. Đây không phải ảnh cơ sở hay khách hàng thật của TG Thang. Logo hoa TG THANG được thiết kế riêng bằng SVG. Font Manrope và Lora đi kèm giấy phép OFL. Lora: https://github.com/google/fonts/tree/main/ofl/lora.','']
(root/'SOURCES.md').write_text('\n'.join(notes+sources)+'\n',encoding='utf-8')
print(f'Prepared {len(items)} local assets')
