export function setupReveals(isPaused, animations) {
    const targets = document.querySelectorAll('.hero-content h1, .beauty-story h2, .art-copy h2, .personal-copy h2, .welcome-copy h2, .faq-intro h2, .closing-copy h2');
    targets.forEach(heading => {
        const label = [...heading.childNodes].map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('');
        heading.setAttribute('aria-label', label.replace(/\s+/g, ' ').trim());
        const content = document.createElement('span');
        content.setAttribute('aria-hidden', 'true');
        [...heading.childNodes].forEach(node => {
            if (node.nodeType !== Node.TEXT_NODE) { content.append(node); return; }
            node.textContent.split(/(\s+)/).forEach(word => {
                if (!word.trim()) { content.append(document.createTextNode(word)); return; }
                const wrap = document.createElement('span');
                wrap.className = 'motion-word';
                [...word.normalize('NFC')].forEach(character => {
                    const char = document.createElement('span');
                    char.className = 'motion-char';
                    char.textContent = character;
                    wrap.append(char);
                });
                content.append(wrap);
            });
        });
        heading.replaceChildren(content);
    });
    function animate(element, frames, options) {
        const animation = element.animate(frames, options);
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) { entry.target.dataset.revealed = 'false'; return; }
        if (entry.target.dataset.revealed === 'true') return;
        entry.target.dataset.revealed = 'true';
        if (isPaused()) return;
        const chars = entry.target.querySelectorAll('.motion-char');
        if (chars.length) {
            chars.forEach((char, index) => animate(char, [
                { opacity: 0, transform: 'translateY(80%) rotateX(-75deg)', filter: 'blur(8px)' },
                { opacity: 1, transform: 'none', filter: 'blur(0)' },
            ], { duration: 950, delay: Math.min(index * 16, 400), fill: 'backwards', easing: 'cubic-bezier(.22,1,.36,1)' }));
        } else {
            // Animate the child, never the observed box: clipping the box
            // itself can retrigger IntersectionObserver mid-animation.
            const images = entry.target.querySelectorAll('.gallery-face, .art-photo img, :scope > img');
            images.forEach((image, index) => animate(image, [
                { opacity: .1, clipPath: 'inset(50% 50%)', scale: '1.15' },
                { opacity: 1, clipPath: 'inset(0)', scale: '1' },
            ], { duration: 1400, delay: Math.min(index * 65, 350), fill: 'backwards', easing: 'cubic-bezier(.22,1,.36,1)' }));
        }
    }), { threshold: .12 });
    targets.forEach(element => observer.observe(element));
    document.querySelectorAll('.gallery-viewport, .art-stage, .personal-film').forEach(element => observer.observe(element));
}
