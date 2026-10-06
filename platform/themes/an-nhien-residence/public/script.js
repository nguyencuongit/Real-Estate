'use strict';
const residenceAssetBase = new URL('.', document.currentScript.src);
const { clamp, range, progress, damp, chapter, motionModes, validPhone, coverPoint } = ResidenceMotion;
const hero = document.querySelector('.hero-sequence');
const header = document.querySelector('.site-header');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.getElementById('motion-toggle');
let paused = reducedMotion.matches, frame = 0, lastTime = 0, currentScroll = scrollY, layout = {};
const living = document.querySelector('.living-sequence');
const livingSteps = [...document.querySelectorAll('.living-step')];
const chapterButtons = [...document.querySelectorAll('[data-chapter]')];
const closing = document.querySelector('.closing');
let activeChapter = -1;

const heroStage = hero.querySelector('.hero-stage');
const heroImage = hero.querySelector('.hero-day');
const hotspots = [...hero.querySelectorAll('.hotspot')];
function showHotspot(spot, open) {
  if (open) hotspots.filter(item => item !== spot).forEach(item => { item.pinned = false; showHotspot(item, false); });
  spot.classList.toggle('is-open', open);
  spot.querySelector('button').setAttribute('aria-expanded', String(open));
  spot.querySelector('.hotspot-preview').hidden = !open;
  if (open) positionHotspots();
}
function positionHotspots(zoom = Number(hero.style.getPropertyValue('--hero-scale')) || 1, visible = true) {
  const width = heroStage.clientWidth, height = heroStage.clientHeight;
  hotspots.forEach(spot => {
    const point = coverPoint(width, height, heroImage.naturalWidth || 2400, heroImage.naturalHeight || 1600, Number(spot.dataset.imageX), Number(spot.dataset.imageY), layout.heroAlign ?? .5);
    const x = width / 2 + (point.x - width / 2) * zoom;
    const y = height / 2 + (point.y - height / 2) * zoom;
    // Keep anchors attached to their building; hide them when that building is cropped out.
    spot.hidden = !visible || hero.classList.contains('is-sunset') || x < 24 || x > width - 24 || y < 24 || y > height - 24;
    if (spot.hidden) { spot.pinned = false; showHotspot(spot, false); }
    spot.style.left = `${x}px`;
    spot.style.top = `${y}px`;
    const preview = spot.querySelector('.hotspot-preview');
    const previewWidth = Math.min(300, width - 32), previewHeight = preview.offsetHeight || 340;
    const left = Math.max(16, Math.min(width - previewWidth - 16, x + 24 + previewWidth <= width - 16 ? x + 24 : x - previewWidth - 24));
    const top = Math.max(16, Math.min(height - previewHeight - 16, y - previewHeight / 2));
    spot.style.setProperty('--preview-left', `${left - x}px`);
    spot.style.setProperty('--preview-top', `${top - y}px`);
  });
}
hotspots.forEach(spot => {
  const button = spot.querySelector('button');
  spot.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') showHotspot(spot, true); });
  spot.addEventListener('pointerleave', () => { if (!spot.pinned && !spot.contains(document.activeElement)) showHotspot(spot, false); });
  button.addEventListener('focus', () => showHotspot(spot, true));
  button.addEventListener('blur', () => { spot.pinned = false; showHotspot(spot, false); });
  button.addEventListener('click', () => { spot.pinned = !spot.pinned; showHotspot(spot, spot.pinned); });
});
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.hotspot')) hotspots.forEach(spot => { spot.pinned = false; showHotspot(spot, false); });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hotspots.forEach(spot => { spot.pinned = false; showHotspot(spot, false); });
});
heroImage.addEventListener('load', () => positionHotspots());

