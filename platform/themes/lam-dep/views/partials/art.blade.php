<section class="beauty-art" id="beauty-art" aria-labelledby="art-title">
    <div class="art-stage">
        @foreach(['one', 'two', 'three', 'four', 'five', 'six'] as $index => $position)
            <div class="art-photo art-{{ $position }}"><img src="{{ Theme::asset()->url('assets/texture-' . ($index + 1) . '.webp') }}" alt="Chi tiết chất liệu tự nhiên {{ $index + 1 }}" width="700" height="900" loading="lazy"></div>
        @endforeach
        <div class="art-copy"><h2 id="art-title">NGHỆ THUẬT<br>CỦA VẺ ĐẸP<br>TỰ NHIÊN</h2></div>
        <p class="art-note">Chăm chút từng đường nét để tôn lên vẻ đẹp tự nhiên.<br>Và để bạn luôn cảm thấy là chính mình.</p>
    </div>
</section>
