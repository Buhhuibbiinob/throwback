// Builds www/ for the iOS app from the same index.html that GitHub Pages serves.
// Copies the page and swaps the face-api CDN URLs for local copies so the app works offline.
import fs from 'node:fs';
import path from 'node:path';

const pkg = 'node_modules/@vladmandic/face-api';
const out = 'www';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'vendor/face-api'), { recursive: true });

fs.copyFileSync(path.join(pkg, 'dist/face-api.js'), path.join(out, 'vendor/face-api/face-api.js'));
fs.cpSync(path.join(pkg, 'model'), path.join(out, 'vendor/face-api/model'), { recursive: true });

let html = fs.readFileSync('index.html', 'utf8');
const libUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/dist/face-api.js';
const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model';
if (!html.includes(libUrl) || !html.includes(modelUrl)) throw new Error('CDN URLs not found in index.html');
html = html.split(libUrl).join('vendor/face-api/face-api.js').split(modelUrl).join('vendor/face-api/model');
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('www/ ready');
