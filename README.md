# core-hisotech

## Chạy local trên Windows

Yêu cầu: PHP 8.3 với các extension trong composer.json, Composer, Node.js 22 và MySQL 8. Máy hiện tại dùng PHP/MySQL của Laragon.

Cấu hình local nằm trong .env (không đưa vào Git):

- Website: http://127.0.0.1:8000
- Quản trị: http://127.0.0.1:8000/admin
- MySQL: 127.0.0.1:3306, database real_estate_local
- Database đã được nhập từ C:\Users\giang\Downloads\core.sql.

Sau khi bật MySQL trong Laragon, mở PowerShell:

```powershell
Set-Location F:\Real-Estate
php artisan serve --host=127.0.0.1 --port=8000
```

Giữ terminal mở khi chạy; nhấn Ctrl+C để dừng.

Khi cần cài lại thư viện hoặc build assets:

```powershell
composer install --no-interaction --prefer-dist
npm ci
php artisan cms:publish:assets
npm run dev
```

npm run dev build assets một lần; dùng npm run watch khi sửa giao diện. Không chạy composer setup, migrate:fresh hoặc seed lại trên database đã nhập vì có thể thay đổi dữ liệu hiện có. File SQL không chứa ảnh tải lên; các file media cần được khôi phục riêng vào storage/app/public.

## Demo An Nhiên Residence

Theme An Nhiên Residence đã được thêm vào `platform/themes/an-nhien-residence` và được chọn cho trang chủ local. Vào **Quản trị → Giao diện → Giao diện** tại `/admin/theme/all` để chọn **Bất động sản** hoặc quay lại Shofy.

Theme giữ giao diện, ảnh và nội dung mẫu từ `F:\an-nhien-residence-demo`; form đặt lịch chỉ chạy tại trình duyệt. Hướng dẫn chỉnh sửa và publish assets nằm trong `platform/themes/an-nhien-residence/README.md`. Môi trường local dùng `APP_DEBUG=false` để không hiện thanh debug khi demo khách hàng.

## Demo Lumi Academy

Theme **Lumi Academy** được chuyển từ `F:\lumi-academy-demo`. Mở `/theme-preview/` để chọn giao diện, hoặc `/theme-preview/?theme=lumi-academy` để xem trực tiếp. Theme cũng có trong `/admin/theme/all` nếu muốn kích hoạt làm trang chủ.

Giao diện giữ cảnh 3D và các tương tác học thử; form đăng ký chỉ mô phỏng trên trình duyệt. Hướng dẫn chỉnh sửa nằm trong `platform/themes/lumi-academy/README.md`.
