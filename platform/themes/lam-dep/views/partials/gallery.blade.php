<section class="beauty-gallery" aria-label="Khám phá các dịch vụ TG Thang"><div class="gallery-viewport" tabindex="0" aria-label="Bộ sưu tập dịch vụ, dùng phím mũi tên hoặc kéo để xem"><div class="gallery-track">
    @foreach([false, true] as $duplicate)
    <div class="gallery-set" @if($duplicate) aria-hidden="true" @endif>
        <button class="gallery-card gallery-house" data-book @if($duplicate) tabindex="-1" @endif aria-label="Đặt lịch tại TG Thang"><div class="gallery-face"><img src="{{ Theme::asset()->url('assets/texture-4.webp') }}" alt="" width="640" height="800" loading="lazy"><span class="gallery-wordmark">TG THANG</span></div></button>
        @foreach($beautyServices as $service)
        <button class="gallery-card" data-service="{{ $service['id'] }}" @if($duplicate) tabindex="-1" @endif aria-label="{{ $service['name'] }}"><div class="gallery-face"><img src="{{ Theme::asset()->url('assets/' . $service['gallery'] . '.webp') }}" alt="" width="640" height="800" loading="lazy"><span class="gallery-wordmark">TG {{ $service['short'] }}</span></div></button>
        @endforeach
    </div>
    @endforeach
</div></div><div class="gallery-caption"><span>KÉO ĐỂ KHÁM PHÁ TỪNG CHI TIẾT</span><div><button data-gallery-direction="-1" aria-label="Dịch vụ trước">←</button><button data-gallery-direction="1" aria-label="Dịch vụ tiếp theo">→</button></div></div></section>
