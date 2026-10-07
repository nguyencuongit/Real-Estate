@php
    $asset = fn (string $file): string => Theme::asset()->url($file);
    $versioned = fn (string $file): string => $asset($file . '?v=' . substr(hash_file('sha256', theme_path('fashion') . '/public/' . $file), 0, 10));
@endphp
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="TG Thang Atelier — thời trang, túi thêu và những thiết kế mang dấu ấn riêng của bạn.">
    <title>TG THANG — Nghệ thuật trong từng đường thêu.</title>
    <link rel="icon" href="{{ $asset('assets/favicon.svg') }}" type="image/svg+xml">
    <link rel="preload" href="{{ $asset('assets/cormorant-garamond.ttf') }}" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="{{ $versioned('styles.css') }}">
    <link rel="stylesheet" href="{{ $versioned('sections.css') }}">
    <link rel="stylesheet" href="{{ $versioned('cinematic.css') }}">
    <script src="{{ $versioned('motion-math.js') }}" defer></script>
    <script src="{{ $versioned('cinematic.js') }}" defer></script>
    <script src="{{ $versioned('motion.js') }}" defer></script>
    <script src="{{ $versioned('script.js') }}" defer></script>
</head>
<body>
<a class="skip-link" href="#fashion-main">Đến nội dung chính</a>
<header class="header" id="fashion-header">
    <nav class="desktop-nav" aria-label="Điều hướng chính"><a href="#fashion-bespoke">Đặt riêng</a><a href="#fashion-worlds">Thế giới TG</a><a href="#fashion-heritage">Câu chuyện</a><a href="#fashion-poppy">Bộ sưu tập</a></nav>
    <a class="brand" href="#fashion-home" aria-label="TG Thang — Trang đầu"><img src="{{ $asset('assets/logo.svg') }}" alt="TG THANG" width="170" height="60"></a>
    <div class="header-actions"><button class="bag-button" data-open="fashion-bag">Túi chọn (<span data-bag-count>0</span>)</button><span class="currency">VNĐ</span><button class="outline-button" data-open="fashion-booking">Hẹn riêng</button><button class="menu-toggle" aria-label="Mở menu" data-open="fashion-menu">☰</button></div>
</header>
<main id="fashion-main">
    <div class="intro-stack">
    <section class="hero" id="fashion-home" aria-labelledby="fashion-title">
        <video class="hero-video" data-autoplay muted loop playsinline preload="metadata" poster="{{ $asset('assets/hero-poster.webp') }}"><source src="{{ $asset('assets/hero.mp4') }}" type="video/mp4"></video>
        <div class="hero-copy"><p class="eyebrow">TG THANG · ATELIER THỜI TRANG</p><h1 id="fashion-title" data-letters>Nghệ thuật trong từng đường thêu.</h1></div>
        <a class="hero-scroll" href="#fashion-statement" aria-label="Khám phá atelier">↓</a>
    </section>
    <section class="statement section-pad" id="fashion-statement"><p data-word-reveal>Một chiếc túi, một câu chuyện. Từng đường thêu lưu giữ <em>cảm hứng thiên nhiên</em>, từng sắc màu làm nên <em>dấu ấn riêng của bạn.</em></p><span class="eyebrow">TỪ ATELIER TG THANG</span></section>
    <section class="categories" aria-label="Dòng sản phẩm">
        <a class="category category-dark" href="#fashion-poppy"><img data-parallax src="{{ $asset('assets/home-cat-handbags.webp') }}" alt="Túi thêu vàng với họa tiết hoa" loading="lazy" width="1000" height="1333"><div><h2 data-reveal>Túi xách</h2><p>Một thiết kế mang câu chuyện của riêng bạn.</p><span class="text-link">Khám phá</span></div></a>
        <a class="category" href="#fashion-thermal"><img data-parallax src="{{ $asset('assets/home-cat-accessories.webp') }}" alt="Phụ kiện xanh với họa tiết thêu nổi" loading="lazy" width="1000" height="1167"><div><h2 data-reveal>Phụ kiện</h2><p>Chút tinh tế, đồng hành trong từng khoảnh khắc.</p><span class="text-link">Khám phá</span></div></a>
    </section>
    </div>
    @include('theme.fashion::views.partials.collection', ['collection' => 'poppy', 'title' => 'Bộ sưu tập Hoa nở', 'suffix' => 'b', 'names' => ['Kem đào', 'Khu vườn', 'Ánh đồng', 'Xanh biển', 'San hô', 'Hồng lá'], 'files' => ['peach-cream', 'nature-s-delight', 'gold-copper', 'ultramarine-blue', 'red-coral', 'pink-green']])
    <div class="scene-stack">
    @include('theme.fashion::views.partials.atelier')
    @include('theme.fashion::views.partials.spinner')
    </div>
    @include('theme.fashion::views.partials.collection', ['collection' => 'thermal', 'title' => 'Bộ sưu tập Giao sắc', 'suffix' => '', 'names' => ['Xanh sương', 'Vàng olive', 'Tím lam', 'Hồng ánh kim', 'Hồng phấn', 'Ngọc nhạt'], 'files' => ['silver-sage-green', 'olive-yellow', 'lavender-blue', 'gold-pink', 'rose-pink', 'light-jade-green']])
    @include('theme.fashion::views.partials.story')
</main>
@include('theme.fashion::views.partials.footer')
@include('theme.fashion::views.partials.dialogs')
<button class="motion-toggle" id="fashion-motion" aria-pressed="false" aria-label="Tạm dừng chuyển động">Ⅱ</button>
<div class="toast" id="fashion-status" role="status" aria-live="polite"></div>
</body>
</html>
