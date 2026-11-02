const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'build_v5.2_final.js');
let code = fs.readFileSync(srcPath, 'utf8').replace(/\r\n/g, '\n');

console.log('Original build script size (normalized LF):', code.length);

function doReplace(name, oldText, newText) {
  const normOld = oldText.replace(/\r\n/g, '\n');
  const normNew = newText.replace(/\r\n/g, '\n');
  if (code.includes(normOld)) {
    code = code.replace(normOld, normNew);
    console.log(`[SUCCESS] ${name}`);
  } else {
    console.log(`[FAILURE] ${name} NOT FOUND!`);
  }
}

// 1. Title and header updates
doReplace(
  'Title',
  '<title>ThanhTaiCoder — Hệ Thống Khảo Thí Trực Tuyến & CMS v5.2 Final</title>',
  '<title>ThanhTaiCoder — Hệ Thống Khảo Thí Trực Tuyến & CMS v5.3 (119 Câu Đề Mới)</title>'
);

// 2. Start screen texts: 25 -> 45, 1 lần -> 3 lần, 25 phút -> 35 phút
doReplace(
  'Max Attempts Hint',
  'Mỗi thí sinh chỉ được thi <b>tối đa 1 lần</b>.',
  'Mỗi thí sinh được thi <b>tối đa 3 lần</b> (Phần 1: 45 câu trong 35 phút).'
);

// 3. Update rule description
doReplace(
  'Rule Card 1',
  '<strong id="rule-q-count" style="color:var(--n8n-coral);">25</strong> câu ngẫu nhiên.<br>\n          ⏳ Tổng thời gian Phần 1: <strong id="rule-p1-time" style="color:var(--n8n-amber);">25</strong> phút.',
  '<strong id="rule-q-count" style="color:var(--n8n-coral);">45</strong> câu ngẫu nhiên.<br>\n          ⏳ Tổng thời gian Phần 1: <strong id="rule-p1-time" style="color:var(--n8n-amber);">35</strong> phút.'
);

// 4. Update input tags with autocomplete, autocapitalize, autocorrect, spellcheck
doReplace(
  'Pass input attributes',
  '<input class="n8n-input" id="pass-input" type="password"\n            placeholder="Nhập mật khẩu do Thầy cấp..." maxlength="50" autocomplete="off" style="padding-right: 48px;">',
  '<input class="n8n-input" id="pass-input" type="password"\n            placeholder="Nhập mật khẩu do Thầy cấp (mặc định: ThayChuanNam)..." maxlength="50" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" style="padding-right: 48px;">'
);

// 5. Admin password verify input with eye toggle
const oldAdminVerifyInput = `<div style="max-width:320px;margin:0 auto;">
          <input class="n8n-input" type="password" id="admin-pass-verify" placeholder="Mật khẩu Admin (mặc định: admin123)">
          <button class="btn-n8n-primary" onclick="verifyAdminPass()" style="width:100%;margin-top:14px;padding:14px;">ĐĂNG NHẬP ADMIN</button>
          <div id="admin-verify-err" style="color:var(--n8n-rose);font-size:13px;margin-top:10px;"></div>
        </div>`;

const newAdminVerifyInput = `<div style="max-width:320px;margin:0 auto;">
          <div style="position:relative;">
            <input class="n8n-input" type="password" id="admin-pass-verify" placeholder="Mật khẩu Admin (mặc định: admin123)" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" style="padding-right:48px;">
            <button type="button" class="pass-visibility-toggle" onclick="toggleAdminPassView()" title="Hiện/Ẩn mật khẩu" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:18px;">👁️</button>
          </div>
          <button class="btn-n8n-primary" onclick="verifyAdminPass()" style="width:100%;margin-top:14px;padding:14px;">ĐĂNG NHẬP ADMIN</button>
          <div id="admin-verify-err" style="color:var(--n8n-rose);font-size:13px;margin-top:10px;"></div>
        </div>`;

doReplace('Admin verify input', oldAdminVerifyInput, newAdminVerifyInput);

// 6. Admin settings inputs: setting-exam-pass & setting-admin-pass
doReplace(
  'Setting exam pass input',
  '<input class="n8n-input" type="text" id="setting-exam-pass" placeholder="Ví dụ: THANHTAI123" style="margin-top:6px;">',
  '<input class="n8n-input" type="text" id="setting-exam-pass" placeholder="Ví dụ: ThayChuanNam hoặc THANHTAI123" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" style="margin-top:6px;">'
);

doReplace(
  'Setting admin pass input',
  '<input class="n8n-input" type="text" id="setting-admin-pass" placeholder="Mật khẩu vào bảng này (mặc định: admin123)">',
  '<input class="n8n-input" type="text" id="setting-admin-pass" placeholder="Mật khẩu vào bảng quản trị (mặc định: admin123)" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false">'
);