function openDialog(dialog, opener) {
  dialog.returnFocus = opener;
  dialog.showModal();
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    dialog.returnFocus?.focus({preventScroll:true});
    measure();
  });
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
});
const navigation = document.getElementById('navigation');
document.getElementById('menu-button').addEventListener('click', event => openDialog(navigation, event.currentTarget));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navigation.close()));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  hero.classList.toggle('is-sunset', button.dataset.view === 'sunset');
  positionHotspots();
  document.querySelectorAll('[data-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));

function measure() {
  const section = element => ({ top: element.getBoundingClientRect().top + scrollY, height: element.clientHeight });
  layout.hero = section(hero);
  layout.heroAlign = parseFloat(getComputedStyle(heroImage).objectPosition) / 100;
  layout.living = section(living);
  layout.closing = section(closing);
  layout.height = innerHeight;
  layout.total = document.documentElement.scrollHeight - innerHeight;
  layout.themes = [...document.querySelectorAll('[data-nav]')].map(el => ({...section(el), theme:el.dataset.nav, element:el}));
  ResidenceEffects.measure();
  positionHotspots();
  requestFrame();
}
function updateMotion(keepSection = false) {
  let anchor;
  if (keepSection && layout.themes) {
    anchor = layout.themes.find(item => scrollY + 150 >= item.top && scrollY + 150 < item.top + item.height)?.element;
    if (anchor === living) anchor = livingSteps[Math.max(0, activeChapter)];
  }
  const modes = motionModes(innerWidth, innerHeight, paused, reducedMotion.matches);
  document.body.classList.toggle('motion-enabled', modes.page);
  document.body.classList.toggle('chapter-motion-enabled', modes.enabled);
  document.body.classList.toggle('horizontal-enabled', modes.horizontal);
  document.body.classList.toggle('living-enabled', modes.living);
  activeChapter = -1;
  if (!document.body.classList.contains('living-enabled')) livingSteps.forEach(step => { step.inert = false; step.removeAttribute('aria-hidden'); });
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.setAttribute('aria-label', paused ? 'Tiếp tục hiệu ứng' : 'Tạm dừng hiệu ứng');
  motionToggle.textContent = paused ? '▷' : 'Ⅱ';
  motionToggle.disabled = reducedMotion.matches;
  measure();
  if (anchor) window.scrollTo({top: Math.max(0, scrollY + anchor.getBoundingClientRect().top - 110), behavior:'instant'});
  currentScroll = scrollY;
}
motionToggle.addEventListener('click', () => { paused = !paused; updateMotion(true); });
reducedMotion.addEventListener('change', event => { paused = event.matches; updateMotion(true); });
function requestFrame() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
function render(time) {
  frame = 0;
  const enabled = document.body.classList.contains('motion-enabled');
  const dt = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 1/60;
  lastTime = time;
  currentScroll = Math.abs(currentScroll - scrollY) < .2 ? scrollY : damp(currentScroll, scrollY, 16, dt);
  const p = enabled ? progress(currentScroll, layout.hero.top, layout.hero.height - layout.height) : 0;
  hero.style.setProperty('--hero-scale', 1 + p * .28);
  hero.style.setProperty('--hero-title-scale', 1 + p * .12);
  hero.style.setProperty('--hero-title-opacity', 1 - range(p, .12, .7));
  hero.style.setProperty('--hero-title-y', `${-p * 160}px`);
  hero.style.setProperty('--hotspot-opacity', 1 - range(p, .65, 1));
  positionHotspots(1 + p * .28, p < .98);
  if (document.body.classList.contains('living-enabled')) {
    const livingProgress = progress(currentScroll, layout.living.top, layout.living.height - layout.height);
    const index = chapter(livingProgress);
    const sceneProgress = clamp(livingProgress * 3 - index);
    livingSteps[index].style.setProperty('--scene-scale', 1.14 - sceneProgress * .1);
    livingSteps[index].style.setProperty('--scene-y', `${(sceneProgress - .5) * -8}px`);
    living.style.setProperty('--living-progress', livingProgress);
    living.dataset.chapter = String(index + 1);
    if (index !== activeChapter || livingSteps[index].inert) {
      activeChapter = index;
      livingSteps.forEach((step, i) => {
        const active = i === index;
        step.classList.toggle('is-active', active);
        step.inert = !active;
        step.setAttribute('aria-hidden', String(!active));
        chapterButtons[i].setAttribute('aria-pressed', String(active));
      });
    }
  }
  const theme = layout.themes.find(item => scrollY + 110 >= item.top && scrollY + 110 < item.top + item.height);
  header.classList.toggle('is-dark', theme?.theme === 'dark');
  header.style.setProperty('--brand-turn', `${enabled ? currentScroll * .015 : 0}deg`);
  const total = progress(scrollY, 0, layout.total);
  document.getElementById('scroll-number').textContent = String(Math.round(total * 100)).padStart(2, '0');
  document.getElementById('scroll-meter').style.height = `${total * 100}%`;
  ResidenceEffects.render(currentScroll, layout.height, enabled);
  if (Math.abs(currentScroll - scrollY) > .2) requestFrame(); else lastTime = 0;
}
addEventListener('scroll', requestFrame, {passive:true});
addEventListener('resize', () => updateMotion());
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  else { currentScroll = scrollY; requestFrame(); }
});
document.fonts.ready.then(measure);
document.querySelectorAll('.faq details').forEach(detail => detail.addEventListener('toggle', measure));
chapterButtons.forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.chapter);
  const top = layout.living.top + ((index + .25) / 3) * (layout.living.height - layout.height);
  window.scrollTo({top, behavior:paused ? 'instant' : 'smooth'});
}));

