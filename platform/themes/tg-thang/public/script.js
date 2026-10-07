'use strict';
(() => {
  const assetBase = new URL('assets/', document.currentScript.src);
  const menu = document.getElementById('site-menu');
  const detail = document.getElementById('construction-detail');
  const contact = document.getElementById('construction-contact');
  const menuButton = document.querySelector('.menu-open');
  let lastOpener;
  function openDialog(dialog, opener) {
    lastOpener = opener;
    document.querySelectorAll('dialog[open]').forEach(other => other.close());
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) {
        document.body.classList.remove('dialog-open');
        if (lastOpener?.isConnected) lastOpener.focus({preventScroll:true});
      }
    });
  });
  menuButton.addEventListener('click', () => openDialog(menu, menuButton));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => openDialog(contact, button.closest('dialog') ? document.querySelector('[data-contact]') : button)));
  const descriptions = {
    panel: {label:'01 / VẬT LIỆU & BAO CHE',title:'Phù hợp từ lớp vỏ đến không gian bên trong.',image:'panels',copy:'Vật liệu cần được lựa chọn cùng với phương án kiến trúc và điều kiện sử dụng, thay vì xem như một bước riêng ở cuối quá trình.',points:['Tư vấn vật liệu theo nhu cầu và ngân sách.','Phối hợp hệ vách, mái, cửa và các lớp hoàn thiện.','Xem xét bảo trì, khả năng thay thế và vận hành.']},
    digital: {label:'02 / THIẾT KẾ & KỸ THUẬT',title:'Giải quyết trên bản vẽ trước khi ra công trường.',image:'robot',copy:'Một bộ hồ sơ rõ ràng giúp các nhóm kỹ thuật hiểu cùng một mục tiêu. Mô hình số hỗ trợ trao đổi phương án và kiểm tra các điểm cần phối hợp.',points:['Khảo sát và xác định yêu cầu sử dụng.','Phối hợp kiến trúc, kết cấu và hệ thống kỹ thuật.','Cập nhật phương án theo các quyết định đã thống nhất.']},
    frame: {label:'03 / KẾT CẤU & LẮP DỰNG',title:'Lắp dựng có kế hoạch, kiểm tra có quy trình.',image:'frame',copy:'Trước khi lắp dựng, đội ngũ thống nhất trình tự thi công, phương án vận chuyển và cách kiểm tra từng hạng mục.',points:['Kiểm tra hồ sơ và điều kiện mặt bằng.','Gia công, đánh dấu và tổ chức cấu kiện theo từng bước.','Nghiệm thu theo giai đoạn trước khi chuyển công việc.']},
    turnkey: {label:'04 / THI CÔNG TRỌN GÓI',title:'Cùng một đội ngũ, từ khởi đầu đến bàn giao.',image:'system',copy:'Một đầu mối trao đổi giúp việc phối hợp thuận tiện hơn. Công việc, tiến độ và chi phí dự kiến được làm rõ trong phạm vi hợp tác.',points:['Khảo sát, đề xuất phương án và dự toán.','Tổ chức thi công, theo dõi tiến độ và chất lượng.','Bàn giao hồ sơ và hướng dẫn bảo trì.']},
    'project-1': {label:'TG.01 / NHÀ Ở',title:'Không gian sống hiện đại',image:'project-1',copy:'Ý tưởng tổ chức nhà ở nhiều tầng với ánh sáng tự nhiên, ban công và các lớp bao che. Bộ ảnh minh họa cách cân bằng hình khối với nhu cầu sử dụng.',points:['Hướng giải pháp: nhà ở đô thị.','Phối hợp thiết kế mặt đứng và kết cấu.','Tập trung vào sự tiện nghi và hiệu quả không gian.']},
    'project-2': {label:'TG.02 / KHU DÂN CƯ',title:'Kết nối những cộng đồng',image:'project-2',copy:'Các khối nhà được nhìn trong tổng thể cảnh quan và hạ tầng. Nội dung demo gợi ý cách chuẩn hóa cấu kiện trong khi vẫn giữ chất lượng không gian sống.',points:['Hướng giải pháp: xây dựng đồng bộ.','Phối hợp khối nhà, cảnh quan và không gian chung.','Lập kế hoạch thi công theo từng giai đoạn.']},
    'project-3': {label:'TG.03 / CÔNG TRÌNH DỊCH VỤ',title:'Kiến trúc vì con người',image:'project-3',copy:'Một công trình dịch vụ cần vận hành thuận tiện và phù hợp với người sử dụng. Phương án kết cấu và vật liệu được lựa chọn theo từng không gian chức năng.',points:['Hướng giải pháp: công trình dịch vụ.','Thiết kế theo công năng và trải nghiệm sử dụng.','Quan tâm đến bảo trì và vận hành sau bàn giao.']},
    'project-4': {label:'TG.04 / CÔNG NGHIỆP HÓA',title:'Tối ưu từng mét vuông',image:'project-4',copy:'Bộ ảnh minh họa một hướng tiếp cận xây dựng có cấu kiện đồng bộ. Các chi tiết lặp lại được chuẩn bị theo kế hoạch để tổ chức hiện trường thuận tiện.',points:['Hướng giải pháp: nhà ở lắp ghép.','Chuẩn hóa chi tiết nhưng thích ứng với công năng.','Phối hợp khâu chuẩn bị và lắp dựng.']},
  };
  document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
    const data = descriptions[button.dataset.detail];
    document.getElementById('detail-label').textContent = data.label;
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-copy').textContent = data.copy;
    const image = document.getElementById('detail-image');
    image.src = new URL(`${data.image}.webp`, assetBase).href;
    image.alt = `Hình minh họa: ${data.title}`;
    const points = document.getElementById('detail-points');
    points.replaceChildren(...data.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    document.getElementById('detail-note').textContent = 'Nội dung và ảnh minh họa phục vụ trình bày giao diện. Ảnh tham khảo từ Enerblock, không phải hồ sơ dự án đã thực hiện của TG Thang.';
    openDialog(detail, button);
  }));
  const track = document.getElementById('project-track');
  const previous = document.getElementById('projects-prev');
  const next = document.getElementById('projects-next');
  const all = document.getElementById('projects-all');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function updateProjects() {
    const expanded = track.classList.contains('show-all');
    previous.disabled = expanded || track.scrollLeft < 8;
    next.disabled = expanded || track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    const index = expanded ? 4 : Math.min(4, Math.round(track.scrollLeft / track.querySelector('.project').offsetWidth) + 1);
    document.getElementById('project-count').textContent = expanded ? '04 DỰ ÁN' : `${String(index).padStart(2,'0')} / 04`;
  }
  previous.addEventListener('click', () => track.scrollBy({left:-track.querySelector('.project').offsetWidth,behavior:reduced.matches ? 'instant' : 'smooth'}));
  next.addEventListener('click', () => track.scrollBy({left:track.querySelector('.project').offsetWidth,behavior:reduced.matches ? 'instant' : 'smooth'}));
  all.addEventListener('click', () => {
    const expanded = track.classList.toggle('show-all');
    all.setAttribute('aria-expanded', String(expanded));
    all.firstChild.textContent = expanded ? 'Thu gọn dự án ' : 'Xem tất cả dự án ';
    updateProjects();
  });
  track.addEventListener('scroll', updateProjects, {passive:true});
  new ResizeObserver(updateProjects).observe(track);
  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 100);
  window.addEventListener('scroll', updateHeader, {passive:true}); updateHeader();
  document.getElementById('consultation-form').addEventListener('submit', event => {
    event.preventDefault();
    const result = document.getElementById('contact-result');
    result.textContent = `Cảm ơn ${document.getElementById('contact-name').value.trim()}. Bạn đã hoàn thành trải nghiệm đăng ký mẫu. Đây là bản demo; thông tin chưa được gửi đi.`;
    result.focus({preventScroll:true});
  });
})();
