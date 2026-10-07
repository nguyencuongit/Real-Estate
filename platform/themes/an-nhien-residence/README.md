# An Nhiên Residence — theme demo Botble

Giao diện được chuyển từ `F:\an-nhien-residence-demo`, giữ nguyên nội dung mẫu, CSS, hiệu ứng cuộn, thư viện ảnh và form đặt lịch tại chỗ. Trang chủ không cần dữ liệu dự án trong database; form không gửi hoặc lưu thông tin.

## Chọn giao diện

Vào **Quản trị → Giao diện → Giao diện**, chọn **Bất động sản → Kích hoạt**. Trang quản lý ở `/admin/theme/all`. Sau đó mở trang chủ `/` để demo.

Có thể kích hoạt từ PowerShell trong thư mục dự án:

```powershell
php artisan cms:theme:activate an-nhien-residence
```

Chọn Shofy trong cùng màn hình để quay lại giao diện cũ.

## Chỉnh sửa và kiểm tra

- Nội dung: `views/index.blade.php`.
- Styles và tương tác: `public/styles.css`, `public/script.js`, `public/motion.js`, `public/scroll-effects.js`.
- Ảnh, font, mặt bằng và thông tin nguồn/giấy phép: `public/assets/`.
- Ảnh xem trước trong quản trị: `screenshot.png`.

Sau khi chỉnh sửa tài nguyên, chạy:

```powershell
php artisan cms:theme:assets:publish an-nhien-residence
php artisan test --filter=AnNhienThemeTest
node --test platform/themes/an-nhien-residence/tests/motion.test.cjs
```

Theme dùng tài nguyên tĩnh có sẵn, không cần npm build. Nội dung và thông số của An Nhiên Residence là minh họa demo như bản nguồn.

`webpack.mix.js` đưa nguyên tài nguyên từ `public/` của theme sang `public/themes/an-nhien-residence/` khi build ở thư mục gốc dự án. Có thể build riêng theme bằng PowerShell:

```powershell
$env:npm_config_theme = 'an-nhien-residence'
npm run dev
# Hoặc npm run prod
Remove-Item Env:npm_config_theme
```

Hai dấu cộng trên banner ban ngày bám theo vị trí tòa căn hộ và biệt thự khi ảnh phóng to. Rê chuột hoặc dùng bàn phím để mở ảnh xem trước; nhấn để giữ ảnh, nhấn Escape hoặc chạm ra ngoài để đóng. Ảnh `hotspot-tower.webp` và `hotspot-villa.webp` được cắt từ `hero-day.webp`. Các điểm nằm ngoài phần ảnh hiển thị sẽ được ẩn; cảnh hoàng hôn dùng ảnh khác nên không hiển thị hai điểm này.
