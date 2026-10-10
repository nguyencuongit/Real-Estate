<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#ff5949">
    <meta name="description" content="TG Thang — giải pháp thiết kế, thi công và xây dựng lắp ghép. Đồng hành từ bản vẽ đầu tiên đến ngày bàn giao.">
    <title>TG Thang — Kiến tạo thế hệ mới</title>
    <link rel="icon" href="{{ Theme::asset()->url('assets/mark.svg') }}" type="image/svg+xml">
    <link rel="preload" as="font" href="{{ Theme::asset()->url('assets/manrope-400.ttf') }}" type="font/ttf" crossorigin>
    <link rel="preload" as="font" href="{{ Theme::asset()->url('assets/manrope-800.ttf') }}" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="{{ Theme::asset()->url('styles.css?v=5') }}">
    <script src="{{ Theme::asset()->url('script.js?v=1') }}" defer></script>
    <script src="{{ Theme::asset()->url('motion.js?v=5') }}" defer></script>
    <script src="{{ Theme::asset()->url('assets/building.min.js?v=2') }}" defer></script>
</head>
<body>
<a class="skip-link" href="#noi-dung">Đi đến nội dung</a>
<header class="site-header">
    <a class="brand" href="#dau-trang" aria-label="TG Thang — Trang chủ"><img src="{{ Theme::asset()->url('assets/mark.svg') }}" alt="" width="32" height="32"><span>TG THANG<sup>®</sup></span></a>
    <div class="header-actions"><button class="outline-button menu-open" aria-haspopup="dialog" aria-controls="site-menu" aria-label="Danh mục"><span class="menu-label">Danh mục</span><span class="menu-lines" aria-hidden="true"></span></button><button class="solid-button" data-contact>Liên hệ <span aria-hidden="true">↗</span></button></div>
</header>
<main id="noi-dung">
    <section class="hero" id="dau-trang" aria-labelledby="hero-title">
        <div class="hero-copy"><h1 id="hero-title">Kiến tạo<br>thế hệ mới.</h1><p>Xây dựng bằng tư duy mới.<br>Vững vàng từ nền móng.</p></div>
        <div class="hero-blueprint"><div class="blueprint-meta"><span>HỆ THỐNG XÂY DỰNG</span><span>TG THANG / VIỆT NAM</span></div><div class="hero-visual"><img src="{{ Theme::asset()->url('assets/structure.svg') }}" alt="Bản vẽ phối cảnh khung nhà ba tầng" width="720" height="480"><div class="blueprint-cross cross-one" aria-hidden="true">+</div><div class="blueprint-cross cross-two" aria-hidden="true">+</div></div><div class="blueprint-footer"><span>THIẾT KẾ. THI CÔNG. HOÀN THIỆN.</span><a href="#phuong-phap" aria-label="Khám phá phương pháp xây dựng">CUỘN ĐỂ KHÁM PHÁ <span aria-hidden="true">↓</span></a></div></div>
    </section>
    <figure class="wide-photo opening-photo"><img src="{{ Theme::asset()->url('assets/factory.webp') }}" alt="Quá trình chuẩn bị cấu kiện tại nhà máy" width="1440" height="810" fetchpriority="high"><video id="construction-video" muted loop playsinline preload="none" poster="{{ Theme::asset()->url('assets/factory.webp') }}" aria-label="Video minh họa quy trình thiết kế và sản xuất cấu kiện"><source src="{{ Theme::asset()->url('assets/construction.mp4') }}" type="video/mp4"></video><button class="video-toggle" id="video-toggle" aria-controls="construction-video" aria-pressed="true">Phát video ▶</button><figcaption><span>TỪ BẢN VẼ ĐẾN CÔNG TRÌNH</span><span>01 / TG THANG</span></figcaption></figure>
    <section class="statement"><span class="section-tag">TƯ DUY XÂY DỰNG MỚI <i aria-hidden="true"></i></span><h2>Thiết kế chuẩn.<br>Thi công chắc.<br>Bàn giao đúng.</h2><p>Một quy trình xuyên suốt.<br>Một đội ngũ cùng trách nhiệm.</p></section>
    @include('theme.tg-thang::views.partials.approach')
    @include('theme.tg-thang::views.partials.system')
    @include('theme.tg-thang::views.partials.solutions')
    @include('theme.tg-thang::views.partials.projects')
    @include('theme.tg-thang::views.partials.values')
    <section class="company" id="cong-ty"><div class="company-copy"><span class="section-tag">VỀ TG THANG <i aria-hidden="true"></i></span><h2>Đồng hành<br>đến từng<br>chi tiết.</h2><p>Chúng tôi bắt đầu mỗi dự án bằng việc lắng nghe. Từ nhu cầu sử dụng, ngân sách đến điều kiện thi công, mọi quyết định đều hướng đến một công trình phù hợp và một trải nghiệm hợp tác rõ ràng.</p><button class="outline-button" data-contact>Trao đổi cùng đội ngũ <span aria-hidden="true">↗</span></button><span class="technical-note">KIẾN TRÚC / KỸ THUẬT / THI CÔNG</span></div><figure><img src="{{ Theme::asset()->url('assets/interior.webp') }}" alt="Không gian bên trong một công trình đang hoàn thiện" width="1152" height="1440" loading="lazy"><figcaption>ĐI TỪ Ý TƯỞNG. ĐẾN MỘT KHÔNG GIAN SỐNG.</figcaption></figure></section>
    <section class="faq" id="hoi-dap"><div><span class="section-tag">HỎI ĐÁP</span><h2>Trước khi<br>bắt đầu.</h2></div><div class="faq-items"><details><summary>TG Thang có nhận thiết kế và thi công trọn gói không?</summary><p>TG Thang đồng hành từ thiết kế đến thi công trọn gói: khảo sát, phương án kiến trúc, dự toán, thi công và bàn giao. Phạm vi cụ thể sẽ được thống nhất theo từng dự án.</p></details><details><summary>Cần chuẩn bị gì cho buổi tư vấn đầu tiên?</summary><p>Bạn có thể chuẩn bị vị trí khu đất, diện tích, nhu cầu sử dụng, ngân sách dự kiến và thời điểm muốn khởi công. Bản vẽ hiện trạng hoặc hình tham khảo sẽ giúp cuộc trao đổi cụ thể hơn.</p></details><details><summary>Giải pháp lắp ghép phù hợp với công trình nào?</summary><p>Nhà ở, công trình lưu trú, văn phòng và nhà xưởng đều có thể xem xét giải pháp lắp ghép. Đội ngũ kỹ thuật cần đánh giá mặt bằng, kết cấu và yêu cầu sử dụng trước khi đề xuất.</p></details></div></section>
</main>
@include('theme.tg-thang::views.partials.footer')
@include('theme.tg-thang::views.partials.dialogs')
</body>
</html>