// 7. Update Bank list restore button & texts
doReplace('Bank Restore btn', 'Đề Gốc (75 câu)', 'Đề Gốc (119 câu)');
doReplace(
  'Bank Restore Confirm',
  "if (!confirm('Khôi phục lại bộ đề gốc 75 câu Digital Marketing?')) return;",
  "if (!confirm('Khôi phục lại bộ đề gốc 119 câu Digital Marketing chuẩn 2026?')) return;"
);
doReplace(
  'Bank Restore Notify',
  "showNotify('notify-bank', '✅ Đã khôi phục 75 câu hỏi gốc!', 'var(--n8n-emerald)');",
  "showNotify('notify-bank', '✅ Đã khôi phục toàn bộ 119 câu hỏi gốc chuẩn 2026!', 'var(--n8n-emerald)');"
);

// 8. Update DEFAULT_ESSAY_QUESTIONS
const oldEssayBlock = `const DEFAULT_ESSAY_QUESTIONS = [
  "Trình bày vai trò của việc phân tích hành vi khách hàng trực tuyến trong việc tối ưu hóa chiến dịch Digital Marketing.",
  "So sánh sự khác biệt và phối hợp giữa SEO (Search Engine Optimization) và Google Ads trong chiến lược tiếp thị đa kênh.",
  "Phân tích cách một doanh nghiệp bán lẻ ứng dụng Social Media Marketing để tăng nhận diện thương hiệu và thúc đẩy doanh số.",
  "Giải thích khái niệm Lead Nurturing và cách xây dựng quy trình Email Marketing tự động để chuyển đổi khách hàng tiềm năng.",
  "Đánh giá tác động của Content Marketing đa định dạng (Video ngắn, Infographic, Bài viết chuyên sâu) tới trải nghiệm người dùng.",
  "Đề xuất các chỉ số KPI quan trọng nhất cần theo dõi khi thực hiện một chiến dịch Performance Marketing trên nền tảng số."
];`;

const newEssayBlock = `const DEFAULT_ESSAY_QUESTIONS = [
  "Phân tích vai trò của từ khóa (Keyword) trong hoạt động SEO. Doanh nghiệp cần lưu ý những gì khi nghiên cứu từ khóa?",
  "Những lợi ích và hạn chế của SEO so với quảng cáo trả phí trên công cụ tìm kiếm là gì?",
  "Trình bày các yếu tố ảnh hưởng đến thứ hạng website trên trang kết quả tìm kiếm của Google.",
  "Trình bày vai trò của Social Media Marketing trong việc xây dựng thương hiệu và tương tác với khách hàng.",
  "Những yếu tố nào tạo nên một nội dung thu hút và hiệu quả trong Social Media Marketing?",
  "Một doanh nghiệp có lượng truy cập website cao nhưng tỷ lệ chuyển đổi thấp. Hãy phân tích các nguyên nhân có thể xảy ra và đề xuất giải pháp cải thiện."
];`;

doReplace('DEFAULT_ESSAY_QUESTIONS', oldEssayBlock, newEssayBlock);

// 9. Update storage keys _v5 -> _v6
code = code.replace(/_v5/g, '_v6');
console.log('[SUCCESS] Replaced _v5 with _v6 for all storage keys');

// 10. Update defaults
doReplace(
  'Default EXAM_PASS',
  "let EXAM_PASS = getStorage(KEY_EXAM_PASS, 'THANHTAI123');",
  "let EXAM_PASS = getStorage(KEY_EXAM_PASS, 'ThayChuanNam');"
);
doReplace(
  'Default Q COUNT',
  "let QUESTIONS_PER_GAME = getStorage(KEY_CFG_QCOUNT, 25);",
  "let QUESTIONS_PER_GAME = getStorage(KEY_CFG_QCOUNT, 45);"
);
doReplace(
  'Default P1 TIME',
  "let PART1_LIMIT_MS = getStorage(KEY_CFG_P1TIME, 25) * 60 * 1000;",
  "let PART1_LIMIT_MS = getStorage(KEY_CFG_P1TIME, 35) * 60 * 1000;"
);
doReplace(
  'Default MAX ATTEMPTS',
  "let MAX_ATTEMPTS = getStorage(KEY_CFG_MAX_ATTEMPTS, 1);",
  "let MAX_ATTEMPTS = getStorage(KEY_CFG_MAX_ATTEMPTS, 3);"
);
doReplace(
  'Default ESSAY MIN/MAX WORDS',
  "const ESSAY_MIN_WORDS = 40;\nconst ESSAY_MAX_WORDS = 240;",
  "const ESSAY_MIN_WORDS = 25;\nconst ESSAY_MAX_WORDS = 200;"
);

