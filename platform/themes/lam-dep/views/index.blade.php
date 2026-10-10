@php($beautyServices = require theme_path('lam-dep') . '/data/services.php')
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#7a6047">
    <meta name="description" content="TG Thang — chăm chút vẻ đẹp riêng của bạn. Khám phá dịch vụ mi, mày, móng, làn da và những khoảng thư giãn dành cho mình.">
    <title>TG Thang — Đẹp từ từng chi tiết</title>
    <link rel="icon" href="{{ Theme::asset()->url('assets/favicon.svg') }}" type="image/svg+xml">
    <link rel="preload" as="font" href="{{ Theme::asset()->url('assets/manrope-400.ttf') }}" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="{{ Theme::asset()->url('styles.css?v=' . substr(hash_file('sha256', theme_path('lam-dep') . '/public/styles.css'), 0, 10)) }}">
    <link rel="stylesheet" href="{{ Theme::asset()->url('reference-motion.css?v=' . substr(hash_file('sha256', theme_path('lam-dep') . '/public/reference-motion.css'), 0, 10)) }}">
    <script src="{{ Theme::asset()->url('script.js?v=' . substr(hash_file('sha256', theme_path('lam-dep') . '/public/script.js'), 0, 10)) }}" defer></script>
    <script defer src="{{ Theme::asset()->url('motion.js?v=' . substr(hash_file('sha256', theme_path('lam-dep') . '/public/motion.js'), 0, 10)) }}"></script>
</head>
<body>
<a class="skip-link" href="#beauty-main">Đi đến nội dung</a>
<header class="beauty-header"><button class="menu-button" id="menu-open" aria-label="Mở danh mục" aria-haspopup="dialog" aria-controls="beauty-menu"><span></span><span></span><span></span></button><a class="brand" href="#beauty-home" aria-label="TG Thang — Trang chủ"><img src="{{ Theme::asset()->url('assets/logo.svg') }}" alt="TG THANG" width="380" height="90"></a><button class="appointment-link" data-book>ĐẶT LỊCH HẸN <span aria-hidden="true">↗</span></button></header>
<main id="beauty-main">
    <section class="beauty-hero" id="beauty-home" aria-labelledby="hero-title"><img class="hero-poster" src="{{ Theme::asset()->url('assets/hero-poster.webp') }}" alt="Vẻ đẹp tự nhiên của gương mặt và đôi mắt" width="1600" height="900" fetchpriority="high"><video class="hero-video" muted loop playsinline preload="none" poster="{{ Theme::asset()->url('assets/hero-poster.webp') }}" aria-label="Video giới thiệu vẻ đẹp tự nhiên"><source src="{{ Theme::asset()->url('assets/hero.mp4') }}" type="video/mp4"></video><div class="hero-shade"></div><div class="hero-content"><h1 id="hero-title">Đẹp từ từng chi tiết.</h1></div><a class="hero-scroll" href="#beauty-story">CUỘN ĐỂ KHÁM PHÁ <span aria-hidden="true">↓</span></a><button class="motion-toggle" id="motion-toggle" aria-pressed="false">Tạm dừng chuyển động <span aria-hidden="true">Ⅱ</span></button></section>
    <section class="beauty-story" id="beauty-story"><h2>“Vẻ đẹp riêng xứng đáng được<br>chăm chút trong từng chạm nhỏ.”</h2><img class="story-logo" src="{{ Theme::asset()->url('assets/logo.svg') }}" alt="TG Thang" width="380" height="90"></section>
    @include('theme.lam-dep::views.partials.gallery')
    @include('theme.lam-dep::views.partials.art')
    @include('theme.lam-dep::views.partials.services')
    <section class="beauty-personal" id="beauty-personal"><div class="personal-copy"><span class="eyebrow">MỖI NGƯỜI LÀ MỘT CÂU CHUYỆN RIÊNG</span><h2>DÀNH RIÊNG<br>CHO BẠN</h2><p>Tại TG Thang, mỗi cuộc hẹn bắt đầu bằng việc lắng nghe. Bạn thích điều gì, muốn thay đổi điều gì, hay chỉ cần một khoảng nghỉ? Chúng tôi cùng bạn chọn những chi tiết thật phù hợp.</p><button class="cream-button" data-book>CHỌN KHOẢNH KHẮC CỦA BẠN <span aria-hidden="true">↗</span></button></div><figure class="personal-film"><img src="{{ Theme::asset()->url('assets/personal-poster.webp') }}" alt="Chăm chút dáng mi và chân mày theo gương mặt" width="800" height="1100" loading="lazy"><video muted loop playsinline preload="none" poster="{{ Theme::asset()->url('assets/personal-poster.webp') }}" aria-label="Video minh họa chăm sóc theo đường nét gương mặt"><source src="{{ Theme::asset()->url('assets/personal.mp4') }}" type="video/mp4"></video><button class="film-toggle" aria-label="Phát video chăm sóc" aria-pressed="true">▶</button><figcaption>MỖI ĐƯỜNG NÉT. MỖI DẤU ẤN RIÊNG.</figcaption></figure></section>
    @include('theme.lam-dep::views.partials.welcome')
    @include('theme.lam-dep::views.partials.faq')
    @include('theme.lam-dep::views.partials.film')
</main>
@include('theme.lam-dep::views.partials.footer')
@include('theme.lam-dep::views.partials.dialogs')
<script type="application/json" id="beauty-service-data">{!! json_encode($beautyServices, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) !!}</script>
</body>
</html>
