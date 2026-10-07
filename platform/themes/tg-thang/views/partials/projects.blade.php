@php
    $projects = [
        ['id' => 'project-1', 'code' => 'TG.01', 'name' => 'Không gian sống hiện đại', 'type' => 'NHÀ Ở / THIẾT KẾ & THI CÔNG', 'alt' => 'Mặt đứng tòa nhà hiện đại với hệ lam và ban công'],
        ['id' => 'project-2', 'code' => 'TG.02', 'name' => 'Kết nối những cộng đồng', 'type' => 'KHU DÂN CƯ / XÂY DỰNG ĐỒNG BỘ', 'alt' => 'Hai khối nhà ở giữa cảnh quan xanh'],
        ['id' => 'project-3', 'code' => 'TG.03', 'name' => 'Kiến trúc vì con người', 'type' => 'CÔNG TRÌNH DỊCH VỤ / KẾT CẤU LẮP GHÉP', 'alt' => 'Công trình dịch vụ có kiến trúc nhiều tầng'],
        ['id' => 'project-4', 'code' => 'TG.04', 'name' => 'Tối ưu từng mét vuông', 'type' => 'NHÀ Ở / GIẢI PHÁP CÔNG NGHIỆP HÓA', 'alt' => 'Khối nhà ở với hệ kết cấu và mặt đứng đồng nhất'],
    ];
@endphp
<figure class="wide-photo site-divider"><img src="{{ Theme::asset()->url('assets/factory.webp') }}" alt="Dây chuyền sản xuất và kiểm soát cấu kiện xây dựng" width="1440" height="810" loading="lazy"><figcaption><span>CHUẨN BỊ KỸ. THI CÔNG CHẮC.</span><span>TG / THI CÔNG</span></figcaption></figure>
<section class="projects" id="du-an" aria-labelledby="projects-title"><div class="section-heading"><span class="section-tag">DỰ ÁN <i aria-hidden="true"></i></span><h2 id="projects-title">Từ ý tưởng.<br>Đến hiện thực.</h2><p class="section-note">Bộ sưu tập công trình minh họa<br>cho các hướng giải pháp của TG Thang.</p></div><div class="project-track" id="project-track" aria-label="Các dự án minh họa">
    @foreach($projects as $project)
    <button class="project" data-detail="{{ $project['id'] }}"><div class="project-meta"><span>{{ $project['code'] }}</span><span aria-hidden="true">↗</span></div><img src="{{ Theme::asset()->url('assets/' . $project['id'] . '.webp') }}" alt="{{ $project['alt'] }}" width="1440" height="1080" loading="lazy"><span class="project-type">{{ $project['type'] }}</span><span class="project-name">{{ $project['name'] }}</span></button>
    @endforeach
    </div><div class="project-controls"><div><button class="square-button" id="projects-prev" aria-label="Dự án trước" disabled>←</button><button class="square-button" id="projects-next" aria-label="Dự án tiếp theo">→</button><span id="project-count" aria-live="polite">01 / 04</span></div><button class="outline-button" id="projects-all" aria-expanded="false" aria-controls="project-track">Xem tất cả dự án <span aria-hidden="true">↗</span></button></div></section>
