# 🚀 Hệ Thống Khảo Thí Trực Tuyến & CMS v5.2 Final — ThanhTaiCoder

Hệ thống thi trắc nghiệm và tự luận trực tuyến với giao diện tối ưu được thiết kế theo ngôn ngữ Workflow Automation của **N8N** kết hợp bộ tiêu chuẩn **UX/UI Pro Max** và phông chữ Google Fonts **Be Vietnam Pro** (chuẩn mực thiết kế tiếng Việt hiện đại).

## 🌐 Tên Miền Chính Thức
- **Domain:** [https://vthanhtai.id.vn](https://vthanhtai.id.vn) (hoặc [https://vothanhtaivip.github.io/quiz-anhtai/](https://vothanhtaivip.github.io/quiz-anhtai/))

## ✨ Tính Năng Nâng Cấp Vượt Trội (v5.2 Final)

1. **🔤 Phông Chữ Be Vietnam Pro**:
   - Sử dụng phông chữ Google Fonts `Be Vietnam Pro` chuẩn mực cho tiếng Việt (độ đậm 300 đến 900).
   - Tối ưu hiển thị các dấu câu tiếng Việt (sắc, huyền, hỏi, ngã, nặng) không bị vỡ hoặc lệch dòng.
   - Kết hợp `JetBrains Mono` cho các thông số đồng hồ, combo và mã sinh viên.

2. **📊 CMS Xem Lại Kết Quả Học Viên**:
   - Tab quản trị `Kết Quả Học Viên` thống kê chi tiết toàn bộ bài nộp của thí sinh.
   - 4 thẻ KPI tổng quan: Tổng thí sinh, Điểm trung bình, Điểm cao nhất, Tỷ lệ đạt (&ge; 5.0đ).
   - Bảng kết quả: Mã SV, Họ Tên, Điểm Trắc Nghiệm, Thang 10, Đúng/Sai, Trạng thái Tự Luận, Thời gian nộp.
   - Modal xem chi tiết từng bài thi và nội dung tự luận hoàn chỉnh của học viên.
   - Nút **Xuất File Excel (CSV)** với chuẩn UTF-8 BOM hiển thị chuẩn tiếng Việt trên Microsoft Excel.

3. **🔒 Giới Hạn Số Lần Thi (Tối Đa 1 Lần)**:
   - Mỗi thí sinh chỉ được tham gia làm bài **duy nhất 1 lần**.
   - Khi nhập Mã SV hoặc Họ Tên đã có bài nộp trong hệ thống, hệ thống lập tức khóa quyền làm bài và hiển thị modal thông báo điểm số đã ghi nhận.
   - Admin có quyền reset/xóa bài nộp trong CMS nếu cho phép học viên thi lại.

4. **🕵️ Ẩn Giao Diện Admin Đối Với Học Viên**:
   - Nút Admin nổi ở góc màn hình được ẩn hoàn toàn đối với học sinh thông thường.
   - **Cách truy cập Admin CMS**:
     - Thêm `?admin` hoặc `#admin` vào URL (Ví dụ: `https://vthanhtai.id.vn/?admin`).
     - Bấm nhanh 3 lần liên tiếp vào logo **ThanhTaiCoder** ở thanh điều hướng trên cùng.
     - Phím tắt bàn phím: `Ctrl + Shift + A` (hoặc `Cmd + Shift + A`).
     - Biểu tượng ổ khóa bí mật 🔒 ở cuối trang (footer).

5. **🔑 Mật Khẩu Phòng Thi Do Admin Thiết Lập (Không Có Bypass)**:
   - Quy chế mới: Học sinh bắt buộc phải có mật khẩu phòng thi do Thầy ThanhTaiCoder cấp mới được vào thi.
   - Admin dễ dàng thay đổi mật khẩu phòng thi trong tab **Mật Khẩu** của CMS.

6. **🔥 Hiệu Ứng Audiophile & Visual FX Khi Làm Bài**:
   - **Đúng liên tiếp (Combo)**:
     - Kích hoạt biểu tượng lửa combo động, âm thanh arpeggio hợp âm thăng hoa.
     - Vệt sáng lửa phát quang quanh viền màn hình và bảng banner chúc mừng.
   - **Sai liên tiếp (Penalty)**:
     - Viền màn hình chuyển sang hiệu ứng đỏ cảnh báo (Danger Vignette).
     - Rung lắc thẻ câu hỏi và phát âm thanh còi cảnh báo tần số kép.
     - Hiển thị mức phạt điểm trừ tương ứng.

7. **📱 Tối Ưu Hóa Tuyệt Đối Cho Điện Thoại (Mobile Responsive)**:
   - Hỗ trợ mượt mà trên iPhone (iOS Safari) và các thiết bị Android.
   - Nút bấm to bản tối thiểu 52px, dễ dàng thao tác bằng ngón tay.
   - Ngăn chặn triệt để tình trạng bàn phím tự động phóng to (zoom-in) trên iOS bằng font-size chuẩn 16px.
   - Mở khóa âm thanh Web Audio API ngay từ lần chạm đầu tiên trên màn hình cảm ứng.
   - Tích hợp rung phản hồi xúc giác (Haptic Feedback) trên các dòng điện thoại hỗ trợ.

8. **🧹 Màn Hình Kết Quả Tối Giản & Chuyên Nghiệp**:
   - Loại bỏ hoàn toàn câu hỏi và nút "Chơi lại", không gây chồng chéo hoặc xao nhãng.
   - Thay thế bằng thẻ chứng nhận kết quả chính thức đã lưu vào hệ thống khảo thí.
   - Nút dẫn trực tiếp sang **Phần Tự Luận (Phần 2)** hoặc **Xem Lại Đáp Án**.

## 👤 Chủ Sở Hữu & Tác Quyền
- **ThanhTaiCoder**
- Email: `vothanhtao68@gmail.com`
- Tên miền: `vthanhtai.id.vn`
