<main id="top" class="gym-home">
    {{-- 01 · HERO — A1 Tubes interactive background --}}
    <section class="gym-hero" data-tubes>
        <canvas class="gym-hero__canvas" aria-hidden="true"></canvas>
        <div class="gym-hero__veil" aria-hidden="true"></div>

        <div class="gym-shell gym-hero__content">
            <p class="gym-eyebrow gym-eyebrow--volt"><span></span> PULSE GYM · QUẬN 7 · MỞ CỬA 08:00 – 22:00</p>
            <h1 class="gym-hero__title">Đừng chỉ<br><em>tập luyện.</em><br>Hãy bứt phá.</h1>
            <p class="gym-hero__lead">Không gian tập luyện giàu năng lượng, huấn luyện có mục tiêu và cộng đồng luôn thúc đẩy bạn tiến về phía trước.</p>
            <div class="gym-hero__actions">
                <a class="gym-btn gym-btn--primary" href="#memberships">Khám phá gói tập <i class="bi bi-arrow-up-right"></i></a>
                <a class="gym-btn gym-btn--ghost" href="#programs">Xem các lớp tập <i class="bi bi-arrow-down"></i></a>
            </div>
        </div>

        <div class="gym-hero__hint" aria-hidden="true"><i class="bi bi-cursor-fill"></i> Click để nạp năng lượng</div>

        <div class="gym-marquee" aria-hidden="true">
            <div class="gym-marquee__track">
                @for ($i = 0; $i < 2; $i++)
                    <span>Stronger every day</span><i class="bi bi-lightning-charge-fill"></i>
                    <span>Move with purpose</span><i class="bi bi-lightning-charge-fill"></i>
                    <span>Your pace</span><i class="bi bi-lightning-charge-fill"></i>
                    <span>No limits</span><i class="bi bi-lightning-charge-fill"></i>
                @endfor
            </div>
        </div>
    </section>

    {{-- 02 · ABOUT + STATS — A3 Count-up + A2 Ghost cursor --}}
    <section id="about" class="gym-section gym-section--dark gym-stats" data-ghost-cursor>
        <div class="gym-shell">
            <div class="gym-split" data-reveal>
                <p class="gym-label">01 / Về PULSE</p>
                <div>
                    <h2 class="gym-heading">Một nơi để bạn đặt<br><em>mục tiêu cao hơn.</em></h2>
                    <p class="gym-copy">PULSE kết hợp sức mạnh, sức bền và sự linh hoạt trong một trải nghiệm tập luyện đầy cảm hứng. Bạn không cần là vận động viên để bắt đầu — bạn chỉ cần sẵn sàng.</p>
                </div>
            </div>

            <div class="gym-stats__grid">
                <div class="gym-stat" data-countup>
                    <div class="gym-stat__value"><span data-target="1200">0</span><sup>+</sup></div>
                    <div class="gym-stat__bar"></div>
                    <p class="gym-stat__label">Hội viên đang thay đổi</p>
                </div>
                <div class="gym-stat" data-countup>
                    <div class="gym-stat__value"><span data-target="4.9" data-decimals="1">0</span><sup>/5</sup></div>
                    <div class="gym-stat__bar"></div>
                    <p class="gym-stat__label">Đánh giá từ cộng đồng</p>
                </div>
                <div class="gym-stat" data-countup>
                    <div class="gym-stat__value"><span data-target="12">0</span></div>
                    <div class="gym-stat__bar"></div>
                    <p class="gym-stat__label">Huấn luyện viên chuyên môn</p>
                </div>
                <div class="gym-stat" data-countup>
                    <div class="gym-stat__value"><span data-target="8">0</span><sup>năm</sup></div>
                    <div class="gym-stat__bar"></div>
                    <p class="gym-stat__label">Kinh nghiệm trung bình</p>
                </div>
            </div>
        </div>
    </section>

    {{-- 03 · SHOWCASE — A4 Full-screen image expansion --}}
    <section class="gym-expand" data-expand>
        <div class="gym-expand__sticky">
            <h2 class="gym-expand__side gym-expand__side--left" aria-hidden="true">Không</h2>
            <h2 class="gym-expand__side gym-expand__side--right" aria-hidden="true">Giới hạn</h2>

            <figure class="gym-expand__frame">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80"
                     alt="Hội viên tập tạ trong không gian PULSE Gym" loading="lazy" decoding="async">
            </figure>

            <div class="gym-expand__caption">
                <p class="gym-eyebrow gym-eyebrow--volt"><span></span> Sàn tập PULSE</p>
                <h2 class="gym-expand__title">Nơi giới hạn<br>bị phá vỡ</h2>
                <a class="gym-btn gym-btn--primary" href="#visit">Đặt lịch tham quan <i class="bi bi-arrow-up-right"></i></a>
            </div>
        </div>
    </section>

    {{-- 04 · PROGRAMS HUB — A5 Scroll shape connect --}}
    <section class="gym-hub" data-hub>
        <div class="gym-hub__sticky">
            <header class="gym-shell gym-hub__head">
                <p class="gym-label">02 / Hệ sinh thái</p>
                <h2 class="gym-heading">Một thẻ hội viên.<br><em>Mọi bộ môn.</em></h2>
            </header>

            <div class="gym-hub__stage">
                <svg class="gym-hub__lines" aria-hidden="true">
                    <defs>
                        <linearGradient id="gymEnergy" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
                            <stop offset="0" stop-color="#FF5A1F"/>
                            <stop offset=".65" stop-color="#C6FF00"/>
                        </linearGradient>
                    </defs>
                </svg>

                <div class="gym-hub__core"><span>Một thẻ<br>tất cả</span></div>

                <div class="gym-hub__sat" style="--x:14%; --y:18%; --mx:22%; --my:10%"><i class="bi bi-activity"></i> Strength</div>
                <div class="gym-hub__sat" style="--x:86%; --y:18%; --mx:78%; --my:10%"><i class="bi bi-fire"></i> HIIT</div>
                <div class="gym-hub__sat" style="--x:6%;  --y:58%; --mx:18%; --my:50%"><i class="bi bi-heart-pulse"></i> Cardio</div>
                <div class="gym-hub__sat" style="--x:94%; --y:58%; --mx:82%; --my:50%"><i class="bi bi-person-arms-up"></i> Flow</div>
                <div class="gym-hub__sat" style="--x:28%; --y:92%; --mx:24%; --my:90%"><i class="bi bi-trophy"></i> Boxing</div>
                <div class="gym-hub__sat" style="--x:72%; --y:92%; --mx:76%; --my:90%"><i class="bi bi-egg-fried"></i> Dinh dưỡng</div>
            </div>
        </div>
    </section>

    {{-- 05 · PROGRAM CARDS — Chalk --}}
    <section id="programs" class="gym-section gym-section--chalk gym-programs">
        <div class="gym-shell">
            <div class="gym-section-head" data-reveal>
                <div>
                    <p class="gym-label">03 / Lớp tập</p>
                    <h2 class="gym-heading">Tìm nhịp tập<br>của <em>riêng bạn.</em></h2>
                </div>
                <p class="gym-copy">Chọn một lộ trình, hoặc kết hợp chúng. Huấn luyện viên sẽ giúp bạn tìm sự cân bằng phù hợp.</p>
            </div>

            <div class="gym-program-grid">
                <article class="gym-program-card" data-reveal style="--i:0">
                    <div class="gym-program-card__top"><span class="gym-program-card__icon"><i class="bi bi-activity"></i></span><span class="gym-program-card__num">01</span></div>
                    <p class="gym-eyebrow">Sức mạnh</p>
                    <h3>Strength</h3>
                    <p>Xây nền tảng sức mạnh với kỹ thuật đúng và tiến độ rõ ràng.</p>
                    <a href="#memberships" class="gym-round-link" aria-label="Khám phá Strength"><i class="bi bi-arrow-up-right"></i></a>
                </article>
                <article class="gym-program-card gym-program-card--featured" data-reveal style="--i:1">
                    <div class="gym-program-card__top"><span class="gym-program-card__icon"><i class="bi bi-fire"></i></span><span class="gym-badge">Hot</span></div>
                    <p class="gym-eyebrow">Sức bền</p>
                    <h3>HIIT &amp; Cardio</h3>
                    <p>Nâng nhịp tim, đốt năng lượng và cải thiện sức bền mỗi buổi.</p>
                    <a href="#memberships" class="gym-round-link" aria-label="Khám phá HIIT và Cardio"><i class="bi bi-arrow-up-right"></i></a>
                </article>
                <article class="gym-program-card" data-reveal style="--i:2">
                    <div class="gym-program-card__top"><span class="gym-program-card__icon"><i class="bi bi-person-arms-up"></i></span><span class="gym-program-card__num">03</span></div>
                    <p class="gym-eyebrow">Phục hồi</p>
                    <h3>Flow</h3>
                    <p>Phục hồi, linh hoạt hơn và kết nối với cơ thể của bạn.</p>
                    <a href="#memberships" class="gym-round-link" aria-label="Khám phá Flow"><i class="bi bi-arrow-up-right"></i></a>
                </article>
            </div>
        </div>
    </section>

    {{-- 06 · VOLT PROMO — single volt block per page --}}
    <section id="visit" class="gym-section gym-volt">
        <div class="gym-shell gym-volt__grid" data-reveal>
            <div>
                <p class="gym-eyebrow"><span></span> Lần đầu đến PULSE?</p>
                <h2 class="gym-volt__title">Hãy đến và<br>cảm nhận nhịp.</h2>
            </div>
            <div class="gym-volt__aside">
                <p>Đặt một buổi trải nghiệm miễn phí. Chúng tôi sẽ dẫn bạn tham quan, lắng nghe mục tiêu và cùng chọn buổi tập đầu tiên.</p>
                <a class="gym-btn gym-btn--dark" href="tel:02873009999">Đặt lịch tập thử <i class="bi bi-arrow-up-right"></i></a>
            </div>
        </div>
    </section>

    {{-- 07 · COACHES — Chalk --}}
    <section id="coaches" class="gym-section gym-section--chalk gym-coaches">
        <div class="gym-shell gym-coaches__grid">
            <div class="gym-coach-card" data-reveal>
                <div class="gym-coach-card__ring" aria-hidden="true"></div>
                <i class="bi bi-star-fill gym-coach-card__star"></i>
                <p class="gym-eyebrow gym-eyebrow--volt">Head coach</p>
                <span class="gym-coach-card__name">Linh<br>Trần</span>
                <p class="gym-coach-card__meta">Strength · Conditioning · 10 năm</p>
            </div>
            <div data-reveal style="--i:1">
                <p class="gym-label">04 / Đội ngũ</p>
                <h2 class="gym-heading">Đúng kỹ thuật.<br><em>Đúng người</em> đồng hành.</h2>
                <p class="gym-copy">Không có một công thức chung cho tất cả. Đội ngũ PULSE lắng nghe mục tiêu của bạn, theo dõi tiến trình và luôn ở đó khi bạn cần thêm một lần lặp.</p>
                <div class="gym-coach-stats">
                    <div><strong>12</strong><span>Huấn luyện viên<br>chuyên môn</span></div>
                    <div><strong>08</strong><span>Năm kinh nghiệm<br>trung bình</span></div>
                </div>
            </div>
        </div>
    </section>

    {{-- 08 · MEMBERSHIPS — Carbon + A2 Ghost cursor (Livewire + Flux kept) --}}
    <section id="memberships" class="gym-section gym-section--dark gym-memberships" data-ghost-cursor>
        <div class="gym-shell">
            <div class="gym-section-head" data-reveal>
                <div>
                    <p class="gym-label">05 / Hội viên</p>
                    <h2 class="gym-heading">Đầu tư cho<br><em>phiên bản tốt hơn.</em></h2>
                </div>
                <p class="gym-copy">Chọn gói phù hợp hôm nay. Bạn luôn có thể thay đổi khi mục tiêu của mình thay đổi.</p>
            </div>
            @livewire('gym-membership')
        </div>
    </section>
</main>
