(function(root) {
  const plans = {
    foundation: {name:'Web 3D Foundation', price:1490000, lessons:32, hours:14},
    motion: {name:'Motion & Shaders', price:1290000, lessons:24, hours:10},
    bundle: {name:'Creative Developer Bundle', price:2290000, lessons:56, hours:24}
  };
  const modules = [
    {title:'Chào thế giới 3D.', tag:'NỀN TẢNG', count:8, hours:'3 giờ', description:'Từ một trang web trống đến cảnh 3D đầu tiên. Làm quen với không gian, camera và vòng lặp render.', lessons:['Không gian 3D & hệ tọa độ','Góc nhìn & hình khối','Cho hình khối chuyển động','Geometry: tạo hình từ con số','Camera & góc nhìn','Thay đổi vị trí, tỷ lệ, góc xoay','Vòng lặp hoạt ảnh','Đưa một cảnh lên website']},
    {title:'Cho ý tưởng một hình hài.', tag:'THIẾT KẾ', count:8, hours:'4 giờ', description:'Khám phá vật liệu, màu sắc, ánh sáng và bóng đổ. Biến hình khối đơn giản thành một căn phòng của riêng bạn.', lessons:['Bảng màu & ngôn ngữ hình khối','Material & bề mặt','Ánh sáng trong cảnh','Bóng đổ mềm','Texture & UV','Bố cục một căn phòng','Mô hình với Blender','Dự án: góc sáng tạo']},
    {title:'Một thế giới biết phản hồi.', tag:'TƯƠNG TÁC', count:8, hours:'4 giờ', description:'Kéo để xoay, rê để khám phá và chạm để lựa chọn. Thiết kế chuyển động với mục đích rõ ràng.', lessons:['Điều khiển camera','Con trỏ & raycasting','Chọn vật thể','Chuyển động theo cuộn','Chuyển cảnh','Âm thanh & phản hồi','Trải nghiệm trên điện thoại','Dự án: phòng triển lãm']},
    {title:'Từ thử nghiệm đến portfolio.', tag:'THỰC HÀNH', count:8, hours:'3 giờ', description:'Sắp xếp code, tối ưu tài nguyên và hoàn thiện một trải nghiệm web có thể chia sẻ.', lessons:['Tổ chức dự án','Tải model GLTF','Trạng thái tải','Tối ưu geometry','Giới hạn chất lượng render','Khả năng tiếp cận','Đưa dự án lên mạng','Dự án: portfolio tương tác']},
    {title:'Viết nên những chuyển động.', tag:'MOTION', count:12, hours:'5 giờ', description:'Tìm hiểu nhịp, độ trễ và các hệ hạt. Kết hợp animation với nội dung để dẫn dắt người xem.', lessons:['Nhịp điệu trong chuyển động','Easing & damping','Hệ hạt đầu tiên','Quỹ đạo & đường cong','Hiệu ứng con trỏ','Hoạt ảnh theo thời gian','Chuyển động theo cuộn nâng cao','Biến đổi hình khối','Mô phỏng sóng','Màu theo thời gian','Dự án: dải thiên hà','Hoàn thiện tương tác']},
    {title:'Những bề mặt đầy bất ngờ.', tag:'SHADERS', count:12, hours:'5 giờ', description:'Tạo vật liệu bằng shader: những dải màu, mặt nước và các chuyển động không có sẵn.', lessons:['Shader làm gì?','Vertex & fragment','Uniform & varying','Màu và gradient','Họa tiết procedural','Noise','Làm biến dạng bề mặt','Mặt nước chuyển động','Hologram','Kết hợp ánh sáng','Dự án: thế giới trừu tượng','Hoàn thiện & tối ưu']}
  ];
  const wrapIndex = (index, length) => ((index % length) + length) % length;
  const sceneProgress = (position, top, distance) => distance > 0 ? Math.max(0,Math.min(1,(position-top)/distance)) : 0;
  const projectProgress = (position, top, height, stageHeight, header) => sceneProgress(position+header,top,height-stageHeight);
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const lessonTotal = items => items.reduce((sum,item) => sum+item.count,0);
  const api = {plans, modules, wrapIndex, sceneProgress, projectProgress, validEmail, lessonTotal};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LumiCourse = api;
})(typeof window !== 'undefined' ? window : this);
