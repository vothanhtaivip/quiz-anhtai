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

console.log('\n--- 1. Testing Admin Login with Tai@00114477 ---');
getEl('admin-pass-verify').value = ' Tai@00114477 ';
evalInCtx('verifyAdminPass()');
let adminAuthed = evalInCtx('adminAuthed');
if (adminAuthed) {
  console.log('✅ Admin login with "Tai@00114477" SUCCEEDED.');
} else {
  console.error('❌ Admin login failed!');
  process.exit(1);
}

// Test with lowercase
evalInCtx('adminAuthed = false');
getEl('admin-pass-verify').value = 'tai@00114477';
evalInCtx('verifyAdminPass()');
if (evalInCtx('adminAuthed')) {
  console.log('✅ Admin login with lowercase "tai@00114477" SUCCEEDED.');
} else {
  console.error('❌ Admin login with lowercase failed!');
  process.exit(1);
}

console.log('\n--- 2. Testing Student Start with Thithu@123 ---');
getEl('student-id').value = 'SV001';
getEl('student-fullname').value = 'Nguyen Van Test';
getEl('pass-input').value = ' Thithu@123 ';
getEl('start-error').textContent = '';

evalInCtx('startQuiz()');
if (!getEl('start-error').textContent) {
  console.log('✅ Student start with "Thithu@123" SUCCEEDED.');
} else {
  console.error('❌ Student start failed:', getEl('start-error').textContent);
  process.exit(1);
}

// Test student with lowercase
getEl('student-id').value = 'SV002';
getEl('student-fullname').value = 'Tran Thi Test';
getEl('pass-input').value = 'thithu@123';
getEl('start-error').textContent = '';

evalInCtx('startQuiz()');
if (!getEl('start-error').textContent) {
  console.log('✅ Student start with lowercase "thithu@123" SUCCEEDED.');
} else {
  console.error('❌ Student start with lowercase failed:', getEl('start-error').textContent);
  process.exit(1);
}

// Test student with wrong pass
getEl('student-id').value = 'SV003';
getEl('student-fullname').value = 'Wrong User';
getEl('pass-input').value = 'wrongpass';
getEl('start-error').textContent = '';

evalInCtx('startQuiz()');
if (getEl('start-error').textContent.includes('không chính xác')) {
  console.log('✅ Student start with wrong password correctly rejected.');
  console.log('Error message shown to user:', getEl('start-error').textContent);
} else {
  console.error('❌ Wrong password was not rejected!');
  process.exit(1);
}

console.log('\n--- 3. Checking that Placeholders do NOT leak passwords ---');
const passInputPlaceholder = html.match(/id="pass-input"[^>]*placeholder="([^"]*)"/);
console.log('pass-input placeholder:', passInputPlaceholder ? passInputPlaceholder[1] : 'not found');
if (passInputPlaceholder && (passInputPlaceholder[1].includes('ThayChuanNam') || passInputPlaceholder[1].includes('Thithu@123') || passInputPlaceholder[1].includes('Ví dụ'))) {
  console.error('❌ Leak in pass-input placeholder!');
  process.exit(1);
} else {
  console.log('✅ pass-input placeholder is clean.');
}

const adminPassPlaceholder = html.match(/id="admin-pass-verify"[^>]*placeholder="([^"]*)"/);
console.log('admin-pass-verify placeholder:', adminPassPlaceholder ? adminPassPlaceholder[1] : 'not found');
if (adminPassPlaceholder && (adminPassPlaceholder[1].includes('admin123') || adminPassPlaceholder[1].includes('Tai@00114477') || adminPassPlaceholder[1].includes('mặc định'))) {
  console.error('❌ Leak in admin-pass-verify placeholder!');
  process.exit(1);
} else {
  console.log('✅ admin-pass-verify placeholder is clean.');
}

console.log('\n===========================================');
console.log('🎉 ALL SECURITY & PASS VERIFICATIONS PASSED!');
console.log('===========================================\n');
