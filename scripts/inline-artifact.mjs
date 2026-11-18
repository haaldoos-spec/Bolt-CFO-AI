// Slår ihop artefakt-bygget till en fil (labbeliv.html) som kan publiceras som Claude-artefakt.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist-artifact/assets';
const files = readdirSync(dir);
const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n');
const js = files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n');
const safeJs = js.replace(/<\/script/gi, '<\\/script');
const safeCss = css.replace(/<\/style/gi, '<\\/style');

const html = `<title>Labbeliv</title>
<meta name="theme-color" content="#110e1c">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<style>html,body{background:#110e1c;color-scheme:dark}${safeCss}</style>
<div id="root"></div>
<script type="module">${safeJs}</script>
`;
writeFileSync('dist-artifact/labbeliv.html', html);
console.log(`labbeliv.html: ${(html.length / 1024).toFixed(0)} kB`);
