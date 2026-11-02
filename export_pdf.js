const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const questions = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'default_questions.json'), 'utf8')
);

const letters = ['A', 'B', 'C', 'D'];

const essays = [
  {
    title: "Câu 1: Phân tích vai trò của từ khóa trong SEO",
    q: "Phân tích vai trò của từ khóa (Keyword) trong hoạt động SEO. Doanh nghiệp cần lưu ý những gì khi nghiên cứu từ khóa?",
    hints: [
      "Vai trò: Cầu nối giữa nhu cầu tìm kiếm của người dùng và nội dung website; định hướng cấu trúc website và chiến lược nội dung; tối ưu tỷ lệ chuyển đổi.",
      "Lưu ý: Search Volume (lượng tìm kiếm hàng tháng), Search Intent (ý định tìm kiếm: Thông tin, Điều hướng, Thương mại, Giao dịch), Độ cạnh tranh (Keyword Difficulty), Từ khóa đuôi dài (Long-tail keywords) để tối ưu chi phí và tăng tỷ lệ chốt đơn."
    ]
  },
  {
    title: "Câu 2: So sánh SEO và Quảng cáo tìm kiếm trả phí (Google Ads)",
    q: "Những lợi ích và hạn chế của SEO so với quảng cáo trả phí trên công cụ tìm kiếm là gì?",
    hints: [
      "SEO - Lợi ích: Chi phí click bằng 0 (organic), độ uy tín tự nhiên cao, hiệu quả bền vững lâu dài ngay cả khi tạm dừng tối ưu.",
      "SEO - Hạn chế: Thời gian lên top chậm (3–6 tháng), phụ thuộc vào biến động thuật toán Google, tốn nhiều công sức tối ưu kỹ thuật và nội dung.",
      "Google Ads: Hiển thị ngay lập tức, nhắm đúng đối tượng mục tiêu, đo lường tức thời nhưng dừng chi tiền là dừng hiển thị (CPC tăng dần theo thời gian)."
    ]
  },
  {
    title: "Câu 3: Các yếu tố ảnh hưởng đến thứ hạng website trên Google",
    q: "Trình bày các yếu tố ảnh hưởng đến thứ hạng website trên trang kết quả tìm kiếm của Google.",
    hints: [
      "On-page SEO: Chất lượng nội dung hữu ích (Helpful Content), mật độ và vị trí từ khóa (Title, H1, Meta, URL, Alt Text), cấu trúc Internal Link.",
      "Technical SEO: Tốc độ tải trang (Core Web Vitals), giao diện thân thiện di động (Mobile-friendly / RWD), chứng chỉ bảo mật HTTPS (SSL), file robots.txt và sitemap.xml.",
      "Off-page SEO: Số lượng và chất lượng backlink từ các tên miền uy tín cùng lĩnh vực, tín hiệu thương hiệu (Brand Mentions) và đánh giá của người dùng."
    ]
  },
  {
    title: "Câu 4: Vai trò của Social Media Marketing",
    q: "Trình bày vai trò của Social Media Marketing trong việc xây dựng thương hiệu và tương tác với khách hàng.",
    hints: [
      "Xây dựng nhận diện thương hiệu: Tiếp cận tệp đối tượng khổng lồ, truyền tải thông điệp đa định dạng (video ngắn, hình ảnh, bài viết).",
      "Giao tiếp hai chiều & Chăm sóc khách hàng: Lắng nghe phản hồi thời gian thực, giải đáp thắc mắc, xử lý khiếu nại qua Messenger/Bình luận.",
      "Khai thác nội dung do người dùng tạo (UGC) và sự lan truyền (Viral): Khách hàng vừa là người tiêu dùng vừa là đại sứ lan tỏa thương hiệu."
    ]
  },
  {
    title: "Câu 5: Các yếu tố tạo nên nội dung thu hút trên Social Media",
    q: "Những yếu tố nào tạo nên một nội dung thu hút và hiệu quả trong Social Media Marketing?",
    hints: [
      "Phần mở đầu (HOOK) mạnh mẽ: Giữ chân người xem trong 3 giây đầu tiên bằng câu hỏi gợi mở, hình ảnh bất ngờ hoặc số liệu ấn tượng.",
      "Quy tắc 80/20 Content Pillars: 80% nội dung mang lại giá trị thực tế (kiến thức, giải trí, cảm xúc), 20% nội dung bán hàng trực tiếp.",
      "Định dạng tối ưu nền tảng: Video ngắn dọc 9:16 (TikTok, Reels, Shorts), hình ảnh trực quan chất lượng cao, âm thanh xu hướng (Trending sound).",
      "Kêu gọi hành động rõ ràng (Call to Action - CTA): Hướng dẫn người xem like, share, comment hoặc click link sinh động."
    ]
  },
  {
    title: "Câu 6: Giải pháp cho website có traffic cao nhưng tỷ lệ chuyển đổi thấp",
    q: "Một doanh nghiệp có lượng truy cập website cao nhưng tỷ lệ chuyển đổi thấp. Hãy phân tích các nguyên nhân có thể xảy ra và đề xuất giải pháp cải thiện.",
    hints: [
      "Nguyên nhân: Tiếp cận sai đối tượng (từ khóa không khớp ý định mua hàng); Trải nghiệm người dùng (UX) kém, tốc độ tải trang chậm; Lời kêu gọi hành động (CTA) mờ nhạt hoặc quy trình thanh toán/đăng ký quá rườm rà; Thiếu tín hiệu tin cậy (chứng nhận, review khách hàng, chính sách đổi trả).",
      "Giải pháp: Phân tích lại Intent từ khóa và nhắm mục tiêu; Tối ưu trang đích (Landing Page Optimization), thiết kế lại CTA nổi bật; Rút ngắn form đăng ký/quy trình thanh toán xuống dưới 3 bước; Bổ sung Feedback thật, chứng chỉ SSL và số hotline tư vấn trực tiếp."
    ]
  }
];

