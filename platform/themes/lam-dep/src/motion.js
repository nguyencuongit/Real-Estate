import { sceneProgress, artOffsets, coverPoint, welcomeFrame } from '../public/motion-state.mjs';
import { setupGallery } from './gallery-motion.js';
import { setupReveals } from './reveal-motion.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.getElementById('motion-toggle');
const art = document.getElementById('beauty-art');
const photos = [...art.querySelectorAll('.art-photo')];
const welcome = document.getElementById('beauty-space');
const welcomeImage = welcome.querySelector('.welcome-visual');
const welcomeCard = welcome.querySelector('.welcome-card');
const hero = document.querySelector('.beauty-hero');
const colorSections = [...document.querySelectorAll('.beauty-art, .beauty-personal, .beauty-welcome, .beauty-faq')];
const scene = document.querySelector('.service-scene');
const model = scene.querySelector('.service-model');
const points = [...scene.querySelectorAll('.service-point')];
const videos = [...document.querySelectorAll('video')];
const film = document.querySelector('.personal-film video');
const filmToggle = document.querySelector('.film-toggle');
const animations = new Set();
const visibleVideos = new Set();
let paused = reduced.matches;
let scheduled = false;
document.body.classList.add('motion-ready');
const refreshGallery = setupGallery(() => paused || reduced.matches);

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
    welcomeCard.style.setProperty('--card-progress', frame.card);
    // Invisible controls cannot receive keyboard focus. The visual scene is
    // followed by the FAQ; keyboard users can also open booking in the header.
    welcomeCard.inert = frame.card < .95;
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom > 0) {
        const shift = paused || reduced.matches ? 0 : Math.min(innerHeight * .18, Math.max(0, -heroRect.top) * .18);
        hero.querySelectorAll('video, .hero-poster').forEach(media => { media.style.transform = `translateY(${shift}px) scale(1.04)`; });
    }
    const current = colorSections.find(section => {
        const box = section.getBoundingClientRect();
        return box.top <= innerHeight * .55 && box.bottom > innerHeight * .55;
    });
    document.body.style.backgroundColor = current?.matches('.beauty-art, .beauty-personal') ? '#705943' : '#7a6047';
}
function requestPaint() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(paint); }
}
function placePoints() {
    const rect = scene.getBoundingClientRect();
    points.forEach(point => {
        const position = coverPoint(rect.width, rect.height, model.naturalWidth || 1440, model.naturalHeight || 900, Number(point.dataset.pointX), Number(point.dataset.pointY));
        point.style.left = `${position.x}px`;
        point.style.top = `${position.y}px`;
        point.hidden = !position.visible;
    });
}
function updateVideo(video) {
    if (!paused && !document.hidden && visibleVideos.has(video) && video.dataset.userPaused !== 'true') {
        video.play().catch(() => {});
    } else {
        video.pause();
    }
}
function updateFilmButton() {
    filmToggle.textContent = film.paused ? '▶' : 'Ⅱ';
    filmToggle.setAttribute('aria-label', film.paused ? 'Phát video chăm sóc' : 'Tạm dừng video chăm sóc');
    filmToggle.setAttribute('aria-pressed', String(!film.paused));
}
film.addEventListener('play', updateFilmButton);
film.addEventListener('pause', updateFilmButton);
filmToggle.addEventListener('click', () => {
    if (film.paused) {
        film.dataset.userPaused = 'false';
        film.play().catch(() => {});
    } else {
        film.dataset.userPaused = 'true';
        film.pause();
    }
});
function applyMotionPreference() {
    document.body.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.replaceChildren(document.createTextNode(paused ? 'Bật chuyển động ' : 'Tạm dừng chuyển động '));
    const symbol = document.createElement('span');
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = paused ? '▶' : 'Ⅱ';
    toggle.append(symbol);
    if (paused) animations.forEach(animation => animation.cancel());
    refreshGallery();
    videos.forEach(updateVideo);
    requestPaint();
}
toggle.addEventListener('click', () => { paused = !paused; applyMotionPreference(); });
reduced.addEventListener('change', () => { paused = reduced.matches; applyMotionPreference(); });
document.addEventListener('visibilitychange', () => videos.forEach(updateVideo));
window.addEventListener('scroll', requestPaint, { passive: true });
window.addEventListener('resize', () => { placePoints(); requestPaint(); });
model.addEventListener('load', placePoints);
new ResizeObserver(placePoints).observe(scene);
const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) visibleVideos.add(entry.target);
        else visibleVideos.delete(entry.target);
        updateVideo(entry.target);
    });
}, { threshold: .15 });
videos.forEach(video => videoObserver.observe(video));

setupReveals(() => paused || reduced.matches, animations);
placePoints();
applyMotionPreference();
updateFilmButton();
