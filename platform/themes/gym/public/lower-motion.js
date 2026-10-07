window.GymLowerMotion = function () {
    'use strict';
    const $ = selector => document.querySelector(selector);
    const $$ = selector => [...document.querySelectorAll(selector)];
    const motion = window.GymMotion;
    const journey = $('.steps-journey');
    const stage = $('.steps-stage');
    const track = $('.steps');
    const stepButtons = $$('[data-step]');
    let active = false;
    const titles = $$('#gym-plans h2, #gym-steps h2, #gym-stories h2, #gym-faq h2, #gym-contact h2, .cta-section h2').map(heading => {
        heading.removeAttribute('data-reveal');
        heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
        const nodes = [];
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
            const fragment = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach(text => {
                if (!text.trim()) fragment.append(document.createTextNode(text));
                else { const word = document.createElement('span'); word.className = 'motion-word'; word.textContent = text; word.setAttribute('aria-hidden', 'true'); fragment.append(word); }
            });
            node.replaceWith(fragment);
        });
        return { heading, words: [...heading.querySelectorAll('.motion-word')] };
    });
    const plans = $$('.plan');
    plans.forEach(plan => {
        plan.removeAttribute('data-reveal');
        plan.addEventListener('pointermove', event => {
            if (!active || event.pointerType !== 'mouse') return;
            const rect = plan.getBoundingClientRect();
            const x = motion.clamp((event.clientX - rect.left) / rect.width);
            const y = motion.clamp((event.clientY - rect.top) / rect.height);
            plan.style.setProperty('--pointer-x', `${(x - .5) * 9}deg`);
            plan.style.setProperty('--shine-x', `${x * 100}%`);
            plan.style.setProperty('--shine-y', `${y * 100}%`);
            plan.style.setProperty('--shine-opacity', '1');
        });
        plan.addEventListener('pointerleave', () => { plan.style.setProperty('--pointer-x', '0deg'); plan.style.setProperty('--shine-opacity', '0'); });
    });
    const photos = $$('.step-photo, .contact-photo');
    const cta = $('.cta-section');
    const stories = $('#gym-stories');
    const entering = (rect, start = .94, finish = .3) => motion.clamp((innerHeight * start - rect.top) / (innerHeight * (start - finish)));
    stepButtons.forEach((button, index) => button.addEventListener('click', () => {
        if (!document.body.classList.contains('pin-enabled')) return;
        const top = journey.getBoundingClientRect().top + scrollY;
        scrollTo({ top: top - innerHeight * .14 + (journey.offsetHeight - innerHeight * .94) * index / (stepButtons.length - 1), behavior: active ? 'smooth' : 'instant' });
    }));
    $$('.faq details').forEach(detail => detail.addEventListener('toggle', () => {
        if (active && detail.open) detail.querySelector('p').animate([{ opacity: .4, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'ease-out' });
    }));
    return {
        sync(enabled) {
            active = enabled;
            document.body.classList.toggle('lower-motion-on', enabled);
            if (!enabled) {
                [track, stage, cta, stories, ...plans, ...photos, ...titles.flatMap(title => title.words)].forEach(element => element.removeAttribute('style'));
                $$('.faq details > p').forEach(element => element.getAnimations().forEach(animation => animation.cancel()));
            }
        },
        draw(enabled) {
            if (!enabled) return;
            titles.forEach(({ heading, words }) => {
                const rect = heading.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > innerHeight) return;
                const progress = entering(rect, .95, .42);
                words.forEach((word, index) => {
                    const value = motion.clamp(progress * 1.65 - index / Math.max(words.length - 1, 1) * .65);
                    const shade = Math.round(145 + value * 110);
                    word.style.setProperty('--word-color', `rgb(${shade}, ${shade}, ${shade})`);
                    word.style.setProperty('--word-y', `${(1 - value) * 12}px`);
                });
            });
            plans.forEach((plan, index) => {
                const rect = plan.getBoundingClientRect();
                if (rect.bottom < -150 || rect.top > innerHeight + 150) return;
                const value = motion.clamp(entering(rect, 1.05, .25) * 1.2 - index * .08);
                plan.style.setProperty('--plan-y', `${(1 - value) * (index === 1 ? 85 : 50)}px`);
                plan.style.setProperty('--plan-x', `${(1 - value) * 12}deg`);
            });
            if (document.body.classList.contains('pin-enabled')) {
                const rect = journey.getBoundingClientRect();
                const value = motion.progress(rect.top - innerHeight * .14, rect.height, innerHeight * .94);
                track.style.setProperty('--steps-shift', `${-Math.max(0, track.scrollWidth - $('.steps-window').clientWidth) * value}px`);
                stage.style.setProperty('--steps-progress', String(value));
                stepButtons.forEach((button, index) => button.setAttribute('aria-current', String(index === motion.activePanel(value, stepButtons.length))));
            } else track.style.removeProperty('--steps-shift');
            photos.forEach(photo => {
                const rect = photo.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > innerHeight) return;
                const value = motion.clamp((innerHeight - rect.top) / (innerHeight + rect.height));
                photo.style.setProperty('--photo-y', `${(value - .5) * Math.min(54, rect.height * .09)}px`);
                if (photo.classList.contains('contact-photo')) photo.style.setProperty('--chip-y', `${(1 - entering(rect)) * 35}px`);
            });
            const quoteProgress = entering(stories.getBoundingClientRect(), 1, -.4);
            stories.style.setProperty('--stars-angle', `${(1 - quoteProgress) * -8}deg`);
            stories.style.setProperty('--quote-y', `${quoteProgress * 80}px`);
            const ctaProgress = entering(cta.getBoundingClientRect(), 1, -.4);
            cta.style.setProperty('--cta-x', `${(ctaProgress - .5) * -180}px`);
            cta.style.setProperty('--cta-y', `${(1 - ctaProgress) * 25}px`);
        },
    };
};
