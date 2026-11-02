const fs = require('fs');
const path = require('path');
const vm = require('vm');

const localStorageData = {};
const sessionStorageData = {};

const mockLocalStorage = {
  getItem: (k) => localStorageData[k] !== undefined ? localStorageData[k] : null,
  setItem: (k, v) => { localStorageData[k] = String(v); },
  removeItem: (k) => { delete localStorageData[k]; }
};

const mockSessionStorage = {
  getItem: (k) => sessionStorageData[k] !== undefined ? sessionStorageData[k] : null,
  setItem: (k, v) => { sessionStorageData[k] = String(v); },
  removeItem: (k) => { delete sessionStorageData[k]; }
};

const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id: id,
      value: '',
      checked: false,
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      addEventListener: () => {},
      focus: () => {},
      appendChild: () => {},
      removeChild: () => {}
    };
  }
  return elements[id];
}

const mockDocument = {
  getElementById: (id) => getEl(id),
  querySelectorAll: () => [],
  querySelector: () => null,
  createElement: (tag) => getEl('mock_' + Math.random()),
  addEventListener: () => {},
  body: { appendChild: () => {}, removeChild: () => {} }
};

const mockWindow = {
  location: { search: '', hash: '', origin: 'https://vthanhtai.id.vn', pathname: '/' },
  scrollTo: () => {},
  addEventListener: () => {}
};

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
const scriptCode = html.substring(scriptStart + 8, scriptEnd);

const sandbox = {
  window: mockWindow,
  document: mockDocument,
  localStorage: mockLocalStorage,
  sessionStorage: mockSessionStorage,
  navigator: { vibrate: () => {}, clipboard: { writeText: () => Promise.resolve() } },
  URLSearchParams: class {
    constructor(s) {}
    has(k) { return false; }
    get(k) { return null; }
  },
  AudioContext: class {
    constructor() { this.state = 'running'; this.currentTime = 0; }
    createOscillator() { return { connect: () => {}, frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, start: () => {}, stop: () => {} }; }
    createGain() { return { connect: () => {}, gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } }; }
  },
  console: console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
  requestAnimationFrame: (fn) => fn(),
  Date: Date,
  Math: Math,
  JSON: JSON,
  String: String,
  Number: Number,
  Array: Array,
  parseInt: parseInt
};

vm.createContext(sandbox);
vm.runInContext(scriptCode, sandbox);

function evalInCtx(expr) {
  return vm.runInContext(expr, sandbox);
}

console.log('\n--- 1. Testing Standard Mode startQuiz(false) ---');
getEl('student-id').value = 'SV_STD';
getEl('student-fullname').value = 'Thi Sinh Chuan';
getEl('pass-input').value = 'Thithu@123';
getEl('start-error').textContent = '';

evalInCtx('startQuiz(false)');

const stdQLen = evalInCtx('questions.length');
const stdTimeMs = evalInCtx('activePart1LimitMs');
const isStdFull = evalInCtx('isCurrentQuizFull');

console.log('Standard mode questions length:', stdQLen);
console.log('Standard mode time in minutes:', Math.round(stdTimeMs / 60000));
console.log('Standard mode isCurrentQuizFull:', isStdFull);

if (stdQLen === 45 && Math.round(stdTimeMs / 60000) === 35 && !isStdFull) {
  console.log('✅ Standard Mode passed: 45 questions in 35 minutes.');
} else {
  console.error('❌ Standard Mode mismatch!');
  process.exit(1);
}

console.log('\n--- 2. Testing Full Exam Mode startQuiz(true) ---');
getEl('student-id').value = 'SV_FULL';
getEl('student-fullname').value = 'Thi Sinh Full De';
getEl('pass-input').value = 'Thithu@123';
getEl('start-error').textContent = '';

evalInCtx('startQuiz(true)');

const fullQLen = evalInCtx('questions.length');
const fullTimeMs = evalInCtx('activePart1LimitMs');
const isFull = evalInCtx('isCurrentQuizFull');

console.log('Full mode questions length:', fullQLen);
console.log('Full mode time in minutes:', Math.round(fullTimeMs / 60000));
console.log('Full mode isCurrentQuizFull:', isFull);

// Expected: 119 questions, time = Math.round(119 * (35 / 45)) = 93 minutes!
if (fullQLen === 119 && Math.round(fullTimeMs / 60000) === 93 && isFull) {
  console.log('✅ Full Exam Mode passed: 119 questions in 93 minutes (proportional)!');
} else {
  console.error('❌ Full Exam Mode mismatch!');
  process.exit(1);
}

console.log('\n--- 3. Testing showResult() with 105/119 in Full Mode ---');
evalInCtx('correctCount = 105; wrongCount = 14; totalTimeUsed = 2400;');
evalInCtx('showResult()');

const title = getEl('result-title').textContent;
const correctDisplay = getEl('stat-correct').textContent;
console.log('Result title:', title);
console.log('Correct stat display:', correctDisplay);

if (title.includes('8.8 ĐIỂM') && title.includes('FULL ĐỀ') && correctDisplay === '105/119') {
  console.log('✅ showResult in Full Mode accurately scaled to 8.8/10 and displayed 105/119!');
} else {
  console.error('❌ showResult mismatch!', title, correctDisplay);
  process.exit(1);
}

console.log('\n===========================================');
console.log('🎉 ALL FULL EXAM MODE TESTS PASSED 100%!');
console.log('===========================================\n');
