(() => {
    'use strict';
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const scriptUrl = document.currentScript.src;
    const asset = (file) => new URL(`assets/${file}`, scriptUrl).href;
    const {clamp, lerp, journeyState, giftState, ritualState, progressFor} = window.SpaMotion;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const journey = $('#spa-journey'), gift = $('#spa-gift'), rituals = $('#spa-rituals');
    const panels = $$('.ritual-panel'), invitation = $('.journey-invitation');
    let paused = false, frame = 0;
    const progress = (section) => {
        const rect = section.getBoundingClientRect();
        return progressFor(rect.top, rect.height, innerHeight);
    };
    function render() {
        frame = 0;
        if (!document.body.classList.contains('motion-enabled')) return;
        const p = progress(journey), gp = progress(gift), rp = progress(rituals);
        const closing = $('.closing-section'), cr = closing.getBoundingClientRect();
        const state = journeyState(p), mobile = innerWidth <= 600;
        journey.dataset.progress = p.toFixed(3);
        $('.journey-landscape').style.transform = `scale(${state.landscapeScale}) translateY(${p * 3}%)`;
        $('.journey-meta').style.opacity = state.metaOpacity;
        $('.hero-title').style.opacity = state.titleOpacity;
        const name = $('.hero-name'), spa = $('.hero-spa');
        name.style.left = `${lerp(mobile ? 5 : 2, 50, state.stack)}%`;
        name.style.bottom = `${lerp(mobile ? 27 : 5, 56, state.stack)}%`;
        name.style.transform = `translateX(${-50 * state.stack}%) scale(${lerp(1, mobile ? .9 : .72, state.stack)})`;
        spa.style.right = `${lerp(mobile ? 7 : 3, 50, state.stack)}%`;
        spa.style.bottom = `${lerp(mobile ? 7 : 5, 27, state.stack)}%`;
        spa.style.transform = `translateX(${50 * state.stack}%) scale(${lerp(1, .9, state.stack)})`;
        $('.journey-portal').style.clipPath = `circle(${state.radius}% at 50% ${state.center}%)`;
        invitation.style.opacity = state.invitationOpacity;
        invitation.style.transform = `translateY(${(1 - state.invitationOpacity) * 40}px)`;
        invitation.inert = state.invitationOpacity < .95;
        invitation.style.pointerEvents = invitation.inert ? 'none' : 'auto';
        $('.journey-progress').style.width = `${p * 100}%`;
        const gs = giftState(gp);
        gift.dataset.progress = gp.toFixed(3);
        $('.card-front').style.transform = `translateY(${gs.lift}px) rotate(${gs.frontAngle}deg) rotateY(${gs.rotateY}deg)`;
        $('.card-back').style.transform = `translateY(${gs.lift * .6}px) rotate(${gs.backAngle}deg) rotateY(${-gs.rotateY}deg)`;
        $('.gift-dome').style.top = `${gs.dome}%`;
        const rs = ritualState(rp, panels.length);
        rituals.dataset.progress = rp.toFixed(3);
        const active = Math.min(panels.length - 1, rs.index + (rs.mix > .5 ? 1 : 0));
        panels.forEach((panel, index) => {
            if (innerHeight <= 620) {
                panel.removeAttribute('style');panel.inert = false;
                $('.ritual-copy', panel).style.transform = '';
                return;
            }
            const reveal = clamp(rp * (panels.length - 1) - (index - 1));
            panel.style.clipPath = index === 0 ? 'inset(0)' : `inset(${100 * (1 - reveal)}% 0 0)`;
            panel.style.zIndex = index + 1;
            panel.inert = index !== active;
            panel.style.pointerEvents = panel.inert ? 'none' : 'auto';
            $('.ritual-image img', panel).style.transform = `scale(${1.06 - reveal * .06})`;
            $('.ritual-copy', panel).style.transform = `translateY(${(1 - reveal) * 24}px)`;
        });
        $$('[data-ritual-jump]').forEach((button, index) => button.setAttribute('aria-current', String(index === active)));
        if (cr.top < innerHeight && cr.bottom > 0) $('.closing-section>img').style.transform = `translateY(${-clamp((innerHeight - cr.top) / (innerHeight + cr.height)) * 12}%)`;
    }
    function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
    const reveals = window.SpaReveal.init(() => !paused && !reduced.matches);
    function setMotion() {
        const enabled = !paused && !reduced.matches;
        document.body.classList.toggle('motion-enabled', enabled);
        document.body.classList.toggle('motion-paused', !enabled);
        if (!enabled) {
            reveals.cancel();
            $$('.journey-stage [style],.gift-stage [style],.ritual-stage [style],.closing-section>img').forEach((element) => element.removeAttribute('style'));
            panels.forEach((panel) => { panel.inert = false; });
            invitation.inert = true;
        }
        const control = $('.motion-toggle');
        control.disabled = reduced.matches;
        control.textContent = enabled ? 'Ⅱ' : '▷';
        control.setAttribute('aria-pressed', String(!enabled));
        control.setAttribute('aria-label', reduced.matches ? 'Hiệu ứng đã tắt theo cài đặt thiết bị' : enabled ? 'Tạm dừng hiệu ứng' : 'Bật hiệu ứng');
        requestRender();
    }
    $('.motion-toggle').addEventListener('click', () => { paused = !(paused || reduced.matches); setMotion(); });
    reduced.addEventListener('change', setMotion);
    addEventListener('scroll', requestRender, {passive:true});
    addEventListener('resize', requestRender, {passive:true});
    document.fonts.ready.then(requestRender);
    $$('[data-ritual-jump]').forEach((button) => button.addEventListener('click', () => {
        const index = Number(button.dataset.ritualJump);
        if (document.body.classList.contains('motion-enabled') && innerHeight > 620) scrollTo({top:scrollY + rituals.getBoundingClientRect().top + index / (panels.length - 1) * (rituals.offsetHeight - innerHeight),behavior:'smooth'});
        else panels[index].scrollIntoView({behavior:reduced.matches ? 'instant' : 'smooth'});
    }));
    setMotion();

    const booking = $('#spa-booking'), form = $('#spa-booking-form');
    const menu = $('#spa-mobile-menu'), detail = $('#spa-detail'), lightbox = $('#spa-lightbox');
    const today = new Date();
    $('input[type=date]', form).min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    $$('.menu-toggle').forEach((button) => button.addEventListener('click', () => menu.showModal()));
    $$('dialog').forEach((dialog) => {
        $('[data-close]', dialog).addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    });
    $$('a', menu).forEach((link) => link.addEventListener('click', () => menu.close()));
    $$('[data-book]').forEach((button) => button.addEventListener('click', () => {
        menu.close(); detail.close();
        if (button.dataset.book) $('select', form).value = button.dataset.book;
        $('.form-status', form).textContent = '';
        booking.showModal();
    }));
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = form.elements.name.value.trim();
        $('.form-status', form).textContent = `Cảm ơn ${name}! Bạn đã thử đặt lịch ${form.elements.treatment.value}. Đây là xác nhận mẫu trên trình duyệt.`;
    });
    const services = {
        massage:{title:'Massage & chăm sóc',image:'massage.webp',description:'Nhịp massage chậm, dầu thơm và hơi ấm dịu dàng. Chọn một trải nghiệm vừa vặn với mong muốn nghỉ ngơi của bạn.',options:['Massage đá nóng · 75 phút · 690.000₫','Massage Bali · 60 phút · 590.000₫','Chăm sóc cơ thể · 90 phút · 890.000₫'],booking:'Massage đá nóng'},
        couples:{title:'Spa cho hai người',image:'couples.webp',description:'Một khoảng riêng tư để cùng người thương tận hưởng sự thư giãn. Phòng đôi, trà thảo mộc và những nghi thức chăm sóc nhẹ nhàng.',options:['Bali cho hai người · 60 phút · 1.190.000₫','Đá nóng cho hai người · 75 phút · 1.390.000₫','Nghi thức thư giãn đôi · 120 phút · 1.990.000₫'],booking:'Spa cho hai người'},
        hammam:{title:'Xông hơi & thảo mộc',image:'hammam.webp',description:'Hơi ấm và hương thảo mộc đưa bạn đến một nhịp sống chậm hơn. Trải nghiệm nghi thức xông hơi và chăm sóc cơ thể trong không gian riêng tư.',options:['Nghi thức xông hơi · 90 phút · 890.000₫','Bọt mềm thư giãn · 60 phút · 690.000₫','Thảo mộc & chăm sóc · 120 phút · 1.190.000₫'],booking:'Xông hơi & thảo mộc'},
    };
    $$('[data-service]').forEach((button) => button.addEventListener('click', () => {
        const service = services[button.dataset.service];
        $('#detail-title').textContent = service.title;
        $('.detail-description').textContent = service.description;
        $('.detail-photo').src = asset(service.image);
        $('.detail-photo').alt = service.title;
        $('.detail-options').replaceChildren(...service.options.map((text) => {const li = document.createElement('li');li.textContent = text;return li;}));
        $('[data-book]', detail).dataset.book = service.booking;
        detail.showModal();
    }));
    $$('[data-gallery]').forEach((button) => button.addEventListener('click', () => {
        $('img', lightbox).src = asset(`${button.dataset.gallery}.webp`);
        lightbox.showModal();
    }));
    const track = $('.people-track');
    let drag = null;
    track.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        drag = {x:event.clientX,scroll:track.scrollLeft};
        track.setPointerCapture(event.pointerId);track.classList.add('dragging');
    });
    track.addEventListener('pointermove', (event) => {if (drag) track.scrollLeft = drag.scroll - (event.clientX - drag.x);});
    const endDrag = () => {drag = null;track.classList.remove('dragging');};
    track.addEventListener('pointerup', endDrag);track.addEventListener('pointercancel', endDrag);
    const slide = (direction) => track.scrollBy({left:direction * ($('.person', track).offsetWidth + 28),behavior:reduced.matches || paused ? 'instant' : 'smooth'});
    $$('[data-slide]').forEach((button) => button.addEventListener('click', () => slide(Number(button.dataset.slide))));
    track.addEventListener('keydown', (event) => {if (['ArrowLeft','ArrowRight'].includes(event.key)) {event.preventDefault();slide(event.key === 'ArrowRight' ? 1 : -1);}});
})();
