@php
    $asset = fn (string $file): string => Theme::asset()->url($file);
@endphp
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#05081c">
    <meta name="description" content="Mai House — không gian sống xanh, tinh giản và kết nối giữa lòng thành phố.">
    <title>Mai House — Chốn về giữa phố</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="{{ $asset('styles.css?v=' . substr(hash_file('sha256', theme_path('mai-house') . '/public/styles.css'), 0, 10)) }}">
    <link rel="stylesheet" href="{{ $asset('page-two.css?v=' . substr(hash_file('sha256', theme_path('mai-house') . '/public/page-two.css'), 0, 10)) }}">
    <link rel="stylesheet" href="{{ $asset('page-three.css?v=' . substr(hash_file('sha256', theme_path('mai-house') . '/public/page-three.css'), 0, 10)) }}">
    <script defer src="{{ $asset('stack-switch.js?v=' . substr(hash_file('sha256', theme_path('mai-house') . '/public/stack-switch.js'), 0, 10)) }}"></script>
</head>
<body>
    <header class="site-header">
        <a class="brand" href="#home" aria-label="Kho demo website"><span class="brand-orb"></span></a>
        <div class="header-actions">
            <a class="header-action" href="/theme-preview">Mẫu website</a>
            <button class="header-action header-action--contact" type="button" data-show-page-three>Liên hệ</button>
        </div>
    </header>
    <main id="home">
        <section class="hero" id="product" data-stack-page tabindex="0" role="region" aria-label="Trang gi?i thi?u Hisotech">
            <div class="hero-copy"><p class="eyebrow">KHO GIAO DI?N WEBSITE ?A D?NG NG?NH NGH?</p><h1><span>Hisotech – Nơi kiến tạo website chuyên nghiệp và mang đến những giải pháp công nghệ đột phá.</span></h1><p class="hero-description">Khám phá các mẫu website được thiết kế sẵn cho nhiều lĩnh vực. Chọn giao diện bạn yêu thích, xem demo thực tế và biến ý tưởng thành website của riêng bạn.</p><div class="hero-actions"><a class="primary-button" href="#get-started">Khám phá mẫu web</a><a class="demo-button" href="#dashboard">Nhận tư vấn</a></div></div>
            <div class="dashboard-scene" id="dashboard" data-stack-scene tabindex="0" role="region" aria-label="Bản xem trước các mẫu giao diện website">
                <div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
                <article class="mock-window analytics-window"><div class="mock-top"><span class="mini-orb"></span><b>Website doanh nghi?p</b><span class="mock-user">S</span></div><div class="mock-body"><aside class="mock-rail"><i>S</i><i>S</i><i>S</i><i>S</i></aside><div class="mock-content"><div class="metric-row"><div><small>Revenue</small><strong>$2,093</strong></div><div><small>New Sales</small><strong>$28.01k</strong></div><div><small>Growth</small><strong>+18.6%</strong></div></div><div class="chart-panel"><small>Team performance <b>Last 30 daysS</b></small><svg viewBox="0 0 450 100" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#42ddff" stop-opacity=".4"/><stop offset="1" stop-color="#42ddff" stop-opacity="0"/></linearGradient></defs><path d="M0 77 C28 74 28 50 58 60 S101 80 132 51 S175 63 205 39 S243 65 273 34 S316 60 347 24 S392 45 450 8 L450 100 L0 100Z" fill="url(#chartFill)"/><path d="M0 77 C28 74 28 50 58 60 S101 80 132 51 S175 63 205 39 S243 65 273 34 S316 60 347 24 S392 45 450 8" fill="none" stroke="#55e3ff" stroke-width="3"/></svg></div><div class="bottom-metrics"><div class="bar-chart"><small>Growth metrics</small><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="growth-list"><small>Growth channels</small><i>Social <b></b></i><i>Organic <b></b></i><i>Campaigns <b></b></i></div></div></div></div></article>
                <article class="mock-window overview-window"><div class="mock-top"><span class="mini-orb"></span><b>Website d?ch v?</b><span class="mock-user">S</span></div><div class="mock-body"><aside class="mock-rail"><i>S</i><i>S</i><i>S</i><i>S</i></aside><div class="mock-content"><div class="metric-row"><div><small>Active users</small><strong>12,840</strong></div><div><small>Revenue</small><strong>$58,090</strong></div><div><small>Conversion</small><strong>6.8%</strong></div></div><div class="chart-panel"><small>Weekly overview <b>S 24.8%</b></small><svg viewBox="0 0 450 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 82 C45 72 45 55 88 67 S150 39 190 53 S248 68 280 36 S346 56 380 22 S419 36 450 9" fill="none" stroke="#6be5ff" stroke-width="3"/><path d="M0 91H450" stroke="#ffffff30"/></svg></div><div class="bottom-metrics"><div class="bar-chart"><small>Growth metrics</small><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="growth-list"><small>Top channels</small><i>Social <b></b></i><i>Search <b></b></i><i>Direct <b></b></i></div></div></div></div></article>
                <article class="mock-window tasks-window"><div class="mock-top"><span class="mini-orb"></span><b>Website th??ng m?i</b><span class="mock-user">S</span></div><div class="mock-body"><aside class="mock-rail"><i>S</i><i>S</i><i>S</i><i>S</i></aside><div class="mock-content"><small class="section-caption">Projects <b>View all S</b></small><div class="task-cards"><div><small>TEAM SYNC</small><b>Product Sprint</b><i class="progress"><span style="width:72%"></span></i><small>4 tasks S 3 members</small></div><div><small>CAMPAIGN BETA</small><b>Launch planning</b><i class="progress"><span style="width:54%"></span></i><small>8 tasks S 5 members</small></div><div><small>TEAM GROWTH</small><b>Quarterly review</b><i class="progress"><span style="width:87%"></span></i><small>6 tasks S 4 members</small></div></div><small class="section-caption update-caption">Recent activity <b>SSS</b></small><div class="activity-line"><span class="avatar">A</span><p><b>Project update</b><small>Alex shared a new project milestone</small></p><time>2m</time></div><div class="activity-line"><span class="avatar avatar-two">J</span><p><b>Team feedback</b><small>Jamie commented on your task</small></p><time>18m</time></div></div></div></article>
                <article class="mock-window collab-window"><div class="mock-top"><span class="mini-orb"></span><b>Website s?ng t?o</b><span class="mock-user">S</span></div><div class="collab-content"><p>Giao diện linh hoạt, thiết kế riêng cho câu chuyện thương hiệu của bạn.</p><div class="integration-icons"><span class="slack-icon">S</span><span class="mail-icon">M</span><span class="flow-icon">S</span></div><div class="collab-bottom"><div class="activity-feed"><small>Tin mới</small><div class="feed-card"><span class="avatar">A</span><p><b>Project updates</b><small>Design review is ready for your team</small></p></div><small>Team comments</small><div class="feed-card"><span class="avatar avatar-two">J</span><p><b>Jamie</b><small>Great work on the latest update!</small></p></div><div class="comment-box">Gửi lời nhắn... <span>S</span></div></div><div class="team-feed"><small>NỘI DUNG NỔI BẬT</small><div class="white-notice"><span class="notice-dot">S</span><p><b>Bộ sưu tập mới</b><small>New task was assigned to your team</small></p></div><div class="team-person"><span class="avatar">A</span><p><b>Alex Morgan</b><small>Just completed a task</small></p></div><div class="team-person"><span class="avatar avatar-two">J</span><p><b>Jamie Lee</b><small>Added a project comment</small></p></div></div></div></div></article>
            </div>
                <div class="page-two-placeholder" aria-live="polite" aria-hidden="true">
                    <div class="showcase-stack" aria-hidden="true">
                        <div class="showcase-back showcase-back-four"><span class="back-menu">☰</span><div class="back-landscape"></div><span class="back-arrow">↗</span></div>
                        <div class="showcase-back showcase-back-three"><span class="back-menu">☰</span><div class="back-house"></div><span class="back-arrow">→</span></div>
                        <div class="showcase-back showcase-back-two"><span class="back-brand">H.</span><span class="back-menu">☰</span><div class="back-architecture"></div><span class="back-arrow">→</span></div>
                        <div class="showcase-back showcase-back-one"><span class="back-brand">Hisotech</span><span class="back-menu">☰</span><div class="back-globe"></div><span class="back-cta">Khám phá <span>→</span></span></div>
                    </div>
                    <div class="showcase-front">
                        <div class="showcase-topbar">
                            <a href="#home" class="showcase-logo" aria-label="Hisotech - trang chủ"><span class="showcase-logo-mark">H</span><span>Hisotech</span></a>
                            <nav class="showcase-nav" aria-label="Trang 2"><a href="#home">Home</a><a href="#features">Solutions</a><a href="#dashboard">Demos</a><a href="#about">About</a><a href="#get-started">Contact</a></nav>
                            <a href="#get-started" class="showcase-start">Get Started <span>→</span></a>
                        </div>
                        <div class="showcase-main">
                            <div class="showcase-copy">
                                <div class="showcase-tag"><span></span> Technology for a better tomorrow</div>
                                <h2>Professional<br>Websites &amp; Digital<br>Solutions for <em>Your Business.</em></h2>
                                <p>We design modern websites and innovative technology solutions to help your business grow.</p>
                                <div class="showcase-actions"><a class="showcase-primary" href="#dashboard">Explore Demos <span>→</span></a><a class="showcase-secondary" href="#features">Our Solutions</a></div>
                            </div>
                            <div class="showcase-art" aria-hidden="true">
                                <div class="art-orb art-orb-one"></div><div class="art-orb art-orb-two"></div><div class="art-orb art-orb-three"></div>
                                <div class="art-dots art-dots-one"></div><div class="art-dots art-dots-two"></div>
                                <div class="laptop"><div class="laptop-screen"><div class="mini-site-nav"><b><span>H</span> Hisotech</b><i>Home　 Projects　 About</i><span>Contact →</span></div><div class="mini-site-hero"><div><small>Beautiful spaces, better living</small><strong>Modern Homes<br>for a Better Life</strong><span>Discover exceptional living spaces made for you.</span><b>Explore homes →</b></div><div class="mini-house-photo"></div></div><div class="mini-site-tiles"><span></span><span></span><span></span></div></div><div class="laptop-base"></div></div>
                                <div class="phone"><div class="phone-notch"></div><div class="phone-brand">H <span>Hisotech Homes</span></div><div class="phone-title">Find your<br>dream home</div><div class="phone-photo"></div><div class="phone-lines"><span></span><span></span></div><div class="phone-thumbs"><i></i><i></i></div></div>
                                <div class="growth-card"><span class="growth-bars"><i></i><i></i><i></i><i></i></span><div><strong>+128%</strong><small>Business Growth</small></div></div>
                                <div class="trusted-card"><span class="trusted-avatars"><i>A</i><i>M</i><i>J</i></span><span><strong>Trusted by</strong><small>250+ businesses</small></span></div>
                            </div>
                        </div>
                        <div class="showcase-stats"><div><strong>250+</strong><span>Happy Clients</span></div><div><strong>500+</strong><span>Projects Completed</span></div><div><strong>5+</strong><span>Years Experience</span></div></div>
                    </div>
                    <button class="showcase-return" type="button" data-show-page-one aria-label="Quay về trang 1">← <span>Trang 1</span></button>
                </div>
                <section class="contact-page" id="contact" aria-label="Liên hệ" aria-hidden="true" inert>
                    <div class="contact-frame">
                        <div class="contact-art" aria-hidden="true">
                            <div class="contact-art-orb"></div>
                            <div class="contact-orbit contact-orbit-one"></div>
                            <div class="contact-orbit contact-orbit-two"></div>
                            <div class="contact-art-dot contact-art-dot-one"></div>
                            <div class="contact-art-dot contact-art-dot-two"></div>
                            <div class="contact-art-dot contact-art-dot-three"></div>
                            <svg class="contact-plane" viewBox="0 0 480 410" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Máy bay giấy">
                                <defs><linearGradient id="plane-fill" x1="65" y1="255" x2="405" y2="58" gradientUnits="userSpaceOnUse"><stop stop-color="#28ECFF"/><stop offset=".53" stop-color="#1466FF"/><stop offset="1" stop-color="#12BDFB"/></linearGradient><linearGradient id="plane-wing" x1="175" y1="254" x2="354" y2="356" gradientUnits="userSpaceOnUse"><stop stop-color="#05143B"/><stop offset="1" stop-color="#178CFF"/></linearGradient><filter id="plane-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter></defs>
                                <path d="M41 220 437 58 326 366 218 266 166 357 159 258 41 220Z" stroke="#13BFFF" stroke-width="17" stroke-linejoin="round" opacity=".8" filter="url(#plane-glow)"/>
                                <path d="M41 220 437 58 326 366 218 266 166 357 159 258 41 220Z" fill="url(#plane-fill)" stroke="#53F2FF" stroke-width="6" stroke-linejoin="round"/>
                                <path d="M159 258 437 58 218 266 166 357 159 258Z" fill="#061943" stroke="#3CBFFF" stroke-width="5" stroke-linejoin="round"/>
                                <path d="M218 266 326 366 437 58 218 266Z" fill="url(#plane-wing)" stroke="#48DDFF" stroke-width="5" stroke-linejoin="round"/>
                                <path d="m166 357 52-91 108 100" stroke="#8AF4FF" stroke-width="5" stroke-linejoin="round"/>
                                <path d="M88 316 130 281M106 366 162 319M169 398 224 355" stroke="#198BFF" stroke-width="9" stroke-linecap="round"/>
                            </svg>
                            <div class="contact-dot-grid" aria-hidden="true"></div>
                        </div>
                        <div class="contact-content">
                            <h2>Liên hệ</h2>
                            <form class="contact-form" id="mai-house-contact-form" method="post" action="{{ route('mai-house.contact.store') }}">
                                @csrf
                                <label class="contact-field"><span class="sr-only">Họ và tên</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-5 3.3-8 8-8s8 3 8 8"/></svg><input name="name" type="text" autocomplete="name" placeholder="Họ và tên"></label>
                                <label class="contact-field"><span class="sr-only">Email của bạn</span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><input name="email" type="text" inputmode="email" autocomplete="email" placeholder="Email của bạn"></label>
                                <label class="contact-field"><span class="sr-only">Số điện thoại</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3h3l1.2 4.1-1.9 1.6a15 15 0 0 0 6.5 6.5l1.6-1.9L21 14.5v3A3.5 3.5 0 0 1 17.5 21 14.5 14.5 0 0 1 3 6.5 3.5 3.5 0 0 1 6.5 3Z"/></svg><input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Số điện thoại" required></label>
                                <label class="contact-field contact-message"><span class="sr-only">Nội dung tin nhắn</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v13H8l-5 3V5Z"/><path d="M7 10h10M7 14h7"/></svg><textarea name="content" placeholder="Nội dung tin nhắn..." rows="4"></textarea></label>
                                <button class="contact-submit" type="submit">Gửi liên hệ <span aria-hidden="true">→</span></button>
                                <p class="contact-feedback" role="status" aria-live="polite" hidden></p>
                            </form>
                            <div class="contact-socials" aria-label="Mạng xã hội"><span aria-label="Facebook">f</span><span aria-label="X">𝕏</span><span aria-label="Instagram">◎</span></div>
                        </div>
                    </div>
                    <button class="contact-back" type="button" data-show-page-two aria-label="Quay về trang 2">← <span>Trang 2</span></button>
                </section>
        </section>
        <span id="features" class="anchor-target"></span><span id="pricing" class="anchor-target"></span><span id="about" class="anchor-target"></span><span id="get-started" class="anchor-target"></span><span id="login" class="anchor-target"></span>
    </main>
</body>
</html>
