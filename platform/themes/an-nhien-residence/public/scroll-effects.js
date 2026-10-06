'use strict';
// Share the page's single animation frame and cached layout; never intercept wheel input.
window.ResidenceEffects = (() => {
  const { progress, range } = ResidenceMotion;
  const revealElements = [...document.querySelectorAll('.section-kicker, .intro-title h2, .intro-copy, .location-copy h2, .amenity-copy h2, .homes-heading, .home-panel, .gallery-heading, .information-layout > div, .enquiry-layout, .resident-heading, .resident-day article')].filter(element => !element.closest('.materials-stage,.living-stage'));
  revealElements.forEach(element => element.dataset.reveal = '');
  const counters = [...document.querySelectorAll('[data-count]')];
  const photos = [...document.querySelectorAll('.gallery-card img, .amenity-visual > img, .resident-photo img')];
  const closing = document.querySelector('.closing');
  const map = document.querySelector('.map-wrap');
  const coast = document.querySelector('.coast-sequence');
  const materials = document.querySelector('.materials-sequence');
  const track = document.querySelector('.materials-track');
  const materialButtons = [...document.querySelectorAll('[data-material]')];
  const living = document.querySelector('.living-sequence');
  const verticalCards = [...document.querySelectorAll('.living-step, .material-card')];
  let coastLayout, materialsLayout, livingLayout, closingLayout, mapLayout, travel = 0, activeMaterial = -1;
  let reveals = [], facts = [], images = [], chapters = [];
  const geometry = element => ({element, top:element.getBoundingClientRect().top + scrollY, height:element.offsetHeight});
  function measure() {
    // Neutralize animated offsets while measuring their natural document positions.
    document.body.classList.add('measuring-effects');
    reveals = revealElements.map(geometry);
    facts = counters.map(geometry);
    images = photos.map(geometry);
    // Only cache natural-flow cards. Sticky children have viewport-relative positions.
    chapters = verticalCards.filter(element => element.matches('.living-step')
      ? !document.body.classList.contains('living-enabled')
      : !document.body.classList.contains('horizontal-enabled')).map(element => ({
        ...geometry(element), copyTop:geometry(element.querySelector('.living-copy,.material-copy')).top
      }));
    coastLayout = geometry(coast);
    closingLayout = geometry(closing);
    mapLayout = geometry(map);
    materialsLayout = geometry(materials);
    livingLayout = geometry(living);
    travel = Math.max(0, track.scrollWidth - materials.querySelector('.materials-window').clientWidth);
    document.body.classList.remove('measuring-effects');
  }
  function render(position, height, enabled) {
    const coastProgress = enabled ? progress(position, coastLayout.top, coastLayout.height - height) : 1;
    coast.style.setProperty('--coast-inset', `${18 * (1 - range(coastProgress,0,.7))}%`);
    coast.style.setProperty('--coast-scale', 1.24 - coastProgress * .24);
    coast.style.setProperty('--coast-title-scale', .78 + range(coastProgress,.05,.8) * .22);
    coast.style.setProperty('--coast-copy-opacity', enabled ? range(coastProgress,.2,.6) : 1);
    coast.style.setProperty('--coast-copy-y', `${enabled ? (1 - range(coastProgress,.2,.6)) * 30 : 0}px`);
    coast.style.setProperty('--coast-word-x', `${(coastProgress - .5) * -220}px`);
    coast.style.setProperty('--coast-progress', `${coastProgress * 100}%`);
    const horizontal = document.body.classList.contains('horizontal-enabled');
    const chapterMotion = document.body.classList.contains('chapter-motion-enabled');
    const materialProgress = horizontal ? progress(position,materialsLayout.top,materialsLayout.height-height) : 0;
    const shift = range(materialProgress,.08,.9);
    track.style.setProperty('--track-x', `${-travel * shift}px`);
    const materialIndex = Math.round(shift * 2);
    if (activeMaterial !== materialIndex) {
      activeMaterial = materialIndex;
      materialButtons.forEach((button,index) => button.setAttribute('aria-pressed', String(index === materialIndex)));
    }
    chapters.forEach(item => {
      const enter = chapterMotion ? range(progress(position + height, item.top + 24, height * .7),0,1) : 1;
      const copyEnter = chapterMotion ? range(progress(position + height, item.copyTop + 24, height * .55),0,1) : 1;
      const pass = chapterMotion ? progress(position + height,item.top,height + item.height) : .5;
      item.element.style.setProperty('--chapter-appear', .25 + copyEnter * .75);
      item.element.style.setProperty('--chapter-y', `${(1-copyEnter)*48}px`);
      item.element.style.setProperty('--chapter-clip', `${(1-enter)*12}%`);
      item.element.style.setProperty('--chapter-scale', chapterMotion ? 1.16 - pass * .1 : 1);
      item.element.style.setProperty('--chapter-photo-y', `${chapterMotion ? (pass-.5)*-12 : 0}px`);
    });
    if (!document.body.classList.contains('living-enabled')) {
      const livingProgress = chapterMotion ? progress(position + height*.4,livingLayout.top,livingLayout.height) : 1;
      living.style.setProperty('--living-progress', livingProgress);
    }
    const mapProgress = enabled ? range(progress(position + height,mapLayout.top,height * .6),0,1) : 1;
    map.style.setProperty('--map-y', `${(1-mapProgress)*64}px`);
    map.style.setProperty('--map-scale', .86 + mapProgress * .14);
    map.style.setProperty('--map-turn', `${(1-mapProgress)*-3}deg`);
    const closingProgress = enabled ? progress(position, closingLayout.top, closingLayout.height-height) : .5;
    closing.style.setProperty('--closing-scale', enabled ? 1.22 - closingProgress * .22 : 1);
    closing.style.setProperty('--closing-title-scale', enabled ? .84 + closingProgress * .3 : 1);
    closing.style.setProperty('--closing-copy-y', `${enabled ? closingProgress * -60 : 0}px`);
    reveals.forEach(item => {
      const p = enabled ? range(progress(position + height, item.top + 30, height * .65), 0, 1) : 1;
      if (item.last === p) return;
      item.last = p;
      item.element.style.setProperty('--appear', .18 + p * .82);
      item.element.style.setProperty('--reveal-y', `${(1 - p) * 64}px`);
    });
    facts.forEach(item => {
      const p = enabled ? range(progress(position + height, item.top, height * .55), 0, 1) : 1;
      const value = String(Math.round(Number(item.element.dataset.count) * p)).padStart(Number(item.element.dataset.digits || 1), '0');
      if (item.element.textContent !== value) item.element.textContent = value;
    });
    images.forEach(item => {
      const p = enabled ? progress(position + height, item.top, height + item.height) : .5;
      if (item.last === p) return;
      item.last = p;
      item.element.style.setProperty('--photo-y', `${(p - .5) * 44}px`);
      item.element.style.setProperty('--photo-scale', enabled ? 1.07 : 1);
    });
  }
  materialButtons.forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.material);
    // Pick the middle of each scene's hold; native scroll still controls the track.
    const positions = [.04,.49,.96];
    window.scrollTo({top:materialsLayout.top + positions[index] * (materialsLayout.height-innerHeight),behavior:'smooth'});
  }));
  return {measure, render};
})();
