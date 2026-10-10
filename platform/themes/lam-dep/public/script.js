(() => {
    'use strict';
    const services = JSON.parse(document.getElementById('beauty-service-data').textContent);
    const byId = new Map(services.map(service => [service.id, service]));
    const assetBase = new URL('./', document.querySelector('.hero-poster').src).href;
    const menu = document.getElementById('beauty-menu');
    const detail = document.getElementById('beauty-detail');
    const booking = document.getElementById('beauty-booking');
    const dialogs = [...document.querySelectorAll('dialog')];
    const peek = document.getElementById('service-peek');
    const scene = document.querySelector('.service-scene');
    let selectedService = null;
    let returnFocus = null;
    let closingPeek;

    function openDialog(dialog, opener) {
        const previousFocus = returnFocus;
        dialogs.forEach(item => { if (item.open) item.close(); });
        returnFocus = opener?.closest('dialog') ? previousFocus : opener;
        document.body.classList.add('dialog-open');
        dialog.showModal();
    }
    dialogs.forEach(dialog => {
        dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
        dialog.addEventListener('close', () => {
            if (dialogs.some(item => item.open)) return;
            document.body.classList.remove('dialog-open');
            if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
        });
        dialog.addEventListener('click', event => {
            if (event.target !== dialog) return;
            const rect = dialog.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
        });
    });
    document.getElementById('menu-open').addEventListener('click', event => openDialog(menu, event.currentTarget));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
    document.querySelector('[data-about]').addEventListener('click', event => openDialog(document.getElementById('beauty-about'), event.currentTarget));

    function showDetail(id, opener) {
        const service = byId.get(id);
        if (!service) return;
        selectedService = service;
        document.getElementById('detail-number').textContent = `${service.number} / TG THANG`;
        document.getElementById('detail-title').textContent = service.name;
        document.getElementById('detail-copy').textContent = service.copy;
        const image = document.getElementById('detail-image');
        image.src = `${assetBase}${service.image}.webp`;
        image.alt = service.name;
        document.getElementById('detail-options').replaceChildren(...service.options.map(option => {
            const item = document.createElement('li');
            item.textContent = option;
            return item;
        }));
        peek.hidden = true;
        openDialog(detail, opener);
    }
    document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => showDetail(button.dataset.service, button)));

    function showPeek(button) {
        clearTimeout(closingPeek);
        const service = byId.get(button.dataset.service);
        selectedService = service;
        document.querySelectorAll('.service-point').forEach(point => point.classList.toggle('is-active', point === button));
        document.getElementById('peek-number').textContent = `${service.number} / TG THANG`;
        document.getElementById('peek-title').textContent = service.name;
        document.getElementById('peek-copy').textContent = service.copy;
        const image = document.getElementById('peek-image');
        image.src = `${assetBase}${service.image}.webp`;
        image.alt = service.name;
        peek.hidden = false;
    }
    document.querySelectorAll('.service-point').forEach(button => {
        button.addEventListener('pointerenter', () => showPeek(button));
        button.addEventListener('focus', () => showPeek(button));
    });
    scene.addEventListener('pointerleave', () => {
        closingPeek = setTimeout(() => {
            if (scene.contains(document.activeElement)) return;
            peek.hidden = true;
            document.querySelectorAll('.service-point').forEach(point => point.classList.remove('is-active'));
        }, 160);
    });
    scene.addEventListener('focusout', event => {
        if (!scene.contains(event.relatedTarget)) peek.hidden = true;
    });
    document.getElementById('peek-detail').addEventListener('click', event => {
        if (selectedService) showDetail(selectedService.id, event.currentTarget);
    });

    function showBooking(opener, service = 'consultation') {
        document.getElementById('booking-service').value = service;
        document.getElementById('booking-result').textContent = '';
        openDialog(booking, opener);
    }
    document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => showBooking(button)));
    document.getElementById('detail-book').addEventListener('click', event => showBooking(event.currentTarget, selectedService?.id));
    const today = new Date();
    document.getElementById('booking-date').min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.getElementById('beauty-booking-form').addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const date = new Date(`${data.get('date')}T12:00:00`).toLocaleDateString('vi-VN');
        const service = byId.get(data.get('service'))?.name || 'Tư vấn dịch vụ';
        const result = document.getElementById('booking-result');
        result.textContent = `Cảm ơn ${String(data.get('name')).trim()}! Lịch mẫu: ${service}, ngày ${date}, ${data.get('time')}. Đây là xác nhận demo; thông tin không được gửi đi và chưa có lịch hẹn thật.`;
        result.focus();
    });
    const header = document.querySelector('.beauty-header');
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
})();
