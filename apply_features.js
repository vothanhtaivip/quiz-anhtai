const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build_v5.3.js');
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Update KEY_QS to v7
code = code.replace(
  "const KEY_QS = 'at_custom_questions_v6';",
  "const KEY_QS = 'at_custom_questions_v7';\nconst KEY_WRONG_HISTORY = 'at_wrong_history_v7';"
);

// 2. Add global variables for wrong question tracking and retries
const oldGlobals = `let isCurrentQuizFull = false;
let currentQuestionShuffleIdx = [];
let currentQuestionOrigOpts = [];`;

const newGlobals = `let isCurrentQuizFull = false;
let currentQuestionShuffleIdx = [];
let currentQuestionOrigOpts = [];
let sessionWrongQuestions = [];
let totalOriginalQuestions = 0;
let isRetryingWrong = false;`;

if (code.includes(oldGlobals)) {
  code = code.replace(oldGlobals, newGlobals);
} else {
  console.log('Notice: oldGlobals not found exactly, searching for isCurrentQuizFull...');
  code = code.replace('let isCurrentQuizFull = false;', 'let isCurrentQuizFull = false;\nlet sessionWrongQuestions = [];\nlet totalOriginalQuestions = 0;\nlet isRetryingWrong = false;');
}

// 3. Add saveWrongHistoryItem helper
const oldRecordSub1 = 'function recordSubmissionPart1(grade10, avgTime) {';
const newHistoryHelper = `function saveWrongHistoryItem(item) {
  try {
    let history = JSON.parse(localStorage.getItem(KEY_WRONG_HISTORY) || '[]');
    if (!Array.isArray(history)) history = [];
    history.unshift({
      timestamp: Date.now(),
      student: currentPlayerName || 'Ẩn danh',
      tag: item.tag,
      q: item.q,
      chosenText: item.chosenText,
      correctText: item.correctText,
      explain: item.explain
    });
    if (history.length > 100) history = history.slice(0, 100);
    localStorage.setItem(KEY_WRONG_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Lỗi khi lưu lịch sử câu sai:', e);
  }
}

function recordSubmissionPart1(grade10, avgTime) {`;

code = code.replace(oldRecordSub1, newHistoryHelper);

// 4. Update recordSubmissionPart1 to update existing record instead of creating duplicate if retrying
const oldSubRecordLogic = `  const subs = getStudentSubmissions();
  currentSubmissionId = generateUUID();

  const record = {
    id: currentSubmissionId,
    studentId: currentStudentId,
    studentFullname: currentStudentFullname,
    score: score,
    grade10: grade10,
    correctCount: correctCount,
    wrongCount: wrongCount,
    totalQuestions: questions.length,
    avgTime: avgTime,
    submittedAt: new Date().toLocaleString('vi-VN'),
    timestamp: Date.now(),
    status: isCurrentQuizFull ? 'Đã hoàn thành Trắc nghiệm (Full đề)' : 'Đã hoàn thành Trắc nghiệm (Chuẩn)',
    reviewLog: reviewLog,
    essayQuestion: '',
    essayAnswer: '',
    essayWordCount: 0,
    essaySubmittedAt: null
  };

  subs.unshift(record);
  saveStudentSubmissions(subs);`;

const newSubRecordLogic = `  const subs = getStudentSubmissions();
  let record = currentSubmissionId ? subs.find(s => s.id === currentSubmissionId) : null;
  if (!record) {
    currentSubmissionId = generateUUID();
    record = {
      id: currentSubmissionId,
      studentId: currentStudentId,
      studentFullname: currentStudentFullname,
      essayQuestion: '',
      essayAnswer: '',
      essayWordCount: 0,
      essaySubmittedAt: null
    };
    subs.unshift(record);
  }

  record.score = score;
  record.grade10 = grade10;
  record.correctCount = correctCount;
  record.wrongCount = wrongCount;
  record.totalQuestions = totalOriginalQuestions || questions.length;
  record.avgTime = avgTime;
  record.submittedAt = new Date().toLocaleString('vi-VN');
  record.timestamp = Date.now();
  record.status = (isCurrentQuizFull ? 'Đã hoàn thành Trắc nghiệm (Full đề)' : 'Đã hoàn thành Trắc nghiệm (Chuẩn)') + (isRetryingWrong ? ' (Đã làm lại câu sai)' : '');
  record.reviewLog = reviewLog;

  saveStudentSubmissions(subs);`;

code = code.replace(oldSubRecordLogic, newSubRecordLogic);

