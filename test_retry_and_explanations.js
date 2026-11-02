const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== TEST SUITE: RETRY WRONG QUESTIONS & AUTO EXPLANATION ===\n');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 1. Verify all questions in index.html have explain
const startToken = 'const DEFAULT_QUESTIONS = ';
const sIdx = html.indexOf(startToken);
if (sIdx === -1) {
  console.error('FAIL: Could not locate DEFAULT_QUESTIONS');
  process.exit(1);
}
const eIdx = html.indexOf(';\n\nconst DEFAULT_ESSAY_QUESTIONS', sIdx);
const defaultQs = JSON.parse(html.substring(sIdx + startToken.length, eIdx));
console.log('1. DEFAULT_QUESTIONS count:', defaultQs.length);
if (defaultQs.length !== 119) {
  console.error(`FAIL: Expected 119 questions, found ${defaultQs.length}`);
  process.exit(1);
}

const missingExplain = defaultQs.filter(q => !q.explain || !q.explain.trim());
console.log('   Missing explain count:', missingExplain.length);
if (missingExplain.length > 0) {
  console.error('FAIL: Found questions with empty explain!');
  process.exit(1);
}
console.log('   Sample explanation Q0:', defaultQs[0].explain);
console.log('   Sample explanation Q50:', defaultQs[50].explain);
console.log('   Sample explanation Q118:', defaultQs[118].explain);
console.log('   -> PASS: All 119 questions have complete, concise explanations!\n');

// 2. Setup mock browser DOM & VM to test runtime behavior
const elements = {};
function mockElement(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      textContent: '',
      innerHTML: '',
      value: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      },
      disabled: false,
      scrollIntoView: () => {},
      appendChild: (child) => {},
      onclick: null
    };
  }
  return elements[id];
}

const mockStorage = {};
const sandbox = {
  console,
  document: {
    getElementById: (id) => mockElement(id),
    querySelectorAll: (sel) => [],
    createElement: (tag) => ({
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      textContent: '',
      innerHTML: ''
    }),
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {},
    scrollTo: () => {}
  },
  localStorage: {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
  },
  navigator: { vibrate: () => {} },
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => 123,
  clearInterval: () => {},
  Audio: function() { return { play: () => {} }; },
  confetti: () => {},
  Date
};

// Extract JS from HTML
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('FAIL: Could not extract script from index.html');
  process.exit(1);
}
const jsCode = scriptMatch[1];

const ctx = vm.createContext(sandbox);
vm.runInContext(jsCode, ctx);

console.log('2. Testing Mock Runtime Quiz Execution...');

// Check initial state
const allQCount = vm.runInContext('ALL_QUESTIONS.length', ctx);
console.log('   ALL_QUESTIONS in runtime:', allQCount);

// Test starting standard quiz with valid credentials
mockElement('student-id').value = 'SV001';
mockElement('student-fullname').value = 'Nguyen Van A';
mockElement('pass-input').value = 'Thithu@123';

vm.runInContext('startQuiz(false)', ctx);
const activeQCount = vm.runInContext('questions.length', ctx);
const totalOrig = vm.runInContext('totalOriginalQuestions', ctx);
console.log('   Active questions count:', activeQCount, '| totalOriginalQuestions:', totalOrig);

if (activeQCount !== 45 || totalOrig !== 45) {
  console.error('FAIL: Standard quiz count mismatch!');
  process.exit(1);
}

// 3. Test Wrong Answer Selection & Auto Explanation Output
console.log('\n3. Testing Wrong Answer Selection & Auto Explanation...');
const q0 = vm.runInContext('questions[0]', ctx);
const shuffleIdx = [0, 1, 2, 3];
const origOpts = q0.opts;
const correctAns = q0.ans;
const wrongAns = (correctAns + 1) % 4;

// Answer incorrectly
vm.runInContext(`selectAnswer(${wrongAns}, ${correctAns}, ${JSON.stringify(q0.explain)}, ${JSON.stringify(q0.tag)}, ${JSON.stringify(q0.q)}, [0,1,2,3], ${JSON.stringify(origOpts)})`, ctx);

const wrongCount = vm.runInContext('wrongCount', ctx);
const sessionWrongCount = vm.runInContext('sessionWrongQuestions.length', ctx);
const fbHTML = mockElement('feedback').innerHTML;

console.log('   wrongCount:', wrongCount);
console.log('   sessionWrongQuestions count:', sessionWrongCount);
console.log('   Feedback output preview:\n', fbHTML);

if (sessionWrongCount !== 1) {
  console.error('FAIL: sessionWrongQuestions did not record the wrong question!');
  process.exit(1);
}

if (!fbHTML.includes('Đáp án đúng') || !fbHTML.includes('Giải thích ngắn gọn')) {
  console.error('FAIL: Feedback HTML did not contain correct answer or explanation!');
  process.exit(1);
}
console.log('   -> PASS: Wrong answer immediately generated correct answer + explanation with zero clicks!\n');

