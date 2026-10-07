# Giới thiệu xe ô tô — theme VANTA Revuelto

Giao diện được chuyển từ `F:\revuelto-atelier-demo`, gồm cảnh camera theo cuộn, mô hình xe thật, màu xe, gallery và form bản phối mẫu. Form chỉ chạy trong trình duyệt, không gửi hoặc lưu dữ liệu.

## Xem giao diện

Vào `/theme-preview/` và chọn **Giới thiệu xe ô tô**. Link trực tiếp: `/theme-preview/?theme=revuelto-atelier`. Theme cũng có ở `/admin/theme/all` nếu muốn kích hoạt làm trang chủ.

Ở banner, chọn **Xem xe 360°**. Kéo bằng chuột hoặc một ngón tay để xoay, cuộn/chụm hai ngón hoặc dùng các nút +/− để zoom. Có tự động xoay, thanh góc xoay, góc mặc định, phím mũi tên và Home; Escape đóng cửa sổ. Khung 360° dùng cùng mô hình và renderer với cảnh chính, không tải xe lần thứ hai. Mô hình khoảng 20.8 MB nên các nút điều khiển bật sau khi tải xong. Khi không có WebGL/tải lỗi, giao diện hiển thị ảnh và trạng thái dự phòng.

## Chỉnh sửa và build

- `views/index.blade.php`: trang demo và cửa sổ 360°.
- `public/orbit-viewer.js`: chuột, chạm, bàn phím và tự động xoay.
- `public/motion.js`: camera theo cuộn và toán học xoay 360°.
- `src/vehicle-3d.js`: tải mô hình, camera và renderer Three.js.
- `public/assets/`: mô hình, ảnh, font và thông tin nguồn/giấy phép.
- `webpack.mix.js`: đưa tài nguyên tĩnh vào `public/themes/revuelto-atelier/`.

Bundle 3D đã dựng sẵn. Nếu sửa renderer, dùng Three.js 0.180.0 và esbuild 0.25.10 đã cài ở dự án nguồn:

```powershell
$env:VANTA_NODE_MODULES = 'F:\revuelto-atelier-demo\node_modules'
node platform/themes/revuelto-atelier/tasks/build.cjs
Remove-Item Env:VANTA_NODE_MODULES
php artisan cms:theme:assets:publish revuelto-atelier
```

Build/publish bằng Mix từ thư mục gốc:

```powershell
$env:npm_config_theme = 'revuelto-atelier'
npm run dev
Remove-Item Env:npm_config_theme
```

Kiểm tra:

```powershell
php artisan test --filter=RevueltoThemeTest
node --test platform/themes/revuelto-atelier/tests/*.test.cjs
```

Nguồn mô hình Lamborghini và giới hạn sử dụng demo cục bộ nằm tại `public/assets/models/SOURCE.md`. Giấy phép Three.js và font được giữ trong `public/assets/`.