// 5. Update HTML in result-screen for retry buttons & banners
const oldResultActions = `<div class="result-actions-cluster">
        <button type="button" class="btn-n8n-primary" id="btn-essay" onclick="goToEssay()" style="max-width:320px;background:linear-gradient(135deg, var(--n8n-purple), var(--n8n-indigo));box-shadow:0 8px 24px rgba(139,92,246,0.35);">
          <span>✍️ SANG PHẦN TỰ LUẬN (PHẦN 2) →</span>
        </button>
        <button type="button" class="btn-n8n-secondary" id="btn-review" onclick="toggleReview()">
          <span>📋 Xem Lại Đáp Án Trắc Nghiệm</span>
        </button>
      </div>`;

const newResultActions = `<!-- Retry Wrong Questions Banner & Cluster -->
      <div id="retry-eligible-banner" style="display:none;margin-bottom:16px;padding:12px 18px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);border-radius:10px;text-align:center;">
        <div style="font-weight:700;color:#fbbf24;font-size:14px;margin-bottom:4px;">⚡ BẠN CÒN THỜI GIAN LÀM BÀI PHẦN 1!</div>
        <div style="font-size:13px;color:#cbd5e1;">Bạn có <b id="retry-wrong-count-text" style="color:#f87171;">0</b> câu trả lời chưa đúng. Hãy bấm nút <b>"Làm Lại Câu Sai"</b> bên dưới để cải thiện điểm số trước khi hết giờ!</div>
      </div>

      <div id="retry-expired-banner" style="display:none;margin-bottom:16px;padding:10px 16px;background:rgba(148,163,184,0.1);border:1px solid rgba(148,163,184,0.25);border-radius:10px;text-align:center;">
        <div style="font-size:13px;color:#94a3b8;">⏰ Đã hết thời gian làm bài trắc nghiệm. Không thể thi lại câu sai.</div>
      </div>

      <div class="result-actions-cluster">
        <button type="button" class="btn-n8n-primary" id="btn-retry-wrong" onclick="retryWrongQuestions()" style="display:none;max-width:380px;background:linear-gradient(135deg, #f59e0b, #d97706);box-shadow:0 8px 24px rgba(245,158,11,0.35);border:1px solid #fbbf24;">
          <span id="btn-retry-wrong-text">🔄 LÀM LẠI CÂU SAI</span>
        </button>
        <button type="button" class="btn-n8n-primary" id="btn-essay" onclick="goToEssay()" style="max-width:320px;background:linear-gradient(135deg, var(--n8n-purple), var(--n8n-indigo));box-shadow:0 8px 24px rgba(139,92,246,0.35);">
          <span>✍️ SANG PHẦN TỰ LUẬN (PHẦN 2) →</span>
        </button>
        <button type="button" class="btn-n8n-secondary" id="btn-review" onclick="toggleReview()">
          <span>📋 Xem Lại Đáp Án Trắc Nghiệm</span>
        </button>
      </div>`;

code = code.replace(oldResultActions, newResultActions);

// 6. Update tickPart1 to update retry wrong button countdown when on result screen
const oldTickPart1 = `function tickPart1() {
  const remain = part1Remaining();
  const txt = fmtMMSS(remain);
  $('part1-time-left').textContent = txt;
  if (remain <= 0 && $('quiz-screen').style.display !== 'none') {
    endPart1ByTimeout();
  }
}`;

const newTickPart1 = `function tickPart1() {
  const remain = part1Remaining();
  const txt = fmtMMSS(remain);
  $('part1-time-left').textContent = txt;
  if (remain <= 0 && $('quiz-screen').style.display !== 'none') {
    endPart1ByTimeout();
  } else if ($('result-screen').style.display !== 'none') {
    updateRetryWrongUI();
  }
}`;

code = code.replace(oldTickPart1, newTickPart1);

// 7. Update startQuiz to reset sessionWrongQuestions, totalOriginalQuestions, isRetryingWrong
const oldStartQuizSetup = `  startPart1Clock();
  questions = shuffle(ALL_QUESTIONS).slice(0, qLimit);
  currentIdx = 0; score = 0; correctCount = 0; wrongCount = 0; totalTimeUsed = 0;
  combo = 0; maxCombo = 0; wrongStreak = 0; reviewLog = [];`;

