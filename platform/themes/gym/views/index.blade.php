@php
    $asset = fn (string $file): string => Theme::asset()->url($file);
    $versioned = fn (string $file): string => $asset($file . '?v=' . substr(hash_file('sha256', theme_path('gym') . '/public/' . $file), 0, 10));
@endphp
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="TG Thang Fitness — không gian tập luyện, huấn luyện cá nhân và lớp tập nhóm. Giao diện phòng gym tiếng Việt.">
    <meta name="theme-color" content="#090909">
    <title>TG THANG — Mạnh mẽ từ hôm nay</title>
    <link rel="icon" href="{{ $asset('assets/symbol.svg') }}" type="image/svg+xml">
    <link rel="preload" href="{{ $asset('assets/manrope-800.ttf') }}" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="{{ $versioned('styles.css') }}">
    <link rel="stylesheet" href="{{ $versioned('lower-motion.css') }}">
    <script defer src="{{ $versioned('motion-state.js') }}"></script>
    <script defer src="{{ $versioned('lower-motion.js') }}"></script>
    <script defer src="{{ $versioned('script.js') }}"></script>
</head>
<body>
    <a class="skip-link" href="#gym-about">Đến nội dung</a>
    <header class="site-header">
        <a class="brand" href="#home" aria-label="TG THANG — về đầu trang"><img src="{{ $asset('assets/logo.svg') }}" alt="TG THANG" width="196" height="44"></a>
        <button class="menu-trigger" type="button" data-dialog="gym-menu" aria-haspopup="dialog">Menu <span aria-hidden="true"><i></i><i></i></span></button>
    </header>
    <main id="home">
        @include('theme.gym::views.partials.hero-about')
        @include('theme.gym::views.partials.services-trainers')
        @include('theme.gym::views.partials.plans-stories')
        @include('theme.gym::views.partials.contact-footer')
    </main>
    @include('theme.gym::views.partials.dialogs')
    <button class="motion-toggle" type="button" aria-pressed="false" aria-label="Tạm dừng hiệu ứng">Ⅱ</button>
</body>
</html>
