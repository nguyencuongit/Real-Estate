# Làm đẹp — TG Thang

Theme demo tiếng Việt tham khảo bố cục và chuyển động của [Ever](https://www.ever.co.id/): tông nâu ấm, chữ serif, video toàn màn hình, gallery ảnh vuông kéo ngang với góc nghiêng/parallax thay đổi theo vị trí, sáu ảnh chất liệu chạy qua cảnh ghim, điểm chọn dịch vụ, video chăm sóc, FAQ và menu toàn màn hình. Phần không gian ghim ảnh, phóng từ 20% lên toàn màn hình rồi đưa khung nội dung vào; cuộn ngược đảo lại tiến trình. Chữ xuất hiện lần lượt và ảnh mở từ tâm khi đi vào màn hình.

Logo hoa và chữ TG THANG được thiết kế riêng trong `public/assets/logo.svg`; favicon trong `public/assets/favicon.svg`. Nội dung dịch vụ được quản lý ở `data/services.php`.

## Xem và chọn theme

- Xem demo: `/theme-preview/?theme=lam-dep`.
- Chọn **Làm đẹp** trong `/theme-preview/` hoặc **Quản trị → Giao diện → Giao diện** (`/admin/theme/all`).
- Không cần nhập dữ liệu hoặc đổi database. Preview không đổi theme đang hoạt động.

## Assets và build

```powershell
$env:npm_config_theme='lam-dep'
npm run dev
php artisan cms:theme:assets:publish lam-dep
```

`webpack.mix.js` copy assets từ `public` của theme sang `public/themes/lam-dep`. CSS/JavaScript khi chạy không cần thư viện ngoài. Motion được đóng gói thành một script thường, không yêu cầu server cấu hình MIME cho ES modules. URL CSS/JS có hash nội dung để bản sửa mới không bị giữ bởi cache cũ. Ảnh WebP, video MP4 và font được lưu nội bộ. Nguồn ảnh/video nằm ở `public/assets/SOURCES.md`; font Manrope và Lora dùng giấy phép OFL đi kèm. Script `tasks/download-assets.py` dùng Python/Pillow để chuẩn bị lại ảnh tham khảo khi cần.

Khi sửa `src/motion.js`, `src/gallery-motion.js`, `src/reveal-motion.js` hoặc `public/motion-state.mjs`, build bundle trước khi publish:

```powershell
$env:BEAUTY_NODE_MODULES = 'F:\revuelto-atelier-demo\node_modules'
node platform/themes/lam-dep/tasks/build.cjs
Remove-Item Env:BEAUTY_NODE_MODULES
php artisan cms:theme:assets:publish lam-dep
```

Máy local đang có esbuild trong dự án demo xe; trên máy khác trỏ `BEAUTY_NODE_MODULES` tới thư mục chứa esbuild. Theme đã kèm bundle hoàn chỉnh nên không cần build lại để chạy demo.

Các ảnh/video tham khảo dùng cho bản trình diễn theo yêu cầu. Khi dùng thương hiệu thật, thay chúng bằng tư liệu của công ty có quyền sử dụng.

## Tương tác

- Rê chuột hoặc dùng bàn phím tại điểm dịch vụ để xem ảnh, bấm để mở chi tiết. Trên điện thoại bấm trực tiếp; danh sách luôn có đủ sáu dịch vụ.
- Điểm được tính theo tọa độ ảnh gốc và phần cắt `object-fit: cover`, nên bám đúng đặc điểm khi đổi màn hình.
- Form đặt lịch chỉ hiển thị xác nhận trên trình duyệt. Không gửi, lưu hoặc tạo lịch thật.
- Video chỉ tự phát khi đang xuất hiện trên màn hình. Có nút tạm dừng chuyển động, điều khiển video và hỗ trợ `prefers-reduced-motion`.
- Nội dung mặc định luôn hiển thị; hiệu ứng không giữ FAQ hay văn bản ở trạng thái mờ.

## Kiểm tra

```powershell
php artisan test --filter=BeautyThemeTest
node --test platform/themes/lam-dep/tests/motion.test.mjs
```
