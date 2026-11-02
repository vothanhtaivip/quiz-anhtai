# 🚀 Hệ Thống Khảo Thí Trực Tuyến & CMS v5.3 — ThanhTaiCoder

Hệ thống thi trắc nghiệm và tự luận trực tuyến với giao diện tối ưu được thiết kế theo ngôn ngữ Workflow Automation của **N8N** kết hợp bộ tiêu chuẩn **UX/UI Pro Max** và phông chữ Google Fonts **Be Vietnam Pro** (chuẩn mực thiết kế tiếng Việt hiện đại).

## 🌐 Tên Miền Chính Thức
- **Domain:** [https://vthanhtai.id.vn](https://vthanhtai.id.vn) (hoặc [https://vothanhtaivip.github.io/quiz-anhtai/](https://vothanhtaivip.github.io/quiz-anhtai/))

---

## ✨ Điểm Mới Nổi Bật Trên Phiên Bản v5.3 (Cập Nhật 2026)

### 1. 📚 Cập Nhật Toàn Bộ Bộ Đề Mới (119 Câu Trắc Nghiệm & 6 Câu Tự Luận)
- **Đồng bộ hóa 100% từ nguồn đề chuẩn `https://nguyenchuannam.n1.tinhgon.xyz`**:
  - Giải mã hoàn chỉnh thuật toán mã hóa đáp án `qHash` với salt bảo mật của hệ thống nguồn.
  - Bộ đề trắc nghiệm gồm **119 câu hỏi** phân bổ trên 4 chuyên đề cốt lõi:
    - *Website*: 28 câu
    - *Marketing công cụ tìm kiếm (SEO & Google Ads)*: 36 câu
    - *Marketing truyền thông xã hội (Social Media)*: 22 câu
    - *Email Marketing - CRM*: 33 câu
- **6 Câu Tự Luận Chuyên Sâu Mới Nhất**:
  1. *Phân tích vai trò của từ khóa (Keyword) trong hoạt động SEO. Doanh nghiệp cần lưu ý những gì khi nghiên cứu từ khóa?*
  2. *Những lợi ích và hạn chế của SEO so với quảng cáo trả phí trên công cụ tìm kiếm là gì?*
  3. *Trình bày các yếu tố ảnh hưởng đến thứ hạng website trên trang kết quả tìm kiếm của Google.*
  4. *Trình bày vai trò của Social Media Marketing trong việc xây dựng thương hiệu và tương tác với khách hàng.*
  5. *Những yếu tố nào tạo nên một nội dung thu hút và hiệu quả trong Social Media Marketing?*
  6. *Một doanh nghiệp có lượng truy cập website cao nhưng tỷ lệ chuyển đổi thấp. Hãy phân tích các nguyên nhân có thể xảy ra và đề xuất giải pháp cải thiện.*
- **Cấu hình thi chuẩn hóa**:
  - Trắc nghiệm: 45 câu ngẫu nhiên rút từ ngân hàng 119 câu.
  - Thời gian Phần 1: **35 phút** (30 giây/câu).
  - Tự luận (Phần 2): **20 phút**, giới hạn 25 - 200 từ.
  - Số lần thi: Tối đa **3 lần** cho mỗi thí sinh.

---

### 2. 🔐 Cơ Chế Bảo Mật & Mật Khẩu (Phòng Thi & Admin)
- **Tự động làm sạch & chuẩn hóa dữ liệu đầu vào**:
  - Tự động cắt bỏ dấu cách thừa (`.trim()`) ở đầu/cuối chuỗi do tính năng gợi ý/autocomplete của bàn phím gây ra.
  - Hỗ trợ so sánh **không phân biệt chữ hoa/thường** (`.toLowerCase()`), khắc phục hoàn toàn hiện tượng bàn phím điện thoại iPhone/Android tự động viết hoa chữ cái đầu tiên.
- **Bảo mật tuyệt đối**:
  - Ẩn toàn bộ mật khẩu khỏi placeholder (ví dụ) và thông báo lỗi.
  - Admin có thể thay đổi bất kỳ lúc nào trong tab **Mật Khẩu & Bảo Mật** của CMS.
- **Bổ sung nút Hiện/Ẩn mật khẩu (👁️)**:
  - Thêm nút con mắt bật/tắt hiển thị mật khẩu cho cả ô nhập mật khẩu phòng thi và ô đăng nhập Admin, giúp người dùng dễ dàng kiểm tra xem mình có gõ nhầm ký tự nào hay không.
- **Bổ sung thuộc tính chống tự động sửa trên thiết bị di động**:
  - `autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false"` trên tất cả các ô nhập liệu nhạy cảm.

---

## 🛠️ Hướng Dẫn Truy Cập & Quản Trị Hệ Thống

### Truy Cập Bảng Quản Trị (Admin CMS):
- **Cách 1:** Truy cập thẳng qua link: `https://vthanhtai.id.vn/#admin` hoặc `https://vthanhtai.id.vn/?admin`
- **Cách 2:** Bấm nhanh 3 lần liên tiếp vào logo **ThanhTaiCoder** ở thanh điều hướng trên cùng.
- **Cách 3:** Bấm vào biểu tượng ổ khóa 🔒 ở chân trang (Footer).
- **Cách 4:** Dùng phím tắt `Ctrl + Shift + A` (hoặc `Cmd + Shift + A` trên Mac).

### Mật Khẩu:
- Mật khẩu phòng thi và mật khẩu quản trị do Admin bảo mật thiết lập và cung cấp riêng cho học viên.
