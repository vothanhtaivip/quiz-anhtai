const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetHtml = fs.readFileSync(path.join(__dirname, 'target_source.html'), 'utf8');

const matchAllQ = targetHtml.match(/const\s+ALL_QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
const matchQHash = targetHtml.match(/function\s+qHash\s*\([\s\S]*?return\s*\([\s\S]*?\)\.toString\(36\);\s*\}/);

if (!matchAllQ || !matchQHash) {
  console.error('Could not find ALL_QUESTIONS or qHash');
  process.exit(1);
}

const code = `
${matchAllQ[0]}
${matchQHash[0]}
var Q_SALT = "xdw#Nam@2026";
function qAnswerIndex(q) {
  for (var i = 0; i < q.opts.length; i++) {
    if (qHash(Q_SALT + '|' + q.q + '|' + q.opts[i]) === q.k) return i;
  }
  return -1;
}

var decodedQuestions = ALL_QUESTIONS.map(function(q) {
  var ans = qAnswerIndex(q);
  return {
    tag: q.tag || "Digital Marketing",
    q: q.q,
    opts: q.opts,
    ans: ans,
    explain: q.explain || ""
  };
});
`;

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const decoded = sandbox.decodedQuestions;
console.log('Decoded questions count:', decoded.length);

let unfoundCount = 0;
decoded.forEach((q, i) => {
  if (q.ans === -1) {
    unfoundCount++;
    console.log(`Answer not found for question ${i}: ${q.q}`);
  }
});

console.log('Unfound answers count:', unfoundCount);

// Save to new default_questions.json
fs.writeFileSync(path.join(__dirname, 'default_questions.json'), JSON.stringify(decoded, null, 2), 'utf8');
console.log('Successfully saved to default_questions.json!');

// Sample decoded
console.log('Sample question 1:', JSON.stringify(decoded[0], null, 2));
console.log('Sample question 2:', JSON.stringify(decoded[1], null, 2));