const newStartQuizSetup = `  startPart1Clock();
  questions = shuffle(ALL_QUESTIONS).slice(0, qLimit);
  totalOriginalQuestions = qLimit;
  sessionWrongQuestions = [];
  isRetryingWrong = false;
  currentIdx = 0; score = 0; correctCount = 0; wrongCount = 0; totalTimeUsed = 0;
  combo = 0; maxCombo = 0; wrongStreak = 0; reviewLog = [];`;

code = code.replace(oldStartQuizSetup, newStartQuizSetup);

// 8. Update selectAnswer for automatic explanation display without clicking, wrong tracking, and retrying logic
const oldSelectAnswerBody = `  if (chosen === correct) {
    combo++; wrongStreak = 0;
    if (combo > maxCombo) maxCombo = combo;

    // Reset danger screen overlay
    $('screen-danger-overlay').classList.remove('active');

    const speedBonus = timeUsed <= 5 ? 2 : (timeUsed <= 12 ? 1 : 0);
    const comboBonus = combo >= 3 ? (combo - 3) : 0;
    const gained = 4 + speedBonus + comboBonus;
    score += gained; correctCount++;

    if (combo >= 2) {
      playSound('combo');
      triggerHaptic('combo');
      flashComboEffect(combo);
    } else {
      playSound('correct');
      triggerHaptic('correct');
    }

    let msg = '✅ Chính xác! +' + gained + ' điểm';
    if (speedBonus > 0) msg += ' ⚡ (Tốc độ)';
    if (combo >= 2) msg += ' 🔥 (Combo x' + combo + ')';

    fb.className = 'execution-feedback-bar correct-fb show';
    fb.innerHTML = msg + (explain ? '<div style="margin-top:8px;font-size:13px;font-weight:400;color:#a8f0d8;line-height:1.5;border-top:1px solid rgba(255,255,255,.12);padding-top:8px;">💡 ' + escHtml(explain) + '</div>' : '');
  } else {
    combo = 0; wrongStreak++; wrongCount++;
    hideComboBanner();

    if (wrongStreak >= 2) {
      playSound('wrong-streak');
      triggerHaptic('wrong-streak');
      flashDangerEffect(wrongStreak);
    } else {
      playSound('wrong');
      triggerHaptic('wrong');
    }

    applyPenalty(fb, wrongStreak, explain);
  }`;

const newSelectAnswerBody = `  const keys = ['A', 'B', 'C', 'D'];

  if (chosen === correct) {
    combo++; wrongStreak = 0;
    if (combo > maxCombo) maxCombo = combo;

    // Reset danger screen overlay
    $('screen-danger-overlay').classList.remove('active');

    const speedBonus = timeUsed <= 5 ? 2 : (timeUsed <= 12 ? 1 : 0);
    const comboBonus = combo >= 3 ? (combo - 3) : 0;
    const gained = 4 + speedBonus + comboBonus;
    score += gained;

    if (isRetryingWrong) {
      correctCount++;
      wrongCount = Math.max(0, wrongCount - 1);
    } else {
      correctCount++;
    }

    if (combo >= 2) {
      playSound('combo');
      triggerHaptic('combo');
      flashComboEffect(combo);
    } else {
      playSound('correct');
      triggerHaptic('correct');
    }

    let msg = '✅ Chính xác! +' + gained + ' điểm';
    if (speedBonus > 0) msg += ' ⚡ (Tốc độ)';
    if (combo >= 2) msg += ' 🔥 (Combo x' + combo + ')';

    fb.className = 'execution-feedback-bar correct-fb show';
    fb.innerHTML =
      '<div style="font-weight:800;font-size:15px;color:#10b981;margin-bottom:6px;">' + msg + '</div>' +
      (explain ? (
        '<div style="margin-top:6px;font-size:13px;font-weight:400;color:#a8f0d8;line-height:1.55;background:rgba(0,0,0,0.2);padding:8px 12px;border-radius:6px;border-left:3px solid var(--n8n-emerald);">' +
          '💡 <b>Giải thích:</b> ' + escHtml(explain) +
        '</div>'
      ) : '');
  } else {
    combo = 0; wrongStreak++;
    if (!isRetryingWrong) wrongCount++;
    hideComboBanner();

    if (wrongStreak >= 2) {
      playSound('wrong-streak');
      triggerHaptic('wrong-streak');
      flashDangerEffect(wrongStreak);
    } else {
      playSound('wrong');
      triggerHaptic('wrong');
    }

    // Save wrong question for session retry
    sessionWrongQuestions.push({
      qObj: questions[currentIdx],
      tag: tag || 'Digital Marketing',
      q: qText,
      chosen: chosen,
      correct: correct,
      explain: explain || ''
    });

    const chosenText = chosen >= 0 ? (keys[chosen] + '. ' + origOpts[shuffleIdx[chosen]]) : 'Hết giờ (chưa chọn)';
    const correctText = keys[correct] + '. ' + origOpts[shuffleIdx[correct]];

    saveWrongHistoryItem({
      tag: tag || 'Digital Marketing',
      q: qText,
      chosenText: chosenText,
      correctText: correctText,
      explain: explain || ''
    });

    applyPenalty(fb, wrongStreak, explain, correct, shuffleIdx, origOpts);
  }`;

