const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://nguyenchuannam.n1.tinhgon.xyz/';

https.get(url, { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  console.log('Status Code:', res.statusCode);
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Data length:', data.length);
    const targetPath = path.join(__dirname, 'target_source.html');
    fs.writeFileSync(targetPath, data, 'utf8');
    console.log('Saved to', targetPath);
  });
}).on('error', (err) => {
  console.error('Error fetching:', err.message);
});
