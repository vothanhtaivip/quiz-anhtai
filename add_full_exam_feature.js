const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build_v5.3.js');
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Replace single button with dual action buttons (Standard Mode & Full Exam Mode)
const oldStartButton = `<button type="button" class="btn-n8n-primary" id="btn-start" onclick="startQuiz()">
        <span>🚀 KHỞI CHẠY BÀI THI</span>
      </button>`;

const newStartButtons = `<div style="display:flex;flex-direction:column;gap:12px;margin-top:14px;">
        <button type="button" class="btn-n8n-primary" id="btn-start" onclick="startQuiz(false)" style="width:100%;padding:16px 20px;font-size:15px;display:flex;justify-content:center;align-items:center;gap:10px;">
          <span>🎯 THI CHUẨN (45 CÂU // 35 PHÚT)</span>
        </button>
        <button type="button" class="btn-n8n-secondary" id="btn-start-full" onclick="startQuiz(true)" style="width:100%;padding:15px 20px;font-size:14.5px;background:rgba(255,109,90,0.12);border:1.5px solid var(--n8n-coral);color:#ffffff;font-weight:800;display:flex;justify-content:center;align-items:center;gap:10px;box-shadow:0 0 20px rgba(255,109,90,0.25);">
          <span>🔥 THI FULL TOÀN BỘ ĐỀ (119 CÂU // 93 PHÚT)</span>
        </button>
      </div>`;

if (code.includes(oldStartButton)) {
  code = code.replace(oldStartButton, newStartButtons);
  console.log('[SUCCESS] Replaced start button with dual mode buttons');
} else {
  console.log('[WARNING] oldStartButton not found!');
}

// 2. Update Rule card description to explain both modes
const oldRuleDesc = `<div class="rule-node-desc">
          Tổng <strong id="rule-q-count" style="color:var(--n8n-coral);">45</strong> câu ngẫu nhiên.<br>
          ⏳ Tổng thời gian Phần 1: <strong id="rule-p1-time" style="color:var(--n8n-amber);">35</strong> phút.<br>
          💡 Bấm chọn A/B/C/D hoặc phím số trên bàn phím.
        </div>`;

const newRuleDesc = `<div class="rule-node-desc">
          🎯 Thi Chuẩn: <strong id="rule-q-count" style="color:var(--n8n-coral);">45</strong> câu / <strong id="rule-p1-time" style="color:var(--n8n-amber);">35</strong> phút.<br>
          🔥 Thi Full Đề: <strong id="rule-full-q" style="color:var(--n8n-rose);">119</strong> câu / <strong id="rule-full-time" style="color:var(--n8n-amber);">93</strong> phút (nhân theo tỉ lệ).<br>
          ⏱️ 30 Giây/câu | 💡 Bấm A/B/C/D hoặc phím 1/2/3/4.
        </div>`;

if (code.includes(oldRuleDesc)) {
  code = code.replace(oldRuleDesc, newRuleDesc);
  console.log('[SUCCESS] Updated rule card description');
} else {
  console.log('[WARNING] oldRuleDesc not found!');
}

// 3. Add global state variables
const stateHook = `/* Part 1 Clock */
let part1EndTime = null;
let part1TimerId = null;
let part1TimedOut = false;
let isCurrentQuizFull = false;
let activePart1LimitMs = PART1_LIMIT_MS;`;

code = code.replace(
  `/* Part 1 Clock */
let part1EndTime = null;
let part1TimerId = null;
let part1TimedOut = false;`,
  stateHook
);

// 4. Update startPart1Clock & part1Remaining
code = code.replace(
  `function startPart1Clock() {
  if (part1TimerId) clearInterval(part1TimerId);
  part1EndTime = Date.now() + PART1_LIMIT_MS;
  tickPart1();
  part1TimerId = setInterval(tickPart1, 1000);
}
function stopPart1Clock() {
  if (part1TimerId) { clearInterval(part1TimerId); part1TimerId = null; }
}
function part1Remaining() {
  if (!part1EndTime) return PART1_LIMIT_MS;
  return Math.max(0, part1EndTime - Date.now());
}`,
  `function startPart1Clock() {
  if (part1TimerId) clearInterval(part1TimerId);
  part1EndTime = Date.now() + activePart1LimitMs;
  tickPart1();
  part1TimerId = setInterval(tickPart1, 1000);
}
function stopPart1Clock() {
  if (part1TimerId) { clearInterval(part1TimerId); part1TimerId = null; }
}
function part1Remaining() {
  if (!part1EndTime) return activePart1LimitMs;
  return Math.max(0, part1EndTime - Date.now());
}`
);

// 5. Update startQuiz function signature and question slicing
const oldStartQuizHead = `function startQuiz() {
  playSound('click');
  triggerHaptic('tap');
  const sid = $('student-id').value.trim();`;

const newStartQuizHead = `function startQuiz(isFullMode = false) {
  isCurrentQuizFull = !!isFullMode;
  playSound('click');
  triggerHaptic('tap');
  const sid = $('student-id').value.trim();`;

code = code.replace(oldStartQuizHead, newStartQuizHead);

// Question count & time calculation inside startQuiz
const oldStartQuizSlice = `  part1TimedOut = false;
  startPart1Clock();

  const qLimit = Math.min(QUESTIONS_PER_GAME, ALL_QUESTIONS.length);
  questions = shuffle(ALL_QUESTIONS).slice(0, qLimit);`;

