<section class="collection" id="fashion-{{ $collection }}" data-horizontal aria-labelledby="{{ $collection }}-title">
    <div class="collection-sticky">
        <header class="collection-heading"><h2 id="{{ $collection }}-title" data-reveal>{{ $title }}</h2><a class="text-link" href="#fashion-worlds">Những cảm hứng mới</a></header>
        <div class="collection-window">
            <div class="collection-track">
                <a class="collection-film" href="#fashion-spinner" aria-label="Khám phá chất liệu bộ sưu tập {{ $title }}"><video data-autoplay muted loop playsinline preload="none" poster="{{ $asset('assets/' . $collection . '-poster.webp') }}" data-src="{{ $asset('assets/' . $collection . '.mp4') }}"></video><span>Cảm hứng dệt thành phong cách</span></a>
                @for($i = 1; $i <= 5; $i++)
                    <button class="editorial-card" data-gallery="{{ $asset('assets/promo-slide-' . $i . $suffix . '.webp') }}" data-caption="{{ $title }} · Chi tiết {{ $i }}" aria-label="Xem ảnh {{ $i }} của {{ $title }}"><img src="{{ $asset('assets/promo-slide-' . $i . $suffix . '.webp') }}" alt="Chi tiết túi thêu trong {{ $title }}" loading="lazy" width="1000" height="1200"><span>Xem chi tiết ↗</span></button>
                @endfor
                @foreach($files as $i => $file)
                    <button class="product-card" data-product="{{ $names[$i] }}" data-collection="{{ $title }}" data-front="{{ $asset('assets/' . $file . '-1.webp') }}" data-detail="{{ $asset('assets/' . $file . '-3.webp') }}" aria-label="Xem thiết kế {{ $names[$i] }}">
                        <span class="product-image"><img src="{{ $asset('assets/' . $file . '-1.webp') }}" alt="Túi {{ $names[$i] }}, mặt trước" width="640" height="800" loading="lazy"><img class="product-detail" src="{{ $asset('assets/' . $file . '-3.webp') }}" alt="Đường thêu chi tiết của túi {{ $names[$i] }}" width="640" height="800" loading="lazy"></span><span class="product-name">{{ $names[$i] }}</span><span class="product-note">Khám phá thiết kế ↗</span>
                    </button>
                @endforeach
                <div class="collection-end"><p class="eyebrow">TG THANG ATELIER</p><h3>Một cảm hứng.<br>Muôn sắc riêng.</h3><button class="text-link" data-open="fashion-booking">Tạo thiết kế của bạn</button></div>
            </div>
        </div>
        <div class="collection-controls"><button data-track-prev aria-label="Xem ảnh trước trong {{ $title }}">←</button><span class="track-progress" aria-hidden="true"><i></i></span><button data-track-next aria-label="Xem ảnh tiếp theo trong {{ $title }}">→</button><span class="rail-hint">Cuộn để khám phá</span></div>
    </div>
</section>
