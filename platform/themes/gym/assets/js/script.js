/**
 * PULSE GYM — Frontend motion and interactive system
 * Implements all 5 animations specified in ui.md:
 * A1: Tubes interactive 3D background (threejs-components tubes1)
 * A2: Ghost cursor (Three.js WebGL FBM smoke shader + bloom + 2D fallback)
 * A3: Stats Count-up + Energy gradient line draw
 * A4: Showcase Full-screen image expansion (300vh sticky scroll)
 * A5: Programs Hub Scroll shape connect (300vh sticky scroll)
 */

(function () {
    'use strict';

    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const range = (p, start, end) => clamp((p - start) / (end - start));
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    /* -------------------------------------------------------------
     * 1. Navigation & Mobile Menu
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
     * 2. A1 — Hero: Tubes Interactive Background (ui.md §3)
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
            const { default: TubesCursor } = await import(
                'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
            );
            const app = TubesCursor(canvas, {
                tubes: {
                    colors: TUBES_PALETTES[0].tubes,
                    lights: { intensity: 160, colors: TUBES_PALETTES[0].lights }
                }
            });
            hero.classList.add('is-ready');

            // Click interaction: cycle through the 3 brand palettes
            let paletteIdx = 0;
            hero.addEventListener('click', (e) => {
                if (e.target.closest('a, button, input, nav')) return;
                paletteIdx = (paletteIdx + 1) % TUBES_PALETTES.length;
                if (app && app.tubes) {
                    app.tubes.setColors(TUBES_PALETTES[paletteIdx].tubes);
                    app.tubes.setLightsColors(TUBES_PALETTES[paletteIdx].lights);
                }
            });

            // Touch interaction for mobile devices
            const dispatchPointer = (clientX, clientY) => {
                canvas.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }));
            };

            let lastInteraction = performance.now();
            hero.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches[0]) {
                    lastInteraction = performance.now();
                    dispatchPointer(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            hero.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches[0]) {
                    lastInteraction = performance.now();
                    dispatchPointer(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            hero.addEventListener('mousemove', () => {
                lastInteraction = performance.now();
            }, { passive: true });

            // Organic drift when mouse is stationary
            let driftAngle = 0;
            const driftLoop = () => {
                const now = performance.now();
                if (now - lastInteraction > 1800) {
                    driftAngle += 0.016;
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    const cx = w * (0.5 + 0.32 * Math.sin(driftAngle * 0.7));
                    const cy = h * (0.5 + 0.26 * Math.cos(driftAngle * 0.5));
                    dispatchPointer(cx, cy);
                }
                requestAnimationFrame(driftLoop);
            };
            requestAnimationFrame(driftLoop);

        } catch (err) {
            console.warn('Tubes hero fallback engaged:', err);
            hero.classList.add('is-ready');
        }
    }

    /* -------------------------------------------------------------
     * 3. A2 — Ghost Cursor: Three.js WebGL + 2D Canvas Fallback (ui.md §4)
     * ----------------------------------------------------------- */
    const GHOST_DEFAULTS = {
        color: '#C6FF00',
        brightness: 0.9,
        trailLength: 24,
        inertia: 0.45,
        grainIntensity: 0.04,
        bloomStrength: 0.35,
        bloomRadius: 0.7,
        bloomThreshold: 0,
        edgeIntensity: 0,
        mixBlendMode: 'screen',
        maxDevicePixelRatio: 0.5,
        fadeDelayMs: 250,
        fadeDurationMs: 1000,
        targetPixels: 1.3e6
    };

    const GHOST_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;

    const GHOST_FRAG = `
        uniform float iTime; uniform vec3 iResolution; uniform vec2 iMouse;
        uniform vec2 iPrevMouse[MAX_TRAIL_LENGTH]; uniform float iOpacity; uniform float iScale;
        uniform vec3 iBaseColor; uniform float iBrightness; uniform float iEdgeIntensity;
        varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
        float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
          return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x), f.y); }
        float fbm(vec2 p){ float v=0., a=.5; mat2 m=mat2(cos(.5),sin(.5),-sin(.5),cos(.5));
          for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p*2.; a*=.5; } return v; }
        vec3 tint1(vec3 b){ return mix(b, vec3(1.0), 0.15); }
        vec3 tint2(vec3 b){ return mix(b, vec3(1.0, 0.55, 0.2), 0.18); }
        vec4 blob(vec2 p, vec2 m, float intensity, float activity){
          vec2 q=vec2(fbm(p*iScale+iTime*.1), fbm(p*iScale+vec2(5.2,1.3)+iTime*.1));
          vec2 r=vec2(fbm(p*iScale+q*1.5+iTime*.15), fbm(p*iScale+q*1.5+vec2(8.3,2.8)+iTime*.15));
          float smoke=fbm(p*iScale+r*.8);
          float radius=.5+.3*(1./iScale);
          float d=1.-smoothstep(0., radius*activity, length(p-m));
          float a=pow(smoke,2.5)*d;
          vec3 c=mix(tint1(iBaseColor), tint2(iBaseColor), sin(iTime*.5)*.5+.5);
          return vec4(c*a*intensity, a*intensity);
        }
        void main(){
          vec2 asp=vec2(iResolution.x/iResolution.y,1.);
          vec2 uv=(gl_FragCoord.xy/iResolution.xy*2.-1.)*asp;
          vec2 mouse=(iMouse*2.-1.)*asp;
          vec4 b=blob(uv,mouse,1.,iOpacity); vec3 col=b.rgb; float al=b.a;
          for(int i=0;i<MAX_TRAIL_LENGTH;i++){
            vec2 pm=(iPrevMouse[i]*2.-1.)*asp;
            float t=pow(1.-float(i)/float(MAX_TRAIL_LENGTH),2.);
            if(t>.01){ vec4 bt=blob(uv,pm,t*.8,iOpacity); col+=bt.rgb; al+=bt.a; }
          }
          col*=iBrightness;
          vec2 u=gl_FragCoord.xy/iResolution.xy;
          float e=clamp(min(min(u.x,1.-u.x),min(u.y,1.-u.y))*2.,0.,1.);
          float mask=mix(1.-clamp(iEdgeIntensity,0.,1.),1.,e);
          gl_FragColor=vec4(col, clamp(al*iOpacity*mask,0.,1.));
        }
    `;

    const PASS_VERT = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

    class ThreeGhostCursor {
        constructor(parent, THREE, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass) {
            this.parent = parent;
            this.host = Object.assign(document.createElement('div'), { className: 'ghost-cursor' });
            parent.prepend(this.host);

            const o = GHOST_DEFAULTS;
            this.o = o;
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, depth: false, stencil: false, premultipliedAlpha: false });
            this.renderer.setClearColor(0x000000, 0);
            Object.assign(this.renderer.domElement.style, { display: 'block', width: '100%', height: '100%', pointerEvents: 'none', mixBlendMode: o.mixBlendMode });
            this.host.appendChild(this.renderer.domElement);

            const N = Math.max(1, Math.floor(o.trailLength));
            this.trail = Array.from({ length: N }, () => new THREE.Vector2(0.5, 0.5));
            this.head = 0;
            const c = new THREE.Color(o.color);

            this.mat = new THREE.ShaderMaterial({
                defines: { MAX_TRAIL_LENGTH: N },
                uniforms: {
                    iTime: { value: 0 },
                    iResolution: { value: new THREE.Vector3(1, 1, 1) },
                    iMouse: { value: new THREE.Vector2(0.5, 0.5) },
                    iPrevMouse: { value: this.trail.map((v) => v.clone()) },
                    iOpacity: { value: 1 },
                    iScale: { value: 1 },
                    iBaseColor: { value: new THREE.Vector3(c.r, c.g, c.b) },
                    iBrightness: { value: o.brightness },
                    iEdgeIntensity: { value: o.edgeIntensity }
                },
                vertexShader: GHOST_VERT,
                fragmentShader: GHOST_FRAG,
                transparent: true,
                depthTest: false,
                depthWrite: false
            });

            const scene = new THREE.Scene();
            this.geom = new THREE.PlaneGeometry(2, 2);
            scene.add(new THREE.Mesh(this.geom, this.mat));

            this.composer = new EffectComposer(this.renderer);
            this.composer.addPass(new RenderPass(scene, new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)));
            this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), o.bloomStrength, o.bloomRadius, o.bloomThreshold);
            this.composer.addPass(this.bloom);
            this.film = new ShaderPass({
                uniforms: { tDiffuse: { value: null }, iTime: { value: 0 }, intensity: { value: o.grainIntensity } },
                vertexShader: PASS_VERT,
                fragmentShader: `uniform sampler2D tDiffuse; uniform float iTime; uniform float intensity; varying vec2 vUv;
                    float h(float n){ return fract(sin(n)*43758.5453); }
                    void main(){ vec4 c=texture2D(tDiffuse,vUv); float n=h(vUv.x*1000.+vUv.y*2000.+iTime)*2.-1.; c.rgb+=n*intensity*c.rgb; gl_FragColor=c; }`
            });
            this.composer.addPass(this.film);
            this.composer.addPass(new ShaderPass({
                uniforms: { tDiffuse: { value: null } },
                vertexShader: PASS_VERT,
                fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
                    void main(){ vec4 c=texture2D(tDiffuse,vUv); gl_FragColor=vec4(clamp(c.rgb/max(c.a,1e-5),0.,1.),c.a); }`
            }));

            this.mouse = new THREE.Vector2(0.5, 0.5);
            this.vel = new THREE.Vector2();
            this.fade = 1;
            this.active = false;
            this.running = false;
            this.lastMove = performance.now();
            this.start = performance.now();

            this.resize = this.resize.bind(this);
            this.tick = this.tick.bind(this);
            this.onMove = (e) => {
                const b = parent.getBoundingClientRect();
                this.mouse.set(THREE.MathUtils.clamp((e.clientX - b.left) / b.width, 0, 1), THREE.MathUtils.clamp(1 - (e.clientY - b.top) / b.height, 0, 1));
                this.active = true;
                this.lastMove = performance.now();
                this.loop();
            };
            this.onEnter = () => { this.active = true; this.loop(); };
            this.onLeave = () => { this.active = false; this.lastMove = performance.now(); this.loop(); };

            parent.addEventListener('pointermove', this.onMove, { passive: true });
            parent.addEventListener('pointerenter', this.onEnter, { passive: true });
            parent.addEventListener('pointerleave', this.onLeave, { passive: true });
            this.ro = new ResizeObserver(this.resize);
            this.ro.observe(this.host);
            this.resize();
        }

        resize() {
            const b = this.host.getBoundingClientRect();
            const w = Math.max(1, Math.floor(b.width));
            const h = Math.max(1, Math.floor(b.height));
            const dpr = Math.min(window.devicePixelRatio || 1, this.o.maxDevicePixelRatio);
            const need = w * h * dpr * dpr;
            const pr = dpr * (need <= this.o.targetPixels ? 1 : Math.max(0.5, Math.sqrt(this.o.targetPixels / need)));
            this.renderer.setPixelRatio(pr);
            this.renderer.setSize(w, h, false);
            this.composer.setPixelRatio?.(pr);
            this.composer.setSize(w, h);
            this.mat.uniforms.iResolution.value.set(Math.floor(w * pr), Math.floor(h * pr), 1);
            this.mat.uniforms.iScale.value = Math.max(0.5, Math.min(2, Math.min(w, h) / 600));
            this.bloom.setSize(Math.floor(w * pr), Math.floor(h * pr));
        }

        loop() {
            if (!this.running) {
                this.running = true;
                this.raf = requestAnimationFrame(this.tick);
            }
        }

        tick(now) {
            const u = this.mat.uniforms;
            if (this.active) {
                this.vel.subVectors(this.mouse, u.iMouse.value);
                u.iMouse.value.copy(this.mouse);
                this.fade = 1;
            } else {
                this.vel.multiplyScalar(this.o.inertia);
                if (this.vel.lengthSq() > 1e-6) u.iMouse.value.add(this.vel);
                const dt = now - this.lastMove;
                if (dt > this.o.fadeDelayMs) {
                    this.fade = Math.max(0, 1 - (dt - this.o.fadeDelayMs) / this.o.fadeDurationMs);
                }
            }
            const N = this.trail.length;
            this.head = (this.head + 1) % N;
            this.trail[this.head].copy(u.iMouse.value);
            for (let i = 0; i < N; i++) {
                u.iPrevMouse.value[i].copy(this.trail[(this.head - i + N) % N]);
            }

            const t = (now - this.start) / 1000;
            u.iOpacity.value = this.fade;
            u.iTime.value = t;
            this.film.uniforms.iTime.value = t;
            this.composer.render();

            if (!this.active && this.fade <= 0.001) {
                this.running = false;
                return;
            }
            this.raf = requestAnimationFrame(this.tick);
        }

        destroy() {
            cancelAnimationFrame(this.raf);
            this.running = false;
            this.ro.disconnect();
            this.parent.removeEventListener('pointermove', this.onMove);
            this.parent.removeEventListener('pointerenter', this.onEnter);
            this.parent.removeEventListener('pointerleave', this.onLeave);
            this.geom.dispose();
            this.mat.dispose();
            this.composer.dispose();
            this.renderer.dispose();
            this.host.remove();
        }
    }

    class CanvasGhostCursorFallback {
        constructor(parent) {
            this.parent = parent;
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'ghost-cursor';
            this.canvas.setAttribute('aria-hidden', 'true');
            this.ctx = this.canvas.getContext('2d');
            parent.prepend(this.canvas);

            this.particles = [];
            this.mouse = { x: 0, y: 0, active: false };
            this.running = false;

            this.resize = this.resize.bind(this);
            this.tick = this.tick.bind(this);
            this.onMove = (e) => {
                const r = this.parent.getBoundingClientRect();
                this.mouse.x = e.clientX - r.left;
                this.mouse.y = e.clientY - r.top;
                this.mouse.active = true;
                this.addParticles(this.mouse.x, this.mouse.y);
                if (!this.running) { this.running = true; requestAnimationFrame(this.tick); }
            };
            this.onLeave = () => { this.mouse.active = false; };

            this.parent.addEventListener('mousemove', this.onMove, { passive: true });
            this.parent.addEventListener('mouseleave', this.onLeave, { passive: true });
            this.parent.addEventListener('touchmove', (e) => {
                if (!e.touches[0]) return;
                const r = this.parent.getBoundingClientRect();
                this.addParticles(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
                if (!this.running) { this.running = true; requestAnimationFrame(this.tick); }
            }, { passive: true });

            window.addEventListener('resize', this.resize, { passive: true });
            this.resize();
        }

        resize() {
            this.canvas.width = this.parent.clientWidth;
            this.canvas.height = this.parent.clientHeight;
        }

        addParticles(x, y) {
            for (let i = 0; i < 2; i++) {
                this.particles.push({
                    x: x + (Math.random() - 0.5) * 16,
                    y: y + (Math.random() - 0.5) * 16,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8 - 0.3,
                    radius: Math.random() * 26 + 18,
                    alpha: 0.35,
                    color: Math.random() > 0.2 ? '198, 255, 0' : '255, 90, 31'
                });
            }
            if (this.particles.length > 50) this.particles.shift();
        }

        tick() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.radius += 0.45;
                p.alpha *= 0.94;

                if (p.alpha < 0.01) {
                    this.particles.splice(i, 1);
                    continue;
                }

                const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
                grad.addColorStop(1, `rgba(${p.color}, 0)`);

                this.ctx.fillStyle = grad;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }

            if (this.particles.length > 0) {
                requestAnimationFrame(this.tick);
            } else {
                this.running = false;
            }
        }

        destroy() {
            this.canvas.remove();
            this.parent.removeEventListener('mousemove', this.onMove);
            this.parent.removeEventListener('mouseleave', this.onLeave);
            window.removeEventListener('resize', this.resize);
        }
    }

    function initGhostCursor() {
        if (prefersReducedMotion() || isCoarsePointer()) return;
        const sections = document.querySelectorAll('[data-ghost-cursor]');
        if (!sections.length) return;

        let ThreeModule = null;
        let PostModules = null;
        let loadFailed = false;

        async function loadThree() {
            if (ThreeModule && PostModules) return true;
            if (loadFailed) return false;
            try {
                const THREE = await import('three');
                const [
                    { EffectComposer },
                    { RenderPass },
                    { UnrealBloomPass },
                    { ShaderPass }
                ] = await Promise.all([
                    import('three/addons/postprocessing/EffectComposer.js'),
                    import('three/addons/postprocessing/RenderPass.js'),
                    import('three/addons/postprocessing/UnrealBloomPass.js'),
                    import('three/addons/postprocessing/ShaderPass.js')
                ]);
                ThreeModule = THREE;
                PostModules = { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass };
                return true;
            } catch (e) {
                console.warn('GhostCursor WebGL postprocessing load skipped, using 2D fallback:', e);
                loadFailed = true;
                return false;
            }
        }

        const instances = new Map();
        const io = new IntersectionObserver(async (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && !instances.has(entry.target)) {
                    const ok = await loadThree();
                    if (ok && ThreeModule && PostModules) {
                        instances.set(
                            entry.target,
                            new ThreeGhostCursor(
                                entry.target,
                                ThreeModule,
                                PostModules.EffectComposer,
                                PostModules.RenderPass,
                                PostModules.UnrealBloomPass,
                                PostModules.ShaderPass
                            )
                        );
                    } else {
                        instances.set(entry.target, new CanvasGhostCursorFallback(entry.target));
                    }
                } else if (!entry.isIntersecting && instances.has(entry.target)) {
                    const inst = instances.get(entry.target);
                    if (inst && typeof inst.destroy === 'function') {
                        inst.destroy();
                    }
                    instances.delete(entry.target);
                }
            }
        }, { rootMargin: '100px 0px' });

        sections.forEach((s) => io.observe(s));
    }

    /* -------------------------------------------------------------
     * 4. A3 — Stats: Count-Up Numbers (ui.md §5)
     * ----------------------------------------------------------- */
    function initCountUp() {
        const statEls = document.querySelectorAll('[data-countup]');
        if (!statEls.length) return;

        const countUp = (el, duration) => {
            const target = parseFloat(el.dataset.target);
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            if (duration === 0) {
                el.textContent = target.toFixed(decimals);
                return;
            }
            const start = performance.now();
            const step = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const val = target * easeOutExpo(t);
                el.textContent = val.toFixed(decimals);
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const reduce = prefersReducedMotion();
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const stats = [...entry.target.parentElement.querySelectorAll('[data-countup]')];
                const idx = stats.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-counted');
                    const num = entry.target.querySelector('[data-target]');
                    if (num) countUp(num, reduce ? 0 : 2000);
                }, reduce ? 0 : idx * 150);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        statEls.forEach((el) => io.observe(el));
    }

    /* -------------------------------------------------------------
     * 5. A4 — Showcase: Full-Screen Image Expansion (ui.md §6)
     * ----------------------------------------------------------- */
    function initExpandImage() {
        const section = document.querySelector('[data-expand]');
        if (!section || prefersReducedMotion()) return;

        let ticking = false;
        const update = () => {
            const r = section.getBoundingClientRect();
            const scrollDistance = section.offsetHeight - window.innerHeight;
            if (scrollDistance <= 0) return;
            const raw = clamp(-r.top / scrollDistance);

            // Expansion phase (0 -> 0.8)
            const p = easeInOutCubic(clamp(raw / 0.8)).toFixed(4);
            // Caption phase (0.8 -> 1.0)
            const c = clamp((raw - 0.8) / 0.2).toFixed(4);

            section.style.setProperty('--p', p);
            section.style.setProperty('--c', c);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });

        window.addEventListener('resize', update, { passive: true });
        update();
    }

    /* -------------------------------------------------------------
     * 6. A5 — Programs Hub: Scroll Shape Connect (ui.md §7)
     * ----------------------------------------------------------- */
    function initScrollHub() {
        const section = document.querySelector('[data-hub]');
        if (!section) return;

        const svg = section.querySelector('.gym-hub__lines');
        const core = section.querySelector('.gym-hub__core');
        const sats = [...section.querySelectorAll('.gym-hub__sat')];
        if (!svg || !core || !sats.length) return;

        const reduce = prefersReducedMotion();
        const SVG_NS = 'http://www.w3.org/2000/svg';

        // Clear existing generated lines if re-run
        svg.querySelectorAll('line').forEach((l) => l.remove());

        // Build dashed base line + energy gradient line per satellite (viewBox: 1000 x 600, center: 500, 300)
        const lines = sats.map((sat, i) => {
            sat.style.setProperty('--i', i);
            const x = parseFloat(sat.style.getPropertyValue('--x')) * 10;
            const y = parseFloat(sat.style.getPropertyValue('--y')) * 6;

            const mkLine = (cls) => {
                const l = document.createElementNS(SVG_NS, 'line');
                l.setAttribute('x1', '500');
                l.setAttribute('y1', '300');
                l.setAttribute('x2', String(x));
                l.setAttribute('y2', String(y));
                l.setAttribute('pathLength', '1');
                if (cls) l.classList.add(cls);
                svg.appendChild(l);
                return l;
            };

            mkLine('is-base');
            const live = mkLine();
            live.style.strokeDasharray = '1';
            live.style.strokeDashoffset = '1';
            return live;
        });

        const render = (p) => {
            // Phase 2 — core charge
            const charge = easeOutExpo(range(p, 0.15, 0.45));
            core.style.setProperty('--core-scale', (1 + 1.5 * charge).toFixed(3));
            core.style.setProperty('--core-glow', charge.toFixed(3));
            core.style.setProperty('--core-label', range(p, 0.28, 0.45).toFixed(3));

            // Phase 3 & 4 — connect + light up satellites
            lines.forEach((line, i) => {
                const start = 0.32 + i * 0.08;
                const lp = easeOutExpo(range(p, start, start + 0.16));
                line.style.strokeDashoffset = (1 - lp).toFixed(4);
                sats[i].classList.toggle('is-on', lp > 0.95);
            });
        };

        if (reduce) {
            render(1);
            return;
        }

        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const r = section.getBoundingClientRect();
                const totalScroll = section.offsetHeight - window.innerHeight;
                if (totalScroll > 0) {
                    render(clamp(-r.top / totalScroll));
                }
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        onScroll();
    }

    /* -------------------------------------------------------------
     * 7. Shared Section Reveal (ui.md §8)
     * ----------------------------------------------------------- */
    function initReveal() {
        const elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        if (prefersReducedMotion()) {
            elements.forEach((el) => el.classList.add('is-revealed'));
            return;
        }

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach((el) => io.observe(el));
    }

    /* -------------------------------------------------------------
     * Bootstrap on DOM Ready
     * ----------------------------------------------------------- */
    function init() {
        initNav();
        initTubesHero();
        initGhostCursor();
        initCountUp();
        initExpandImage();
        initScrollHub();
        initReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