code = code.replace(oldSelectAnswerBody, newSelectAnswerBody);

// 9. Update applyPenalty to show prominent automatic explanation card with correct answer
const oldApplyPenalty = `function applyPenalty(fb, streak, explain) {
  let penalty = 0, msg = '';
  if (streak === 1) {
    msg = '❌ Chưa đúng! ⚠️ Chú ý: Sai thêm câu nữa sẽ bị trừ điểm!';
  } else {
    penalty = streak >= 4 ? 4 : (streak >= 3 ? 3 : 2);
    score = Math.max(0, score - penalty);
    msg = '❌ SAI LẦN ' + streak + ' LIÊN TIẾP! −' + penalty + ' điểm 💸';
  }

  fb.className = 'execution-feedback-bar wrong-fb show';
  fb.innerHTML = msg + (explain ? '<div style="margin-top:8px;font-size:13px;font-weight:400;color:#ffa4bc;line-height:1.5;border-top:1px solid rgba(255,255,255,.12);padding-top:8px;">💡 ' + escHtml(explain) + '</div>' : '');
}`;

const newApplyPenalty = `function applyPenalty(fb, streak, explain, correct, shuffleIdx, origOpts) {
  let penalty = 0, msg = '';
  if (streak === 1) {
    msg = '❌ Chưa đúng! ⚠️ Chú ý: Sai thêm câu nữa sẽ bị trừ điểm!';
  } else {
    penalty = streak >= 4 ? 4 : (streak >= 3 ? 3 : 2);
    score = Math.max(0, score - penalty);
    msg = '❌ SAI LẦN ' + streak + ' LIÊN TIẾP! −' + penalty + ' điểm 💸';
  }

  const keys = ['A', 'B', 'C', 'D'];
  const correctKey = (correct !== undefined && keys[correct]) ? keys[correct] : '';
  const correctText = (origOpts && shuffleIdx && correct !== undefined) ? origOpts[shuffleIdx[correct]] : '';

  fb.className = 'execution-feedback-bar wrong-fb show';
  fb.innerHTML =
    '<div style="font-weight:800;font-size:15px;color:#f43f5e;margin-bottom:6px;">' + msg + '</div>' +
    (correctText ? (
      '<div style="font-size:13.5px;color:#e2e8f0;margin-bottom:8px;background:rgba(0,0,0,0.25);padding:8px 12px;border-radius:6px;border-left:3px solid var(--n8n-emerald);">' +
        '👉 <b>Đáp án đúng:</b> <span style="color:#34d399;font-weight:700;">' + correctKey + '. ' + escHtml(correctText) + '</span>' +
      '</div>'
    ) : '') +
    (explain ? (
      '<div style="font-size:13px;color:#f1f5f9;line-height:1.55;background:rgba(255,255,255,0.05);padding:8px 12px;border-radius:6px;border-left:3px solid var(--n8n-coral);">' +
        '💡 <b>Giải thích ngắn gọn:</b> ' + escHtml(explain) +
      '</div>'
    ) : '');
}`;

code = code.replace(oldApplyPenalty, newApplyPenalty);

