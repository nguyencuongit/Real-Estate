'use strict';
(() => {
    const math = window.FashionMotionMath;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduced.matches;
    let frame = 0;
    let keyboardNavigation = false;
    document.addEventListener('keydown', event => { if(event.key === 'Tab') keyboardNavigation = true; });
    document.addEventListener('pointerdown', () => keyboardNavigation = false);
    const header = document.querySelector('#fashion-header');
    const toggle = document.querySelector('#fashion-motion');
    const rails = [...document.querySelectorAll('[data-horizontal]')].map(section => ({section, track: section.querySelector('.collection-track'), window: section.querySelector('.collection-window'), bar: section.querySelector('.track-progress i')}));
    const parallax = [...document.querySelectorAll('[data-parallax]')];
    const words = [...document.querySelectorAll('[data-word-reveal]')].map(element => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
            const fragment = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach(text => {
                if (!text.trim()) fragment.append(document.createTextNode(text));
                else { const span = document.createElement('span'); span.className = 'word'; span.textContent = text; fragment.append(span); }
            });
            node.replaceWith(fragment);
        });
        return {element, items: [...element.querySelectorAll('.word')]};
    });
    const videos = [...document.querySelectorAll('[data-autoplay]')];
    const cinematic = window.createFashionCinematicMotion();
    const visibleVideos = new Set();
    const loadVideo = video => {
        if (video.dataset.src) { video.src = video.dataset.src; delete video.dataset.src; }
    };
    const videoObserver = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting) { visibleVideos.add(target); loadVideo(target); if (!paused && !document.hidden) target.play().catch(() => {}); }
        else { visibleVideos.delete(target); target.pause(); }
    }), {threshold: .12});
    videos.forEach(video => videoObserver.observe(video));
    function draw() {
        frame = 0;
        const viewport = innerHeight;
        const pinned = innerWidth > 780 && !paused;
        cinematic.draw({paused, viewport});
        header.classList.toggle('scrolled', scrollY > viewport * .6);
        rails.forEach(rail => {
            const rect = rail.section.getBoundingClientRect();
            if (pinned) {
                const progress = math.travel(rect.top, rect.height, viewport, 82);
                const distance = Math.max(0, rail.track.scrollWidth - rail.window.clientWidth + rail.window.clientWidth * .064);
                rail.track.style.transform = `translate3d(${-distance * progress}px,0,0)`;
                rail.bar.style.transform = `scaleX(${progress})`;
            } else {
                rail.track.style.transform = '';
                const distance = rail.window.scrollWidth - rail.window.clientWidth;
                rail.bar.style.transform = `scaleX(${distance > 0 ? rail.window.scrollLeft / distance : 1})`;
            }
        });
        if (paused) return;
        words.forEach(({element,items}) => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom < -100 || rect.top > viewport) return;
            const progress = math.clamp((viewport * .9 - rect.top) / (viewport * .5 + rect.height * .25));
            items.forEach((word, index) => word.style.color = progress >= index / items.length ? '' : (element.closest('.full-editorial') ? '#d2d7cfee' : '#7b877d'));
        });
        parallax.forEach(image => {
            const parent = image.parentElement.getBoundingClientRect();
            if (parent.bottom < 0 || parent.top > viewport) return;
            const progress = math.clamp((viewport - parent.top) / (viewport + parent.height));
            image.style.transform = `translate3d(0,${-progress * 10}%,0)`;
        });
        const wordmark = document.querySelector('[data-footer-wordmark]');
        const bottom = wordmark.getBoundingClientRect();
        if (bottom.top < viewport) wordmark.style.transform = `translateY(${(1 - math.clamp((viewport - bottom.top) / (viewport * .5))) * 40}px)`;
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(draw); };
    rails.forEach(rail => {
        rail.window.addEventListener('scroll', request, {passive:true});
        const move = direction => {
            if (innerWidth <= 780 || paused) rail.window.scrollBy({left:direction * rail.window.clientWidth * .8, behavior:paused?'auto':'smooth'});
            else {
                const top = rail.section.getBoundingClientRect().top + scrollY;
                const end = top + rail.section.offsetHeight - innerHeight - 82;
                const next = scrollY + direction * Math.max(150, (end - top) / 8);
                window.scrollTo({top:Math.max(top - 82, Math.min(end, next)),behavior:'smooth'});
            }
        };
        rail.section.querySelector('[data-track-prev]').addEventListener('click', () => move(-1));
        rail.section.querySelector('[data-track-next]').addEventListener('click', () => move(1));
        rail.track.addEventListener('focusin', event => {
            const card = event.target.closest('.collection-track > *');
            if (!card || !keyboardNavigation || innerWidth <= 780 || paused) return;
            const rect = card.getBoundingClientRect();
            if(rect.left >= 0 && rect.right <= innerWidth) return;
            const distance = rail.track.scrollWidth - rail.window.clientWidth;
            const progress = math.clamp(card.offsetLeft / distance);
            window.scrollTo({top:rail.section.getBoundingClientRect().top + scrollY - 82 + (rail.section.offsetHeight - innerHeight) * progress,behavior:'auto'});
        });
    });
    const revealObserver = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
        if (!isIntersecting) return;
        if (!paused) target.animate([{transform:'translateY(40px)',filter:'blur(8px)',opacity:.3},{transform:'translateY(0)',filter:'blur(0px)',opacity:1}], {duration:1100,easing:'cubic-bezier(.2,.7,.2,1)'});
        revealObserver.unobserve(target);
    }), {threshold:.2});
    document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
    const title = document.querySelector('[data-letters]');
    if (!paused && Intl.Segmenter) {
        const text = title.textContent;
        title.setAttribute('aria-label', text);
        title.textContent = '';
        let index=0;
        text.split(/(\s+)/).forEach(word => {
            if(!word.trim()){title.append(document.createTextNode(word));return;}
            const group=document.createElement('span');group.className='letter-word';group.setAttribute('aria-hidden','true');title.append(group);
            [...new Intl.Segmenter('vi',{granularity:'grapheme'}).segment(word)].forEach(({segment})=>{
                const span=document.createElement('span');span.className='letter';span.textContent=segment;group.append(span);
                span.animate([{transform:'translateY(80px)',filter:'blur(12px)',opacity:0},{transform:'translateY(0)',filter:'blur(0px)',opacity:1}],{duration:1350,delay:Math.min(index++*28,1000),easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
            });
        });
    }
    const bespoke = document.querySelector('[data-bespoke]');
    const slides = [...bespoke.querySelectorAll('img')];
    const dots = [...bespoke.querySelectorAll('button')];
    let slide = 0;
    const show = index => { slide=index; slides.forEach((image,i)=>image.classList.toggle('active',i===index)); dots.forEach((dot,i)=>dot.setAttribute('aria-pressed', String(i===index))); };
    dots.forEach((dot,index)=>dot.addEventListener('click',()=>show(index)));
    setInterval(() => {const rect=bespoke.getBoundingClientRect(); if (!paused&&!document.hidden&&rect.top<innerHeight&&rect.bottom>0&&!bespoke.matches(':hover,:focus-within')) show((slide+1)%slides.length);},5000);
    document.querySelectorAll('[data-hover-video]').forEach(video=>{
        const tile=video.closest('.world-tile');
        const start=()=>{if(paused)return;loadVideo(video);video.play().then(()=>tile.classList.add('playing')).catch(()=>{});};
        const stop=()=>{video.pause();tile.classList.remove('playing');};
        tile.addEventListener('pointerenter',start);tile.addEventListener('pointerleave',stop);tile.addEventListener('focusin',start);tile.addEventListener('focusout',stop);
    });
    let counted=false;
    const counter=document.querySelector('[data-count]');
    const countObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting||counted)return;counted=true;if(paused)return;const start=performance.now(),total=Number(counter.dataset.count);function count(now){const progress=math.clamp((now-start)/1500);counter.textContent=Math.round(total*(1-(1-progress)**3)).toLocaleString('vi-VN');if(progress<1&&!paused)requestAnimationFrame(count);else counter.textContent=total.toLocaleString('vi-VN');}requestAnimationFrame(count);},{threshold:.5});
    countObserver.observe(counter);
    function setPaused(value) {
        paused=value;document.documentElement.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Tiếp tục chuyển động':'Tạm dừng chuyển động');toggle.textContent=paused?'▷':'Ⅱ';
        document.querySelectorAll('video').forEach(video=>{if(paused)video.pause();else if(visibleVideos.has(video)&&!document.hidden)video.play().catch(()=>{});});
        if(paused){document.getAnimations().forEach(animation=>{if(animation.effect?.target?.closest?.('[data-letters],[data-reveal]'))animation.finish();});parallax.forEach(image=>image.style.transform='');document.querySelector('[data-footer-wordmark]').style.transform='';}
        window.dispatchEvent(new CustomEvent('fashion:motion',{detail:{paused}}));request();
    }
    toggle.addEventListener('click',()=>setPaused(!paused));reduced.addEventListener('change',()=>setPaused(reduced.matches));
    document.addEventListener('visibilitychange',()=>{document.querySelectorAll('video').forEach(video=>{if(document.hidden)video.pause();else if(!paused&&visibleVideos.has(video))video.play().catch(()=>{});});});
    window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);setPaused(paused);
})();
