@php
    $rituals = [
        ['Massage', 'đá nóng', 'coconut-ritual', 'coconut-detail', 'Sức ấm từ đá bazan kết hợp cùng dầu thơm và nhịp massage chậm. Một khoảng nghỉ để cơ thể thả lỏng sau những ngày bận rộn.', '75 PHÚT · TỪ 690.000₫', 'massage'],
        ['Nghi thức', 'xông hơi', 'foam-ritual', 'foam-detail', 'Hơi ấm, bọt mềm và hương thảo mộc tạo nên một nghi thức chăm sóc cơ thể thật dịu dàng. Dành thời gian để nghỉ ngơi và cảm nhận.', '90 PHÚT · TỪ 890.000₫', 'hammam'],
        ['Massage', 'Bali', 'bali-ritual', 'bali-detail', 'Trải nghiệm massage Bali với dầu thực vật và những chuyển động nhịp nhàng. Mỗi buổi chăm sóc được điều chỉnh theo mong muốn của bạn.', '60 PHÚT · TỪ 590.000₫', 'massage'],
    ];
@endphp
<section class="rituals" id="spa-rituals" aria-label="Liệu trình nổi bật">
    <div class="ritual-stage">
        @foreach ($rituals as [$title, $subtitle, $image, $detail, $description, $duration, $key])
            <article class="ritual-panel" data-ritual="{{ $loop->index }}" aria-label="{{ $title }} {{ $subtitle }}">
                <div class="ritual-copy"><p class="eyebrow">{{ '0' . $loop->iteration }} / NGHI THỨC CHĂM SÓC</p><h2>{{ $title }}<br><em>{{ $subtitle }}</em></h2><img class="ritual-detail" src="{{ $asset('assets/' . $detail . '.webp') }}" alt="Chi tiết {{ $title }} {{ $subtitle }}" loading="lazy"><p>{{ $description }}</p><p class="eyebrow">{{ $duration }}</p><button class="text-link" data-service="{{ $key }}" type="button">KHÁM PHÁ LIỆU TRÌNH ↗</button></div>
                <div class="ritual-image"><img src="{{ $asset('assets/' . $image . '.webp') }}" alt="Cảm hứng {{ $title }} {{ $subtitle }}" loading="lazy" width="1056" height="1280"></div>
            </article>
        @endforeach
        <nav class="ritual-nav" aria-label="Chọn liệu trình nổi bật"><button type="button" data-ritual-jump="0" aria-label="Massage đá nóng" aria-current="true">01</button><button type="button" data-ritual-jump="1" aria-label="Nghi thức xông hơi">02</button><button type="button" data-ritual-jump="2" aria-label="Massage Bali">03</button></nav>
    </div>
</section>
