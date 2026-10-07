<section class="beauty-services" id="beauty-services" aria-labelledby="services-title"><div class="service-scene"><img class="service-model" src="{{ Theme::asset()->url('assets/model.webp') }}" alt="Gương mặt và những điểm nhấn để khám phá dịch vụ" width="1440" height="900" loading="lazy"><div class="scene-shade"></div><div class="service-marquee" aria-hidden="true"><span>ĐẸP TỪ TỪNG CHI TIẾT · ĐẸP TỪ TỪNG CHI TIẾT ·&nbsp;</span><span>ĐẸP TỪ TỪNG CHI TIẾT · ĐẸP TỪ TỪNG CHI TIẾT ·&nbsp;</span></div><h2 class="sr-only" id="services-title">Dịch vụ làm đẹp TG Thang</h2>
    @foreach($beautyServices as $service)
    <button class="service-point" data-service="{{ $service['id'] }}" data-point-x="{{ $service['point'][0] }}" data-point-y="{{ $service['point'][1] }}" aria-label="{{ $service['number'] }} — {{ $service['name'] }}" aria-haspopup="dialog">{{ $service['number'] }}</button>
    @endforeach
    <aside class="service-peek" id="service-peek" hidden><img id="peek-image" alt="" width="600" height="400"><div><span class="eyebrow" id="peek-number"></span><h3 id="peek-title"></h3><p id="peek-copy"></p><button class="line-button" id="peek-detail">TÌM HIỂU DỊCH VỤ <span aria-hidden="true">↗</span></button></div></aside><span class="scene-instruction">CHẠM HOẶC DI CHUỘT QUA TỪNG ĐIỂM</span></div><nav class="service-list" aria-label="Chọn dịch vụ làm đẹp">
    @foreach($beautyServices as $service)
    <button data-service="{{ $service['id'] }}"><span>{{ $service['number'] }}</span>{{ $service['name'] }}<b aria-hidden="true">↗</b></button>
    @endforeach
</nav></section>