// 10. Update timeOut for wrong tracking, history saving, and automatic explanation
const oldTimeOut = `function timeOut(correct, explain, tag, qText, shuffleIdx, origOpts) {
  combo = 0; wrongStreak++; wrongCount++;
  hideComboBanner();

  if (wrongStreak >= 2) {
    playSound('wrong-streak');
    triggerHaptic('wrong-streak');
    flashDangerEffect(wrongStreak);
  } else {
    playSound('wrong');
    triggerHaptic('wrong');
  }

  answered = true;
  const opts = document.querySelectorAll('.opt-node-output');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('reveal');
  });

  const fb = $('feedback');
  let msg = '⏰ Hết 30 giây! Tính là câu sai.';
  if (wrongStreak >= 2) {
    const penalty = wrongStreak >= 4 ? 4 : (wrongStreak >= 3 ? 3 : 2);
    score = Math.max(0, score - penalty);
    msg += ' Sai ' + wrongStreak + ' lần liên tiếp — −' + penalty + ' điểm 💸';
  }

  fb.className = 'execution-feedback-bar wrong-fb show';
  fb.innerHTML = msg + (explain ? '<div style="margin-top:8px;font-size:13px;font-weight:400;color:#ffa4bc;line-height:1.5;border-top:1px solid rgba(255,255,255,.12);padding-top:8px;">💡 ' + escHtml(explain) + '</div>' : '');

  updateComboDisplay();
  const shuffledOpts = [0,1,2,3].map(j => origOpts[shuffleIdx[j]]);
  reviewLog.push({
    tag: tag || 'Digital Marketing',
    q: qText,
    chosen: -1,
    correct: correct,
    explain: explain || '',
    isCorrect: false,
    opts: shuffledOpts
  });

  $('score-display').textContent = score;
  $('next-btn').disabled = false;
}`;

const newTimeOut = `function timeOut(correct, explain, tag, qText, shuffleIdx, origOpts) {
  combo = 0; wrongStreak++;
  if (!isRetryingWrong) wrongCount++;
  hideComboBanner();

  if (wrongStreak >= 2) {
    playSound('wrong-streak');
    triggerHaptic('wrong-streak');
    flashDangerEffect(wrongStreak);
  } else {
    playSound('wrong');
    triggerHaptic('wrong');
  }

  answered = true;
  const opts = document.querySelectorAll('.opt-node-output');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('reveal');
  });

  const keys = ['A', 'B', 'C', 'D'];
  const correctKey = keys[correct] || '';
  const correctText = (origOpts && shuffleIdx) ? origOpts[shuffleIdx[correct]] : '';

  // Track wrong question for retry
  sessionWrongQuestions.push({
    qObj: questions[currentIdx],
    tag: tag || 'Digital Marketing',
    q: qText,
    chosen: -1,
    correct: correct,
    explain: explain || ''
  });

  saveWrongHistoryItem({
    tag: tag || 'Digital Marketing',
    q: qText,
    chosenText: '⏰ Hết giờ (chưa chọn)',
    correctText: correctKey + '. ' + correctText,
    explain: explain || ''
  });

  const fb = $('feedback');
  let msg = '⏰ Hết 30 giây! Tính là câu sai.';
  if (wrongStreak >= 2) {
    const penalty = wrongStreak >= 4 ? 4 : (wrongStreak >= 3 ? 3 : 2);
    score = Math.max(0, score - penalty);
    msg += ' Sai ' + wrongStreak + ' lần liên tiếp — −' + penalty + ' điểm 💸';
  }

  fb.className = 'execution-feedback-bar wrong-fb show';
  fb.innerHTML =
    '<div style="font-weight:800;font-size:15px;color:#f43f5e;margin-bottom:6px;">' + msg + '</div>' +
    (correctText ? (
      '<div style="font-size:13.5px;color:#e2e8f0;margin-bottom:8px;background:rgba(0,0,0,0.25);padding:8px 12px;border-radius:6px;border-left:3px solid var(--n8n-emerald);">' +
        '👉 <b>Đáp án đúng:</b> <span style="color:#34d399;font-weight:700;">' + correctKey + '. ' + escHtml(correctText) + '</span>' +
      '</div>'
    ) : '') +
    (explain ? (
      '<div style="font-size:13px;color:#f1f5f9;line-height:1.55;background:rgba(255,255,255,0.05);padding:8px 12px;border-radius:6px;border-left:3px solid var(--n8n-coral);">' +
        '💡 <b>Giải thích ngắn gọn:</b> ' + escHtml(explain) +
      '</div>'
    ) : '');

  updateComboDisplay();
  const shuffledOpts = [0,1,2,3].map(j => origOpts[shuffleIdx[j]]);
  reviewLog.push({
    tag: tag || 'Digital Marketing',
    q: qText,
    chosen: -1,
    correct: correct,
    explain: explain || '',
    isCorrect: false,
    opts: shuffledOpts
  });

  $('score-display').textContent = score;
  $('next-btn').disabled = false;
}`;

code = code.replace(oldTimeOut, newTimeOut);

