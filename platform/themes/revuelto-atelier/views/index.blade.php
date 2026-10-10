<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#080909" />
    <meta
      name="description"
      content="VANTA — bản demo automotive atelier với Lamborghini Revuelto và trải nghiệm cuộn điện ảnh."
    />
    <title>VANTA Atelier — Lamborghini Revuelto</title>
    <link rel="icon" href="{{ Theme::asset()->url('assets/favicon.svg') }}" type="image/svg+xml" />
    <link
      rel="preload"
      as="font"
      href="{{ Theme::asset()->url('assets/cormorant-garamond.ttf') }}"
      type="font/ttf"
      crossorigin
    />
    <link rel="preload" as="image" href="{{ Theme::asset()->url('assets/studio-b.webp') }}" />
    <link rel="stylesheet" href="{{ Theme::asset()->url('styles.css') }}" />
    <link rel="stylesheet" href="{{ Theme::asset()->url('cinematic.css?v=3') }}" />
    <script src="{{ Theme::asset()->url('motion.js?v=3') }}" defer></script>
    <script src="{{ Theme::asset()->url('assets/vehicle-3d.min.js?v=3') }}" defer></script>
    <script src="{{ Theme::asset()->url('orbit-viewer.js?v=1') }}" defer></script>
    <script src="{{ Theme::asset()->url('script.js?v=3') }}" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Đi đến nội dung</a>
    <header class="site-header">
      <a class="header-edition" href="#main"
        ><span>AUTOMOTIVE ATELIER</span><span>VIETNAM · EST. 2026</span></a
      >
      <a class="brand" href="#main" aria-label="VANTA — Trang chủ">
        <svg viewBox="0 0 50 25" aria-hidden="true">
          <path d="M3 3h9l13 16L38 3h9L25 25z" fill="currentColor" />
        </svg>
        <span>VANTA</span>
      </a>
      <button
        class="menu-toggle"
        id="menu-toggle"
        aria-expanded="false"
        aria-controls="navigation"
      >
        <span>KHÁM PHÁ</span><i aria-hidden="true"><b></b><b></b></i>
      </button>
    </header>

    <dialog class="entry" id="entry" aria-labelledby="entry-title">
      <div class="entry-gallery" aria-hidden="true">
        <img class="tile tile-1" src="{{ Theme::asset()->url('assets/headlight.webp') }}" alt="" />
        <img class="tile tile-2" src="{{ Theme::asset()->url('assets/rear.webp') }}" alt="" />
        <img class="tile tile-3" src="{{ Theme::asset()->url('assets/interior.webp') }}" alt="" />
        <img class="tile tile-4" src="{{ Theme::asset()->url('assets/hero.webp') }}" alt="" />
        <img class="tile tile-5" src="{{ Theme::asset()->url('assets/road-2.webp') }}" alt="" />
        <img class="tile tile-6" src="{{ Theme::asset()->url('assets/exterior-b.webp') }}" alt="" />
      </div>
      <div class="entry-content">
        <p class="eyebrow">VANTA · AUTOMOTIVE ATELIER</p>
        <h2 id="entry-title">A different<br />kind of <em>ordinary.</em></h2>
        <p>Những đường nét mang dấu ấn của bạn.</p>
        <button class="line-button entry-button" id="enter-button">
          BƯỚC VÀO TRẢI NGHIỆM <span aria-hidden="true">↗</span>
        </button>
        <small class="model-status" role="status">ĐANG CHUẨN BỊ REVUELTO 3D…</small>
      </div>
    </dialog>

    <main id="main">
      <section
        class="cinematic"
        id="experience"
        aria-label="Trải nghiệm Lamborghini Revuelto"
      >
        <div class="cinematic-stage">
          <div class="vehicle-host hero-vehicle" data-vehicle-scene="hero"></div>
          <span class="model-status hero-model-status" role="status">ĐANG CHUẨN BỊ REVUELTO 3D…</span>
          <div class="exterior-photos">
            <img
              class="hero-photo is-selected"
              src="{{ Theme::asset()->url('assets/studio-b.webp') }}"
              alt="Lamborghini Revuelto màu xanh đậm trong studio"
              data-paint-photo="blue"
              fetchpriority="high"
            />
            <img
              class="hero-photo"
              src="{{ Theme::asset()->url('assets/studio-a.webp') }}"
              alt="Lamborghini Revuelto màu tím trong studio"
              data-paint-photo="violet"
            />
            <img
              class="hero-photo"
              src="{{ Theme::asset()->url('assets/studio-c.webp') }}"
              alt="Lamborghini Revuelto màu xanh lime trong studio"
              data-paint-photo="lime"
            />
          </div>
          <div class="hero-vignette" aria-hidden="true"></div>
          <img
            class="interior-photo"
            src="{{ Theme::asset()->url('assets/interior.webp') }}"
            alt="Khoang lái Lamborghini Revuelto với nội thất đen và điểm nhấn cam"
          />
          <div class="interior-shade" aria-hidden="true"></div>
          <div class="hero-heading">
            <p class="eyebrow">LAMBORGHINI REVUELTO · V12 HYBRID</p>
            <h1>Crafted to<br /><em>defy ordinary.</em></h1>
          </div>
          <div class="hero-caption">
            <p>
              Mỗi đường nét, một tuyên ngôn.<br />Mỗi lựa chọn, một dấu ấn
              riêng.
            </p>
          </div>
          <div class="interior-heading" aria-hidden="true">
            <p class="eyebrow">DESIGNED AROUND THE DRIVER</p>
            <h2>Không chỉ để lái.<br />Để <em>cảm nhận.</em></h2>
            <p>
              Da, carbon và từng điểm chạm.<br />Một thế giới được tạo nên quanh
              bạn.
            </p>
          </div>
          <div class="hero-bottom">
            <button class="orbit-open" type="button" data-orbit-open aria-haspopup="dialog">Xem xe 360° <span aria-hidden="true">↻</span></button>
            <a class="scroll-cue" href="#experience"
              ><span class="scroll-line" aria-hidden="true"></span>CUỘN ĐỂ KHÁM
              PHÁ</a
            >
            <div class="paint-selector" aria-label="Chọn màu xe">
              <span id="paint-name">BLU NOTTE</span>
              <button
                data-paint="blue"
                class="paint-chip blue is-active"
                aria-label="Màu xanh đậm"
                aria-pressed="true"
              ></button>
              <button
                data-paint="violet"
                class="paint-chip violet"
                aria-label="Màu tím"
                aria-pressed="false"
              ></button>
              <button
                data-paint="lime"
                class="paint-chip lime"
                aria-label="Màu xanh lime"
                aria-pressed="false"
              ></button>
            </div>
          </div>
          <div class="scene-progress" aria-hidden="true"></div>
        </div>
      </section>
      <section class="approach section-pad" id="approach">
        <p class="eyebrow">01 / THE VANTA PHILOSOPHY</p>
        <h2 class="word-fill">
          Không chỉ khác biệt.<br />Phải là <em>chất riêng.</em>
        </h2>
        <p class="section-copy">
          Một chiếc xe có thể gây chú ý. Một chiếc xe mang dấu ấn cá nhân khiến
          người ta nhớ mãi.
        </p>
        <button class="line-button" data-project>
          BẮT ĐẦU BẢN PHỐI <span aria-hidden="true">↗</span>
        </button>
        <div class="spec-strip reveal">
          <div><b>V12</b><span>HYBRID POWERTRAIN</span></div>
          <div>
            <b>1.015 <small>CV</small></b
            ><span>CÔNG SUẤT KẾT HỢP</span>
          </div>
          <div>
            <b>2,5 <small>s</small></b
            ><span>TỪ 0 ĐẾN 100 KM/H</span>
          </div>
          <div>
            <b>&gt;350 <small>km/h</small></b
            ><span>TỐC ĐỘ TỐI ĐA</span>
          </div>
        </div>
      </section>
      <section
        class="story-sequence"
        id="vision"
        aria-label="Ba yếu tố trong mỗi bản phối"
      >
        <div class="story-stage">
          <div class="story-backgrounds" aria-hidden="true">
            <img src="{{ Theme::asset()->url('assets/headlight.webp') }}" alt="" /><img
              src="{{ Theme::asset()->url('assets/road-3.webp') }}"
              alt=""
            /><img src="{{ Theme::asset()->url('assets/rear.webp') }}" alt="" />
          </div>
          <div class="story-top">
            <p class="eyebrow">02 / CRAFTED AROUND YOU</p>
            <div class="chapter-dots" aria-hidden="true">
              <i class="is-active"></i><i></i><i></i>
            </div>
          </div>
          <article class="story-step is-active">
            <div class="story-image">
              <img
                src="{{ Theme::asset()->url('assets/headlight.webp') }}"
                alt="Đèn chữ Y và phần đầu xe Revuelto màu cam"
              />
            </div>
            <div class="story-copy">
              <p class="chapter-number">01 <span>/ 03</span></p>
              <h2>Identity.</h2>
              <p>
                Một ánh nhìn đã đủ nói lên cá tính. Từ sắc sơn đến đường nét ánh
                sáng, chiếc xe bắt đầu bằng câu chuyện của người ngồi sau vô
                lăng.
              </p>
              <button class="line-button" data-project>
                TẠO DẤU ẤN RIÊNG <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
          <article class="story-step" aria-hidden="true" inert>
            <div class="story-image">
              <img
                src="{{ Theme::asset()->url('assets/road-3.webp') }}"
                alt="Nút khởi động và các chi tiết cam trong khoang lái Revuelto"
              />
            </div>
            <div class="story-copy">
              <p class="chapter-number">02 <span>/ 03</span></p>
              <h2>Intention.</h2>
              <p>
                Không chi tiết nào là ngẫu nhiên. Vật liệu, cảm giác chạm và
                những điểm nhấn được lựa chọn để mỗi hành trình đều mang một ý
                nghĩa riêng.
              </p>
              <button class="line-button" data-project>
                KHÁM PHÁ BẢN PHỐI <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
          <article class="story-step" aria-hidden="true" inert>
            <div class="story-image">
              <img
                src="{{ Theme::asset()->url('assets/rear.webp') }}"
                alt="Đuôi Revuelto với đèn hậu và ống xả đôi"
              />
            </div>
            <div class="story-copy">
              <p class="chapter-number">03 <span>/ 03</span></p>
              <h2>Harmony.</h2>
              <p>
                Mạnh mẽ nhưng có tiết chế. Ngoại thất, khoang lái và từng đường
                nét cùng tạo nên một tổng thể liền mạch — đúng với tầm nhìn của
                bạn.
              </p>
              <button class="line-button" data-project>
                BẮT ĐẦU CÂU CHUYỆN <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
          <div class="story-progress" aria-hidden="true"><span></span></div>
        </div>
      </section>

      <section class="manifesto section-pad" id="craft">
        <div class="manifesto-title reveal">
          <p class="eyebrow">03 / OBSESSION IN EVERY DETAIL</p>
          <h2>
            Một chiếc xe nên<br />lên tiếng trước khi<br /><em
              >nó chuyển động.</em
            >
          </h2>
        </div>
        <div class="manifesto-side reveal">
          <img
            src="{{ Theme::asset()->url('assets/hero.webp') }}"
            alt="Revuelto màu cam nhìn từ trên cao"
            loading="lazy"
          />
          <p>
            Mỗi bề mặt, chất liệu và sắc độ đều là một phần của bản phối. Để
            hiệu suất và cá tính hiện diện trong cùng một đường nét.
          </p>
        </div>
      </section>
      <section
        class="services section-pad"
        id="details"
        aria-labelledby="details-title"
      >
        <div class="services-header reveal">
          <p class="eyebrow">04 / THE ART OF DETAIL</p>
          <h2 id="details-title">Nothing is<br /><em>an afterthought.</em></h2>
        </div>
        <div class="services-layout">
          <div class="service-list">
            <button
              class="service-row is-active"
              data-service="0"
              aria-expanded="true"
              aria-controls="service-description-0"
            >
              <span class="service-number">01</span
              ><span
                ><strong>Body &amp; aero</strong
                ><small id="service-description-0"
                  >Những đường nét sắc sảo, khe hút gió và bề mặt carbon tạo nên
                  một dáng xe không thể nhầm lẫn.</small
                ></span
              ><b aria-hidden="true">↗</b>
            </button>
            <button
              class="service-row"
              data-service="1"
              aria-expanded="false"
              aria-controls="service-description-1"
            >
              <span class="service-number">02</span
              ><span
                ><strong>Interior</strong
                ><small id="service-description-1"
                  >Chất liệu da, đường chỉ và các điểm chạm biến khoang lái
                  thành một không gian mang dấu ấn riêng.</small
                ></span
              ><b aria-hidden="true">↗</b>
            </button>
            <button
              class="service-row"
              data-service="2"
              aria-expanded="false"
              aria-controls="service-description-2"
            >
              <span class="service-number">03</span
              ><span
                ><strong>Light signature</strong
                ><small id="service-description-2"
                  >Dấu ấn chữ Y. Một nét sáng đủ để khắc họa tính cách của
                  Revuelto.</small
                ></span
              ><b aria-hidden="true">↗</b>
            </button>
            <button
              class="service-row"
              data-service="3"
              aria-expanded="false"
              aria-controls="service-description-3"
            >
              <span class="service-number">04</span
              ><span
                ><strong>V12 character</strong
                ><small id="service-description-3"
                  >Động cơ V12 và công nghệ hybrid cùng định hình một thế hệ cảm
                  xúc mới.</small
                ></span
              ><b aria-hidden="true">↗</b>
            </button>
            <button
              class="service-row"
              data-service="4"
              aria-expanded="false"
              aria-controls="service-description-4"
            >
              <span class="service-number">05</span
              ><span
                ><strong>Rear expression</strong
                ><small id="service-description-4"
                  >Từ cụm đèn hậu đến ống xả, phía sau xe vẫn tiếp nối cùng một
                  ngôn ngữ thiết kế.</small
                ></span
              ><b aria-hidden="true">↗</b>
            </button>
          </div>
          <div class="service-visual">
            <img
              class="is-active"
              src="{{ Theme::asset()->url('assets/intake.webp') }}"
              alt="Khí động học và khe hút gió Revuelto"
            /><img
              src="{{ Theme::asset()->url('assets/interior.webp') }}"
              alt="Nội thất Revuelto"
              aria-hidden="true"
            /><img
              src="{{ Theme::asset()->url('assets/headlight.webp') }}"
              alt="Đèn trước Revuelto"
              aria-hidden="true"
            /><img
              src="{{ Theme::asset()->url('assets/engine.webp') }}"
              alt="Động cơ V12 của Revuelto"
              aria-hidden="true"
            /><img
              src="{{ Theme::asset()->url('assets/rear.webp') }}"
              alt="Thiết kế đuôi Revuelto"
              aria-hidden="true"
            />
            <div class="service-image-caption">
              <span id="service-image-label">BODY &amp; AERO</span
              ><span id="service-image-number">01 / 05</span>
            </div>
          </div>
        </div>
      </section>

      <section class="statement exploded-sequence" id="engineering" aria-labelledby="statement-title">
        <div class="exploded-stage">
          <div class="vehicle-host" data-vehicle-scene="explode">
            <img class="vehicle-fallback" src="{{ Theme::asset()->url('assets/engine.webp') }}" alt="Động cơ V12 của Revuelto" />
          </div>
          <div class="exploded-opening">
            <p class="eyebrow">04 / BEYOND THE SURFACE</p>
            <h2 id="statement-title">Extraordinary.<br /><em>Inside out.</em></h2>
          </div>
          <div class="exploded-heading">
            <p class="eyebrow">LAMBORGHINI REVUELTO / ANATOMY</p>
            <h2>Every part.<br /><em>One vision.</em></h2>
          </div>
          <div class="part-notes" aria-hidden="true">
            <span>01 / CARBON BODY</span><span>02 / V12 HYBRID</span><span>03 / FORGED WHEELS</span>
          </div>
          <p class="exploded-instruction">CUỘN ĐỂ TÁCH TỪNG CỤM CHI TIẾT · CUỘN NGƯỢC ĐỂ LẮP LẠI</p>
          <div class="exploded-meter" aria-hidden="true"><i></i></div>
        </div>
      </section>

      <section
        class="collection section-pad"
        id="collection"
        aria-labelledby="collection-title"
      >
        <div class="collection-heading reveal">
          <p class="eyebrow">05 / SELECTED EXPRESSIONS</p>
          <h2 id="collection-title">The collection.</h2>
          <span>LAMBORGHINI REVUELTO / TWO PERSPECTIVES</span>
        </div>
        <div class="project-grid">
          <button
            class="project-card reveal"
            data-gallery="0"
            aria-label="Xem bộ ảnh Midnight expression"
          >
            <div class="project-image">
              <img
                src="{{ Theme::asset()->url('assets/exterior-b.webp') }}"
                alt="Revuelto màu xanh đậm trong studio"
                loading="lazy"
              /><span class="image-arrow" aria-hidden="true">↗</span>
            </div>
            <div class="project-caption">
              <div>
                <p class="eyebrow">01 / STUDIO EDITION</p>
                <h3>Midnight expression.</h3>
              </div>
              <span>KHÁM PHÁ ↗</span>
            </div>
          </button>
          <button
            class="project-card reveal"
            data-gallery="1"
            aria-label="Xem bộ ảnh Beyond the city"
          >
            <div class="project-image">
              <img
                src="{{ Theme::asset()->url('assets/road-1.webp') }}"
                alt="Revuelto giữa khung cảnh núi tuyết"
                loading="lazy"
              /><span class="image-arrow" aria-hidden="true">↗</span>
            </div>
            <div class="project-caption">
              <div>
                <p class="eyebrow">02 / OPEN ROAD</p>
                <h3>Beyond the city.</h3>
              </div>
              <span>KHÁM PHÁ ↗</span>
            </div>
          </button>
        </div>
      </section>
      <section class="contact-section finale" id="contact" aria-labelledby="finale-title">
        <div class="finale-stage">
          <div class="vehicle-host" data-vehicle-scene="finale">
            <img class="vehicle-fallback" src="{{ Theme::asset()->url('assets/rear.webp') }}" alt="Thiết kế đuôi Lamborghini Revuelto" />
          </div>
          <div class="finale-copy">
            <p class="eyebrow">ARE YOU READY TO</p>
            <h2 id="finale-title">Refuse<br /><em>Ordinary.</em></h2>
          </div>
          <button class="finale-cta" data-project>BẮT ĐẦU DẤU ẤN CỦA BẠN <span aria-hidden="true">↗</span></button>
          <button class="finale-back" id="finale-back">BACK TO TOP <span aria-hidden="true">↑</span></button>
        </div>
      </section>
    </main>
    <footer class="site-footer section-pad">
      <div class="footer-top">
        <a class="footer-brand" href="#main"
          >VANTA<span>AUTOMOTIVE ATELIER</span></a
        >
        <div class="footer-links">
          <a href="#experience">Trải nghiệm</a><a href="#details">Chi tiết</a
          ><a href="#collection">Bộ sưu tập</a
          ><button id="back-to-top">Lên đầu trang ↑</button
          ><button id="replay-intro">Xem lại intro ↗</button>
        </div>
      </div>
      <div class="footer-bottom">
        <small
          >© 2026 VANTA CONCEPT · Bản demo thiết kế.<br />Không phải website
          chính thức của Lamborghini hoặc Forge Automotive.</small
        ><a
          href="https://www.lamborghini.com/en-en/models/revuelto-models/revuelto"
          target="_blank"
          rel="noopener noreferrer"
          >Ảnh, mô hình &amp; thông số: Lamborghini ↗</a
        >
      </div>
    </footer>

    <dialog class="orbit-dialog" id="vehicle-orbit" aria-labelledby="orbit-title" aria-describedby="orbit-help">
      <div class="orbit-top"><div><p class="eyebrow">VANTA / INTERACTIVE SHOWROOM</p><h2 id="orbit-title">Revuelto <em>360°</em></h2></div><button class="orbit-close" type="button" aria-label="Đóng xem xe 360 độ">✕</button></div>
      <div class="orbit-stage" tabindex="0" role="group" aria-label="Mô hình xe 360 độ: kéo để xoay hoặc dùng các phím mũi tên" aria-describedby="orbit-help">
        <div class="vehicle-host" data-vehicle-scene="orbit"><img class="orbit-fallback" src="{{ Theme::asset()->url('assets/studio-b.webp') }}" alt="Lamborghini Revuelto — ảnh dự phòng khi mô hình 3D đang tải"/></div>
        <span class="model-status orbit-status" role="status">ĐANG TẢI REVUELTO 3D…</span>
      </div>
      <div class="orbit-controls"><div class="orbit-angle"><label for="orbit-angle">Góc nhìn <output id="orbit-angle-value">45°</output></label><input id="orbit-angle" type="range" min="0" max="360" value="45" aria-label="Góc xoay xe" data-orbit-control disabled/></div><div class="orbit-actions"><button type="button" id="orbit-auto" data-orbit-control disabled aria-pressed="false">Tự động xoay</button><button type="button" id="orbit-zoom-in" data-orbit-control disabled aria-label="Phóng to xe">+</button><button type="button" id="orbit-zoom-out" data-orbit-control disabled aria-label="Thu nhỏ xe">−</button><button type="button" id="orbit-reset" data-orbit-control disabled>Góc mặc định</button></div></div>
      <p id="orbit-help" class="orbit-help">Kéo để xoay 360° · Cuộn hoặc chụm hai ngón để zoom · Phím mũi tên để xoay · Home để về góc mặc định · Esc để đóng</p>
    </dialog>
    <dialog
      class="navigation"
      id="navigation"
      aria-labelledby="navigation-title"
    >
      <div class="nav-top">
        <span class="eyebrow" id="navigation-title">VANTA / NAVIGATION</span
        ><button
          class="close-button"
          data-close="navigation"
          aria-label="Đóng menu"
        >
          ĐÓNG <span aria-hidden="true">×</span>
        </button>
      </div>
      <nav>
        <a href="#main"><small>01</small> The experience <span>↗</span></a
        ><a href="#vision"><small>02</small> Our philosophy <span>↗</span></a
        ><a href="#details"><small>03</small> The details <span>↗</span></a
        ><a href="#engineering"><small>04</small> Inside out <span>↗</span></a
        ><a href="#collection"
          ><small>05</small> The collection <span>↗</span></a
        ><a href="#contact"><small>06</small> Your vision <span>↗</span></a>
      </nav>
      <div class="nav-bottom">
        <span>LAMBORGHINI REVUELTO</span><span>CRAFTED AROUND YOU.</span>
      </div>
    </dialog>
    <dialog
      class="project-dialog"
      id="project-dialog"
      aria-labelledby="project-title"
    >
      <button
        class="close-button"
        data-close="project-dialog"
        aria-label="Đóng bản phối"
      >
        ĐÓNG ×
      </button>
      <p class="eyebrow">VANTA / YOUR VISION</p>
      <h2 id="project-title">Chất riêng<br />của <em>bạn.</em></h2>
      <form id="project-form">
        <label for="project-name">Tên của bạn</label
        ><input
          id="project-name"
          name="name"
          required
          maxlength="80"
          autocomplete="name"
          placeholder="Bạn muốn được gọi là...?"
        /><label for="project-paint">Sắc độ bạn yêu thích</label
        ><select id="project-paint" name="paint">
          <option value="blue">Blu Notte · Xanh đậm</option>
          <option value="violet">Viola Vision · Tím</option>
          <option value="lime">Verde Flash · Xanh lime</option></select
        ><label for="project-style">Dấu ấn bạn hướng đến</label
        ><select id="project-style" name="style">
          <option>Thanh lịch &amp; tinh giản</option>
          <option>Nổi bật &amp; táo bạo</option>
          <option>Thể thao &amp; mạnh mẽ</option></select
        ><button class="line-button" type="submit">
          XEM BẢN PHỐI <span aria-hidden="true">↗</span>
        </button>
        <p class="form-note">
          Bản phối demo chỉ hiển thị trên máy của bạn, không gửi thông tin đi.
        </p>
      </form>
      <div class="project-result" id="project-result" hidden>
        <img
          id="result-image"
          src="{{ Theme::asset()->url('assets/exterior-b.webp') }}"
          alt="Revuelto trong bản phối của bạn"
        />
        <p class="eyebrow">YOUR REVUELTO EXPRESSION</p>
        <h3 id="result-name"></h3>
        <p id="result-summary"></p>
        <button class="line-button" id="edit-project">
          ĐỔI BẢN PHỐI <span aria-hidden="true">↗</span>
        </button>
      </div>
    </dialog>
    <dialog
      class="gallery-dialog"
      id="gallery-dialog"
      aria-labelledby="gallery-title"
    >
      <div class="gallery-top">
        <h2 id="gallery-title">Midnight expression.</h2>
        <button
          class="close-button"
          data-close="gallery-dialog"
          aria-label="Đóng bộ ảnh"
        >
          ĐÓNG ×
        </button>
      </div>
      <img id="gallery-image" src="{{ Theme::asset()->url('assets/exterior-b.webp') }}" alt="" />
      <div class="gallery-bottom">
        <button id="gallery-previous" aria-label="Ảnh trước">←</button
        ><span id="gallery-count">01 / 03</span
        ><button id="gallery-next" aria-label="Ảnh tiếp theo">→</button>
      </div>
    </dialog>
    <button
      class="motion-toggle"
      id="motion-toggle"
      aria-label="Tạm dừng hiệu ứng"
      aria-pressed="false"
    >
      Ⅱ
    </button>
    <noscript
      ><style>
        .hero-photo:not(.is-selected) {
          display: none;
        }
      </style>
      <p class="no-script">
        Bật JavaScript để dùng hiệu ứng cuộn và các nút tương tác.
      </p></noscript
    >
  </body>
</html>
