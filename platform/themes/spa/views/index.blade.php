@php
    $asset = fn (string $file): string => Theme::asset()->url($file);
    $versioned = fn (string $file): string => $asset($file . '?v=' . substr(hash_file('sha256', theme_path('spa') . '/public/' . $file), 0, 10));
@endphp
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="TG Thang Spa — một khoảng bình yên với massage Bali, đá nóng và nghi thức thư giãn. Giao diện demo tiếng Việt.">
    <meta name="theme-color" content="#dadbd5">
    <title>TG Thang Spa — Chạm vào an yên</title>
    <link rel="icon" href="{{ $asset('assets/symbol.svg') }}" type="image/svg+xml">
    <link rel="preload" href="{{ $asset('assets/cormorant-garamond.ttf') }}" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="{{ $versioned('styles.css') }}">
    <script defer src="{{ $versioned('motion-state.js') }}"></script>
    <script defer src="{{ $versioned('reveal.js') }}"></script>
    <script defer src="{{ $versioned('script.js') }}"></script>
</head>
<body>
    <a class="skip-link" href="#spa-menu">Đến nội dung</a>
    @include('theme.spa::views.partials.header')
    <main>
        @include('theme.spa::views.partials.journey')
        @include('theme.spa::views.partials.services')
        @include('theme.spa::views.partials.gift-about')
        @include('theme.spa::views.partials.rituals')
        @include('theme.spa::views.partials.people-contact')
    </main>
    @include('theme.spa::views.partials.dialogs')
    <button class="motion-toggle" type="button" aria-pressed="false" aria-label="Tạm dừng hiệu ứng">Ⅱ</button>
</body>
</html>
