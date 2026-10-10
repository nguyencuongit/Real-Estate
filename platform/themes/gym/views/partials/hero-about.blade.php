<section class="hero" aria-labelledby="hero-title">
    <video class="hero-video" autoplay muted loop playsinline preload="metadata" poster="{{ $asset('assets/hero-poster.webp') }}" aria-hidden="true"><source src="{{ $asset('assets/hero.mp4') }}" type="video/mp4"></video>
    <div class="hero-shade"></div>
    <div class="hero-copy container">
        <p class="hero-badge"><span aria-hidden="true">❮❮</span> KHƠI DẬY NĂNG LƯỢNG <span aria-hidden="true">❯❯</span></p>
        <h1 id="hero-title" data-reveal><span>Mạnh mẽ</span><br>Từ hôm nay.</h1>
        <p>Mỗi buổi tập là một bước tiến. Khám phá phiên bản khỏe hơn, tự tin hơn của bạn tại TG Thang.</p>
        <div class="actions"><a class="button" href="#gym-contact">Đăng ký tập thử <span aria-hidden="true">↗</span></a><button class="text-button" type="button" data-dialog="gym-schedule">Khám phá lớp tập <span aria-hidden="true">↗</span></button></div>
    </div>
    <span class="hero-bottom">TẬP LUYỆN · KẾT NỐI · BỨT PHÁ</span>
</section>
<section class="section container about" id="gym-about">
    <div class="photo-frame" data-reveal><img src="{{ $asset('assets/about.webp') }}" alt="Không gian tập luyện với thiết bị thể lực" width="1500" height="1500" loading="lazy"></div>
    <div class="about-copy">
        <p class="eyebrow">VỀ TG THANG</p>
        <h2 data-reveal>Tập đúng.<br><span>Mạnh hơn.</span></h2>
        <p>Khởi đầu không cần hoàn hảo. Chỉ cần một mục tiêu, một nơi khiến bạn muốn quay lại và những người đồng hành hiểu bạn.</p>
        <p>TG Thang kết hợp không gian tập luyện hiện đại, hướng dẫn gần gũi và lộ trình phù hợp để bạn duy trì thói quen mỗi ngày.</p>
        <ul class="check-grid"><li>Thiết bị đa dạng</li><li>Lộ trình phù hợp</li><li>Huấn luyện tận tâm</li><li>Cộng đồng năng động</li></ul>
        <div class="actions"><a class="button" href="#gym-plans">Chọn gói tập <span aria-hidden="true">↗</span></a><a class="text-button" href="#gym-services">Xem dịch vụ <span aria-hidden="true">↗</span></a></div>
    </div>
</section>
<section class="stats container" aria-label="Các con số minh họa">
    @foreach ([['1200', '+', 'Hội viên đồng hành'], ['12', '+', 'Huấn luyện viên'], ['18', '+', 'Lớp tập mỗi tuần'], ['7', '', 'Ngày mở cửa / tuần']] as [$value, $suffix, $label])
        <div><strong><span data-count="{{ $value }}">{{ number_format((int) $value, 0, ',', '.') }}</span>{{ $suffix }}</strong><p>{{ $label }}</p></div>
    @endforeach
    <small>Số liệu minh họa cho giao diện demo.</small>
</section>
