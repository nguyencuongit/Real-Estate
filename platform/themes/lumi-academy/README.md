# Khóa học — theme demo Lumi Academy cho Botble

Giao diện được chuyển từ `F:\lumi-academy-demo`, gồm cảnh 3D, hiệu ứng cuộn, lộ trình, bài học thử và form đăng ký mẫu. Form chỉ hiển thị kết quả trong trình duyệt, không lưu dữ liệu hoặc thanh toán thật.

## Xem và chọn giao diện

Mở `/theme-preview/`, chọn **Khóa học**. Có thể mở trực tiếp `/theme-preview/?theme=lumi-academy` hoặc `/theme-preview/demo/lumi-academy`. Xem thử không thay đổi theme đang kích hoạt cho trang chủ.

Để dùng Lumi làm trang chủ, vào `/admin/theme/all`, chọn **Khóa học → Kích hoạt**.

## Chỉnh sửa

- `views/index.blade.php`: nội dung, các đường dẫn tài nguyên dùng `Theme::asset()->url()`.
- `public/styles.css`, `public/app.js`, `public/course-data.js`: bố cục và tương tác.
- `public/scene.js`: mã nguồn cảnh 3D; `public/assets/scene.bundle.js`: bản dựng sẵn chạy trong trình duyệt.
- `public/assets/`: logo, font, bundle và giấy phép từ bản nguồn.
- `screenshot.png`: ảnh đại diện ở admin.

Theme chạy bằng các tài nguyên cục bộ, không cần npm build khi xem demo. Nếu sửa `scene.js`, dựng bundle ở dự án nguồn theo README của dự án đó rồi chép bundle mới vào theme.

`webpack.mix.js` được cấu hình để đưa nguyên tài nguyên từ `public/` của theme sang `public/themes/lumi-academy/` khi build ở thư mục gốc dự án. Có thể build riêng theme bằng PowerShell:

```powershell
$env:npm_config_theme = 'lumi-academy'
npm run dev
# Hoặc npm run prod
Remove-Item Env:npm_config_theme
```

Danh sách câu hỏi ở phần 6 hiển thị rõ ngay khi vào vùng nhìn, không dùng hiệu ứng làm mờ theo cuộn; các câu trả lời vẫn mở/đóng khi chọn câu hỏi.

Sau khi sửa tài nguyên:

```powershell
php artisan cms:theme:assets:publish lumi-academy
php artisan test --filter=LumiAcademyThemeTest
node --test platform/themes/lumi-academy/tests/course.test.cjs
```
