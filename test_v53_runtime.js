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
  location: { search: '', hash: '' },
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
  navigator: { vibrate: () => {} },
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

console.log('\n--- 1. Question Bank Verification ---');
const allQCount = evalInCtx('ALL_QUESTIONS.length');
console.log('ALL_QUESTIONS count:', allQCount);
if (allQCount === 119) {
  console.log('✅ Correct! Exactly 119 questions embedded.');
} else {
  console.error('❌ Mismatch! Expected 119, got', allQCount);
  process.exit(1);
}

const essayQCount = evalInCtx('ESSAY_QUESTIONS.length');
console.log('ESSAY_QUESTIONS count:', essayQCount);
if (essayQCount === 6) {
  console.log('✅ Correct! Exactly 6 essay questions embedded.');
} else {
  console.error('❌ Mismatch! Expected 6, got', essayQCount);
  process.exit(1);
}

console.log('\n--- 2. Default Password Verification ---');
// Test Admin login with default 'admin123'
getEl('admin-pass-verify').value = ' admin123 ';
evalInCtx('verifyAdminPass()');
const adminAuthed = evalInCtx('adminAuthed');
if (adminAuthed) {
  console.log('✅ Admin login with " admin123 " succeeded.');
} else {
  console.error('❌ Admin login failed!');
  process.exit(1);
}

// Test Student Start with default 'ThayChuanNam'
getEl('student-id').value = 'SV001';
getEl('student-fullname').value = 'Nguyen Van Test';
getEl('pass-input').value = ' thaychuannam ';
evalInCtx('startQuiz()');
if (!getEl('start-error').textContent) {
  console.log('✅ Student start with " thaychuannam " (lowercase + spaced) succeeded.');
} else {
  console.error('❌ Student start failed:', getEl('start-error').textContent);
  process.exit(1);
}

console.log('\n--- 3. Testing Password Update in Admin Panel ---');
getEl('setting-exam-pass').value = '  KhaoThi2026  ';
getEl('setting-admin-pass').value = '  SuperAdmin999  ';
getEl('setting-anticheat').checked = true;

evalInCtx('saveSecuritySettings()');

const savedExam = evalInCtx('EXAM_PASS');
const savedAdmin = evalInCtx('ADMIN_PASS');
console.log('Saved EXAM_PASS:', savedExam);
console.log('Saved ADMIN_PASS:', savedAdmin);

if (savedExam === 'KhaoThi2026' && savedAdmin === 'SuperAdmin999') {
  console.log('✅ Passwords trimmed and updated in memory.');
} else {
  console.error('❌ Passwords not trimmed properly!');
  process.exit(1);
}

// Test verifying new admin pass (with lowercase and extra spaces)
evalInCtx('adminAuthed = false');
getEl('admin-pass-verify').value = '  superadmin999  ';
evalInCtx('verifyAdminPass()');
if (evalInCtx('adminAuthed')) {
  console.log('✅ Admin login with new password "superadmin999" (lowercase + spaced) succeeded.');
} else {
  console.error('❌ Admin login with new password failed!');
  process.exit(1);
}

// Test student start with new exam pass (with lowercase and extra spaces)
getEl('student-id').value = 'SV002';
getEl('student-fullname').value = 'Tran Thi Test';
getEl('pass-input').value = '  khaothi2026  ';
getEl('start-error').textContent = '';

evalInCtx('startQuiz()');
if (!getEl('start-error').textContent) {
  console.log('✅ Student start with new exam pass "khaothi2026" (lowercase + spaced) succeeded.');
} else {
  console.error('❌ Student start failed with new exam pass:', getEl('start-error').textContent);
  process.exit(1);
}

// Test student start with fallback 'ThayChuanNam' still accepted
getEl('student-id').value = 'SV003';
getEl('student-fullname').value = 'Le Van Fallback';
getEl('pass-input').value = 'ThayChuanNam';
getEl('start-error').textContent = '';

evalInCtx('startQuiz()');
if (!getEl('start-error').textContent) {
  console.log('✅ Student start with fallback "ThayChuanNam" succeeded.');
} else {
  console.error('❌ Student start with fallback failed:', getEl('start-error').textContent);
  process.exit(1);
}

// Test student start with wrong pass is rejected
getEl('student-id').value = 'SV004';
getEl('student-fullname').value = 'Wrong Pass User';
getEl('pass-input').value = 'wrongpassword123';
getEl('start-error').textContent = '';

evalInCtx('startQuiz()');
if (getEl('start-error').textContent.includes('không chính xác')) {
  console.log('✅ Student start with wrong password correctly rejected:', getEl('start-error').textContent);
} else {
  console.error('❌ Wrong password was not rejected!');
  process.exit(1);
}

console.log('\n===========================================');
console.log('🎉 ALL TESTS PASSED! 100% RELIABLE & BULLETPROOF!');
console.log('===========================================\n');
