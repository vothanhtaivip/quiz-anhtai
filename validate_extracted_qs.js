const fs = require('fs');
const path = require('path');

const qs = JSON.parse(fs.readFileSync(path.join(__dirname, 'default_questions.json'), 'utf8'));

console.log('Total questions:', qs.length);
let errors = 0;
qs.forEach((q, i) => {
  if (!q.q || typeof q.q !== 'string') {
    console.error(`Q${i} invalid question text:`, q);
    errors++;
  }
  if (!Array.isArray(q.opts) || q.opts.length !== 4) {
    console.error(`Q${i} invalid opts:`, q.opts);
    errors++;
  }
  if (typeof q.ans !== 'number' || q.ans < 0 || q.ans > 3) {
    console.error(`Q${i} invalid ans:`, q.ans);
    errors++;
  }
});

console.log('Validation complete, errors:', errors);
const tags = {};
qs.forEach(q => { tags[q.tag] = (tags[q.tag] || 0) + 1; });
console.log('Topic breakdown:', tags);
