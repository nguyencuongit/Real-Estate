@php
    $services = [
        ['Huấn luyện', 'cá nhân', 'Tập cùng người hướng dẫn, hiểu cách vận động và điều chỉnh từng động tác theo mục tiêu của bạn.', ['1:1', 'Kỹ thuật', 'Mục tiêu cá nhân']],
        ['Dinh dưỡng', '& thói quen', 'Một kế hoạch dễ theo, bắt đầu từ những thay đổi nhỏ trong sinh hoạt và bữa ăn hằng ngày.', ['Cân bằng', 'Thói quen', 'Đồng hành']],
        ['Lớp tập', 'nhóm', 'Năng lượng được nhân lên khi tập cùng nhau. Chọn yoga, sức mạnh hoặc những lớp vận động đầy hứng khởi.', ['Yoga', 'Sức mạnh', 'Nhịp điệu']],
        ['Lộ trình', 'thể lực', 'Từ những buổi làm quen đến thử thách mới, tiến bộ từng bước với lịch tập có cấu trúc rõ ràng.', ['Nền tảng', 'Tiến bộ', 'Bền bỉ']],
        ['Hướng dẫn', 'từ xa', 'Giữ nhịp tập luyện ngay cả khi bận rộn với bài tập linh hoạt và hướng dẫn phù hợp không gian của bạn.', ['Linh hoạt', 'Tại nhà', 'Kết nối']],
    ];
    $trainers = [
        ['Minh An', 'Sức mạnh & thể lực', 'Bắt đầu từ kỹ thuật đúng, xây dựng nền tảng vững và cùng bạn chinh phục từng cột mốc.'],
        ['Hà Linh', 'Vận động & cân bằng', 'Một nhịp tập dễ duy trì, giúp bạn lắng nghe cơ thể và tìm lại năng lượng mỗi ngày.'],
        ['Quốc Bảo', 'Huấn luyện cá nhân', 'Mỗi người có một xuất phát điểm. Lộ trình của bạn cũng cần được thiết kế theo cách riêng.'],
        ['Mai Phương', 'Lớp tập nhóm', 'Mang sự hào hứng vào từng buổi tập, kết nối mọi người qua những chuyển động đầy năng lượng.'],
    ];
@endphp
<section class="section section-gray" id="gym-services">
    <div class="section-intro container">
        <p class="eyebrow">DỊCH VỤ CỦA CHÚNG TÔI</p>
        <h2 data-reveal>Tập theo cách bạn muốn.<br><span>Tiến bộ theo cách<br>của riêng bạn.</span></h2>
        <p>Một mục tiêu hay nhiều thử thách mới — luôn có một lựa chọn để bạn bắt đầu và tiếp tục.</p>
        <div class="actions"><a class="button" href="#gym-contact">Bắt đầu ngay <span aria-hidden="true">↗</span></a><button class="text-button" type="button" data-dialog="gym-schedule">Xem lịch tập <span aria-hidden="true">↗</span></button></div>
    </div>
    <div class="carousel service-carousel" data-carousel aria-label="Dịch vụ phòng gym">
        <div class="carousel-track" tabindex="0" aria-label="Danh sách dịch vụ, dùng phím mũi tên để chuyển">
            @foreach ($services as $service)
                <article class="service-card carousel-card">
                    <img src="{{ $asset('assets/service-' . $loop->iteration . '.webp') }}" alt="{{ $service[0] . ' ' . $service[1] }}" width="1231" height="1600" loading="lazy">
                    <div class="service-copy"><span class="service-number">0{{ $loop->iteration }}</span><h3>{{ $service[0] }}<br><span>{{ $service[1] }}</span></h3><p>{{ $service[2] }}</p><ul class="tags">@foreach ($service[3] as $tag)<li>{{ $tag }}</li>@endforeach</ul><button class="text-button" type="button" data-book="{{ $service[0] . ' ' . $service[1] }}">Tìm lộ trình của bạn <span aria-hidden="true">↗</span></button></div>
                </article>
            @endforeach
        </div>
        <div class="carousel-controls container"><button type="button" data-prev aria-label="Dịch vụ trước">←</button><p><span data-current>01</span> / 05</p><button type="button" data-next aria-label="Dịch vụ tiếp theo">→</button></div>
    </div>
</section>
<section class="section trainers" id="gym-trainers">
    <div class="section-intro container"><p class="eyebrow">NGƯỜI ĐỒNG HÀNH CÙNG BẠN</p><h2 data-reveal>Hiểu mục tiêu.<br><span>Truyền cảm hứng.</span></h2><p>Những gương mặt mang năng lượng, sự tận tâm và một cách tiếp cận riêng đến mỗi buổi tập.</p><div class="actions"><a class="button" href="#trainer-journey">Gặp huấn luyện viên <span aria-hidden="true">↓</span></a><a class="text-button" href="#gym-contact">Đặt buổi tư vấn <span aria-hidden="true">↗</span></a></div></div>
    <div class="trainer-journey" id="trainer-journey">
        <div class="trainer-sticky">
            <span class="trainer-watermark" aria-hidden="true">MINH AN</span>
            <div class="trainer-stage">
                @foreach ($trainers as $trainer)
                    <article class="trainer-card" data-trainer="{{ $loop->index }}">
                        <img src="{{ $asset('assets/trainer-' . $loop->iteration . '.webp') }}" alt="Huấn luyện viên minh họa {{ $trainer[0] }}" width="1320" height="1600" loading="lazy">
                        <div><span class="eyebrow">0{{ $loop->iteration }} / ĐỘI NGŨ TG THANG</span><h3>{{ $trainer[0] }}</h3><h4>{{ $trainer[1] }}</h4><p>{{ $trainer[2] }}</p><button class="text-button" type="button" data-book="Tư vấn cùng {{ $trainer[0] }}">Tập cùng {{ $trainer[0] }} <span aria-hidden="true">↗</span></button><small>Thông tin nhân vật minh họa.</small></div>
                    </article>
                @endforeach
            </div>
            <nav class="trainer-nav" aria-label="Chọn huấn luyện viên">@foreach ($trainers as $trainer)<button type="button" data-trainer-nav="{{ $loop->index }}" aria-label="Xem {{ $trainer[0] }}">0{{ $loop->iteration }}</button>@endforeach</nav>
            <p class="scroll-hint">CUỘN ĐỂ GẶP NGƯỜI TIẾP THEO <span aria-hidden="true">↓</span></p>
        </div>
    </div>
</section>
