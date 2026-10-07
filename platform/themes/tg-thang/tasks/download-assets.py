"""Fetch the reference photography used by this local demo, with source records."""
from pathlib import Path
from io import BytesIO
from urllib.request import Request, urlopen
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'public' / 'assets'
root.mkdir(parents=True, exist_ok=True)
photos = {
    'factory': '5b59badb0ea9760ac2226c34dfed90294e2d9278-1920x1080.jpg',
    'assembly': '1c96f23dffa6ce54c3a25fd0eaeb77b7fa2223af-1920x1920.jpg',
    'panels': '412ba9cabcfe4100e58f200e8eb60981de0699d3-1280x1919.jpg',
    'robot': 'c1cbd3302c4634f4bd45a01694f8c0e4524c7e5f-1280x1920.jpg',
    'frame': '2ef4b1c58061c44b22ffec20f8d5f36672c56f4d-1920x2880.jpg',
    'system': '0f575310ad07068379959bc276e752e41243345f-1280x1604.jpg',
    'site': '3827ee5eca6ab5f64e987f515402c2a980bc61b6-1920x1080.jpg',
    'project-1': 'a7464010698d6abdbf5991bfbab8e8117b342f6d-1920x1440.jpg',
    'project-2': '1e334d24264efa898e82f627799013d1badfd730-1920x1440.jpg',
    'project-3': 'd78bc723abd75efb9df75ce865836dc44d6d9262-1920x1440.jpg',
    'project-4': '673b4119cbddc02115e602e50124ff8d70ee4511-1920x1440.jpg',
    'digital': 'e751d80d7c6c52b042c94641aee5fac9894cc3ea-1920x1920.jpg',
    'green': '2f7752e3da4a656b9719b75475bf6aff71bd5b5d-1920x1920.jpg',
    'quality': 'bece36037ca59fa7d26f8c333dc95f75b093b060-1920x1920.jpg',
    'interior': '4119391714e1905bbb2837f26dbd4ee8bf0861c1-1280x1600.jpg',
}
sources = ['# Nguồn hình ảnh', '', 'Ảnh minh họa lấy từ website tham khảo https://enerblock.net/en/ do người dùng chỉ định, phục vụ demo cục bộ. Bản quyền thuộc chủ sở hữu ảnh; không phải ảnh dự án thật của TG THANG.', '', 'Mô hình 3D và biểu tượng TG THANG được dựng riêng bằng code. Font Manrope đi kèm giấy phép OFL; Three.js đi kèm MIT.', '']
for name, asset in photos.items():
    url = f'https://cdn.sanity.io/images/unkmsg3i/production/{asset}?w=1440&q=82'
    if not (root / f'{name}.webp').exists():
        with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30) as response:
            photo = Image.open(BytesIO(response.read())).convert('RGB')
        photo.save(root / f'{name}.webp', 'WEBP', quality=83)
    sources.append(f'- `{name}.webp`: {url}')
(root / 'SOURCES.md').write_text('\n'.join(sources) + '\n', encoding='utf-8')
print(f'Prepared {len(photos)} local reference photos')
