/**
 * PULSE GYM — Frontend scripts & motion system
 * Optimized for ALL devices (Desktop, Tablet, Mobile)
 * Compatible with Bootstrap, jQuery, Livewire, Flux.
 */

(function () {
    'use strict';

    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = () => window.innerWidth <= 768;

    /* -------------------------------------------------------------
     * 1. Mobile navigation menu toggle
     * ----------------------------------------------------------- */
    function initNav() {
        const toggle = document.querySelector('[data-gym-menu-toggle]');
        const menu = document.querySelector('[data-gym-menu]');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                menu.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* -------------------------------------------------------------
     * 2. A1 — Hero: Tubes interactive background
     * Works on desktop (mouse) AND mobile (touch + organic auto-drift)
     * ----------------------------------------------------------- */
    const TUBES_PALETTES = [
        { tubes: ['#C6FF00', '#FF5A1F', '#FFFFFF'], lights: ['#C6FF00', '#FF5A1F', '#EEFFB8', '#FF8A3D'] }, // Volt / Ember
        { tubes: ['#C6FF00', '#9BE000', '#EEFFB8'], lights: ['#C6FF00', '#EEFFB8', '#7FD400', '#FFFFFF'] }, // Full volt
        { tubes: ['#FF5A1F', '#FF8A3D', '#C6FF00'], lights: ['#FF5A1F', '#FFB03D', '#C6FF00', '#FF3D00'] }, // Heat
    ];

    async function initTubesHero() {
        const hero = document.querySelector('[data-tubes]');
        if (!hero) return;
        const canvas = hero.querySelector('.gym-hero__canvas');
        if (!canvas || prefersReducedMotion()) return;

        try {
            const { default: TubesCursor } = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
            const app = TubesCursor(canvas, {
                tubes: {
                    colors: TUBES_PALETTES[0].tubes,
                    lights: { intensity: isMobile() ? 120 : 160, colors: TUBES_PALETTES[0].lights }
                }
            });
            hero.classList.add('is-ready');

            // Interactive palette cycling on click/tap
            let paletteIndex = 0;
            const cyclePalette = (e) => {
                if (e.target.closest('a, button, input, nav')) return;
                paletteIndex = (paletteIndex + 1) % TUBES_PALETTES.length;
                if (app && app.tubes) {
                    app.tubes.setColors(TUBES_PALETTES[paletteIndex].tubes);
                    app.tubes.setLightsColors(TUBES_PALETTES[paletteIndex].lights);
                }
            };
            hero.addEventListener('click', cyclePalette);

            // Touch support for mobile: simulate pointermove on touchmove
            let lastTouchTime = 0;
            const handleTouch = (e) => {
                if (!e.touches || !e.touches[0]) return;
                lastTouchTime = performance.now();
                const touch = e.touches[0];
                const evt = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true
                });
                canvas.dispatchEvent(evt);
            };
            hero.addEventListener('touchmove', handleTouch, { passive: true });
            hero.addEventListener('touchstart', handleTouch, { passive: true });

            // Organic subtle idle drift so on mobile and idle desktop, it's alive!
            let userInteracted = false;
            hero.addEventListener('mousemove', () => { userInteracted = true; lastTouchTime = performance.now(); }, { passive: true });

            let idleTime = 0;
            const animateIdle = () => {
                const now = performance.now();
                if (now - lastTouchTime > 2500) {
                    idleTime += 0.015;
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    const cx = w * (0.5 + 0.3 * Math.sin(idleTime * 0.8));
                    const cy = h * (0.45 + 0.25 * Math.cos(idleTime * 1.1));
                    const fakeEvt = new MouseEvent('mousemove', { clientX: cx, clientY: cy, bubbles: true });
                    canvas.dispatchEvent(fakeEvt);
                }
                requestAnimationFrame(animateIdle);
            };
            requestAnimationFrame(animateIdle);

        } catch (err) {
            console.warn('[PULSE Gym] Tubes background fallback:', err);
        }
    }

    /* -------------------------------------------------------------
     * 3. A3 — Count-up stat numbers
     * ----------------------------------------------------------- */
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function animateNumber(el, duration) {
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const fmt = new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });

        if (duration === 0) {
            el.textContent = fmt.format(target);
            return;
        }

        const start = performance.now();
        const step = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            el.textContent = fmt.format(target * easeOutExpo(progress));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    function initCountUp() {
        const items = document.querySelectorAll('[data-countup]');
        if (!items.length) return;

        const reduce = prefersReducedMotion();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const statEl = entry.target;
                const numEl = statEl.querySelector('[data-target]');
                const allStats = Array.from(statEl.parentElement.querySelectorAll('[data-countup]'));
                const idx = allStats.indexOf(statEl);

                setTimeout(() => {
                    statEl.classList.add('is-counted');
                    if (numEl) animateNumber(numEl, reduce ? 0 : 2000);
                }, reduce ? 0 : idx * 120);

                observer.unobserve(statEl);
            });
        }, { threshold: 0.25 });

        items.forEach((item) => observer.observe(item));
    }

    /* -------------------------------------------------------------
     * 4. A4 — Showcase: Full-screen image expansion
     * Responsive across mobile (shorter scroll) & desktop
     * ----------------------------------------------------------- */
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function initExpandImage() {
        const section = document.querySelector('[data-expand]');
        if (!section) return;

        if (prefersReducedMotion()) {
            section.style.setProperty('--p', '1');
            section.style.setProperty('--c', '1');
            return;
        }

        let ticking = false;
        const update = () => {
            const rect = section.getBoundingClientRect();
            const totalScroll = section.offsetHeight - window.innerHeight;
            if (totalScroll <= 0) return;

            const rawProgress = clamp(-rect.top / totalScroll, 0, 1);
            const expandProgress = easeInOutCubic(clamp(rawProgress / 0.75, 0, 1));
            const captionProgress = clamp((rawProgress - 0.7) / 0.3, 0, 1);

            section.style.setProperty('--p', expandProgress.toFixed(4));
            section.style.setProperty('--c', captionProgress.toFixed(4));
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });

        window.addEventListener('resize', update);
        update();
    }

    /* -------------------------------------------------------------
     * 5. A5 — Programs Hub: Scroll shape connect
     * Dynamically positions lines for ALL screen sizes
     * ----------------------------------------------------------- */
    function initScrollHub() {
        const section = document.querySelector('[data-hub]');
        if (!section) return;

        const stage = section.querySelector('.gym-hub__stage');
        const svg = section.querySelector('.gym-hub__lines');
        const core = section.querySelector('.gym-hub__core');
        const sats = Array.from(section.querySelectorAll('.gym-hub__sat'));
        if (!stage || !svg || !core || !sats.length) return;

        const reduce = prefersReducedMotion();

        function syncLines() {
            svg.querySelectorAll('line').forEach((l) => l.remove());

            const stageRect = stage.getBoundingClientRect();
            if (stageRect.width === 0) return [];

            const coreRect = core.getBoundingClientRect();
            const cx = coreRect.left - stageRect.left + coreRect.width / 2;
            const cy = coreRect.top - stageRect.top + coreRect.height / 2;

            const pairs = sats.map((sat, idx) => {
                const sRect = sat.getBoundingClientRect();
                const sx = sRect.left - stageRect.left + sRect.width / 2;
                const sy = sRect.top - stageRect.top + sRect.height / 2;

                const baseLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                baseLine.setAttribute('x1', cx);
                baseLine.setAttribute('y1', cy);
                baseLine.setAttribute('x2', sx);
                baseLine.setAttribute('y2', sy);
                baseLine.classList.add('gym-hub__line-base');
                svg.appendChild(baseLine);

                const liveLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                liveLine.setAttribute('x1', cx);
                liveLine.setAttribute('y1', cy);
                liveLine.setAttribute('x2', sx);
                liveLine.setAttribute('y2', sy);
                liveLine.classList.add('gym-hub__line-live');
                const len = Math.hypot(sx - cx, sy - cy);
                liveLine.style.strokeDasharray = `${len} ${len}`;
                liveLine.style.strokeDashoffset = `${len}`;
                svg.appendChild(liveLine);

                return { liveLine, len, sat, idx };
            });

            return pairs;
        }

        let lineData = syncLines();
        window.addEventListener('resize', () => { lineData = syncLines(); });

        const range = (p, start, end) => clamp((p - start) / (end - start), 0, 1);

        const render = (progress) => {
            const maxScale = isMobile() ? 1.5 : 2.2;
            const charge = easeOutExpo(range(progress, 0.08, 0.38));
            core.style.setProperty('--core-scale', (1 + (maxScale - 1) * charge).toFixed(3));
            core.style.setProperty('--core-glow', charge.toFixed(3));
            core.style.setProperty('--core-label', range(progress, 0.2, 0.4).toFixed(3));

            lineData.forEach(({ liveLine, len, sat, idx }) => {
                const start = 0.28 + idx * 0.09;
                const lineProgress = easeOutExpo(range(progress, start, start + 0.18));
                liveLine.style.strokeDashoffset = `${len * (1 - lineProgress)}`;
                sat.classList.toggle('is-on', lineProgress > 0.94);
            });
        };

        if (reduce) {
            render(1);
            return;
        }

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    const rect = section.getBoundingClientRect();
                    const totalScroll = section.offsetHeight - window.innerHeight;
                    if (totalScroll > 0) {
                        const progress = clamp(-rect.top / totalScroll, 0, 1);
                        render(progress);
                    }
                    ticking = false;
                });
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* -------------------------------------------------------------
     * 6. A2 — Ghost cursor trail & Touch energy aura
     * High performance, zero external dependencies, works on
     * ALL devices (Desktop mouse + Mobile touch + Tablet)
     * ----------------------------------------------------------- */
    function initGhostCursor() {
        const sections = document.querySelectorAll('[data-ghost-cursor]');
        if (!sections.length || prefersReducedMotion()) return;

        sections.forEach((section) => {
            const canvas = document.createElement('canvas');
            canvas.className = 'gym-ghost-canvas';
            section.prepend(canvas);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let width = (canvas.width = section.offsetWidth);
            let height = (canvas.height = section.offsetHeight);

            const resize = () => {
                width = canvas.width = section.offsetWidth;
                height = canvas.height = section.offsetHeight;
            };
            window.addEventListener('resize', resize);

            const points = [];
            const maxPoints = 22;
            let currentX = width / 2;
            let currentY = height / 2;
            let targetX = currentX;
            let targetY = currentY;
            let isActive = false;
            let idleTimer = null;

            const onMove = (clientX, clientY) => {
                const rect = section.getBoundingClientRect();
                targetX = clientX - rect.left;
                targetY = clientY - rect.top;
                isActive = true;
                clearTimeout(idleTimer);
                idleTimer = setTimeout(() => { isActive = false; }, 1200);
            };

            // Desktop mouse
            section.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY), { passive: true });
            section.addEventListener('mouseenter', (e) => onMove(e.clientX, e.clientY), { passive: true });
            section.addEventListener('mouseleave', () => { isActive = false; });

            // Mobile & Tablet touch
            section.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: true });
            section.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: true });
            section.addEventListener('touchend', () => {
                idleTimer = setTimeout(() => { isActive = false; }, 800);
            });

            // Particles
            const particles = [];
            function addParticle(x, y) {
                if (particles.length > 25) return;
                particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    radius: Math.random() * 2.5 + 1.5,
                    alpha: 0.8,
                    color: Math.random() > 0.3 ? '#C6FF00' : '#FF5A1F'
                });
            }

            let inView = false;
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => { inView = e.isIntersecting; });
            }, { rootMargin: '100px 0px' });
            io.observe(section);

            const render = () => {
                if (!inView) {
                    requestAnimationFrame(render);
                    return;
                }

                ctx.clearRect(0, 0, width, height);

                // Smooth inertia tracking
                currentX += (targetX - currentX) * 0.25;
                currentY += (targetY - currentY) * 0.25;

                if (isActive) {
                    points.unshift({ x: currentX, y: currentY });
                    if (Math.random() > 0.4) addParticle(currentX, currentY);
                }
                if (points.length > maxPoints) points.pop();
                if (!isActive && points.length > 0) points.pop();

                // Draw glowing fluid trail
                if (points.length > 2) {
                    for (let i = 0; i < points.length - 1; i++) {
                        const pt = points[i];
                        const next = points[i + 1];
                        const ratio = 1 - i / points.length;
                        const radius = ratio * (isMobile() ? 28 : 42);

                        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
                        grad.addColorStop(0, `rgba(198, 255, 0, ${ratio * 0.45})`);
                        grad.addColorStop(0.5, `rgba(198, 255, 0, ${ratio * 0.18})`);
                        grad.addColorStop(1, 'rgba(198, 255, 0, 0)');

                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
                        ctx.fillStyle = grad;
                        ctx.fill();
                    }
                }

                // Render ember spark particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha -= 0.025;
                    if (p.alpha <= 0) {
                        particles.splice(i, 1);
                        continue;
                    }
                    ctx.save();
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }

                requestAnimationFrame(render);
            };

            render();
        });
    }

    /* -------------------------------------------------------------
     * 7. Reveal animations with smooth entrance
     * ----------------------------------------------------------- */
    function initReveal() {
        const els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        els.forEach((el) => io.observe(el));
    }

    /* -------------------------------------------------------------
     * Bootstrap on DOM ready
     * ----------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        initNav();
        initTubesHero();
        initCountUp();
        initExpandImage();
        initScrollHub();
        initReveal();
        initGhostCursor();
    });
})();
