import { galleryPose } from '../public/motion-state.mjs';

export function setupGallery(isPaused) {
    const viewport = document.querySelector('.gallery-viewport');
    const track = viewport.querySelector('.gallery-track');
    const cards = [...track.querySelectorAll('.gallery-card')];
    let offset = 0, target = 0, half = 0, width = 0, step = 0;
    let frame = 0, lastTime = 0, visible = false, hovering = false, drag = null, suppressClick = false;

    function measure() {
        half = track.querySelector('.gallery-set').getBoundingClientRect().width;
        width = viewport.clientWidth;
        step = cards[0].offsetWidth + parseFloat(getComputedStyle(track.querySelector('.gallery-set')).gap);
        target = Math.max(0, half - width / 2 + cards[0].offsetWidth / 2);
        offset = target;
        paint();
    }
    function paint() {
        track.style.transform = `translateX(${-offset}px)`;
        cards.forEach(card => {
            const x = card.offsetLeft - offset + card.offsetWidth / 2;
            const position = (x - width / 2) / (width / 2);
            const pose = galleryPose(position);
            card.style.transform = `translateY(${pose.y}px) rotate(${pose.angle}deg)`;
            card.querySelector('img').style.transform = `scale(1.2) translateX(${pose.imageX}%)`;
        });
    }
    function tick(time) {
        frame = 0;
        const delta = lastTime ? Math.min(40, time - lastTime) : 0;
        lastTime = time;
        const resting = hovering || viewport.contains(document.activeElement) || drag;
        if (!isPaused() && !resting) target += delta * .022;
        offset += (target - offset) * .12;
        if (!viewport.contains(document.activeElement)) {
            if (offset >= half) { offset -= half; target -= half; }
            if (offset < 0) { offset += half; target += half; }
        }
        paint();
        if (visible && !document.hidden && (!isPaused() || Math.abs(target - offset) > .2)) frame = requestAnimationFrame(tick);
    }
    function refresh() {
        if (visible && !document.hidden && !frame) { lastTime = 0; frame = requestAnimationFrame(tick); }
    }
    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
        refresh();
    }).observe(viewport);
    new ResizeObserver(measure).observe(viewport);
    viewport.addEventListener('pointerenter', () => { hovering = true; });
    viewport.addEventListener('pointerleave', () => { hovering = false; refresh(); });
    viewport.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        drag = { x: event.clientX, target, pointer: event.pointerId };
        suppressClick = false;
    });
    viewport.addEventListener('pointermove', event => {
        if (!drag) return;
        const distance = event.clientX - drag.x;
        if (Math.abs(distance) > 8) {
            suppressClick = true;
            if (!viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
            viewport.classList.add('is-dragging');
            target = drag.target - distance;
            refresh();
        }
    });
    function endDrag() { drag = null; viewport.classList.remove('is-dragging'); refresh(); }
    window.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('click', event => {
        if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
    }, true);
    function move(direction) { target += direction * step; refresh(); }
    document.querySelectorAll('[data-gallery-direction]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.galleryDirection))));
    viewport.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
        }
    });
    // Keyboard focus brings a service into the middle instead of focusing a
    // clipped card. The loop's duplicate is excluded from the tab sequence.
    cards.forEach(card => card.addEventListener('focus', () => {
        target = card.offsetLeft + card.offsetWidth / 2 - width / 2;
        refresh();
    }));
    document.addEventListener('visibilitychange', refresh);
    measure();
    return refresh;
}
