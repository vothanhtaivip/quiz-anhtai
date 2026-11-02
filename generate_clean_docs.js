const fs = require('fs');
const path = require('path');

const qs = JSON.parse(fs.readFileSync(path.join(__dirname, 'default_questions.json'), 'utf8'));
const letters = ['A', 'B', 'C', 'D'];

const essays = [
  "Phân tích vai trò của từ khóa (Keyword) trong hoạt động SEO. Doanh nghiệp cần lưu ý những gì khi nghiên cứu từ khóa?",
  "Những lợi ích và hạn chế của SEO so với quảng cáo trả phí trên công cụ tìm kiếm là gì?",
  "Trình bày các yếu tố ảnh hưởng đến thứ hạng website trên trang kết quả tìm kiếm của Google.",
  "Trình bày vai trò của Social Media Marketing trong việc xây dựng thương hiệu và tương tác với khách hàng.",
  "Những yếu tố nào tạo nên một nội dung thu hút và hiệu quả trong Social Media Marketing?",
  "Một doanh nghiệp có lượng truy cập website cao nhưng tỷ lệ chuyển đổi thấp. Hãy phân tích các nguyên nhân có thể xảy ra và đề xuất giải pháp cải thiện."
];

let md = '# 📚 TOÀN BỘ 119 CÂU HỎI TRẮC NGHIỆM & 6 CÂU TỰ LUẬN KÈM ĐÁP ÁN VÀ GIẢI THÍCH CHI TIẾT (CHUẨN 2026)\n\n';
md += '> **Nguồn gốc đề thi**: Giải mã 100% từ hệ thống khảo thí trực tuyến https://nguyenchuannam.n1.tinhgon.xyz\n';
md += '> **Bổ sung độc quyền**: Đáp án chính xác tuyệt đối + Lời giải thích ngắn gọn, súc tích 1-2 câu cho từng câu hỏi.\n\n';

const topics = [
  { key: 'Website', title: 'CHỦ ĐỀ WEBSITE (25 CÂU CƠ BẢN + 3 CÂU MỞ RỘNG)' },
  { key: 'Marketing công cụ tìm kiếm', title: 'CHỦ ĐỀ MARKETING CÔNG CỤ TÌM KIẾM - SEO & SEM (36 CÂU)' },
  { key: 'Marketing truyền thông xã hội', title: 'CHỦ ĐỀ MARKETING TRUYỀN THÔNG XÃ HỘI - SOCIAL MEDIA (22 CÂU)' },
  { key: 'Email Marketing - CRM', title: 'CHỦ ĐỀ EMAIL MARKETING & CRM (33 CÂU)' }
];

topics.forEach((t, tIdx) => {
  md += `## PHẦN ${tIdx + 1}: ${t.title}\n\n`;
  const topicQs = qs.filter(q => q.tag === t.key);
  topicQs.forEach((q) => {
    const globalIdx = qs.indexOf(q) + 1;
    md += `#### Câu ${globalIdx}: ${q.q}\n\n`;
    q.opts.forEach((opt, oIdx) => {
      if (oIdx === q.ans) {
        md += `- **[X] ${letters[oIdx]}. ${opt}**  👈 *(ĐÁP ÁN ĐÚNG)*\n`;
      } else {
        md += `- [ ] ${letters[oIdx]}. ${opt}\n`;
      }
    });
    md += `\n> 💡 **Giải thích:** ${q.explain || 'Kiến thức chuẩn Digital Marketing'}\n\n---\n\n`;
  });
});

md += '## PHẦN 5: 6 CÂU HỎI TỰ LUẬN (PHẦN 2)\n\n';
essays.forEach((eq, idx) => {
  md += `**Câu tự luận ${idx + 1}:** ${eq}\n\n`;
});

fs.writeFileSync(path.join(__dirname, 'BO_DE_TRAC_NGHIEM_119_CAU.md'), md, 'utf8');
console.log('Successfully updated BO_DE_TRAC_NGHIEM_119_CAU.md with explanations!');

// Copy to artifact directory for presentation
const brainPath = 'C:\\Users\\THI\\.gemini\\antigravity\\brain\\febeeb54-7909-4fbe-98d4-3356cf3e3e58\\bo_de_119_cau_hoi_va_dap_an.md';
fs.writeFileSync(brainPath, md, 'utf8');
console.log('Synced to artifact directory.');
