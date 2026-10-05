<!DOCTYPE html>
<html {!! Theme::htmlAttributes() !!}>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#0A0A0B">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

        {!! Theme::header() !!}
        @fluxAppearance
    </head>
    <body {!! Theme::bodyAttributes() !!} class="gym-site">
        {!! apply_filters(THEME_FRONT_BODY, null) !!}

        <header class="gym-header">
            <div class="gym-shell gym-header__inner">
                <a class="gym-brand" href="{{ BaseHelper::getHomepageUrl() }}" aria-label="PULSE Gym - Trang chủ">
                    <span class="gym-brand__mark"><i class="bi bi-lightning-charge-fill"></i></span>
                    <span class="gym-brand__text">PULSE<span>GYM</span></span>
                </a>

                <button class="gym-menu-toggle" type="button" data-gym-menu-toggle aria-label="Mở menu" aria-expanded="false">
                    <i class="bi bi-list"></i>
                </button>

                <nav class="gym-nav" data-gym-menu aria-label="Điều hướng chính">
                    <a href="#about">Về chúng tôi</a>
                    <a href="#programs">Lớp tập</a>
                    <a href="#coaches">Huấn luyện viên</a>
                    <a href="#memberships">Hội viên</a>
                </nav>

                <a class="gym-btn gym-btn--primary gym-header__cta" href="#memberships">Tập thử miễn phí <i class="bi bi-arrow-up-right"></i></a>
            </div>
        </header>