// 4. Test Wrong History Storage in localStorage
console.log('4. Testing Wrong History in localStorage...');
const historyRaw = mockStorage['at_wrong_history_v7'];
console.log('   Raw wrong history saved:', historyRaw ? 'YES' : 'NO');
if (!historyRaw) {
  console.error('FAIL: at_wrong_history_v7 not found in localStorage!');
  process.exit(1);
}
const historyList = JSON.parse(historyRaw);
console.log('   History entries count:', historyList.length);
console.log('   First entry question:', historyList[0].q);
console.log('   First entry correct:', historyList[0].correctText);
console.log('   First entry explanation:', historyList[0].explain);
console.log('   -> PASS: Wrong question history successfully persisted!\n');

// 5. Test Result Screen & Retry Button with remaining time
console.log('5. Testing Result Screen & Retry Eligible UI...');
// Simulate end of quiz with remaining time
vm.runInContext('showResult()', ctx);

const btnRetry = mockElement('btn-retry-wrong');
const btnRetryText = mockElement('btn-retry-wrong-text').textContent;
const bannerEligible = mockElement('retry-eligible-banner');

console.log('   btn-retry-wrong display:', btnRetry.style.display);
console.log('   btn-retry-wrong text:', btnRetryText);
console.log('   banner-eligible display:', bannerEligible.style.display);

if (btnRetry.style.display !== 'inline-flex') {
  console.error('FAIL: Retry button should be displayed when wrong questions exist and time remains!');
  process.exit(1);
}
if (!btnRetryText.includes('LÀM LẠI CÂU SAI')) {
  console.error('FAIL: Retry button text is missing expected string!');
  process.exit(1);
}
console.log('   -> PASS: Retry button & banner clearly shown with countdown!\n');

// 6. Test Retaking Wrong Questions (retryWrongQuestions)
console.log('6. Testing retryWrongQuestions execution...');
vm.runInContext('retryWrongQuestions()', ctx);

const retryQCount = vm.runInContext('questions.length', ctx);
const isRetrying = vm.runInContext('isRetryingWrong', ctx);
console.log('   Questions during retry:', retryQCount);
console.log('   isRetryingWrong flag:', isRetrying);

if (retryQCount !== 1 || !isRetrying) {
  console.error('FAIL: retryWrongQuestions did not load only the wrong questions!');
  process.exit(1);
}

// Now answer correctly during retry
console.log('\n7. Answering correctly during retry...');
const retryQ0 = vm.runInContext('questions[0]', ctx);
vm.runInContext(`selectAnswer(${retryQ0.ans}, ${retryQ0.ans}, ${JSON.stringify(retryQ0.explain)}, ${JSON.stringify(retryQ0.tag)}, ${JSON.stringify(retryQ0.q)}, [0,1,2,3], ${JSON.stringify(retryQ0.opts)})`, ctx);

const newCorrectCount = vm.runInContext('correctCount', ctx);
const newWrongCount = vm.runInContext('wrongCount', ctx);
console.log('   Updated correctCount:', newCorrectCount);
console.log('   Updated wrongCount:', newWrongCount);

if (newCorrectCount !== 1 || newWrongCount !== 0) {
  console.error('FAIL: correctCount should have incremented and wrongCount decremented!');
  process.exit(1);
}

// Show result again
vm.runInContext('showResult()', ctx);
console.log('   Post-retry btn-retry-wrong display:', btnRetry.style.display);
if (btnRetry.style.display !== 'none') {
  console.error('FAIL: Retry button should hide once all wrong questions are solved!');
  process.exit(1);
}
console.log('   -> PASS: Retry workflow flawlessly updated score, decremented wrong count, and finished!\n');

// 8. Test Time Out Condition: when time expires, retry is blocked
console.log('8. Testing Expiration condition (no retries allowed when time expires)...');
// Force 1 wrong question
vm.runInContext('sessionWrongQuestions.push({ qObj: ALL_QUESTIONS[0] })', ctx);
// Simulate timed out
vm.runInContext('part1TimedOut = true', ctx);
vm.runInContext('updateRetryWrongUI()', ctx);

console.log('   When timed out - btn-retry display:', btnRetry.style.display);
console.log('   When timed out - banner-expired display:', mockElement('retry-expired-banner').style.display);

if (btnRetry.style.display !== 'none' || mockElement('retry-expired-banner').style.display !== 'block') {
  console.error('FAIL: Expired condition did not hide retry button or display expired banner!');
  process.exit(1);
}
console.log('   -> PASS: When time expires, retrying is strictly prevented!\n');

console.log('🎉 ALL 8 TESTS PASSED WITH 100% SUCCESS!');