const newStartQuizSlice = `  part1TimedOut = false;

  let qLimit;
  if (isCurrentQuizFull) {
    qLimit = ALL_QUESTIONS.length;
    const stdQ = Math.max(1, QUESTIONS_PER_GAME || 45);
    const stdMin = Math.round(PART1_LIMIT_MS / 60000);
    const fullMin = Math.round(qLimit * (stdMin / stdQ));
    activePart1LimitMs = fullMin * 60 * 1000;
  } else {
    qLimit = Math.min(QUESTIONS_PER_GAME, ALL_QUESTIONS.length);
    activePart1LimitMs = PART1_LIMIT_MS;
  }

  startPart1Clock();
  questions = shuffle(ALL_QUESTIONS).slice(0, qLimit);`;

code = code.replace(oldStartQuizSlice, newStartQuizSlice);

// 6. Update showResult score / grade10 calculation
const oldShowResultGrade = `  let medal, title, sub, grade10;
  if (score > 160)      { medal = '🏆'; title = 'XUẤT SẮC!'; sub = 'Nắm vững kiến thức — Đạt chuẩn Chuyên gia Digital Marketing!'; grade10 = 10; }
  else if (score > 120) { medal = '🥈'; title = 'GIỎI!'; sub = 'Kiến thức rất tốt — Bạn đã hoàn thành xuất sắc bài thi!'; grade10 = 8.5; }
  else if (score > 60)  { medal = '🥉'; title = 'TRUNG BÌNH'; sub = 'Đạt mức khá — Hãy xem lại đáp án để cải thiện kiến thức nhé!'; grade10 = 6.5; }
  else                  { medal = '📚'; title = 'CẦN CỐ GẮNG HƠN'; sub = 'Hãy đọc lại nội dung bài học và ôn tập thêm nhé!'; grade10 = 4.0; }

  $('result-medal').textContent = medal;
  $('result-title').textContent = title + ' — ' + grade10 + ' ĐIỂM';`;

const newShowResultGrade = `  const totalQ = Math.max(1, questions.length);
  const ratio = correctCount / totalQ;
  const grade10 = Number((ratio * 10).toFixed(1));

  let medal, title, sub;
  if (grade10 >= 8.5)      { medal = '🏆'; title = 'XUẤT SẮC!'; sub = 'Nắm vững kiến thức — Đạt chuẩn Chuyên gia Digital Marketing!'; }
  else if (grade10 >= 7.0) { medal = '🥈'; title = 'GIỎI!'; sub = 'Kiến thức rất tốt — Bạn đã hoàn thành bài thi rất tốt!'; }
  else if (grade10 >= 5.0) { medal = '🥉'; title = 'ĐẠT YÊU CẦU'; sub = 'Đạt mức khá — Hãy xem lại đáp án để cải thiện thêm nhé!'; }
  else                     { medal = '📚'; title = 'CẦN CỐ GẮNG HƠN'; sub = 'Hãy đọc lại nội dung bài học và ôn tập thêm nhé!'; }

  $('result-medal').textContent = medal;
  $('result-title').textContent = title + ' — ' + grade10 + ' ĐIỂM' + (isCurrentQuizFull ? ' (FULL ĐỀ)' : '');
  $('stat-correct').textContent = correctCount + '/' + totalQ;`;

code = code.replace(oldShowResultGrade, newShowResultGrade);

// 7. Update status in recordSubmissionPart1
code = code.replace(
  "status: 'Đã hoàn thành Trắc nghiệm',",
  "status: isCurrentQuizFull ? 'Đã hoàn thành Trắc nghiệm (Full đề)' : 'Đã hoàn thành Trắc nghiệm (Chuẩn)',"
);

// 8. Add updateStartScreenLabels function to dynamically update button texts
const updateLabelsFunc = `
function updateStartScreenLabels() {
  const stdQ = Math.min(QUESTIONS_PER_GAME, ALL_QUESTIONS.length);
  const stdMin = Math.round(PART1_LIMIT_MS / 60000);
  const fullQ = ALL_QUESTIONS.length;
  const fullMin = Math.round(fullQ * (stdMin / Math.max(1, QUESTIONS_PER_GAME)));

  const btnStd = $('btn-start');
  if (btnStd) btnStd.innerHTML = '<span>🎯 THI CHUẨN (' + stdQ + ' CÂU // ' + stdMin + ' PHÚT)</span>';

  const btnFull = $('btn-start-full');
  if (btnFull) btnFull.innerHTML = '<span>🔥 THI FULL TOÀN BỘ ĐỀ (' + fullQ + ' CÂU // ' + fullMin + ' PHÚT)</span>';

  if ($('rule-q-count')) $('rule-q-count').textContent = stdQ;
  if ($('rule-p1-time')) $('rule-p1-time').textContent = stdMin;
  if ($('rule-full-q')) $('rule-full-q').textContent = fullQ;
  if ($('rule-full-time')) $('rule-full-time').textContent = fullMin;
}
`;

code = code.replace('function initApp() {', updateLabelsFunc + '\nfunction initApp() {');

// Call updateStartScreenLabels in initApp()
code = code.replace(
  `  $('rule-q-count').textContent = Math.min(QUESTIONS_PER_GAME, ALL_QUESTIONS.length);
  $('rule-p1-time').textContent = Math.round(PART1_LIMIT_MS / 60000);`,
  `  updateStartScreenLabels();`
);

// Call updateStartScreenLabels when bank or configs update
code = code.replace(/renderBankList\(\);/g, 'renderBankList(); updateStartScreenLabels();');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully added Full Exam mode to build_v5.3.js!');
