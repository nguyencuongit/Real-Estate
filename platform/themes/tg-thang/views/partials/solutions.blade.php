@php
    $solutions = [
        ['id' => 'panel', 'number' => '01', 'label' => 'VẬT LIỆU & BAO CHE', 'title' => 'Gọn nhẹ trong lắp đặt.\nBền vững khi sử dụng.', 'description' => 'Lựa chọn vật liệu theo công năng và điều kiện sử dụng. Hệ vách, mái và lớp hoàn thiện được tính toán đồng bộ để cân bằng thẩm mỹ, độ bền và khả năng bảo trì.', 'image' => 'panels', 'alt' => 'Các tấm vật liệu được chuẩn bị tại nhà máy'],
        ['id' => 'digital', 'number' => '02', 'label' => 'THIẾT KẾ & KỸ THUẬT', 'title' => 'Rõ từ bản vẽ.\nChuẩn đến chi tiết.', 'description' => 'Phối hợp các bộ môn trên cùng một phương án. Mô hình số hỗ trợ kiểm tra kích thước, vị trí cấu kiện và các điểm giao nhau trước khi gia công hoặc thi công.', 'image' => 'robot', 'alt' => 'Máy gia công cấu kiện trong nhà máy'],
        ['id' => 'frame', 'number' => '03', 'label' => 'KẾT CẤU & LẮP DỰNG', 'title' => 'Từng cấu kiện chuẩn.\nMột tổng thể vững.', 'description' => 'Gia công theo hồ sơ được duyệt, đánh dấu cấu kiện và lập kế hoạch lắp dựng. Công tác kiểm tra được thực hiện theo từng giai đoạn, từ nền móng đến khung công trình.', 'image' => 'frame', 'alt' => 'Các cấu kiện kết cấu được gia công để lắp dựng'],
        ['id' => 'turnkey', 'number' => '04', 'label' => 'THI CÔNG TRỌN GÓI', 'title' => 'Một đầu mối.\nTrọn hành trình.', 'description' => 'Theo sát công trình từ khảo sát đến bàn giao. Kế hoạch tiến độ, khối lượng và các thay đổi được trao đổi rõ ràng để bạn chủ động trong mỗi quyết định.', 'image' => 'system', 'alt' => 'Giải pháp kết cấu và vật liệu cho công trình'],
    ];
@endphp
<section class="solutions" id="giai-phap" aria-labelledby="solutions-title"><div class="section-heading"><span class="section-tag">GIẢI PHÁP <i aria-hidden="true"></i></span><h2 id="solutions-title">Từ nhu cầu thực tế.<br>Đến giải pháp<br>đồng bộ.</h2><span class="section-index">[ 01 — 04 ]</span></div>
    <div class="solution-stack">
    @foreach($solutions as $solution)
    <article class="solution-row" style="--stack-index: {{ $loop->index }}"><div class="solution-number">{{ $solution['number'] }} <span>/</span></div><figure><div class="solution-media"><img src="{{ Theme::asset()->url('assets/' . $solution['image'] . '.webp') }}" alt="{{ $solution['alt'] }}" width="960" height="1280" loading="lazy"></div></figure><div class="solution-body"><span class="section-tag">{{ $solution['label'] }}</span><h3>{!! nl2br(e(str_replace('\n', "\n", $solution['title']))) !!}</h3><p>{{ $solution['description'] }}</p><button class="outline-button" data-detail="{{ $solution['id'] }}">Tìm hiểu giải pháp <span aria-hidden="true">↗</span></button></div></article>
    @endforeach
    </div>
</section>
