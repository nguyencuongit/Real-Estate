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

## Demo Khóa học (Lumi Academy)

Theme **Khóa học** được chuyển từ `F:\lumi-academy-demo`. Mở `/theme-preview/` để chọn giao diện, hoặc `/theme-preview/?theme=lumi-academy` để xem trực tiếp. Theme cũng có trong `/admin/theme/all` nếu muốn kích hoạt làm trang chủ.

Giao diện giữ cảnh 3D và các tương tác học thử; form đăng ký chỉ mô phỏng trên trình duyệt. Hướng dẫn chỉnh sửa nằm trong `platform/themes/lumi-academy/README.md`.

## Demo Giới thiệu xe ô tô (VANTA Revuelto)

Theme **Giới thiệu xe ô tô** từ `F:\revuelto-atelier-demo` có ở `/theme-preview/` và `/admin/theme/all`. Mở `/theme-preview/?theme=revuelto-atelier` để xem trực tiếp. Banner có nút **Xem xe 360°** với mô hình 3D thật, kéo xoay, zoom, tự động xoay và điều khiển bàn phím. Hướng dẫn nằm trong `platform/themes/revuelto-atelier/README.md`.

## Demo Công ty xây dựng — TG Thang

Theme **Công ty xây dựng — TG Thang** có tại `/theme-preview/?theme=tg-thang` và `/admin/theme/all`. Giao diện tiếng Việt tham khảo phong cách Enerblock: nền đỏ san hô, lưới kỹ thuật, ảnh công trình lớn, phần giải pháp và dự án. Có mô hình khung nhà 3D xoay/tách tầng, menu, chi tiết dự án và form tư vấn mẫu. Form không gửi hoặc lưu dữ liệu. Hướng dẫn và thông tin nguồn ảnh nằm trong `platform/themes/tg-thang/README.md`.

## Demo Làm đẹp — TG Thang

Theme **Làm đẹp** có tại `/theme-preview/?theme=lam-dep` và `/admin/theme/all`. Giao diện tiếng Việt tham khảo Ever với logo TG Thang riêng, tông nâu, video banner, gallery chạy ngang, ảnh chuyển động theo cuộn và các điểm chọn dịch vụ. Menu, chi tiết dịch vụ, FAQ và form đặt lịch mẫu có thể tương tác trực tiếp. Hướng dẫn và nguồn tư liệu nằm trong `platform/themes/lam-dep/README.md`.

## Demo Spa — TG Thang

Theme **Spa** có tại `/theme-preview/?theme=spa` và `/admin/theme/all`. Giao diện tiếng Việt tham khảo 7Sky / Liqium với ảnh mở vòng tròn, chữ ghép theo cuộn, các nhóm liệu trình dạng vòm, thẻ quà xoay 3D, ảnh liệu trình ghim theo cuộn và slider chuyên viên. Có chi tiết liệu trình, lightbox ảnh, FAQ và form đặt lịch mẫu trên trình duyệt. Hướng dẫn và nguồn tư liệu nằm trong `platform/themes/spa/README.md`.

## Demo Phòng gym — TG Thang

Theme **Phòng gym** có tại `/theme-preview/?theme=gym` và `/admin/theme/all`. Giao diện tiếng Việt tham khảo Flexova với logo TG Thang Fitness riêng, tông đen–đỏ, banner video, carousel dịch vụ kéo ngang, số đếm và huấn luyện viên chuyển theo cuộn. Có gói hội viên, lịch lớp, menu, FAQ và form tập thử mẫu. Hướng dẫn và nguồn tư liệu nằm trong `platform/themes/gym/README.md`.

## Demo Thời trang — TG Thang Atelier

Theme **Thời trang** có tại `/theme-preview/?theme=fashion` và `/admin/theme/all`. Giao diện tiếng Việt tham khảo AGNESTOTH: video điện ảnh, chữ serif lớn, hai bộ sưu tập chạy ngang theo cuộn, ảnh chi tiết đổi khi hover, thiết kế đặt riêng chuyển cảnh, túi video xoay 360° với sáu màu, gallery và wordmark cuối trang chuyển động. Logo TG Thang dùng chung với theme Làm đẹp. Có lightbox, danh sách yêu thích và lịch hẹn mẫu tại trình duyệt; hướng dẫn và nguồn tư liệu nằm trong `platform/themes/fashion/README.md`.
