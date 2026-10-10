# Phòng gym — TG Thang

Theme demo tiếng Việt tham khảo bố cục và chuyển động của Flexova. Logo TG Thang Fitness được dựng riêng bằng SVG.

- Preview: `/theme-preview/?theme=gym`.
- Quản trị: `/admin/theme/all` → **Phòng gym**.
- Trang độc lập để kiểm tra: `/theme-preview/demo/gym`.
- Không tự kích hoạt hoặc thay đổi theme đang dùng.

Banner video chạy từ file local. Carousel dịch vụ hỗ trợ kéo, vuốt, nút và bàn phím. Trên desktop, ảnh và thông tin huấn luyện viên chuyển theo cuộn trong vùng ghim. Điện thoại, cửa sổ thấp hoặc chế độ giảm chuyển động hiển thị đầy đủ các huấn luyện viên theo chiều dọc. Có số đếm, hiệu ứng xuất hiện, menu, lịch lớp, FAQ và nút tạm dừng chuyển động.

Phần dưới có tiêu đề đổi sắc từng từ theo cuộn, thẻ gói tập nâng/nghiêng và đếm giá, dải bộ môn chạy liên tục, lộ trình ghim rồi trượt ngang với nút chọn bước, ảnh dịch chuyển nhẹ, nền chữ ở phần cảm nhận và chữ TG THANG chạy phía sau khối đăng ký. `lower-motion.js` dùng chung vòng vẽ và trạng thái tạm dừng của `script.js`; `lower-motion.css` giữ các nội dung hiển thị đầy đủ khi tắt hiệu ứng. Trên mobile hoặc cửa sổ thấp, lộ trình trở lại dạng danh sách dọc.

Form tập thử và nhận tin chỉ xử lý trên trình duyệt; không gửi request, email, thanh toán hoặc lưu thông tin. Tên huấn luyện viên, số liệu, cảm nhận, gói tập, giá, địa chỉ và lịch lớp đều là nội dung minh họa.

## Chỉnh sửa và build

Nội dung nằm trong `views/partials`; CSS và JS nằm trong `public`. `motion-state.js` chứa các phép tính chuyển động có thể kiểm tra độc lập.

```powershell
$env:npm_config_theme='gym'
npm run dev
Remove-Item Env:npm_config_theme
php artisan cms:theme:assets:publish gym
php artisan test --filter=GymThemeTest
node --test platform/themes/gym/tests/motion-state.test.cjs
```

`webpack.mix.js` sao chép tài nguyên sang `public/themes/gym` như các theme demo khác. Asset CSS/JS có hash phiên bản để tránh cache bản cũ. `screenshot.png` là ảnh chụp giao diện thực tế dùng trong danh sách theme. Xem `SOURCES.md` về tư liệu ảnh, video và font.
