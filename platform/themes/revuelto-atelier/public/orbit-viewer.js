'use strict';
(() => {
  const dialog = document.getElementById('vehicle-orbit');
  const stage = dialog.querySelector('.orbit-stage');
  const range = document.getElementById('orbit-angle');
  const output = document.getElementById('orbit-angle-value');
  const autoButton = document.getElementById('orbit-auto');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const initial = () => ({yaw:Math.PI / 4, pitch:.19, zoom:1});
  let state = initial(), auto = false, frame = 0, lastTime = 0, opener, pinch = 0;
  const pointers = new Map();
  window.VantaOrbit = {getPose: aspect => VantaMotion.orbitPose(state, aspect)};
  const ready = () => document.body.dataset.vehicleState === 'ready';
  function updateAvailability() {
    dialog.querySelectorAll('[data-orbit-control]').forEach(control => { control.disabled = !ready(); });
    stage.setAttribute('aria-disabled', String(!ready()));
    if (!ready()) setAuto(false);
    requestDraw();
  }
  function setAuto(value) {
    auto = value;
    lastTime = 0;
    autoButton.setAttribute('aria-pressed', String(auto));
    autoButton.textContent = auto ? 'Dừng xoay' : 'Tự động xoay';
    requestDraw();
  }
  function requestDraw() {
    if (!frame && dialog.open && ready() && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function draw(time) {
    frame = 0;
    if (!dialog.open || document.hidden || !ready()) return;
    if (auto) {
      const seconds = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 0;
      state = VantaMotion.rotateOrbit(state, -seconds * 40, 0, 800);
      lastTime = time;
    }
    const angle = Math.round(state.yaw * 180 / Math.PI);
    range.value = String(angle);
    output.textContent = `${angle}°`;
    dialog.dataset.angle = String(angle);
    dialog.dataset.zoom = state.zoom.toFixed(2);
    window.VantaVehicle?.render();
    if (auto) requestDraw();
  }
  function reset() { state = initial(); setAuto(false); }
  document.querySelectorAll('[data-orbit-open]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    dialog.showModal();
    document.body.classList.add('modal-open');
    reset();
    updateAvailability();
    stage.focus({preventScroll:true});
  }));
  dialog.querySelector('.orbit-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    auto = false;
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    pointers.clear(); pinch = 0;
    stage.classList.remove('is-dragging');
    window.VantaVehicle?.render();
    opener?.focus({preventScroll:true});
  });
  document.getElementById('orbit-reset').addEventListener('click', reset);
  autoButton.addEventListener('click', () => setAuto(!auto));
  function zoom(value) { state.zoom = VantaMotion.orbitZoom(value); requestDraw(); }
  document.getElementById('orbit-zoom-in').addEventListener('click', () => zoom(state.zoom - .1));
  document.getElementById('orbit-zoom-out').addEventListener('click', () => zoom(state.zoom + .1));
  range.addEventListener('input', () => { setAuto(false); state.yaw = Number(range.value) * Math.PI / 180; requestDraw(); });
  stage.addEventListener('wheel', event => {
    if (!ready()) return;
    event.preventDefault();
    zoom(state.zoom + Math.sign(event.deltaY) * .06);
  }, {passive:false});
  function pinchDistance() {
    const [a, b] = [...pointers.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  }
  stage.addEventListener('pointerdown', event => {
    if (!ready() || event.button !== 0) return;
    setAuto(false);
    stage.focus({preventScroll:true});
    stage.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, {x:event.clientX, y:event.clientY});
    pinch = pinchDistance();
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', event => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    pointers.set(event.pointerId, {x:event.clientX, y:event.clientY});
    if (pointers.size === 2) {
      const distance = pinchDistance();
      if (pinch && distance) zoom(state.zoom * pinch / distance);
      pinch = distance;
    } else {
      state = VantaMotion.rotateOrbit(state, event.clientX - previous.x, event.clientY - previous.y, stage.clientWidth);
      requestDraw();
    }
  });
  function endPointer(event) {
    pointers.delete(event.pointerId);
    pinch = pinchDistance();
    if (!pointers.size) stage.classList.remove('is-dragging');
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => stage.addEventListener(name, endPointer));
  stage.addEventListener('keydown', event => {
    if (!ready()) return;
    const moves = {ArrowLeft:[stage.clientWidth / 24,0], ArrowRight:[-stage.clientWidth / 24,0], ArrowUp:[0,-8], ArrowDown:[0,8]};
    if (moves[event.key]) { event.preventDefault(); setAuto(false); state = VantaMotion.rotateOrbit(state, ...moves[event.key], stage.clientWidth); requestDraw(); }
    else if (event.key === 'Home') { event.preventDefault(); reset(); }
    else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(state.zoom - .1); }
    else if (event.key === '-') { event.preventDefault(); zoom(state.zoom + .1); }
  });
  document.addEventListener('vehicle-ready', updateAvailability);
  document.addEventListener('vehicle-unavailable', updateAvailability);
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; requestDraw(); });
  reduced.addEventListener('change', () => { if (reduced.matches) setAuto(false); });
  new ResizeObserver(requestDraw).observe(stage);
})();
