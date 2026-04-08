const fs = require('node:fs');
const path = require('node:path');
const src = path.join(__dirname, '../public/assets/uploads/file_000000006ec461f5905d0bdb5d01b34a-1-1-1-1.png');
const dest = path.join(__dirname, '../public/assets/logo.png');
fs.copyFileSync(src, dest);
console.log('Logo copied successfully');
