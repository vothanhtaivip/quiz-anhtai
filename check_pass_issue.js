const fs = require('fs');
const path = require('path');

const c1 = fs.readFileSync(path.join(__dirname, 'build_v5.1_n8n.js'), 'utf8');
const c2 = fs.readFileSync(path.join(__dirname, 'build_v5.2_final.js'), 'utf8');

console.log('--- 5.1 keys ---');
c1.split('\n').filter(l => l.includes('KEY_')).forEach(l => console.log('  ', l.trim()));

console.log('--- 5.2 keys ---');
c2.split('\n').filter(l => l.includes('KEY_')).forEach(l => console.log('  ', l.trim()));
