import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function element() {
    const listeners = new Map();
    const classes = new Set();
    return {
        listeners,
        dataset: {},
        style: { removeProperty() {} },
        classList: {
            toggle(name, force) { if (force) classes.add(name); else classes.delete(name); },
            contains(name) { return classes.has(name); },
        },
        addEventListener(name, handler) { listeners.set(name, handler); },
        setAttribute(name, value) { this[name] = value; },
        closest() { return null; },
        querySelector() { return null; },
        querySelectorAll() { return []; },
        scrollHeight: 0,
        clientHeight: 0,
        scrollTop: 0,
    };
}

test('navigation and contact submission use the contact endpoint', async () => {
    const page = element();
    const scene = element();
    const first = element();
    const second = element();
    const third = element();
    const backOne = element();
    const backTwo = element();
    const headerContact = element();
    const form = element();
    const feedback = element();
    const submitButton = element();
    let now = 1000;
    let resetCount = 0;
    let response = { ok: true, json: async () => ({ error: false, message: 'Saved' }) };
    const requests = [];

    page.querySelector = selector => ({
        '[data-stack-scene]': scene,
        '.page-two-placeholder': second,
        '.contact-page': third,
        '.hero-copy': first,
    })[selector];
    second.querySelector = () => backOne;
    third.querySelector = selector => selector === 'form' ? form : backTwo;
    form.action = '/mai-house/contact';
    form.reset = () => { resetCount += 1; };
    form.querySelector = selector => ({
        '.contact-feedback': feedback,
        '.contact-submit': submitButton,
    })[selector] ?? null;

    runInNewContext(readFileSync(new URL('../public/stack-switch.js', import.meta.url), 'utf8'), {
        document: { querySelector: selector => ({
            '[data-stack-page]': page,
            '[data-show-page-three]': headerContact,
        })[selector] ?? null },
        Date: { now: () => now },
        setTimeout: (callback, delay) => {
            if (delay === 850) callback();
            return 1;
        },
        clearTimeout() {},
        getComputedStyle: () => ({ translate: '0px', opacity: '1' }),
        FormData: class { constructor(source) { this.source = source; } },
        fetch: async (url, options) => {
            requests.push({ url, options });
            return response;
        },
    });

    const wheel = deltaY => {
        let prevented = false;
        page.listeners.get('wheel')({ deltaY, preventDefault() { prevented = true; } });
        now += 800;
        return prevented;
    };

    assert.equal(page.dataset.page, '1');
    headerContact.listeners.get('click')();
    assert.equal(page.dataset.page, '3');
    assert.equal(third.inert, false);
    backTwo.listeners.get('click')();
    backOne.listeners.get('click')();
    assert.equal(page.dataset.page, '1');
    assert.equal(wheel(120), true);
    assert.equal(page.dataset.page, '2');
    assert.equal(second.inert, false);
    assert.equal(wheel(120), true);
    assert.equal(page.dataset.page, '3');
    assert.equal(third.inert, false);

    third.scrollHeight = 900;
    third.clientHeight = 500;
    third.scrollTop = 100;
    assert.equal(wheel(-120), true);
    assert.equal(page.dataset.page, '2');
    second.scrollHeight = 900;
    second.clientHeight = 500;
    second.scrollTop = 100;
    assert.equal(wheel(-120), false);
    assert.equal(page.dataset.page, '2');
    second.scrollTop = 0;
    assert.equal(wheel(-120), true);
    assert.equal(page.dataset.page, '1');
    assert.equal(first.inert, false);

    backOne.listeners.get('click')();
    backTwo.listeners.get('click')();
    assert.equal(page.dataset.page, '2');
    assert.equal(page.classList.contains('is-contact'), false);

    second.scrollHeight = 0;
    wheel(120);
    assert.equal(page.dataset.page, '3');
    const submitted = form.listeners.get('submit')({ preventDefault() {}, currentTarget: form });
    assert.equal(third.classList.contains('is-sending'), true);
    await submitted;
    assert.equal(requests[0].url, '/mai-house/contact');
    assert.equal(requests[0].options.method, 'POST');
    assert.equal(requests[0].options.headers.Accept, 'application/json');
    assert.equal(requests[0].options.body.source, form);
    assert.equal(resetCount, 1);
    assert.equal(feedback.textContent, 'Saved');
    assert.equal(feedback.dataset.state, 'success');
    assert.equal(feedback.hidden, false);
    assert.equal(third.classList.contains('is-sent'), true);
    assert.equal(third.classList.contains('is-sending'), false);

    response = { ok: false, json: async () => ({ errors: { phone: ['Invalid phone'] } }) };
    await form.listeners.get('submit')({ preventDefault() {}, currentTarget: form });
    assert.equal(feedback.textContent, 'Invalid phone');
    assert.equal(feedback.dataset.state, 'error');
    assert.equal(resetCount, 1);
    assert.equal(submitButton.disabled, false);
    assert.equal(third.classList.contains('is-failed'), true);
    assert.equal(third.classList.contains('is-sent'), false);
});
