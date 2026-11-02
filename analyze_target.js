const fs = require('fs');
const path = require('path');

const targetHtml = fs.readFileSync(path.join(__dirname, 'target_source.html'), 'utf8');

// Search for question arrays or JSON in target_source.html
console.log('Target HTML length:', targetHtml.length);

// Look for patterns like questions, DEFAULT_QUESTIONS, rawData, quizData, etc.
const matches = [];
const regex = /(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(\[[\s\S]*?\]);/g;
let match;
while ((match = regex.exec(targetHtml)) !== null) {
  matches.push({ varName: match[2], length: match[3].length });
}
console.log('Array variables found:', matches);

// Check if default_questions.json exists
const defaultQsPath = path.join(__dirname, 'default_questions.json');
let existingQs = [];
if (fs.existsSync(defaultQsPath)) {
  existingQs = JSON.parse(fs.readFileSync(defaultQsPath, 'utf8'));
  console.log('Existing questions count in default_questions.json:', existingQs.length);
}

// Let's search for "q": or "question": or "opts":
const qMatches = targetHtml.match(/"q"\s*:/g) || targetHtml.match(/"question"\s*:/g) || [];
console.log('Question object matches in target HTML:', qMatches.length);

// Let's find script tags in targetHtml
const scriptMatches = targetHtml.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Number of script tags:', scriptMatches.length);
scriptMatches.forEach((s, idx) => {
  console.log(`Script ${idx}: length ${s.length}, snippet:`, s.substring(0, 100).replace(/\n/g, ' '));
  if (s.includes('opts') || s.includes('ans') || s.includes('explain') || s.includes('Digital Marketing')) {
    console.log(`Script ${idx} contains quiz keywords!`);
  }
});
