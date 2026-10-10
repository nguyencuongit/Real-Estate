(() => {
    'use strict';
    const animations = new Set();
    const segmenter = new Intl.Segmenter('vi', {granularity:'grapheme'});
    function splitHeading(heading) {
        heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        const letters = [];
        textNodes.forEach((node) => {
            const fragment = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach((word) => {
                if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
                const span = document.createElement('span');
                span.className = 'reveal-word';
                span.setAttribute('aria-hidden', 'true');
                [...segmenter.segment(word)].forEach(({segment}) => {
                    const letter = document.createElement('span');
                    letter.className = 'reveal-letter';letter.textContent = segment;
                    span.append(letter);letters.push(letter);
                });
                fragment.append(span);
            });
            node.replaceWith(fragment);
        });
        return letters;
    }
    function init(shouldAnimate) {
        const headings = new Map([...document.querySelectorAll('h2[data-reveal]')].map((heading) => [heading,splitHeading(heading)]));
        const observer = new IntersectionObserver((entries) => entries.forEach(({target,isIntersecting}) => {
            if (!isIntersecting || !shouldAnimate()) return;
            const letters = headings.get(target);
            (letters || [target]).forEach((element,index) => {
                const animation = element.animate([
                    {opacity:0,transform:letters ? 'perspective(300px) translateY(70%) rotateX(-80deg)' : 'translateY(28px)',filter:'blur(5px)'},
                    {opacity:1,transform:'none',filter:'blur(0)'},
                ], {duration:1100,delay:letters ? index * 16 : 0,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
                animations.add(animation);
                animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
            });
            observer.unobserve(target);
        }), {threshold:.12});
        document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
        return {cancel:() => {animations.forEach((animation) => animation.cancel());animations.clear();}};
    }
    window.SpaReveal = {init};
})();
