@php
    $plans = [
        ['Tự do tập luyện', '490.000', 'tháng', 'Không gian của bạn, nhịp tập của bạn.', ['Tập luyện tại khu vực gym', 'Sử dụng thiết bị & tủ đồ', 'Hướng dẫn buổi đầu', 'Linh hoạt thời gian']],
        ['Đồng hành 1:1', '1.490.000', 'tháng', 'Thêm định hướng, thêm động lực mỗi ngày.', ['Quyền lợi gói Tự do', '4 buổi hướng dẫn cá nhân', 'Lộ trình theo mục tiêu', 'Theo dõi quá trình tập']],
        ['Năng lượng nhóm', '890.000', 'tháng', 'Cùng nhau tìm lại năng lượng tích cực.', ['Quyền lợi gói Tự do', 'Tham gia lớp tập nhóm', 'Yoga & vận động nền tảng', 'Lịch lớp đa dạng']],
    ];
    $steps = [['Bắt đầu trò chuyện', 'Chia sẻ mục tiêu, lịch sinh hoạt và cách bạn muốn tập. Chúng mình cùng tìm một điểm bắt đầu.'], ['Chọn lộ trình', 'Làm quen với không gian, thiết bị và những bài tập phù hợp trong buổi trải nghiệm đầu tiên.'], ['Giữ nhịp tiến bộ', 'Tập đều, điều chỉnh khi cần và tận hưởng từng thay đổi nhỏ theo thời gian.']];
    $quotes = [['An', '“Buổi đầu có người hướng dẫn nên mình thấy dễ bắt nhịp hơn. Mỗi lần đến tập đều có thêm động lực.”', 'Hội viên tập sức mạnh'], ['Linh', '“Mình thích không khí lớp nhóm. Tập xong thấy nhẹ đầu hơn và có thêm năng lượng cho cả ngày.”', 'Hội viên lớp nhóm'], ['Minh', '“Một lịch tập rõ ràng giúp mình giữ được thói quen. Không cần vội, cứ tiến bộ từng chút một.”', 'Hội viên tập cá nhân']];
@endphp
<section class="section section-gray" id="gym-plans">
    <div class="section-intro container"><p class="eyebrow">GÓI HỘI VIÊN</p><h2 data-reveal>Một lựa chọn hôm nay.<br><span>Nhiều thay đổi ngày mai.</span></h2><p>Chọn cách tập phù hợp với thời gian và mục tiêu của bạn. Các gói và giá dưới đây là nội dung demo.</p></div>
    <div class="plans container">
        @foreach ($plans as $plan)
            <article class="plan {{ $loop->iteration === 2 ? 'featured' : '' }}" data-reveal>@if ($loop->iteration === 2)<span class="plan-badge">ĐỀ XUẤT</span>@endif<h3>{{ $plan[0] }}</h3><p>{{ $plan[3] }}</p><div class="price"><strong data-count="{{ str_replace('.', '', $plan[1]) }}">{{ $plan[1] }}</strong><span>đ / {{ $plan[2] }}</span></div><button class="button" type="button" data-book="{{ $plan[0] }}">Chọn gói này <span aria-hidden="true">↗</span></button><ul class="check-list">@foreach ($plan[4] as $feature)<li>{{ $feature }}</li>@endforeach</ul></article>
        @endforeach
    </div>
    <div class="discipline-strip" aria-label="Các bộ môn"><div class="discipline-track"><div class="discipline-group"><span>SỨC MẠNH</span><span>YOGA</span><span>THỂ LỰC</span><span>VẬN ĐỘNG</span><span>CÂN BẰNG</span></div><div class="discipline-group" aria-hidden="true"><span>SỨC MẠNH</span><span>YOGA</span><span>THỂ LỰC</span><span>VẬN ĐỘNG</span><span>CÂN BẰNG</span></div></div></div>
