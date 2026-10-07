(() => {
  // platform/themes/lam-dep/public/motion-state.mjs
  var clamp = (value) => Math.max(0, Math.min(1, value));
  function sceneProgress(top, height, viewport) {
    if (height <= viewport) return 0;
    return clamp(-top / (height - viewport));
  }
  function artOffsets(progress, reduced2 = false) {
    if (reduced2) return [0, 0, 0, 0, 0, 0];
    const phase = clamp(progress);
    return [-1250, -1250, -1250, -1250, -850, -850].map((distance) => phase * distance);
  }
  function welcomeFrame(progress, reduced2 = false) {
    if (reduced2) return { width: 100, height: 100, card: 1 };
    const phase = clamp(progress);
    return { width: 20 + phase * 80, height: 40 + phase * 60, card: Math.round(clamp((phase - 0.8) / 0.2) * 1e3) / 1e3 };
  }
  function galleryPose(position) {
    const distance = Math.max(-1, Math.min(1, position));
    return { y: distance * 92, angle: distance * 5, imageX: -distance * 9 || 0 };
  }
  function coverPoint(width, height, sourceWidth, sourceHeight, x, y) {
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const left = (width - sourceWidth * scale) / 2;
    const top = (height - sourceHeight * scale) / 2;
    const pointX = left + x * sourceWidth * scale;
    const pointY = top + y * sourceHeight * scale;
    return { x: pointX, y: pointY, visible: pointX >= 22 && pointX <= width - 22 && pointY >= 22 && pointY <= height - 22 };
  }

  // platform/themes/lam-dep/src/gallery-motion.js
  function setupGallery(isPaused) {
    const viewport = document.querySelector(".gallery-viewport");
    const track = viewport.querySelector(".gallery-track");
    const cards = [...track.querySelectorAll(".gallery-card")];
    let offset = 0, target = 0, half = 0, width = 0, step = 0;
    let frame = 0, lastTime = 0, visible = false, hovering = false, drag = null, suppressClick = false;
    function measure() {
      half = track.querySelector(".gallery-set").getBoundingClientRect().width;
      width = viewport.clientWidth;
      step = cards[0].offsetWidth + parseFloat(getComputedStyle(track.querySelector(".gallery-set")).gap);
      target = Math.max(0, half - width / 2 + cards[0].offsetWidth / 2);
      offset = target;
      paint2();
    }
    function paint2() {
      track.style.transform = `translateX(${-offset}px)`;
      cards.forEach((card) => {
        const x = card.offsetLeft - offset + card.offsetWidth / 2;
        const position = (x - width / 2) / (width / 2);
        const pose = galleryPose(position);
        card.style.transform = `translateY(${pose.y}px) rotate(${pose.angle}deg)`;
        card.querySelector("img").style.transform = `scale(1.2) translateX(${pose.imageX}%)`;
      });
    }
    function tick(time) {
      frame = 0;
      const delta = lastTime ? Math.min(40, time - lastTime) : 0;
      lastTime = time;
      const resting = hovering || viewport.contains(document.activeElement) || drag;
      if (!isPaused() && !resting) target += delta * 0.022;
      offset += (target - offset) * 0.12;
      if (!viewport.contains(document.activeElement)) {
        if (offset >= half) {
          offset -= half;
          target -= half;
        }
        if (offset < 0) {
          offset += half;
          target += half;
        }
      }
      paint2();
      if (visible && !document.hidden && (!isPaused() || Math.abs(target - offset) > 0.2)) frame = requestAnimationFrame(tick);
    }
    function refresh() {
      if (visible && !document.hidden && !frame) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    }
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      refresh();
    }).observe(viewport);
    new ResizeObserver(measure).observe(viewport);
    viewport.addEventListener("pointerenter", () => {
      hovering = true;
    });
    viewport.addEventListener("pointerleave", () => {
      hovering = false;
      refresh();
    });
    viewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      drag = { x: event.clientX, target, pointer: event.pointerId };
      suppressClick = false;
    });
    viewport.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const distance = event.clientX - drag.x;
      if (Math.abs(distance) > 8) {
        suppressClick = true;
        if (!viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
        viewport.classList.add("is-dragging");
        target = drag.target - distance;
        refresh();
      }
    });
    function endDrag() {
      drag = null;
      viewport.classList.remove("is-dragging");
      refresh();
    }
    window.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("click", (event) => {
      if (suppressClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      }
    }, true);
    function move(direction) {
      target += direction * step;
      refresh();
    }
    document.querySelectorAll("[data-gallery-direction]").forEach((button) => button.addEventListener("click", () => move(Number(button.dataset.galleryDirection))));
    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    });
    cards.forEach((card) => card.addEventListener("focus", () => {
      target = card.offsetLeft + card.offsetWidth / 2 - width / 2;
      refresh();
    }));
    document.addEventListener("visibilitychange", refresh);
    measure();
    return refresh;
  }

  // platform/themes/lam-dep/src/reveal-motion.js
  function setupReveals(isPaused, animations2) {
    const targets = document.querySelectorAll(".hero-content h1, .beauty-story h2, .art-copy h2, .personal-copy h2, .welcome-copy h2, .faq-intro h2, .closing-copy h2");
    targets.forEach((heading) => {
      const label = [...heading.childNodes].map((node) => node.nodeName === "BR" ? " " : node.textContent).join("");
      heading.setAttribute("aria-label", label.replace(/\s+/g, " ").trim());
      const content = document.createElement("span");
      content.setAttribute("aria-hidden", "true");
      [...heading.childNodes].forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE) {
          content.append(node);
          return;
        }
        node.textContent.split(/(\s+)/).forEach((word) => {
          if (!word.trim()) {
            content.append(document.createTextNode(word));
            return;
          }
          const wrap = document.createElement("span");
          wrap.className = "motion-word";
          [...word.normalize("NFC")].forEach((character) => {
            const char = document.createElement("span");
            char.className = "motion-char";
            char.textContent = character;
            wrap.append(char);
          });
          content.append(wrap);
        });
      });
      heading.replaceChildren(content);
    });
    function animate(element, frames, options) {
      const animation = element.animate(frames, options);
      animations2.add(animation);
      animation.finished.then(() => animations2.delete(animation), () => animations2.delete(animation));
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        entry.target.dataset.revealed = "false";
        return;
      }
      if (entry.target.dataset.revealed === "true") return;
      entry.target.dataset.revealed = "true";
      if (isPaused()) return;
      const chars = entry.target.querySelectorAll(".motion-char");
      if (chars.length) {
        chars.forEach((char, index) => animate(char, [
          { opacity: 0, transform: "translateY(80%) rotateX(-75deg)", filter: "blur(8px)" },
          { opacity: 1, transform: "none", filter: "blur(0)" }
        ], { duration: 950, delay: Math.min(index * 16, 400), fill: "backwards", easing: "cubic-bezier(.22,1,.36,1)" }));
      } else {
        const images = entry.target.querySelectorAll(".gallery-face, .art-photo img, :scope > img");
        images.forEach((image, index) => animate(image, [
          { opacity: 0.1, clipPath: "inset(50% 50%)", scale: "1.15" },
          { opacity: 1, clipPath: "inset(0)", scale: "1" }
        ], { duration: 1400, delay: Math.min(index * 65, 350), fill: "backwards", easing: "cubic-bezier(.22,1,.36,1)" }));
      }
    }), { threshold: 0.12 });
    targets.forEach((element) => observer.observe(element));
    document.querySelectorAll(".gallery-viewport, .art-stage, .personal-film").forEach((element) => observer.observe(element));
  }

  // platform/themes/lam-dep/src/motion.js
  var reduced = matchMedia("(prefers-reduced-motion: reduce)");
  var toggle = document.getElementById("motion-toggle");
  var art = document.getElementById("beauty-art");
  var photos = [...art.querySelectorAll(".art-photo")];
  var welcome = document.getElementById("beauty-space");
  var welcomeImage = welcome.querySelector(".welcome-visual");
  var welcomeCard = welcome.querySelector(".welcome-card");
  var hero = document.querySelector(".beauty-hero");
  var colorSections = [...document.querySelectorAll(".beauty-art, .beauty-personal, .beauty-welcome, .beauty-faq")];
  var scene = document.querySelector(".service-scene");
  var model = scene.querySelector(".service-model");
  var points = [...scene.querySelectorAll(".service-point")];
  var videos = [...document.querySelectorAll("video")];
  var film = document.querySelector(".personal-film video");
  var filmToggle = document.querySelector(".film-toggle");
  var animations = /* @__PURE__ */ new Set();
  var visibleVideos = /* @__PURE__ */ new Set();
  var paused = reduced.matches;
  var scheduled = false;
  document.body.classList.add("motion-ready");
  var refreshGallery = setupGallery(() => paused || reduced.matches);
  function paint() {
    scheduled = false;
    const rect = art.getBoundingClientRect();
    const progress = sceneProgress(rect.top, rect.height, innerHeight);
    art.dataset.progress = progress.toFixed(3);
    artOffsets(progress, paused || reduced.matches).forEach((offset, index) => {
      photos[index].style.transform = `translateY(${offset * innerHeight / 720}px)`;
    });
    const welcomeRect = welcome.getBoundingClientRect();
    const welcomeProgress = sceneProgress(welcomeRect.top, welcomeRect.height, innerHeight);
    const frame = welcomeFrame(welcomeProgress, paused || reduced.matches);
    welcome.dataset.progress = welcomeProgress.toFixed(3);
    welcomeImage.style.width = `${frame.width}%`;
    welcomeImage.style.height = `${frame.height}%`;
    welcomeCard.style.setProperty("--card-progress", frame.card);
    welcomeCard.inert = frame.card < 0.95;
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom > 0) {
      const shift = paused || reduced.matches ? 0 : Math.min(innerHeight * 0.18, Math.max(0, -heroRect.top) * 0.18);
      hero.querySelectorAll("video, .hero-poster").forEach((media) => {
        media.style.transform = `translateY(${shift}px) scale(1.04)`;
      });
    }
    const current = colorSections.find((section) => {
      const box = section.getBoundingClientRect();
      return box.top <= innerHeight * 0.55 && box.bottom > innerHeight * 0.55;
    });
    document.body.style.backgroundColor = current?.matches(".beauty-art, .beauty-personal") ? "#705943" : "#7a6047";
  }
  function requestPaint() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(paint);
    }
  }
  function placePoints() {
    const rect = scene.getBoundingClientRect();
    points.forEach((point) => {
      const position = coverPoint(rect.width, rect.height, model.naturalWidth || 1440, model.naturalHeight || 900, Number(point.dataset.pointX), Number(point.dataset.pointY));
      point.style.left = `${position.x}px`;
      point.style.top = `${position.y}px`;
      point.hidden = !position.visible;
    });
  }
  function updateVideo(video) {
    if (!paused && !document.hidden && visibleVideos.has(video) && video.dataset.userPaused !== "true") {
      video.play().catch(() => {
      });
    } else {
      video.pause();
    }
  }
  function updateFilmButton() {
    filmToggle.textContent = film.paused ? "\u25B6" : "\u2161";
    filmToggle.setAttribute("aria-label", film.paused ? "Ph\xE1t video ch\u0103m s\xF3c" : "T\u1EA1m d\u1EEBng video ch\u0103m s\xF3c");
    filmToggle.setAttribute("aria-pressed", String(!film.paused));
  }
  film.addEventListener("play", updateFilmButton);
  film.addEventListener("pause", updateFilmButton);
  filmToggle.addEventListener("click", () => {
    if (film.paused) {
      film.dataset.userPaused = "false";
      film.play().catch(() => {
      });
    } else {
      film.dataset.userPaused = "true";
      film.pause();
    }
  });
  function applyMotionPreference() {
    document.body.classList.toggle("motion-paused", paused);
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.replaceChildren(document.createTextNode(paused ? "B\u1EADt chuy\u1EC3n \u0111\u1ED9ng " : "T\u1EA1m d\u1EEBng chuy\u1EC3n \u0111\u1ED9ng "));
    const symbol = document.createElement("span");
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = paused ? "\u25B6" : "\u2161";
    toggle.append(symbol);
    if (paused) animations.forEach((animation) => animation.cancel());
    refreshGallery();
    videos.forEach(updateVideo);
    requestPaint();
  }
  toggle.addEventListener("click", () => {
    paused = !paused;
    applyMotionPreference();
  });
  reduced.addEventListener("change", () => {
    paused = reduced.matches;
    applyMotionPreference();
  });
  document.addEventListener("visibilitychange", () => videos.forEach(updateVideo));
  window.addEventListener("scroll", requestPaint, { passive: true });
  window.addEventListener("resize", () => {
    placePoints();
    requestPaint();
  });
  model.addEventListener("load", placePoints);
  new ResizeObserver(placePoints).observe(scene);
  var videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
      updateVideo(entry.target);
    });
  }, { threshold: 0.15 });
  videos.forEach((video) => videoObserver.observe(video));
  setupReveals(() => paused || reduced.matches, animations);
  placePoints();
  applyMotionPreference();
  updateFilmButton();
})();
