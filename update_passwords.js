const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build_v5.3.js');
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Storage Keys bump to _v7 to clear out any old cached pass on any device
code = code.replace("const KEY_EXAM_PASS = 'at_exam_password_v6';", "const KEY_EXAM_PASS = 'at_exam_password_v7';");
code = code.replace("const KEY_ADMIN_PASS = 'at_admin_password_v6';", "const KEY_ADMIN_PASS = 'at_admin_password_v7';");

// 2. Set hardcoded defaults in code
code = code.replace(
  "let EXAM_PASS = getStorage(KEY_EXAM_PASS, 'ThayChuanNam');",
  "let EXAM_PASS = getStorage(KEY_EXAM_PASS, 'Thithu@123');"
);
code = code.replace(
  "let ADMIN_PASS = getStorage(KEY_ADMIN_PASS, 'admin123');",
  "let ADMIN_PASS = getStorage(KEY_ADMIN_PASS, 'Tai@00114477');"
);

// 3. Remove password hints from placeholders
// Start screen pass input
code = code.replace(
  'placeholder="Nhập mật khẩu do Thầy cấp (mặc định: ThayChuanNam)..."',
  'placeholder="Nhập mật khẩu phòng thi..."'
);
code = code.replace(
  'placeholder="Nhập mật khẩu do Thầy cấp..."',
  'placeholder="Nhập mật khẩu phòng thi..."'
);

// Admin login verify input
code = code.replace(
  'placeholder="Mật khẩu Admin (mặc định: admin123)"',
  'placeholder="Nhập mật khẩu quản trị..."'
);

// Admin settings inputs
code = code.replace(
  'placeholder="Ví dụ: ThayChuanNam hoặc THANHTAI123"',
  'placeholder="Nhập mật khẩu phòng thi mới..."'
);
code = code.replace(
  'placeholder="Ví dụ: THANHTAI123"',
  'placeholder="Nhập mật khẩu phòng thi mới..."'
);
code = code.replace(
  'placeholder="Mật khẩu vào bảng quản trị (mặc định: admin123)"',
  'placeholder="Nhập mật khẩu Admin mới..."'
);
code = code.replace(
  'placeholder="Mật khẩu vào bảng này (mặc định: admin123)"',
  'placeholder="Nhập mật khẩu Admin mới..."'
);

// 4. Update Error Messages (remove any default pass hints)
code = code.replace(
  "errEl.textContent = '❌ Mật khẩu phòng thi không chính xác! Vui lòng kiểm tra lại (mặc định: ThayChuanNam).';",
  "errEl.textContent = '❌ Mật khẩu phòng thi không chính xác! Vui lòng liên hệ Thầy để nhận mật khẩu phòng thi.';"
);

// 5. Update startQuiz password check
const oldStartQuizPassRegex = /const currentExamPass = \(getStorage\(KEY_EXAM_PASS, EXAM_PASS\) \|\| '[^']+'\)\.trim\(\);[\s\S]*?if \(!isExamPassValid\) \{/;
const newStartQuizPassCode = `const currentExamPass = (getStorage(KEY_EXAM_PASS, EXAM_PASS) || 'Thithu@123').trim();
  const cleanInput = pass.toLowerCase();
  const cleanConfigPass = currentExamPass.toLowerCase();

  const isExamPassValid = (
    cleanInput === cleanConfigPass ||
    cleanInput === 'thithu@123'
  );

  if (!isExamPassValid) {`;

code = code.replace(oldStartQuizPassRegex, newStartQuizPassCode);

// 6. Update verifyAdminPass password check
const oldAdminPassRegex = /const currentAdminPass = \(getStorage\(KEY_ADMIN_PASS, ADMIN_PASS\) \|\| '[^']+'\)\.trim\(\);[\s\S]*?if \(isAdminValid\) \{/;
const newAdminPassCode = `const currentAdminPass = (getStorage(KEY_ADMIN_PASS, ADMIN_PASS) || 'Tai@00114477').trim();
  const cleanInput = enteredPass.toLowerCase();
  const cleanConfigPass = currentAdminPass.toLowerCase();

  const isAdminValid = (
    cleanInput === cleanConfigPass ||
    cleanInput === 'tai@00114477'
  );

  if (isAdminValid) {`;

code = code.replace(oldAdminPassRegex, newAdminPassCode);

// 7. In loadAdminData
code = code.replace(
  "EXAM_PASS = getStorage(KEY_EXAM_PASS, EXAM_PASS || 'ThayChuanNam');",
  "EXAM_PASS = getStorage(KEY_EXAM_PASS, EXAM_PASS || 'Thithu@123');"
);
code = code.replace(
  "ADMIN_PASS = getStorage(KEY_ADMIN_PASS, ADMIN_PASS || 'admin123');",
  "ADMIN_PASS = getStorage(KEY_ADMIN_PASS, ADMIN_PASS || 'Tai@00114477');"
);

// 8. Add URL param ?pass= / ?p= support to auto-fill or validate
const urlParamSnippet = `
  // Support ?pass= or ?p= in URL to auto-fill exam password
  const urlPass = urlParams.get('pass') || urlParams.get('p');
  if (urlPass && $('pass-input')) {
    $('pass-input').value = urlPass;
  }
`;

code = code.replace(
  "const isAdminParam = urlParams.has('admin') || hash === '#admin';",
  "const isAdminParam = urlParams.has('admin') || hash === '#admin';\n" + urlParamSnippet
);

// 9. Add "Sao chép link phòng thi" button in Tab 2 Admin
const oldTab2Buttons = `<button class="btn-n8n-primary" onclick="saveSecuritySettings()" style="padding:14px 28px;max-width:260px;">
            💾 LƯU CÀI ĐẶT BẢO MẬT
          </button>`;

const newTab2Buttons = `<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
            <button class="btn-n8n-primary" onclick="saveSecuritySettings()" style="padding:14px 28px;max-width:260px;">
              💾 LƯU CÀI ĐẶT BẢO MẬT
            </button>
            <button type="button" class="btn-n8n-secondary" onclick="copyExamRoomLink()" style="padding:14px 20px;">
              🔗 Sao Chép Link Kèm Mật Khẩu
            </button>
          </div>`;

code = code.replace(oldTab2Buttons, newTab2Buttons);

// Add copyExamRoomLink function
const copyExamLinkFunc = `
function copyExamRoomLink() {
  triggerHaptic('tap');
  const pass = ($('setting-exam-pass').value || EXAM_PASS || 'Thithu@123').trim();
  const url = window.location.origin + window.location.pathname + '?pass=' + encodeURIComponent(pass);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showNotify('notify-pass', '📋 Đã sao chép link phòng thi vào bộ nhớ tạm: ' + escHtml(url), 'var(--n8n-emerald)');
    }).catch(() => {
      prompt('Sao chép link phòng thi này gửi cho học sinh:', url);
    });
  } else {
    prompt('Sao chép link phòng thi này gửi cho học sinh:', url);
  }
}
`;

code = code.replace('function saveSecuritySettings() {', copyExamLinkFunc + '\nfunction saveSecuritySettings() {');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated build_v5.3.js with new passwords and hidden placeholders!');
