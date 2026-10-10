(() => {
    'use strict';
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
    const motion = window.GymMotion;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pinSize = matchMedia('(min-width: 768px) and (min-height: 660px)');
    const video = $('.hero-video');
    const toggle = $('.motion-toggle');
    const journey = $('.trainer-journey');
    const panels = $$('[data-trainer]');
    const trainerNav = $$('[data-trainer-nav]');
    const animations = new Set();
    const lowerMotion = window.GymLowerMotion();
    let paused = reduced.matches;
    let scheduled = false;
    let opener = null;
    const enabled = () => !paused;
    const pinned = () => enabled() && pinSize.matches;
    const animate = (element, frames, options) => {
        if (!enabled()) return;
        const animation = element.animate(frames, options);
        animations.add(animation);
        animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    };

    function updateVideo() {
        if (enabled() && !document.hidden && $('.hero').getBoundingClientRect().bottom > 0) video.play().catch(() => {});
        else video.pause();
    }
    function draw() {
        scheduled = false;
        $('.site-header').classList.toggle('scrolled', scrollY > 35);
        if (pinned()) {
            const bounds = journey.getBoundingClientRect();
            const position = motion.progress(bounds.top - innerHeight * 0.12, bounds.height, innerHeight * 0.92);
            const active = motion.activePanel(position, panels.length);
            panels.forEach((panel, index) => {
                panel.style.transform = `translateY(${motion.panelOffset(index, position, panels.length)}%)`;
                panel.inert = index !== active;
            });
            trainerNav.forEach((button, index) => button.setAttribute('aria-current', String(index === active)));
            $('.trainer-watermark').textContent = $('h3', panels[active]).textContent.toLocaleUpperCase('vi');
        }
        lowerMotion.draw(enabled());
        updateVideo();
    }
    function requestDraw() {
        if (!scheduled) { scheduled = true; requestAnimationFrame(draw); }
    }
    function setMotion() {
        document.documentElement.classList.toggle('motion-paused', !enabled());
        document.body.classList.toggle('pin-enabled', pinned());
        lowerMotion.sync(enabled());
        toggle.setAttribute('aria-pressed', String(!enabled()));
        toggle.setAttribute('aria-label', enabled() ? 'Tạm dừng hiệu ứng' : 'Bật hiệu ứng');
        toggle.textContent = enabled() ? 'Ⅱ' : '▶';
        if (!enabled()) animations.forEach(animation => animation.cancel());
        if (!pinned()) panels.forEach(panel => { panel.style.transform = ''; panel.inert = false; });
        requestDraw();
    }
    toggle.addEventListener('click', () => { paused = !paused; setMotion(); });
    reduced.addEventListener('change', () => { paused = reduced.matches; setMotion(); });
    pinSize.addEventListener('change', setMotion);
    addEventListener('scroll', requestDraw, { passive: true });
    addEventListener('resize', requestDraw, { passive: true });
    document.addEventListener('visibilitychange', updateVideo);
    trainerNav.forEach((button, index) => button.addEventListener('click', () => {
        if (!pinned()) return;
        const top = journey.getBoundingClientRect().top + scrollY;
        const distance = journey.offsetHeight - innerHeight * 0.92;
        scrollTo({ top: top - innerHeight * 0.12 + distance * index / (panels.length - 1), behavior: enabled() ? 'smooth' : 'instant' });
    }));

    function closeDialog(dialog, restore = true) {
        dialog.close();
        document.documentElement.classList.remove('dialog-open');
        if (restore) opener?.focus({ preventScroll: true });
    }
    $$('[data-dialog]').forEach(button => button.addEventListener('click', () => {
        const dialog = document.getElementById(button.dataset.dialog);
        const current = $('dialog[open]');
        if (current) closeDialog(current, false);
        opener = current ? $('.menu-trigger') : button;
        dialog.showModal();
        document.documentElement.classList.add('dialog-open');
    }));
    $$('dialog').forEach(dialog => {
        $('[data-close]', dialog).addEventListener('click', () => closeDialog(dialog));
        dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
        dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(dialog); } });
        $$('a[href^="#"]', dialog).forEach(link => link.addEventListener('click', () => closeDialog(dialog, false)));
    });
    $$('[data-book]').forEach(button => button.addEventListener('click', () => {
        const current = $('dialog[open]');
        if (current) closeDialog(current, false);
        const select = $('#gym-service');
        const value = button.dataset.book;
        if (![...select.options].some(option => option.value === value)) select.add(new Option(value, value));
        select.value = value;
        $('#gym-contact').scrollIntoView({ behavior: enabled() ? 'smooth' : 'instant', block: 'start' });
        $('#gym-contact-form').classList.remove('booking-highlight');
        requestAnimationFrame(() => $('#gym-contact-form').classList.add('booking-highlight'));
        $('[name="name"]').focus({ preventScroll: true });
    }));
    $$('[data-day]').forEach(button => button.addEventListener('click', () => {
        $$('[data-day]').forEach(day => day.setAttribute('aria-pressed', String(day === button)));
        $$('[data-class-day]').forEach(row => { row.hidden = row.dataset.classDay !== button.dataset.day; });
    }));
    $('#gym-contact-form').addEventListener('submit', event => {
        event.preventDefault();
        $('.form-status').textContent = `Cảm ơn ${$('[name="name"]').value.trim()}! Bạn đã hoàn tất trải nghiệm đăng ký ${$('#gym-service').value.toLocaleLowerCase('vi')}. Đây là bản demo, thông tin không được gửi hoặc lưu.`;
    });
    $('#gym-newsletter').addEventListener('submit', event => {
        event.preventDefault();
        $('[role="status"]', event.currentTarget).textContent = 'Đã hoàn tất đăng ký minh họa. Bản demo không gửi email.';
    });
    $$('.faq details').forEach(item => item.addEventListener('toggle', () => { if (item.open) $$('.faq details').forEach(other => { if (other !== item) other.open = false; }); }));

    $$('[data-carousel]').forEach(carousel => {
        const track = $('.carousel-track', carousel);
        const cards = $$('.carousel-card', track);
        const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
        const current = () => Math.round(track.scrollLeft / step());
        const go = direction => track.scrollTo({ left: motion.wrap(current() + direction, cards.length) * step(), behavior: enabled() ? 'smooth' : 'instant' });
        $('[data-prev]', carousel).addEventListener('click', () => go(-1));
        $('[data-next]', carousel).addEventListener('click', () => go(1));
        track.addEventListener('scroll', () => { $('[data-current]', carousel).textContent = String(Math.min(cards.length - 1, current()) + 1).padStart(2, '0'); }, { passive: true });
        track.addEventListener('keydown', event => { if (event.target !== track) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(event.key === 'ArrowRight' ? 1 : -1); } });
        let drag = null;
        track.addEventListener('pointerdown', event => {
            if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button,a')) return;
            drag = { x: event.clientX, scroll: track.scrollLeft, moved: false };
            track.setPointerCapture(event.pointerId);
        });
        track.addEventListener('pointermove', event => {
            if (!drag) return;
            const difference = event.clientX - drag.x;
            if (Math.abs(difference) > 5) { drag.moved = true; track.classList.add('dragging'); track.scrollLeft = drag.scroll - difference; }
        });
        const end = () => { if (!drag) return; const moved = drag.moved; drag = null; track.classList.remove('dragging'); if (moved) track.scrollTo({ left: current() * step(), behavior: enabled() ? 'smooth' : 'instant' }); };
        track.addEventListener('pointerup', end);
        track.addEventListener('pointercancel', end);
        track.addEventListener('lostpointercapture', end);
        $$('img', track).forEach(image => image.draggable = false);
    });

    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal.unobserve(entry.target);
        if (entry.target.dataset.count) {
            const target = Number(entry.target.dataset.count);
            if (!enabled()) return;
            const start = performance.now();
            const tick = now => {
                const progress = enabled() ? motion.clamp((now - start) / 1200) : 1;
                entry.target.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString('vi');
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        } else animate(entry.target, [{ opacity: 0.25, transform: 'translateY(36px)', filter: 'blur(5px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }], { duration: 800, easing: 'cubic-bezier(.16,1,.3,1)' });
    }), { threshold: 0.15 });
    $$('[data-reveal],[data-count]').forEach(element => reveal.observe(element));
    setMotion();
})();
