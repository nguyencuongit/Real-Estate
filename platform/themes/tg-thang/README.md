# Công ty xây dựng — TG THANG

Theme demo tiếng Việt tham khảo bố cục tại https://enerblock.net/en/: đỏ san hô, lưới kỹ thuật, chữ đậm, ảnh lớn và các hàng giải pháp. Thương hiệu TG THANG, dự án và thông tin liên hệ là nội dung mẫu. Không có thay đổi cơ sở dữ liệu.

## Phạm vi và kiểm tra

- Chọn **Công ty xây dựng — TG Thang** tại `/theme-preview/` hoặc `/admin/theme/all`.
- Link trực tiếp: `/theme-preview/?theme=tg-thang`.
- Menu toàn màn hình, chi tiết giải pháp/dự án, hỏi đáp và form tư vấn mẫu hoạt động bằng chuột và bàn phím.
- Mô hình khung nhà 3D được dựng bằng hình học Three.js: kéo xoay, dùng phím mũi tên, thanh tách tầng và nút đặt lại. Chỉ khởi tạo khi gần vào màn hình, dừng khi ẩn; có bản vẽ SVG dự phòng.
- Form chỉ xác nhận mô phỏng trong trình duyệt, không gửi thông tin. Thông báo này hiển thị tại form.
- Nội dung mặc định luôn nhìn thấy; hiệu ứng chuyển động tôn trọng `prefers-reduced-motion`.
- Chữ quét theo từng dòng, câu tuyên ngôn sáng dần theo cuộn, ảnh parallax và đường tọa độ theo con trỏ. Menu mở có chuyển động lần lượt; nhãn nút cuộn khi hover.
- Video sản xuất tự phát khi vào màn hình (tắt tiếng), dừng ngoài màn hình và có nút phát/tạm dừng. File video nằm trong theme, không gọi dịch vụ ngoài lúc xem demo.
- Khối 3D ghim theo cuộn trên desktop/tablet: mặt bằng → phối cảnh → tách tầng → lắp lại. Kéo, phím hoặc thanh tách tầng chuyển sang điều khiển thủ công; nút đặt lại khôi phục chuyển động theo cuộn.
- Phần Giải pháp có nhãn hiện từng chữ, tiêu đề quét từng dòng, ảnh mở theo chiều dọc và parallax. Hiệu ứng chồng thẻ tính theo chiều cao thực tế và độ dài nội dung, kể cả preview thấp hơn 700px; chỉ chuyển về luồng đọc thường khi thẻ không đủ chỗ hoặc trên điện thoại. Khi giảm chuyển động, bỏ ghim và hiệu ứng cuộn.
- Kiểm tra responsive ở 320, 768, 1024 và 1440px, preview/admin và các tương tác chính.

## Cấu trúc và build

`views/index.blade.php` là trang chính; `views/partials/` chứa các khối nội dung; `public/styles.css` và `public/script.js` điều khiển giao diện. `src/building.js` dựng mô hình, `src/motion.js` điều khiển hiệu ứng, `src/solutions-motion.js` điều khiển phần Giải pháp và `src/motion-state.mjs` tính trạng thái theo cuộn. Các asset và thông tin nguồn nằm trong `public/assets/`.

```powershell
$env:npm_config_theme = 'tg-thang'
npm run dev
Remove-Item Env:npm_config_theme
php artisan test --filter=ConstructionThemeTest
node --test platform/themes/tg-thang/tests/motion.test.mjs
```

Nếu sửa mô hình, build bundle với Three.js 0.180.0 / esbuild 0.25.10 đã có trong dự án demo xe:

```powershell
$env:CONSTRUCTION_NODE_MODULES = 'F:\revuelto-atelier-demo\node_modules'
node platform/themes/tg-thang/tasks/build.cjs
Remove-Item Env:CONSTRUCTION_NODE_MODULES
php artisan cms:theme:assets:publish tg-thang
```

Giữ cách viết theme đơn giản: Blade + CSS + JavaScript, không bổ sung thư viện giao diện hoặc dịch vụ ngoài. Các hình công trình là hình tham khảo từ Enerblock, không phải dự án thật của TG THANG; chi tiết dự án ghi rõ đây là hình minh họa. Xem `public/assets/SOURCES.md`.
