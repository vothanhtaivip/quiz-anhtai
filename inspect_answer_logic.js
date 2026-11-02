const fs = require('fs');
const path = require('path');

const targetHtml = fs.readFileSync(path.join(__dirname, 'target_source.html'), 'utf8');

// Find answer checking logic
const lines = targetHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function selectAnswer') || l.includes('function checkAnswer') || l.includes('.k') || l.includes('hash') || l.includes('ans')) {
    console.log((i+1) + ': ' + l.trim().substring(0, 150));
  }
});
