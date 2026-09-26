// Render the pixel-art area scenes to MP4 for social media.
//   node scripts/render-video.mjs              -> all areas (story scenes), Spanish
//   node scripts/render-video.mjs finanzas en  -> one area, English
// Needs Google Chrome and ffmpeg on the machine. Output: _media/redes/*.mp4 (gitignored).
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import WebSocket from 'ws';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const AREAS = ['seguridad', 'mantenimiento', 'operaciones', 'finanzas', 'ia', 'datos-web'];
const FPS = 30;
const [onlyArea, langArg] = process.argv.slice(2);
const lang = langArg === 'en' ? 'en' : 'es';
const targets = onlyArea ? [onlyArea.replace(/-hq$/, '')] : AREAS;
const outDir = path.join(ROOT, '_media', 'redes');
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const vite = await createServer({ configFile: path.join(ROOT, 'vite.config.ts'), server: { port: 5199, strictPort: true }, logLevel: 'error' });
await vite.listen();

const port = 9900 + Math.floor(Math.random() * 90);
const profile = path.join(ROOT, '_media', '.chrome-profile');
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--no-first-run', '--disable-extensions', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

try {
  let target;
  for (let i = 0; i < 120 && !target; i++) {
    await sleep(250);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {}
  }
  if (!target) throw new Error('Chrome did not start');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.on('open', r));
  let id = 0;
  const pending = new Map();
  ws.on('message', (m) => { const msg = JSON.parse(m); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable');

  for (const area of targets) {
    const frames = path.join(outDir, `.frames-${area}`);
    rmSync(frames, { recursive: true, force: true });
    mkdirSync(frames, { recursive: true });
    await send('Page.navigate', { url: `http://localhost:5199/tools/render.html?scene=${area}-hq&lang=${lang}&record` });
    for (let i = 0; i < 60 && !(await evaluate('!!window.READY')); i++) await sleep(250);
    await evaluate('document.fonts.ready.then(() => true)');
    const total = Math.round((await evaluate('window.DURATION')) * FPS);
    for (let i = 0; i < total; i++) {
      await evaluate(`window.renderFrame(${i / FPS})`);
      const { result } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1280, height: 720, scale: 1 } });
      writeFileSync(path.join(frames, `f${String(i).padStart(5, '0')}.png`), Buffer.from(result.data, 'base64'));
    }
    const out = path.join(outDir, `star-apps-${area}${lang === 'en' ? '-en' : ''}.mp4`);
    const ff = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out], { encoding: 'utf8' });
    rmSync(frames, { recursive: true, force: true });
    if (ff.status !== 0) throw new Error(ff.stderr);
    console.log('ok', path.relative(ROOT, out));
  }
  ws.close();
} finally {
  chrome.kill();
  await vite.close();
}
