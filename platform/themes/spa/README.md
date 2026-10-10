# Spa — TG Thang

Theme demo tiếng Việt tham khảo bố cục và chuyển động của [7Sky / Liqium](https://7sky.liqium.com/). Logo, tên thương hiệu, thẻ quà và nội dung được thiết kế riêng cho TG Thang.

Xem tại `/theme-preview/?theme=spa`, hoặc chọn **Spa** trong `/admin/theme/all`. Preview không kích hoạt hoặc đổi theme đang dùng của website.

## Tương tác

- Banner ghép chữ khi cuộn, mở ảnh chân dung qua mặt nạ vòng tròn và hiện lời mời đặt lịch.
- Tiêu đề mở lần lượt từng ký tự, giữ nguyên dấu tiếng Việt và nhãn đọc cho trình đọc màn hình.
- Ba nhóm liệu trình dạng vòm; di chuột hoặc focus bằng bàn phím để mở ảnh, bấm để xem chi tiết.
- Hai thẻ quà xoay trong không gian 3D và nền vòm mở theo cuộn; thẻ dùng nhận diện TG Thang.
- Các liệu trình nổi bật ghim khung nhìn, mở ảnh theo cuộn; nút 01/02/03 chuyển trực tiếp đến từng liệu trình.
- Slider chuyên viên hỗ trợ kéo chuột, vuốt cảm ứng, nút và phím mũi tên; ảnh không gian có lightbox.
- Menu di động, FAQ và form đặt lịch mẫu. Form không gọi API, không gửi hoặc lưu thông tin.
- Nút góc dưới phải tạm dừng chuyển động. `prefers-reduced-motion` dùng bố cục tĩnh, vẫn đọc được mọi liệu trình.
- Màn hình cao tối đa 620px dùng các liệu trình xếp dọc và thẻ quà không ghim, tránh cắt nội dung.

## Sửa và build

Nội dung nằm trong `views/partials/`, CSS trong `public/styles.css`, tương tác trong `public/script.js`. `public/motion-state.js` chứa các phép tính tiến độ cuộn dùng chung với test.

```powershell
Set-Location F:\Real-Estate
$env:npm_config_theme = 'spa'
npm run dev
Remove-Item Env:npm_config_theme
php artisan cms:theme:assets:publish spa
php artisan test --filter=SpaThemeTest
node --test platform/themes/spa/tests/motion.test.cjs
```

`webpack.mix.js` copy các asset tĩnh theo cách các theme demo khác đang dùng. CSS/JS được gắn phiên bản bằng hash nội dung để tránh cache bản cũ. `screenshot.png` là ảnh chụp theme thực tế cho danh sách giao diện.

Mức giá, địa chỉ, thông tin chuyên viên và liệu trình là nội dung minh họa; form chỉ phục vụ demo khách hàng. Nguồn tư liệu và giấy phép font nằm trong `SOURCES.md` và `public/assets/`.