const locations = {
  beach: ['Biển Mỹ Khê', 'Những buổi sáng dạo biển, những chiều thả bước trên cát — một phần của nhịp sống ven bờ.'],
  city: ['Trung tâm thành phố', 'Cảm hứng về một nơi ở kết nối quán cà phê, không gian văn hóa và nhịp sống đô thị bên sông Hàn.'],
  airport: ['Sân bay Đà Nẵng', 'Kết nối với cửa ngõ hàng không của thành phố, phù hợp với ý tưởng một chốn trở về sau mỗi hành trình.'],
  nature: ['Bán đảo Sơn Trà', 'Khoảng xanh và cảnh quan núi biển gợi mở những chuyến đi gần, để cân bằng lại nhịp sống thường ngày.'],
};
document.querySelectorAll('[data-location]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.location;
  document.querySelectorAll('[data-location]').forEach(item => {
    const active = item.dataset.location === key;
    item.setAttribute('aria-pressed', String(active)); item.classList.toggle('is-active', active);
  });
  document.getElementById('location-title').textContent = locations[key][0];
  document.getElementById('location-description').textContent = locations[key][1];
}));
const amenities = {
  pool: ['01 / 04','Hồ bơi & sân nắng','pool.webp','Một khoảng xanh và mặt nước dành cho vận động nhẹ, thư giãn và những buổi chiều ở bên gia đình.'],
  garden: ['02 / 04','Đường dạo & vườn xanh','hero-day.webp','Những lối đi dưới bóng cây, khoảng sân chung và góc dừng chân nối tiếp nhau trong cảnh quan mở.'],
  lounge: ['03 / 04','Lounge cộng đồng','lounge.webp','Một không gian ấm để đọc sách, làm việc nhẹ và gặp gỡ những người hàng xóm cùng nhịp sống.'],
  wellness: ['04 / 04','Không gian wellness','residence.webp','Ý tưởng về không gian vận động và thư giãn gần thiên nhiên, dành cho những khoảng chăm sóc bản thân mỗi ngày.'],
};
document.querySelectorAll('[data-amenity]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-amenity]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const [number,title,src,description] = amenities[button.dataset.amenity];
  const image = document.getElementById('amenity-image');
  image.src = new URL(`assets/${src}`, residenceAssetBase).href; image.alt = `${title}, ảnh tiện ích minh họa`;
  document.getElementById('amenity-number').textContent = number;
  document.getElementById('amenity-title').textContent = title;
  document.getElementById('amenity-description').textContent = description;
  measure();
}));

