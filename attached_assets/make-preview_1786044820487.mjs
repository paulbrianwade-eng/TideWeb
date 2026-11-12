// Inlinea el build IIFE en un único HTML (dist-preview/index.html)
import fs from 'node:fs';
import path from 'node:path';

const dir = 'dist-preview';
const css = fs.readFileSync(path.join(dir, 'app.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0B0D0F">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>TIDE · High Performance Training System</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>`;

fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log(`dist-preview/index.html · ${(html.length / 1024).toFixed(0)} kB`);
