<section class="spa-menu section-intro" id="spa-menu">
    <p class="eyebrow" data-reveal>TG THANG SPA</p>
    <h2 data-reveal>Thực đơn<br><em>thư giãn</em></h2>
    <p class="intro-copy" data-reveal>Tìm một liệu trình dành riêng cho bạn. Từ <span class="circled">massage đá nóng</span> ấm áp, chăm sóc cơ thể bằng thảo mộc đến nghi thức xông hơi và những khoảnh khắc cùng người thương.</p>
</section>
<section class="service-pills" aria-label="Nhóm liệu trình">
    @foreach ([['Massage', '& chăm sóc', 'massage', '01'], ['Spa', 'cho hai người', 'couples', '02'], ['Xông hơi', '& thảo mộc', 'hammam', '03']] as [$title, $subtitle, $key, $number])
        <button class="service-pill pill-{{ $number }}" data-service="{{ $key }}" type="button" aria-label="Xem liệu trình {{ $title }} {{ $subtitle }}">
            <img class="pill-photo" src="{{ $asset('assets/' . $key . '.webp') }}" alt="" loading="lazy" width="627" height="916">
            <img class="pill-leaf" src="{{ $asset('assets/leaf.svg') }}" alt="" aria-hidden="true">
            <span class="pill-number">{{ $number }}</span><span class="pill-title"><span>{{ $title }}</span><em>{{ $subtitle }}</em></span><span class="pill-bottom">3 LIỆU TRÌNH <span>↗</span></span>
        </button>
    @endforeach
</section>
