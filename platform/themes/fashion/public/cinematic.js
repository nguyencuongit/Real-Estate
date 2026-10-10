'use strict';
window.createFashionCinematicMotion = () => {
    const math = window.FashionMotionMath;
    const root = document.documentElement;
    const intro = document.querySelector('.intro-stack');
    const categories = intro.querySelector('.categories');
    const hero = intro.querySelector('.hero');
    const stack = document.querySelector('.scene-stack');
    const scenes = [...stack.querySelectorAll('[data-scene]')].map((section,index) => {
        const panel = document.createElement('div');panel.className='scene-panel';panel.style.zIndex=String(index+1);
        section.before(panel);panel.append(section);
        let curtain=null;
        if(section.dataset.scene==='wipe'){curtain=document.createElement('span');curtain.className='scene-curtain';curtain.setAttribute('aria-hidden','true');section.append(curtain);}
        return {section,panel,curtain,progress:1};
    });
    const collections = [...document.querySelectorAll('.collection')];
    const headings = [...document.querySelectorAll('[data-word-reveal]')].map(element=>({element,words:[...element.querySelectorAll('.word')]}));
    headings.forEach(({words})=>words.forEach(word=>word.classList.add('cinematic-word')));
    const images = [...document.querySelectorAll('.world-media,.heritage .editorial-photo')];
    const wordmark = document.querySelector('[data-footer-wordmark]');
    const footerText = wordmark.textContent;
    wordmark.replaceChildren();
    [...footerText].forEach(letter=>{
        if(!letter.trim()){wordmark.append(document.createTextNode(letter));return;}
        const span=document.createElement('span');span.className='footer-letter';span.setAttribute('aria-hidden','true');span.textContent=letter;wordmark.append(span);
    });
    const footerLetters = [...wordmark.querySelectorAll('.footer-letter')];
    let active=false, paused=false, keyboard=false, target=null, wheelFrame=0, lastTime=0;
    const stopWheel=()=>{target=null;if(wheelFrame)cancelAnimationFrame(wheelFrame);wheelFrame=0;};
    document.addEventListener('pointerdown',()=>{keyboard=false;stopWheel();});
    document.addEventListener('keydown',event=>{keyboard=event.key==='Tab';stopWheel();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stopWheel();});
    document.addEventListener('click',event=>{
        const link=event.target.closest('a[href^="#"]');
        if(!active||!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
        const destination=document.getElementById(link.hash.slice(1));
        const scene=scenes.find(item=>item.section===destination);
        let top;
        if(scene)top=stack.getBoundingClientRect().top+scrollY+scenes.slice(0,scenes.indexOf(scene)).reduce((height,item)=>height+item.panel.offsetHeight,0);
        else if(destination===hero)top=intro.getBoundingClientRect().top+scrollY;
        else if(destination===intro.querySelector('.statement'))top=intro.getBoundingClientRect().top+scrollY+hero.offsetHeight;
        else return;
        event.preventDefault();stopWheel();history.pushState(null,'',link.hash);window.scrollTo({top,behavior:'smooth'});
    });
    // Let keyboard focus finish a transition before an off-screen control is used.
    stack.addEventListener('focusin',event=>{
        if(!active||!keyboard)return;
        const scene=scenes.find(item=>item.section.contains(event.target));
        if(!scene)return;
        const index=scenes.indexOf(scene);
        window.scrollTo({top:stack.getBoundingClientRect().top+scrollY+index*innerHeight,behavior:'instant'});
    });
    categories.addEventListener('focusin',()=>{if(active&&keyboard)window.scrollTo({top:intro.getBoundingClientRect().top+scrollY+hero.offsetHeight+intro.querySelector('.statement').offsetHeight,behavior:'instant'});});
    function wheelStep(now){
        wheelFrame=0;
        if(target===null||!active||document.hidden){stopWheel();return;}
        const delta=target-scrollY;
        if(Math.abs(delta)<.7){window.scrollTo({top:target,behavior:'instant'});target=null;return;}
        const dt=Math.min(64,Math.max(8,now-lastTime));lastTime=now;
        window.scrollTo({top:scrollY+delta*(1-Math.exp(-dt/105)),behavior:'instant'});
        wheelFrame=requestAnimationFrame(wheelStep);
    }
    window.addEventListener('wheel',event=>{
        if(!active||event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||document.querySelector('dialog[open]'))return;
        if(event.target.closest('input,select,textarea,[contenteditable="true"]'))return;
        const nested=event.target.closest('.collection-window,.gallery-window');
        if(nested&&['auto','scroll'].includes(getComputedStyle(nested).overflowY))return;
        const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
        const end=Math.max(0,root.scrollHeight-innerHeight);
        const next=Math.max(0,Math.min(end,(target===null?scrollY:target)+delta));
        if(next===scrollY&&target===null)return;
        event.preventDefault();target=next;
        if(!wheelFrame){lastTime=performance.now();wheelFrame=requestAnimationFrame(wheelStep);}
    },{passive:false});
    function reset(){
        categories.style.transform='';categories.style.filter='';categories.style.opacity='';
        hero.querySelector('video').style.scale='';
        scenes.forEach(({section,curtain})=>{section.style.transform='';section.style.clipPath='';section.querySelectorAll('img').forEach(image=>image.style.scale='');if(curtain)curtain.style.transform='';});
        collections.forEach(section=>{const child=section.querySelector('.collection-sticky');child.style.maskImage='';child.style.filter='';});
    }
    function draw({paused:nextPaused,viewport}){
        paused=nextPaused;
        const enabled=!paused&&innerWidth>780&&viewport>=680;
        if(enabled!==active){active=enabled;root.classList.toggle('fashion-cinematic',active);stopWheel();reset();}
        if(active){
            const introTop=intro.getBoundingClientRect().top;
            const naturalTop=introTop+hero.offsetHeight+intro.querySelector('.statement').offsetHeight;
            const progress=math.smooth(math.entrance(naturalTop,viewport));
            categories.style.transform=`translate3d(0,${-Math.max(0,Math.min(viewport,naturalTop))}px,0) scale(${.6+.4*progress})`;
            categories.style.filter=progress<1?`blur(${6*(1-progress)}px)`:'none';categories.style.opacity=String(progress);
            hero.querySelector('video').style.scale=String(1+.08*math.clamp(-introTop/viewport));
            const top=stack.getBoundingClientRect().top;
            let offset=0;
            scenes.forEach(scene=>{
                const natural=top+offset;offset+=scene.panel.offsetHeight;
                const progress=math.smooth(math.entrance(natural,viewport));scene.progress=progress;
                scene.section.style.transform=`translate3d(0,${-Math.max(0,Math.min(viewport,natural))}px,0)`;
                scene.section.style.clipPath=scene.section.dataset.scene==='wipe'?`inset(0 0 0 ${100*(1-progress)}%)`:`inset(0 0 ${100*(1-progress)}% 0)`;
                if(scene.curtain)scene.curtain.style.transform=`translateX(${(1-2*progress*progress)*100}%)`;
                scene.section.querySelectorAll('img').forEach(image=>image.style.scale=String(1+.12*(1-progress)));
            });
            collections.forEach(section=>{
                const progress=math.smooth(math.entrance(section.getBoundingClientRect().top,viewport,82));
                const child=section.querySelector('.collection-sticky');
                child.style.maskImage=progress<1?`linear-gradient(to top,#000 ${progress*140-40}%,transparent ${progress*140}%)`:'none';
                child.style.filter=progress<1?`blur(${6*(1-progress)}px)`:'none';
            });
        }
        headings.forEach(({element,words})=>{
            const rect=element.getBoundingClientRect();
            const scene=active?scenes.find(item=>item.section.contains(element)):null;
            const progress=paused?1:scene?math.clamp((scene.progress-.15)/.75):math.entrance(rect.top,viewport,viewport*.38);
            words.forEach((word,index)=>{
                const value=math.smooth(math.clamp((progress-index/Math.max(1,words.length-1)*.45)/.55));
                word.style.transform=`translateY(${28*(1-value)}px)`;word.style.filter=value<1?`blur(${5*(1-value)}px)`:'none';word.style.opacity=String(.45+.55*value);
            });
        });
        images.forEach(image=>{
            const progress=paused?1:math.smooth(math.entrance(image.getBoundingClientRect().top,viewport,viewport*.12));
            image.style.clipPath=progress<1?`inset(0 0 ${100*(1-progress)}% 0)`:'none';
            const photo=image.querySelector('img');photo.style.scale=String(1+.12*(1-progress));
        });
        const progress=paused?1:math.entrance(wordmark.getBoundingClientRect().top,viewport,viewport*.5);
        footerLetters.forEach((letter,index)=>{const value=math.smooth(math.clamp((progress-index/Math.max(1,footerLetters.length-1)*.3)/.7));letter.style.transform=`translateY(${(1-value)*90}%) rotate(${(1-value)*4}deg)`;letter.style.opacity=String(.35+.65*value);});
    }
    return {draw};
};