const homes = {
  '1pn': { title:'Một khoảng riêng thật vừa vặn.', description:'Không gian gọn gàng cho một người hoặc đôi bạn, với phòng khách mở và ban công đón sáng.', area:'58 m²', beds:'01', baths:'01', code:'AN / TYPE 01', who:'Cá nhân / cặp đôi' },
  '2pn': { title:'Chỗ cho những ngày bên nhau.', description:'Hai phòng ngủ riêng, không gian sinh hoạt chung mở và hai phòng tắm — một ý tưởng tổ ấm dành cho gia đình nhỏ.', area:'84 m²', beds:'02', baths:'02', code:'AN / TYPE 02', who:'Gia đình nhỏ' },
  '3pn': { title:'Rộng hơn cho cả gia đình.', description:'Ba phòng ngủ và khoảng sinh hoạt chung rộng, gợi mở một không gian gần gũi cho gia đình nhiều thế hệ.', area:'128–168 m²', beds:'03', baths:'02', code:'AN / TYPE 03', who:'Gia đình nhiều thế hệ' },
};
let selectedHome = '1pn';
const homeTabs = [...document.querySelectorAll('[data-home]')];
function selectHome(key) {
  selectedHome = key; const home = homes[key];
  homeTabs.forEach(tab => { const active = tab.dataset.home === key; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  document.getElementById('home-panel').setAttribute('aria-labelledby', `tab-${key}`);
  for (const name of ['title','description','area','bedrooms','bathrooms','code','who'])
    document.getElementById(`home-${name}`).textContent = home[{bedrooms:'beds',bathrooms:'baths'}[name] || name];
  const image = document.getElementById('plan-image');
  image.src = new URL(`assets/plan-${key}.svg`, residenceAssetBase).href; image.alt = `Sơ đồ ý tưởng căn hộ ${home.beds} phòng ngủ, không theo tỷ lệ`;
}
homeTabs.forEach((tab,index) => {
  tab.addEventListener('click', () => selectHome(tab.dataset.home));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % homeTabs.length;
    if (event.key === 'ArrowLeft') next = (index + homeTabs.length - 1) % homeTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = homeTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); selectHome(homeTabs[next].dataset.home); homeTabs[next].focus({preventScroll:true});
  });
});
const imageDialog = document.getElementById('image-dialog');
const dialogImage = document.getElementById('dialog-image');
const galleryNavigation = document.getElementById('gallery-navigation');
document.getElementById('plan-zoom').addEventListener('click', event => {
  dialogImage.src = new URL(`assets/plan-${selectedHome}.svg`, residenceAssetBase).href; dialogImage.alt = document.getElementById('plan-image').alt;
  document.getElementById('image-dialog-title').textContent = `Mặt bằng ${homes[selectedHome].beds} phòng ngủ · ${homes[selectedHome].area}`;
  document.getElementById('image-dialog-note').textContent = 'SƠ ĐỒ Ý TƯỞNG · KHÔNG THEO TỶ LỆ';
  galleryNavigation.hidden = true; openDialog(imageDialog, event.currentTarget);
});
const galleryCards = [...document.querySelectorAll('[data-gallery]')];
let galleryItems = galleryCards, galleryIndex = 0;
function showGalleryImage() {
  const card = galleryItems[galleryIndex]; const image = card.querySelector('img');
  dialogImage.src = image.getAttribute('src'); dialogImage.alt = image.alt;
  document.getElementById('image-dialog-title').textContent = card.querySelector('span').textContent.replace('↗','').trim();
  document.getElementById('image-dialog-note').textContent = 'ẢNH CẢM HỨNG / MINH HỌA';
  document.getElementById('gallery-count').textContent = `${String(galleryIndex+1).padStart(2,'0')} / ${String(galleryItems.length).padStart(2,'0')}`;
}
function moveGallery(direction) { galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length; showGalleryImage(); }
galleryCards.forEach(card => card.addEventListener('click', () => {
  galleryItems = galleryCards.filter(item => !item.hidden); galleryIndex = galleryItems.indexOf(card);
  showGalleryImage(); galleryNavigation.hidden = false; openDialog(imageDialog, card);
}));
document.getElementById('gallery-prev').addEventListener('click', () => moveGallery(-1));
document.getElementById('gallery-next').addEventListener('click', () => moveGallery(1));
imageDialog.addEventListener('keydown', event => {
  if (galleryNavigation.hidden || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault(); moveGallery(event.key === 'ArrowRight' ? 1 : -1);
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  galleryCards.forEach(card => card.hidden = filter !== 'all' && card.dataset.category !== filter);
  document.querySelector('.gallery-grid').classList.toggle('is-filtered', filter !== 'all');
  measure();
}));

const enquiryDialog = document.getElementById('enquiry-dialog');
const enquiryForm = document.getElementById('enquiry-form');
const success = document.getElementById('enquiry-success');
const visitorPhone = document.getElementById('visitor-phone');
document.querySelectorAll('[data-enquiry]').forEach(button => button.addEventListener('click', () => {
  enquiryForm.hidden = false; success.hidden = true;
  document.getElementById('visitor-home').value = selectedHome;
  openDialog(enquiryDialog, button);
}));
visitorPhone.addEventListener('input', () => visitorPhone.setCustomValidity(''));
enquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  visitorPhone.setCustomValidity(validPhone(visitorPhone.value) ? '' : 'Nhập số di động Việt Nam hợp lệ gồm 10 số hoặc dạng +84.');
  if (!enquiryForm.reportValidity()) return;
  const name = document.getElementById('visitor-name').value.trim();
  if (!name) { document.getElementById('visitor-name').setCustomValidity('Vui lòng nhập tên của bạn.'); enquiryForm.reportValidity(); return; }
  const date = document.getElementById('visitor-date').value;
  const type = document.getElementById('visitor-home').selectedOptions[0].textContent;
  document.getElementById('success-copy').textContent = `${name}, bạn đã chọn ${type.toLowerCase()}${date ? ` vào ngày ${date.split('-').reverse().join('/')}` : ', thời gian sẽ được lựa chọn sau'}.`;
  enquiryForm.hidden = true; success.hidden = false;
  success.querySelector('button').focus({preventScroll:true}); enquiryDialog.scrollTop = 0;
});
document.getElementById('visitor-name').addEventListener('input', event => event.target.setCustomValidity(''));
document.getElementById('edit-enquiry').addEventListener('click', () => {
  success.hidden = true; enquiryForm.hidden = false; document.getElementById('visitor-name').focus();
});
const today = new Date();
document.getElementById('visitor-date').min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
updateMotion();