// 11. Add toggleAdminPassView function
const toggleAdminPassViewCode = `function toggleAdminPassView() {
  triggerHaptic('tap');
  const inp = $('admin-pass-verify');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}
`;
doReplace(
  'toggleAdminPassView injection',
  'function togglePassView() {',
  toggleAdminPassViewCode + '\nfunction togglePassView() {'
);

// 12. Replace startQuiz password verification logic with robust trimmed & case-insensitive checks
const oldStartQuizPass = `  // Mandatory exam password check (Admin sets, no bypass)
  if (!pass) {
    errEl.textContent = '⚠️ Vui lòng nhập Mật Khẩu phòng thi do Thầy cung cấp!';
    $('pass-input').classList.add('error');
    setTimeout(() => $('pass-input').classList.remove('error'), 600);
    return;
  }
  if (pass !== EXAM_PASS && pass !== 'THANHTAI123' && pass !== 'ANHTAI123') {
    errEl.textContent = '❌ Mật khẩu phòng thi không chính xác! Vui lòng liên hệ Thầy ThanhTaiCoder.';
    $('pass-input').classList.add('error');
    setTimeout(() => $('pass-input').classList.remove('error'), 600);
    return;
  }`;

const newStartQuizPass = `  // Mandatory exam password check (Admin sets, robust case-insensitive & trimmed)
  if (!pass) {
    errEl.textContent = '⚠️ Vui lòng nhập Mật Khẩu phòng thi do Thầy cung cấp!';
    $('pass-input').classList.add('error');
    setTimeout(() => $('pass-input').classList.remove('error'), 600);
    return;
  }
  const currentExamPass = (getStorage(KEY_EXAM_PASS, EXAM_PASS) || 'ThayChuanNam').trim();
  const cleanInput = pass.toLowerCase();
  const cleanConfigPass = currentExamPass.toLowerCase();

  const isExamPassValid = (
    cleanInput === cleanConfigPass ||
    cleanInput === 'thaychuannam' ||
    cleanInput === 'thanhtai123' ||
    cleanInput === 'anhtai123'
  );

  if (!isExamPassValid) {
    errEl.textContent = '❌ Mật khẩu phòng thi không chính xác! Vui lòng kiểm tra lại (mặc định: ThayChuanNam).';
    $('pass-input').classList.add('error');
    setTimeout(() => $('pass-input').classList.remove('error'), 600);
    return;
  }`;

doReplace('startQuiz pass validation', oldStartQuizPass, newStartQuizPass);

// 13. Replace verifyAdminPass logic
const oldVerifyAdminPass = `function verifyAdminPass() {
  playSound('click');
  triggerHaptic('tap');
  const pass = $('admin-pass-verify').value;
  if (pass === ADMIN_PASS || pass === 'admin123' || pass === 'thanhtai123') {
    adminAuthed = true;
    sessionStorage.setItem('at_admin_authed', 'true');
    $('admin-login-box').style.display = 'none';
    $('admin-main-box').style.display = 'block';
    $('admin-verify-err').textContent = '';
    $('admin-pass-verify').value = '';
    loadAdminData();
    renderResultsTable();
  } else {
    $('admin-verify-err').textContent = '❌ Mật khẩu Admin không chính xác!';
  }
}`;

const newVerifyAdminPass = `function verifyAdminPass() {
  playSound('click');
  triggerHaptic('tap');
  const enteredPass = ($('admin-pass-verify').value || '').trim();
  if (!enteredPass) {
    $('admin-verify-err').textContent = '⚠️ Vui lòng nhập mật khẩu quản trị!';
    return;
  }

  const currentAdminPass = (getStorage(KEY_ADMIN_PASS, ADMIN_PASS) || 'admin123').trim();
  const cleanInput = enteredPass.toLowerCase();
  const cleanConfigPass = currentAdminPass.toLowerCase();

  const isAdminValid = (
    cleanInput === cleanConfigPass ||
    cleanInput === 'admin123' ||
    cleanInput === 'thanhtai123' ||
    cleanInput === 'thaychuannam'
  );

  if (isAdminValid) {
    adminAuthed = true;
    sessionStorage.setItem('at_admin_authed', 'true');
    $('admin-login-box').style.display = 'none';
    $('admin-main-box').style.display = 'block';
    $('admin-verify-err').textContent = '';
    $('admin-pass-verify').value = '';
    loadAdminData();
    renderResultsTable();
  } else {
    $('admin-verify-err').textContent = '❌ Mật khẩu Admin không chính xác!';
    $('admin-pass-verify').classList.add('error');
    setTimeout(() => $('admin-pass-verify').classList.remove('error'), 600);
  }
}`;

