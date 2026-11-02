const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetHtml = fs.readFileSync(path.join(__dirname, 'target_source.html'), 'utf8');

// Find const ALL_QUESTIONS = [...];
const matchAllQ = targetHtml.match(/const\s+ALL_QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
const matchEssay = targetHtml.match(/const\s+ESSAY_QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);

if (!matchAllQ) {
  console.error('Could not find ALL_QUESTIONS in target HTML');
  process.exit(1);
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext('var targetQuestions = ' + matchAllQ[1] + ';', sandbox);
if (matchEssay) {
  vm.runInContext('var targetEssay = ' + matchEssay[1] + ';', sandbox);
}

const targetQuestions = sandbox.targetQuestions;
const targetEssay = sandbox.targetEssay || [];

console.log('Target questions count:', targetQuestions.length);
console.log('Target essay questions count:', targetEssay.length);

const defaultQs = JSON.parse(fs.readFileSync(path.join(__dirname, 'default_questions.json'), 'utf8'));
console.log('Current default_questions.json count:', defaultQs.length);

// Compare questions
let diffCount = 0;
targetQuestions.forEach((tq, i) => {
  const dq = defaultQs[i];
  if (!dq) {
    diffCount++;
    console.log(`Extra question at index ${i}:`, tq.q.substring(0, 50));
  } else if (tq.q !== dq.q) {
    diffCount++;
    console.log(`Diff at ${i}:`);
    console.log('  Target:', tq.q.substring(0, 60));
    console.log('  Local: ', dq.q.substring(0, 60));
  }
});

console.log('Total diff count:', diffCount);

// Save target questions to target_questions_extracted.json
fs.writeFileSync(path.join(__dirname, 'target_questions_extracted.json'), JSON.stringify(targetQuestions, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'target_essay_extracted.json'), JSON.stringify(targetEssay, null, 2), 'utf8');

console.log('First 3 target questions:');
console.log(JSON.stringify(targetQuestions.slice(0, 3), null, 2));
console.log('Target essay questions:');
console.log(JSON.stringify(targetEssay, null, 2));