</section>
<section class="section container" id="gym-steps">
    <div class="section-intro"><p class="eyebrow">LỘ TRÌNH ĐƠN GIẢN</p><h2 data-reveal>Không cần đợi.<br><span>Bắt đầu từ đây.</span></h2><p>Ba bước để biến mong muốn thành một thói quen tập luyện.</p><a class="button" href="#gym-contact">Đăng ký trải nghiệm <span aria-hidden="true">↗</span></a></div>
    <div class="steps-journey" id="gym-steps-journey"><div class="steps-stage"><div class="steps-window"><div class="steps">@foreach ($steps as $step)<article><div class="step-photo"><img src="{{ $asset('assets/step-' . $loop->iteration . '.webp') }}" alt="{{ $step[0] }}" width="1400" height="1340" loading="lazy"><span>0{{ $loop->iteration }}</span></div><h3>{{ $step[0] }}</h3><p>{{ $step[1] }}</p></article>@endforeach</div></div><div class="steps-controls"><p>CUỘN ĐỂ THEO LỘ TRÌNH <span aria-hidden="true">→</span></p><nav aria-label="Chọn bước trong lộ trình">@foreach ($steps as $step)<button type="button" data-step="{{ $loop->index }}" aria-label="Bước {{ $loop->iteration }}: {{ $step[0] }}">0{{ $loop->iteration }}</button>@endforeach</nav><div class="steps-progress" aria-hidden="true"><i></i></div></div></div></div>
</section>
<section class="section section-gray" id="gym-stories">
    <div class="section-intro container"><p class="eyebrow">NHỮNG CÂU CHUYỆN TẬP LUYỆN</p><h2 data-reveal>Mỗi người một mục tiêu.<br><span>Cùng nhau tiến về phía trước.</span></h2><p>Cảm nhận minh họa dành cho bản demo TG Thang.</p></div>
    <div class="carousel quotes-carousel container" data-carousel aria-label="Cảm nhận minh họa">
        <div class="carousel-track" tabindex="0" aria-label="Dùng phím mũi tên để chuyển cảm nhận">@foreach ($quotes as $quote)<figure class="quote carousel-card"><span class="quote-stars" aria-hidden="true">★★★★★</span><blockquote>{{ $quote[1] }}</blockquote><figcaption><span class="avatar">{{ mb_substr($quote[0], 0, 1) }}</span><div><strong>{{ $quote[0] }}</strong><p>{{ $quote[2] }}</p></div></figcaption></figure>@endforeach</div>
        <div class="carousel-controls"><button type="button" data-prev aria-label="Cảm nhận trước">←</button><p><span data-current>01</span> / 03</p><button type="button" data-next aria-label="Cảm nhận tiếp theo">→</button></div>
    </div>
</section>
<section class="section container faq" id="gym-faq">
    <div class="section-intro"><p class="eyebrow">GIẢI ĐÁP NHANH</p><h2 data-reveal>Trước khi<br><span>bắt đầu.</span></h2></div>
    @foreach ([['Chưa từng tập gym, mình có tham gia được không?', 'Bạn có thể bắt đầu từ buổi làm quen để tìm hiểu thiết bị, kỹ thuật cơ bản và lựa chọn cách tập phù hợp.'], ['Mình cần chuẩn bị gì cho buổi tập đầu tiên?', 'Trang phục thoải mái, giày thể thao, khăn cá nhân và bình nước là một khởi đầu đơn giản.'], ['Có lớp tập nhóm nào để lựa chọn?', 'Bản demo có các lớp yoga, thể lực nền tảng và sức mạnh. Bạn có thể mở lịch tập để xem thời gian minh họa.'], ['Gói hội viên có bao gồm huấn luyện cá nhân không?', 'Gói Đồng hành 1:1 minh họa có các buổi hướng dẫn riêng. Xem phần gói hội viên để so sánh quyền lợi.'], ['Mình có thể trải nghiệm trước khi chọn gói không?', 'Có. Điền biểu mẫu đăng ký tập thử để xem luồng đăng ký trong giao diện demo.'], ['Đăng ký trên trang này có thanh toán không?', 'Không. Đây là giao diện demo; biểu mẫu chỉ hiển thị xác nhận trên màn hình, không gửi hay lưu thông tin.']] as [$question, $answer])
        <details><summary>{{ $question }}<span aria-hidden="true">+</span></summary><p>{{ $answer }}</p></details>
    @endforeach
</section>