const topics = [
  { name: 'Website', tag: 'Website', count: 28, color: '#2563eb' },
  { name: 'Marketing Công Cụ Tìm Kiếm (SEO & SEM)', tag: 'Marketing công cụ tìm kiếm', count: 36, color: '#7c3aed' },
  { name: 'Marketing Truyền Thông Xã Hội (Social Media)', tag: 'Marketing truyền thông xã hội', count: 22, color: '#e11d48' },
  { name: 'Email Marketing & CRM', tag: 'Email Marketing - CRM', count: 33, color: '#059669' }
];

let html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Bộ Đề & Đáp Án Digital Marketing 2026 - 119 Câu Trắc Nghiệm & 6 Câu Tự Luận</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 14mm 14mm 16mm 14mm;
    @bottom-right {
      content: counter(page);
    }
  }

  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  
  body {
    font-family: 'Be Vietnam Pro', 'Segoe UI', Tahoma, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.55;
    font-size: 11pt;
    margin: 0;
    padding: 0;
  }

  /* Cover & Header */
  .cover-header {
    border-bottom: 3px double #e2e8f0;
    padding-bottom: 18px;
    margin-bottom: 24px;
    text-align: center;
  }
  .doc-badge {
    display: inline-block;
    background: #1e293b;
    color: #ffffff;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 14px;
    border-radius: 999px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .doc-title {
    font-size: 21pt;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.25;
    margin: 0 0 8px 0;
  }
  .doc-subtitle {
    font-size: 13pt;
    font-weight: 600;
    color: #e11d48;
    margin: 0 0 12px 0;
  }
  .doc-meta {
    font-size: 9.5pt;
    color: #64748b;
    line-height: 1.6;
  }
  .doc-meta b { color: #334155; }

  /* Stats Table */
  .stats-grid {
    display: table;
    width: 100%;
    margin-bottom: 24px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    border-spacing: 0;
    overflow: hidden;
  }
  .stats-cell {
    display: table-cell;
    width: 25%;
    padding: 10px 12px;
    text-align: center;
    border-right: 1px solid #e2e8f0;
    background: #f8fafc;
  }
  .stats-cell:last-child { border-right: none; }
  .stats-num { font-family: 'JetBrains Mono', monospace; font-size: 15pt; font-weight: 800; color: #0f172a; }
  .stats-label { font-size: 8.5pt; font-weight: 600; color: #64748b; text-transform: uppercase; margin-top: 2px; }

  /* Section Title */
  .section-banner {
    background: #0f172a;
    color: #ffffff;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13pt;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-top: 28px;
    margin-bottom: 16px;
    page-break-after: avoid;
    break-after: avoid;
  }
  .section-banner.essay-sec { background: #7c2d12; }

  /* Question Card */
  .question-block {
    page-break-inside: avoid;
    break-inside: avoid;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
    background: #ffffff;
  }
  .q-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .q-title {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.45;
    flex: 1;
  }
  .q-tag {
    font-size: 8pt;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    background: #e2e8f0;
    color: #475569;
    white-space: nowrap;
    margin-left: 8px;
  }
  
  /* Options */
  .options-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .opt-item {
    font-size: 10.2pt;
    padding: 5px 10px;
    border-radius: 5px;
    margin-bottom: 4px;
    line-height: 1.4;
    color: #334155;
    border: 1px solid transparent;
  }
  .opt-item.correct {
    background: #ecfdf5 !important;
    border-color: #10b981 !important;
    color: #065f46 !important;
    font-weight: 700 !important;
  }
  .opt-prefix {
    font-weight: 700;
    display: inline-block;
    width: 22px;
  }
  .correct-badge {
    display: inline-block;
    float: right;
    font-size: 8pt;
    font-weight: 800;
    background: #10b981;
    color: #ffffff;
    padding: 1px 7px;
    border-radius: 3px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* Essay Block */
  .essay-card {
    page-break-inside: avoid;
    break-inside: avoid;
    border: 1.5px solid #fed7aa;
    background: #fffbeb;
    border-radius: 8px;
    padding: 14px 18px;
    margin-bottom: 14px;
  }
  .essay-title {
    font-size: 11.5pt;
    font-weight: 800;
    color: #9a3412;
    margin-bottom: 6px;
  }
  .essay-q {
    font-size: 11pt;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 10px;
    line-height: 1.5;
  }
  .hints-box {
    background: #ffffff;
    border: 1px dashed #fdba74;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 9.8pt;
    color: #475569;
    line-height: 1.5;
  }
  .hints-title {
    font-weight: 700;
    color: #c2410c;
    margin-bottom: 4px;
    display: block;
    text-transform: uppercase;
    font-size: 8.5pt;
    letter-spacing: 0.5px;
  }
  .hints-box ul {
    margin: 0;
    padding-left: 18px;
  }
  .hints-box li {
    margin-bottom: 4px;
  }
  .hints-box li:last-child { margin-bottom: 0; }
</style>
</head>
<body>

  <!-- COVER HEADER -->
  <div class="cover-header">
    <div class="doc-badge">Tài Liệu Ôn Tập Khảo Thí Chính Thức 2026</div>
    <h1 class="doc-title">BỘ ĐỀ THI & ĐÁP ÁN DIGITAL MARKETING</h1>
    <div class="doc-subtitle">119 Câu Trắc Nghiệm Chuẩn & 6 Câu Hỏi Tự Luận Chuyên Sâu</div>
    <div class="doc-meta">
      Đơn vị biên soạn & quản trị: <b>ThanhTaiCoder</b> | Hệ thống thi trực tuyến: <b>https://vthanhtai.id.vn</b><br>
      Đồng bộ hóa & giải mã 100% từ hệ thống nguồn: <b>https://nguyenchuannam.n1.tinhgon.xyz</b>
    </div>
  </div>

  <!-- STATS -->
  <div class="stats-grid">
    <div class="stats-cell">
      <div class="stats-num">28</div>
      <div class="stats-label">Chuyên đề Website</div>
    </div>
    <div class="stats-cell">
      <div class="stats-num">36</div>
      <div class="stats-label">SEO & Google Ads</div>
    </div>
    <div class="stats-cell">
      <div class="stats-num">22</div>
      <div class="stats-label">Social Media</div>
    </div>
    <div class="stats-cell">
      <div class="stats-num">33</div>
      <div class="stats-label">Email & CRM</div>
    </div>
  </div>
`;

// Render 4 topics
topics.forEach((t, tIdx) => {
  html += `\n<div class="section-banner">PHẦN ${tIdx + 1}: CHỦ ĐỀ ${t.name.toUpperCase()} (${t.count} CÂU)</div>\n`;
  const tQuestions = questions.filter(q => q.tag === t.tag);
  
  tQuestions.forEach((q) => {
    const globalIdx = questions.indexOf(q) + 1;
    html += `
  <div class="question-block">
    <div class="q-head">
      <div class="q-title">Câu ${globalIdx}: ${escapeHtml(q.q)}</div>
      <span class="q-tag">${escapeHtml(q.tag)}</span>
    </div>
    <ul class="options-list">`;

    q.opts.forEach((opt, oIdx) => {
      const isAns = (oIdx === q.ans);
      html += `
      <li class="opt-item ${isAns ? 'correct' : ''}">
        <span class="opt-prefix">${letters[oIdx]}.</span> ${escapeHtml(opt)}
        ${isAns ? '<span class="correct-badge">✔ ĐÁP ÁN ĐÚNG</span>' : ''}
      </li>`;
    });

    html += `
    </ul>
  </div>`;
  });
});

// Render Essays
html += `\n<div class="section-banner essay-sec">PHẦN 5: 6 CÂU HỎI TỰ LUẬN CHUYÊN SÂU (KÈM GỢI Ý ĐÁP ÁN)</div>\n`;

essays.forEach((es, idx) => {
  html += `
  <div class="essay-card">
    <div class="essay-title">${es.title}</div>
    <div class="essay-q">${es.q}</div>
    <div class="hints-box">
      <span class="hints-title">💡 Gợi Ý Luận Điểm Cốt Lõi Khi Làm Bài:</span>
      <ul>
        ${es.hints.map(h => `<li>${h}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>`;
});

html += `
</body>
</html>`;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const htmlPath = path.join(__dirname, 'bo_de_in_an.html');
const pdfPath = path.join(__dirname, 'BO_DE_TRAC_NGHIEM_119_CAU.pdf');
const brainPdfPath = 'C:\\Users\\THI\\.gemini\\antigravity\\brain\\febeeb54-7909-4fbe-98d4-3356cf3e3e58\\BO_DE_TRAC_NGHIEM_119_CAU.pdf';

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved printable HTML:', htmlPath);

// Convert using Chrome headless
console.log('Printing to PDF via headless Chrome...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

try {
  execSync(`"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`, { stdio: 'inherit' });
  console.log('PDF generated successfully at:', pdfPath);
  
  // Also copy to brain artifacts dir
  fs.copyFileSync(pdfPath, brainPdfPath);
  console.log('Copied PDF to Brain Artifact Dir:', brainPdfPath);
} catch (e) {
  console.error('Failed to run Chrome headless:', e.message);
}