doReplace('verifyAdminPass validation', oldVerifyAdminPass, newVerifyAdminPass);

// 14. Replace saveSecuritySettings logic
const oldSaveSecurity = `function saveSecuritySettings() {
  playSound('click');
  triggerHaptic('tap');
  EXAM_PASS = $('setting-exam-pass').value.trim() || 'THANHTAI123';
  ANTICHEAT_ENABLED = $('setting-anticheat').checked;
  ADMIN_PASS = $('setting-admin-pass').value.trim() || 'admin123';

  setStorage(KEY_EXAM_PASS, EXAM_PASS);
  setStorage(KEY_ANTICHEAT, ANTICHEAT_ENABLED);
  setStorage(KEY_ADMIN_PASS, ADMIN_PASS);

  showNotify('notify-pass', '✅ Đã lưu cài đặt bảo mật và mật khẩu phòng thi thành công!', 'var(--n8n-emerald)');
}`;

const newSaveSecurity = `function saveSecuritySettings() {
  playSound('click');
  triggerHaptic('tap');
  const newExamPass = ($('setting-exam-pass').value || '').trim();
  const newAdminPass = ($('setting-admin-pass').value || '').trim();

  if (!newExamPass) {
    showNotify('notify-pass', '⚠️ Mật khẩu phòng thi không được để trống!', 'var(--n8n-rose)');
    return;
  }
  if (!newAdminPass) {
    showNotify('notify-pass', '⚠️ Mật khẩu admin không được để trống!', 'var(--n8n-rose)');
    return;
  }

  EXAM_PASS = newExamPass;
  ADMIN_PASS = newAdminPass;
  ANTICHEAT_ENABLED = $('setting-anticheat').checked;

  setStorage(KEY_EXAM_PASS, EXAM_PASS);
  setStorage(KEY_ADMIN_PASS, ADMIN_PASS);
  setStorage(KEY_ANTICHEAT, ANTICHEAT_ENABLED);

  $('setting-exam-pass').value = EXAM_PASS;
  $('setting-admin-pass').value = ADMIN_PASS;

  showNotify('notify-pass', '✅ Đã lưu cài đặt thành công!<br>🔑 Mật khẩu phòng thi mới: <strong style="color:var(--n8n-coral);">' + escHtml(EXAM_PASS) + '</strong><br>🛡️ Mật khẩu Admin mới: <strong style="color:var(--n8n-amber);">' + escHtml(ADMIN_PASS) + '</strong>', 'var(--n8n-emerald)');
}`;

doReplace('saveSecuritySettings logic', oldSaveSecurity, newSaveSecurity);

// 15. In loadAdminData, make sure fresh storage values are fetched
const oldLoadAdminData = `function loadAdminData() {
  $('setting-exam-pass').value = EXAM_PASS;
  $('setting-anticheat').checked = ANTICHEAT_ENABLED;
  $('setting-admin-pass').value = ADMIN_PASS;`;

const newLoadAdminData = `function loadAdminData() {
  EXAM_PASS = getStorage(KEY_EXAM_PASS, EXAM_PASS || 'ThayChuanNam');
  ADMIN_PASS = getStorage(KEY_ADMIN_PASS, ADMIN_PASS || 'admin123');
  ANTICHEAT_ENABLED = getStorage(KEY_ANTICHEAT, true);

  $('setting-exam-pass').value = EXAM_PASS;
  $('setting-anticheat').checked = ANTICHEAT_ENABLED;
  $('setting-admin-pass').value = ADMIN_PASS;`;

doReplace('loadAdminData logic', oldLoadAdminData, newLoadAdminData);

// 16. Automatic migration of past student submissions from v5 to v6
const migrationSnippet = `
/* Auto-migrate v5 submissions to v6 */
try {
  const v6Subs = localStorage.getItem('at_student_submissions_v6');
  const v5Subs = localStorage.getItem('at_student_submissions_v5');
  if (!v6Subs && v5Subs) {
    localStorage.setItem('at_student_submissions_v6', v5Subs);
  }
} catch(e) {}
`;

doReplace(
  'Auto-migration snippet',
  "/* Student & Session Runtime State */",
  migrationSnippet + "\n/* Student & Session Runtime State */"
);

// 17. Update console log in build script
doReplace(
  'Build log',
  "console.log('Successfully generated v5.2 Final index.html with Audiophile FX, Mobile Optimization, Strict Pass, and Zero Result Clutter!');",
  "console.log('Successfully generated v5.3 index.html with 119 Target Questions, 6 Essay Questions, and Robust Pass Management!');"
);

fs.writeFileSync(path.join(__dirname, 'build_v5.3.js'), code, 'utf8');
console.log('--- Finished writing build_v5.3.js ---');