// 11. Update showResult to calculate grade using totalOriginalQuestions and update retry wrong UI
const oldShowResultTotalQ = `  const totalQ = Math.max(1, questions.length);
  const ratio = correctCount / totalQ;
  const grade10 = Number((ratio * 10).toFixed(1));`;

const newShowResultTotalQ = `  const totalQ = Math.max(1, totalOriginalQuestions || questions.length);
  const ratio = Math.min(1, correctCount / totalQ);
  const grade10 = Number((ratio * 10).toFixed(1));`;

code = code.replace(oldShowResultTotalQ, newShowResultTotalQ);

const oldShowResultEnd = `  // Record submission in CMS storage
  recordSubmissionPart1(grade10, avgTime);

  if (score > 120) {
    playSound('win');
    launchConfetti();
  }
}`;

const newShowResultEnd = `  // Record submission in CMS storage
  recordSubmissionPart1(grade10, avgTime);

  // Update retry UI for wrong questions
  updateRetryWrongUI();

  if (score > 120) {
    playSound('win');
    launchConfetti();
  }
}

function updateRetryWrongUI() {
  const btnRetry = $('btn-retry-wrong');
  const bannerEligible = $('retry-eligible-banner');
  const bannerExpired = $('retry-expired-banner');
  const rem = part1Remaining();
  const canRetry = sessionWrongQuestions.length > 0 && rem > 10000 && !part1TimedOut;

  if (btnRetry) {
    if (canRetry) {
      btnRetry.style.display = 'inline-flex';
      $('btn-retry-wrong-text').textContent = '🔄 LÀM LẠI CÂU SAI (' + sessionWrongQuestions.length + ' CÂU // CÒN ' + fmtMMSS(rem) + ')';
      if (bannerEligible) {
        bannerEligible.style.display = 'block';
        $('retry-wrong-count-text').textContent = sessionWrongQuestions.length;
      }
      if (bannerExpired) bannerExpired.style.display = 'none';
    } else {
      btnRetry.style.display = 'none';
      if (bannerEligible) bannerEligible.style.display = 'none';
      if (sessionWrongQuestions.length > 0 && (part1TimedOut || rem <= 10000)) {
        if (bannerExpired) bannerExpired.style.display = 'block';
      } else if (bannerExpired) {
        bannerExpired.style.display = 'none';
      }
    }
  }
}

function retryWrongQuestions() {
  if (sessionWrongQuestions.length === 0 || part1TimedOut || part1Remaining() <= 10000) return;
  playSound('click');
  triggerHaptic('tap');
  isRetryingWrong = true;

  // Extract question objects from wrong questions
  const retryList = sessionWrongQuestions.map(item => item.qObj);
  sessionWrongQuestions = []; // Reset wrong list for this retry pass

  questions = retryList;
  currentIdx = 0;
  answered = false;
  quizActive = true;
  combo = 0;
  wrongStreak = 0;

  showScreen('quiz-screen');
  $('score-display').textContent = score;
  $('combo-display').style.display = 'none';
  $('combo-banner').style.display = 'none';

  loadQuestion();
}`;

code = code.replace(oldShowResultEnd, newShowResultEnd);

// 12. Update buildReview for enhanced explanation formatting
const oldBuildReviewItem = `      '<div style="font-size:13.5px;margin-bottom:8px;">Đáp án đúng: <span style="font-weight:700;color:var(--n8n-emerald);">' + keys[item.correct] + '. ' + escHtml(item.opts[item.correct]) + '</span></div>' +
      '<div style="font-size:13px;color:var(--text-muted);border-top:1px solid var(--border-subtle);padding-top:8px;">💡 ' + escHtml(item.explain || '(Không có giải thích)') + '</div>';`;

const newBuildReviewItem = `      '<div style="font-size:13.5px;margin-bottom:8px;">Đáp án đúng: <span style="font-weight:700;color:var(--n8n-emerald);">' + keys[item.correct] + '. ' + escHtml(item.opts[item.correct]) + '</span></div>' +
      '<div style="font-size:13px;color:#e2e8f0;background:rgba(255,255,255,0.05);padding:10px 12px;border-radius:6px;border-left:3px solid ' + (item.isCorrect ? 'var(--n8n-emerald)' : 'var(--n8n-coral)') + ';margin-top:8px;">💡 <b>Giải thích:</b> ' + escHtml(item.explain || 'Kiến thức cốt lõi môn Digital Marketing') + '</div>';`;

code = code.replace(oldBuildReviewItem, newBuildReviewItem);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated build_v5.3.js with retry wrong questions and automatic explanations!');
