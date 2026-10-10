# Thời trang — TG Thang Atelier

Theme demo độc lập lấy bố cục/nhịp chuyển động tham khảo từ https://agnestoth.com/, nội dung tiếng Việt và logo TG Thang dùng chung với theme Làm đẹp.

## Xem và chọn

- `/theme-preview/?theme=fashion`: xem trong bộ chọn giao diện.
- `/theme-preview/demo/fashion`: xem toàn màn hình.
- `/admin/theme/all`: tên hiển thị **Thời trang**.
- Xem thử không thay đổi theme đang kích hoạt và không cần dữ liệu sản phẩm.

## Trải nghiệm

Video điện ảnh; chữ tách theo ký tự tiếng Việt; nội dung tô màu theo cuộn; hai bộ sưu tập ngang được giữ trên màn hình khi cuộn ở desktop; ảnh chi tiết đổi khi hover/focus; ảnh atelier chuyển cảnh; ảnh editorial parallax; túi video xoay 360° với sáu màu, kéo chuột/chạm hoặc dùng nút xoay; thẻ bộ sưu tập có video khi hover/focus; gallery chạy ngang; wordmark cuối trang chuyển động.

Desktop bổ sung cảnh ghim toàn màn hình, ảnh danh mục phóng từ 60% lên 100% và rõ dần từ nhòe, bộ sưu tập mở bằng mặt nạ chuyển sắc, cảnh editorial chuyển bằng lớp che ngang. Tiêu đề hiện từng từ, ảnh đặt riêng đổi bằng màn che, ảnh thế giới/di sản mở dần và chữ cuối trang hiện theo cuộn. Cuộn chuột có quán tính; liên kết và phím Tab đưa đến cảnh đã mở đầy đủ. Phần chuyển cảnh nằm trong `cinematic.js`/`cinematic.css`, dùng chung hàm tiến độ trong `motion-math.js`.

Trên điện thoại hoặc màn hình thấp hơn 680px, các cảnh dùng bố cục tự nhiên; bộ sưu tập trên điện thoại trở thành hàng kéo ngang. Nút tạm dừng và `prefers-reduced-motion` chuyển sang bố cục tĩnh. Ảnh/video lưu cục bộ, video chỉ phát khi ở trong vùng nhìn thấy; ẩn tab sẽ dừng video. Chi tiết nguồn ảnh và giấy phép font xem [SOURCES.md](SOURCES.md).

Video xoay dùng `/theme-preview/media/fashion/spinner-[1-6].mp4`, phục vụ bằng `BinaryFileResponse` để hỗ trợ HTTP byte ranges cả trên máy chủ PHP local. Điều này cho phép nút xoay và kéo chuột tìm đúng khung hình. Đường dẫn chỉ nhận sáu tên video được cho phép, không nhận đường dẫn file tùy ý.

Xem ảnh, đổi góc túi, lưu/bỏ thiết kế yêu thích, menu, hướng dẫn bảo quản và lịch hẹn đều hoạt động. Danh sách yêu thích chỉ ở bộ nhớ của trang; biểu mẫu chỉ hiển thị phản hồi demo, không gửi email, tạo đơn hàng hay lưu dữ liệu.

## Build

```powershell
$env:npm_config_theme = 'fashion'
npm run dev
Remove-Item Env:npm_config_theme
php artisan cms:theme:assets:publish fashion
```

`webpack.mix.js` sao chép tài nguyên theo quy ước theme hiện có. Hash nội dung trên CSS/JS tránh cache cũ khi thay đổi file.

## Kiểm tra

```powershell
php artisan test --filter=FashionThemeTest
node --test tests/Unit/FashionMotionMath.test.cjs
```

PHP kiểm tra hiển thị trong bộ chọn/admin, tài nguyên cục bộ, giữ theme đang dùng và phản hồi video 206 đúng giới hạn byte; tên file không được phép trả 404. Node kiểm tra giới hạn cuộn ngang, tiến độ vào/ra cảnh, trường hợp chiều cao thấp và vòng xoay video tại hai đầu thời lượng.
