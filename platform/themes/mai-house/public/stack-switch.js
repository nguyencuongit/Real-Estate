(() => {
    const page = document.querySelector('[data-stack-page]');
    const scene = page?.querySelector('[data-stack-scene]');
    if (!page || !scene) return;

    const pageTwo = page.querySelector('.page-two-placeholder');
    const pageThree = page.querySelector('.contact-page');
    const headerContact = document.querySelector('[data-show-page-three]');
    const heroCopy = page.querySelector('.hero-copy');
    const showcaseCards = [...(pageTwo?.querySelectorAll('.showcase-back, .showcase-front') ?? [])];
    let currentPage = 1;
    let lastChange = 0;
    let touchStartY = null;
    let touchScrolledContent = false;
    let cardCleanupTimer = null;

    const releaseShowcaseCards = () => {
        showcaseCards.forEach(card => {
            card.style.removeProperty('translate');
            card.style.removeProperty('opacity');
        });
        cardCleanupTimer = null;
    };

    const setPage = nextPage => {
        if (nextPage < 1 || nextPage > 3 || nextPage === currentPage) return;
        const leavingShowcase = currentPage >= 2 && nextPage === 1;
        if (cardCleanupTimer !== null) clearTimeout(cardCleanupTimer);
        if (nextPage >= 2) {
            releaseShowcaseCards();
        } else if (leavingShowcase) {
            showcaseCards.forEach(card => {
                const style = getComputedStyle(card);
                card.style.translate = style.translate;
                card.style.opacity = style.opacity;
            });
            cardCleanupTimer = setTimeout(releaseShowcaseCards, 400);
        }

        currentPage = nextPage;
        page.classList.toggle('is-alternate', nextPage >= 2);
        page.classList.toggle('is-contact', nextPage === 3);
        if (nextPage !== 3) {
            pageThree?.classList.toggle('is-sending', false);
            pageThree?.classList.toggle('is-sent', false);
            pageThree?.classList.toggle('is-failed', false);
        }
        page.dataset.page = String(nextPage);
        heroCopy?.setAttribute('aria-hidden', String(nextPage !== 1));
        if (heroCopy) heroCopy.inert = nextPage !== 1;
        pageTwo?.setAttribute('aria-hidden', String(nextPage !== 2));
        if (pageTwo) pageTwo.inert = nextPage !== 2;
        pageThree?.setAttribute('aria-hidden', String(nextPage !== 3));
        if (pageThree) pageThree.inert = nextPage !== 3;
        scene.querySelectorAll('.mock-window').forEach(card => {
            card.setAttribute('aria-hidden', String(nextPage !== 1));
        });
    };

    // The initial page is already visible in CSS; apply accessibility state.
    page.dataset.page = '1';
    if (pageTwo) pageTwo.inert = true;
    if (pageThree) pageThree.inert = true;
    headerContact?.addEventListener('click', () => setPage(3));

    const scrollableContent = () => currentPage === 2 ? pageTwo : null;
    const canScrollWithin = delta => {
        const container = scrollableContent();
        if (!container || container.scrollHeight <= container.clientHeight + 1) return false;
        return delta > 0
            ? container.scrollTop + container.clientHeight < container.scrollHeight - 1
            : container.scrollTop > 1;
    };

    const switchFromDelta = delta => {
        const now = Date.now();
        if (Math.abs(delta) < 12 || now - lastChange < 700) return;
        const nextPage = Math.max(1, Math.min(3, currentPage + Math.sign(delta)));
        if (nextPage === currentPage) return;
        lastChange = now;
        setPage(nextPage);
    };

    page.addEventListener('wheel', event => {
        if (Math.abs(event.deltaY) < 12 || canScrollWithin(event.deltaY)) return;
        event.preventDefault();
        switchFromDelta(event.deltaY);
    }, { passive: false });

    page.addEventListener('touchstart', event => {
        touchStartY = event.touches[0]?.clientY ?? null;
        touchScrolledContent = false;
    }, { passive: true });

    page.addEventListener('touchmove', event => {
        if (touchStartY === null || !event.touches.length) return;
        const delta = touchStartY - event.touches[0].clientY;
        if (canScrollWithin(delta)) touchScrolledContent = true;
        else event.preventDefault();
    }, { passive: false });

    page.addEventListener('touchend', event => {
        if (touchStartY === null) return;
        const delta = touchStartY - (event.changedTouches[0]?.clientY ?? touchStartY);
        touchStartY = null;
        if (!touchScrolledContent && !canScrollWithin(delta)) switchFromDelta(delta);
    }, { passive: true });

    page.addEventListener('touchcancel', () => { touchStartY = null; }, { passive: true });

    page.addEventListener('keydown', event => {
        if (event.target.closest('a, button, input, textarea, select')) return;
        if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(event.key)) return;
        const delta = event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey) ? -1 : 1;
        if (canScrollWithin(delta)) return;
        event.preventDefault();
        setPage(Math.max(1, Math.min(3, currentPage + delta)));
    });

    pageTwo?.querySelector('[data-show-page-one]')?.addEventListener('click', () => setPage(1));
    pageThree?.querySelector('[data-show-page-two]')?.addEventListener('click', () => setPage(2));
    pageTwo?.querySelectorAll('a[href="#home"], a[href="#dashboard"]').forEach(link => {
        link.addEventListener('click', () => setPage(1));
    });
    pageTwo?.querySelectorAll('a[href="#get-started"], a[href="#about"]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            setPage(3);
        });
    });

    pageThree?.querySelector('form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const feedback = form.querySelector('.contact-feedback');
        const button = form.querySelector('.contact-submit');
        if (button.disabled) return;

        button.disabled = true;
        feedback.hidden = true;
        pageThree.classList.toggle('is-sent', false);
        pageThree.classList.toggle('is-failed', false);
        pageThree.classList.toggle('is-sending', true);
        const departure = new Promise(resolve => setTimeout(resolve, 850));

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });
            const result = await response.json().catch(() => null);
            if (!result) throw new Error('Không thể gửi liên hệ. Vui lòng thử lại.');
            if (!response.ok || result.error) {
                const errors = result.errors ? Object.values(result.errors).flat().join(' ') : '';
                throw new Error(errors || result.message || 'Không thể gửi liên hệ. Vui lòng thử lại.');
            }

            await departure;
            form.reset();
            feedback.textContent = result.message || 'Đã gửi liên hệ thành công.';
            feedback.dataset.state = 'success';
            pageThree.classList.toggle('is-sending', false);
            pageThree.classList.toggle('is-sent', currentPage === 3);
        } catch (error) {
            feedback.textContent = error?.name === 'TypeError'
                ? 'Không thể kết nối. Vui lòng thử lại.'
                : error.message || 'Không thể gửi liên hệ. Vui lòng thử lại.';
            feedback.dataset.state = 'error';
            pageThree.classList.toggle('is-sending', false);
            pageThree.classList.toggle('is-failed', currentPage === 3);
        } finally {
            feedback.hidden = false;
            button.disabled = false;
        }
    });
})();
