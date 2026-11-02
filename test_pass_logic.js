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
      focus: () => {}
    };
  }
  return elements[id];
}

const mockDocument = {
  getElementById: (id) => getEl(id),
  querySelectorAll: () => [],
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

console.log('\n--- Simulating Admin updating password to "ThayChuanNam" and "newadmin888" ---');
getEl('setting-exam-pass').value = 'ThayChuanNam';
getEl('setting-admin-pass').value = 'newadmin888';
getEl('setting-anticheat').checked = true;

sandbox.saveSecuritySettings();

console.log('localStorage at_exam_password_v5:', localStorageData['at_exam_password_v5']);
console.log('localStorage at_admin_password_v5:', localStorageData['at_admin_password_v5']);

// Now test verifyAdminPass
console.log('\n--- Testing verifyAdminPass with "newadmin888" ---');
getEl('admin-pass-verify').value = 'newadmin888';
sandbox.verifyAdminPass();
console.log('adminAuthed:', sandbox.adminAuthed, 'Error:', getEl('admin-verify-err').textContent);

// Now test startQuiz with "ThayChuanNam"
console.log('\n--- Testing startQuiz with "ThayChuanNam" ---');
getEl('student-id').value = 'SV001';
getEl('student-fullname').value = 'Nguyen Van A';
getEl('pass-input').value = 'ThayChuanNam';

sandbox.startQuiz();
console.log('Start error:', getEl('start-error').textContent);

// What if student enters "thaychuannam" (lowercase)?
console.log('\n--- Testing startQuiz with lowercase "thaychuannam" ---');
getEl('student-id').value = 'SV002';
getEl('student-fullname').value = 'Tran Van B';
getEl('pass-input').value = 'thaychuannam';
sandbox.startQuiz();
console.log('Start error with lowercase:', getEl('start-error').textContent);
