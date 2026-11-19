// Excalidraw diagram helpers: the body of an async function(page) that returns H.
// Every action goes through the real editor UI (tools, mouse, keyboard, the Stats
// panel), the way a person would draw. Element JSON is never injected.
//
// Load once per session (see SKILL.md "Bootstrap"), then start every
// runPlaywrightCode call with:
//   const H = await new (async()=>{}).constructor('page', await page.evaluate(()=>localStorage.getItem('dg:helpers')))(page);
//
// COORDINATES: all helpers use LAYOUT coordinates. Layout (0,0) is the diagram's
// top-left; scene = layout + origin. The origin is fixed by H.setup() and stored in
// localStorage 'dg:origin', so values typed into the Stats panel are exact at any zoom.

const kb = page.keyboard, ms = page.mouse;
const wait = (t) => page.waitForTimeout(t);
const lsGet = (k) => page.evaluate((k) => localStorage.getItem(k), k);
let O = JSON.parse((await lsGet('dg:origin')) || '{"x":0,"y":0,"left":270,"top":90}');

async function view() {
  const s = JSON.parse((await lsGet('excalidraw-state')) || '{}');
  return { sx: s.scrollX || 0, sy: s.scrollY || 0, z: (s.zoom && s.zoom.value) || 1 };
}
let V = await view();
async function vpSize() { return page.viewportSize() || page.evaluate(() => ({ width: innerWidth, height: innerHeight })); }
const toScreen = (x, y) => [(x + O.x + V.sx) * V.z, (y + O.y + V.sy) * V.z];

// ---------- basic input ----------
async function esc(n = 1) { for (let i = 0; i < n; i++) await kb.press('Escape'); }
async function tool(key) { await esc(); await kb.press(key); await wait(60); }
async function click(x, y, o = {}) {
  const [a, b] = toScreen(x, y);
  if (o.shift) await kb.down('Shift');
  await ms.click(a, b, o.button ? { button: o.button } : {});
  if (o.shift) await kb.up('Shift');
  await wait(o.wait ?? 150);
}
async function drag(x1, y1, x2, y2, o = {}) {
  const [a, b] = toScreen(x1, y1), [c, d] = toScreen(x2, y2);
  await ms.move(a, b); await ms.down();
  if (o.ctrl) await kb.down('Control');           // Ctrl while dragging = no arrow binding
  await ms.move(c, d, { steps: o.steps || 6 });
  await ms.up();
  if (o.ctrl) await kb.up('Control');
  await wait(o.wait ?? 150);
}
// Screen point guaranteed to be empty canvas (bottom-right, above the help button).
async function emptyClick() {
  const vp = await vpSize();
  await esc(2); await kb.press('v');
  await ms.click(vp.width - 60, vp.height - 140); await wait(120);
}

// ---------- Stats panel: exact geometry ----------
async function statsOpen() {
  if (!(await page.locator('h2:has-text("Properties")').count())) { await kb.press('Alt+Slash'); await wait(250); }
}
const inp = (id) => page.locator(`#elementStats [data-testid="${id}"] input`);
async function field(id) {
  if (!(await inp(id).count())) return null;
  const v = parseFloat(await inp(id).inputValue());
  return isNaN(v) ? null : v;
}
// Info about the current selection: type plus layout x/y, w/h and font size f.
async function info() {
  await statsOpen();
  const t = await page.locator('#elementStats').innerText().catch(() => '');
  const type = t.split('\n')[1] || null;
  if (!type) return null;
  const x = await field('X'), y = await field('Y');
  return { type, x: x == null ? null : +(x - O.x).toFixed(2), y: y == null ? null : +(y - O.y).toFixed(2),
           w: await field('W'), h: await field('H'), f: await field('F') };
}
async function setField(id, v) {
  const i = inp(id);
  await i.click({ clickCount: 3 });
  await i.fill(String(Math.round(v * 100) / 100));
  await i.press('Enter');
  await wait(90);
}
// Raw set: f (font size), w, h, x, y in layout coords. Apply size before position.
async function place(p) {
  await statsOpen();
  if (p.f != null) await setField('F', p.f);
  if (p.w != null) await setField('W', p.w);
  if (p.h != null) await setField('H', p.h);
  if (p.x != null) await setField('X', p.x + O.x);
  if (p.y != null) await setField('Y', p.y + O.y);
}
// Anchored placement: one of x | cx | right, and one of y | cy | bottom.
async function put(p) {
  await place({ f: p.f, w: p.w, h: p.h });
  const i = await info();
  let x = p.x, y = p.y;
  if (p.cx != null) x = p.cx - i.w / 2;
  if (p.right != null) x = p.right - i.w;
  if (p.cy != null) y = p.cy - i.h / 2;
  if (p.bottom != null) y = p.bottom - i.h;
  await place({ x, y });
  return info();
}
// Scale the selection to fit a box (keeps the aspect ratio), then anchor it.
async function fit(box, anchor) {
  const i = await info();
  const s = Math.min(box.h / i.h, (box.w || 1e9) / i.w);
  await setField('W', i.w * s);
  const j = await info();
  if (Math.abs(j.h - i.h * s) > 0.5) await setField('H', i.h * s);
  return put(anchor);
}

// ---------- properties panel ----------
const panel = () => page.getByRole('region', { name: 'Selected shape actions' });
async function color(kind, hex) {                // kind: 'stroke' | 'background'
  if (hex === 'transparent') {
    const t = panel().getByRole('button', { name: 'transparent' }).first();
    if (await t.count()) await t.click();
    return;
  }
  const b = page.locator(`button[aria-label="Show ${kind} color picker"]`).first();
  if (!(await b.count())) return;                // lines and arrows have no background picker
  await b.click();
  await page.locator('input.color-picker-input').first().fill(hex.replace('#', ''));
  await b.click();                               // close it with the same button; NEVER press Enter
  await wait(60);
}
async function pick(group, title) {
  await panel().getByRole('group', { name: group }).getByTitle(title, { exact: true }).first().click();
  await wait(50);
}
const QUICK_FONTS = { excalifont: 'Hand-drawn', 'hand-drawn': 'Hand-drawn', nunito: 'Normal', normal: 'Normal',
  'comic shanns': 'Code', comic: 'Code', code: 'Code' };
async function font(name) {
  const g = panel().getByRole('group', { name: 'Font family' });
  const q = QUICK_FONTS[name.toLowerCase()];
  if (q) { await g.getByRole('button', { name: q, exact: true }).click(); await wait(60); return; }
  const search = page.locator('input.QuickSearch__input');
  const toggle = g.getByRole('button', { name: 'Show font picker' });
  if (!(await search.isVisible().catch(() => false))) await toggle.click();
  await wait(150);
  await page.getByRole('button', { name, exact: true }).first().click();
  await wait(150);
  // Close with the toggle; Escape here reverts the font (seen: Helvetica).
  if (await search.isVisible().catch(() => false)) await toggle.click();
}
// o: stroke, bg, fill('solid'|'hachure'|'cross'), width('Thin'|'Medium'|'Bold'),
//    dash('Solid'|'Dashed'|'Dotted'), rough('Architect'|'Artist'|'Cartoonist'),
//    edges('Sharp'|'Round'), arrow('Sharp arrow'|'Curved arrow'|'Elbow arrow'),
//    font, preset('Small'|'Medium'|'Large'|'Very large'), align('Left'|'Center'|'Right')
async function style(o = {}) {
  if (o.stroke) await color('stroke', o.stroke);
  if (o.bg) await color('background', o.bg);
  if (o.fill) {
    const n = { solid: 'Solid', hachure: 'Hachure (Alt-Click)', cross: 'Cross-hatch' }[o.fill];
    await panel().getByRole('group', { name: 'Fill' }).getByRole('button', { name: n }).click();
  }
  if (o.width) await pick('Stroke width', o.width);
  if (o.dash) await pick('Stroke style', o.dash);
  if (o.rough) await pick('Sloppiness', o.rough);
  if (o.edges) await pick('Edges', o.edges);
  if (o.arrow) await panel().getByTitle(o.arrow, { exact: true }).first().click();
  if (o.font) await font(o.font);
  if (o.preset) await pick('Font size', o.preset);
  if (o.align) await pick('Text align', o.align);
}

// ---------- drawing ----------
// Free text. o: x|cx|right, y (top) | cy, size (exact px), font, color, align.
// Click an EMPTY spot: clicking on existing text edits it, and clicking inside a
// container binds to it. Draw text before backgrounds.
async function text(str, o = {}) {
  await tool('t');
  if (o.align) await style({ align: o.align });
  const px = o.x ?? o.cx ?? o.right ?? 0, py = o.y ?? o.cy ?? 0;
  await click(px, py + 8);
  await kb.insertText(str);
  await esc(); await wait(120);                   // Escape commits; the text stays selected
  await style({ stroke: o.color, font: o.font, align: o.align || 'Left' });
  return put({ f: o.size, x: o.x, cx: o.cx, right: o.right, y: o.y, cy: o.cy });
}
// Rectangle 'r', ellipse 'o' or diamond 'd' at an exact layout box.
async function shape(kind, x, y, w, h, o = {}) {
  await tool(kind);
  await drag(x, y, x + w, y + h);
  await style(o);
  await place({ w, h, x, y });
  return info();
}
const rect = (x, y, w, h, o) => shape('r', x, y, w, h, o);
const ellipse = (x, y, w, h, o) => shape('o', x, y, w, h, o);
const circle = (cx, cy, d, o) => shape('o', cx - d / 2, cy - d / 2, d, d, o);
// Straight line or arrow, unbound (Ctrl held). Exact for horizontal and vertical.
async function line(x1, y1, x2, y2, o = {}, key = 'l') {
  await tool(key);
  await drag(x1, y1, x2, y2, { ctrl: true });
  await style(o);
  const p = { x: Math.min(x1, x2), y: Math.min(y1, y2) };
  if (y1 === y2) p.w = Math.abs(x2 - x1);
  if (x1 === x2) p.h = Math.abs(y2 - y1);
  await place(p);
  return info();
}
const arrow = (x1, y1, x2, y2, o = {}) => line(x1, y1, x2, y2, { arrow: 'Sharp arrow', ...o }, 'a');
// Bound, centered label inside a shape (pill or number circle). Text props come
// from the current text style, so set them with the text tool first.
async function label(x, y, str, o = {}) {
  await tool('t');
  if (o.preset) await style({ preset: o.preset });
  await esc(); await kb.press('v');
  await click(x, y);
  await kb.press('Enter'); await wait(120);
  await kb.insertText(str);
  await esc(); await wait(120);
  await style({ stroke: o.color, font: o.font, preset: o.preset || 'Medium', align: 'Center' });
}
const toBack = async () => { await kb.press('Control+Shift+BracketLeft'); await wait(80); };
const lock = async () => { await kb.press('Control+Shift+l'); await wait(80); };

// ---------- selection ----------
async function sel(x, y, o = {}) { if (!o.shift) await tool('v'); await click(x, y, o); return info(); }
// Marquee: START IN EMPTY SPACE, otherwise the drag moves the element under the cursor.
async function marquee(x1, y1, x2, y2) { await tool('v'); await drag(x1, y1, x2, y2, { steps: 8 }); return info(); }
async function align(name) {                     // 'Align left','Center horizontally','Align right',
  await panel().getByRole('button', { name }).click(); await wait(100);   // 'Align top','Center vertically','Align bottom',
}                                                // 'Distribute horizontally','Distribute vertically'
async function nudge(dx, dy) {                   // for mixed multi-selections
  for (const [d, n, p] of [[dx, 'ArrowLeft', 'ArrowRight'], [dy, 'ArrowUp', 'ArrowDown']]) {
    let a = Math.abs(d); const k = d < 0 ? n : p;
    while (a >= 5) { await kb.press('Shift+' + k); a -= 5; }
    while (a-- > 0) await kb.press(k);
  }
  await wait(120);
}
async function move(dx, dy) { const i = await info(); await place({ x: i.x + dx, y: i.y + dy }); }

// ---------- library icons ----------
async function libIds() {
  return page.evaluate(() => new Promise((res) => {
    const r = indexedDB.open('excalidraw-library-db');
    r.onerror = () => res([]);
    r.onsuccess = () => {
      try {
        const g = r.result.transaction('excalidraw-library-store').objectStore('excalidraw-library-store').get('libraryData');
        g.onsuccess = () => res(((g.result && g.result.libraryItems) || []).map((i) => i.id));
        g.onerror = () => res([]);
      } catch (e) { res([]); }
    };
  }));
}
// Import .excalidrawlib files (absolute paths) by dropping them on the canvas.
// Packs that are already loaded are skipped.
async function loadLibraries(paths) {
  const have = await libIds();
  const done = [];
  for (const p of paths) {
    const pack = (p.match(/([A-Z]\d{3})-[^\\/]*\.excalidrawlib$/) || [])[1];
    if (pack && have.some((i) => i.startsWith(pack + '-'))) { done.push(pack + ' (already)'); continue; }
    await page.evaluate(() => { const i = document.createElement('input'); i.type = 'file'; i.id = 'dg-file'; i.style.display = 'none'; document.body.appendChild(i); });
    await page.locator('#dg-file').setInputFiles(p);
    await page.evaluate(async () => {
      const i = document.getElementById('dg-file'); const f = i.files[0];
      const file = new File([await f.text()], f.name, { type: 'application/vnd.excalidrawlib+json' });
      const c = document.querySelector('canvas.interactive') || document.querySelector('.excalidraw canvas');
      const dt = new DataTransfer(); dt.items.add(file);
      for (const t of ['dragenter', 'dragover', 'drop'])
        c.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, dataTransfer: dt, clientX: 700, clientY: 500 }));
      i.remove();
    });
    await wait(900);
    done.push(pack || p);
  }
  await closeLibrary();
  return { loaded: done, total: (await libIds()).length };
}
async function openLibrary() {
  if (await page.locator('.library-unit').count()) return;
  await page.getByRole('button', { name: 'Library' }).first().click(); await wait(400);
}
async function closeLibrary() {
  if (!(await page.locator('.library-unit').count())) return;
  const c = page.getByRole('button', { name: 'Close' });
  if (await c.count()) await c.first().click();
  else await page.getByRole('button', { name: 'Library' }).first().click();   // the toggle; not Escape
  await wait(200);
}
// Insert a library icon by id (e.g. 'B004-icon-04') and fit it to a box.
// box: {h:80, w:110}; anchor: {cx, cy} or {x, y} etc.
async function icon(id, anchor, box = { h: 80, w: 110 }) {
  const order = await libIds();
  const idx = order.indexOf(id);
  if (idx < 0) throw new Error('icon not in library: ' + id + ' (run H.loadLibraries first)');
  await esc(2);                                   // with a selection, an extra "add" tile shifts indexes
  await openLibrary();
  const units = page.locator('.library-unit');
  const offset = (await units.count()) - order.length;
  await units.nth(idx + offset).click(); await wait(350);
  await closeLibrary();
  const i = await info();
  if (!i || i.type !== 'Group') throw new Error('icon insert did not select a group: ' + JSON.stringify(i));
  return fit(box, anchor);
}

// ---------- setup ----------
// Start a drawing: optionally clear, set the zoom so a W×H layout fits the safe area,
// and fix the origin. The safe area avoids the left properties panel (x < ~260) and
// the right Stats panel (x > viewport−240), which swallow clicks.
async function setup({ W = 1420, H = 1000, clear = false, left = 270, top = 90 } = {}) {
  const n = JSON.parse((await lsGet('excalidraw')) || '[]').filter((e) => !e.isDeleted).length;
  if (n && !clear) throw new Error(`canvas has ${n} elements; save it, then call setup({clear:true})`);
  await emptyClick();
  if (n) { await kb.press('Control+a'); await kb.press('Delete'); await wait(200); }
  await kb.press('Shift+0'); await wait(250);     // zoom 100%
  const vp = await vpSize();
  const fitZ = Math.min(1, (vp.width - left - 240) / W, (vp.height - top - 30) / H);
  let z = 1;
  while (z - 0.1 >= fitZ - 1e-9 || z > fitZ + 1e-9) { await kb.press('Control+Minus'); await wait(120); z = +(z - 0.1).toFixed(2); if (z <= 0.3) break; }
  await wait(600);
  V = await view();
  O = { x: left / V.z - V.sx, y: top / V.z - V.sy, left, top };
  await page.evaluate((o) => localStorage.setItem('dg:origin', JSON.stringify(o)), O);
  await statsOpen();
  return { zoom: V.z, origin: O, fitZ };
}
// Re-read the scroll and zoom after anything that pans or zooms. The origin stays fixed.
async function refresh() { await wait(500); V = await view(); return V; }

// ---------- QA ----------
// Items in layout coords: groups merged, bound labels skipped.
async function items() {
  await wait(500);
  return page.evaluate((O) => {
    const els = JSON.parse(localStorage.getItem('excalidraw') || '[]').filter((e) => !e.isDeleted);
    const m = new Map();
    for (const e of els) {
      if (e.containerId) continue;
      const k = e.groupIds && e.groupIds.length ? 'g:' + e.groupIds[e.groupIds.length - 1] : e.id;
      const x1 = e.x - O.x, y1 = e.y - O.y;
      let x2 = x1 + e.width, y2 = y1 + e.height;
      if (e.points) { const xs = e.points.map((p) => p[0]), ys = e.points.map((p) => p[1]);
        x2 = x1 + Math.max(...xs); y2 = y1 + Math.max(...ys); }
      const it = m.get(k) || { k, type: k.startsWith('g:') ? 'group' : e.type, x1: 1e9, y1: 1e9, x2: -1e9, y2: -1e9, n: 0,
        text: e.text ? e.text.slice(0, 24) : '', font: e.fontFamily, size: e.fontSize };
      it.x1 = Math.min(it.x1, x1); it.y1 = Math.min(it.y1, y1); it.x2 = Math.max(it.x2, x2); it.y2 = Math.max(it.y2, y2); it.n++;
      m.set(k, it);
    }
    return [...m.values()].map((i) => ({ ...i, x1: +i.x1.toFixed(1), y1: +i.y1.toFixed(1), x2: +i.x2.toFixed(1), y2: +i.y2.toFixed(1) }));
  }, O);
}
// Alignment audit. Reports near-misses (0.5 < d ≤ tol) between same-type edges or
// centers of items larger than 20 px, text overlapping text, and text crossing a
// rectangle's border.
async function audit(tol = 6) {
  const its = (await items()).filter((i) => (i.x2 - i.x1) > 20 || (i.y2 - i.y1) > 20 || i.type === 'text');
  const name = (i) => i.text ? `"${i.text}"` : `${i.type}@${Math.round(i.x1)},${Math.round(i.y1)}`;
  const keys = { L: (i) => i.x1, C: (i) => (i.x1 + i.x2) / 2, R: (i) => i.x2, T: (i) => i.y1, M: (i) => (i.y1 + i.y2) / 2, B: (i) => i.y2 };
  const near = [];
  for (const [kname, f] of Object.entries(keys))
    for (let a = 0; a < its.length; a++) for (let b = a + 1; b < its.length; b++) {
      const d = Math.abs(f(its[a]) - f(its[b]));
      if (d > 0.5 && d <= tol) near.push({ d: +d.toFixed(1), k: kname, a: name(its[a]), b: name(its[b]) });
    }
  near.sort((p, q) => q.d - p.d);
  const texts = its.filter((i) => i.type === 'text');
  const ov = (p, q) => p.x1 < q.x2 - 1 && q.x1 < p.x2 - 1 && p.y1 < q.y2 - 1 && q.y1 < p.y2 - 1;
  const overlaps = [];
  for (let a = 0; a < texts.length; a++) for (let b = a + 1; b < texts.length; b++)
    if (ov(texts[a], texts[b])) overlaps.push(name(texts[a]) + ' × ' + name(texts[b]));
  const rects = its.filter((i) => i.type === 'rectangle' && (i.x2 - i.x1) > 100);
  const crossing = [];
  for (const t of texts) for (const r of rects) {
    const inside = t.x1 >= r.x1 && t.x2 <= r.x2 && t.y1 >= r.y1 && t.y2 <= r.y2;
    if (ov(t, r) && !inside) crossing.push(name(t) + ' crosses ' + name(r));
  }
  return { count: its.length, nearMisses: near.slice(0, 40), nearMissTotal: near.length, textOverlaps: overlaps, textCrossesBox: crossing };
}

// ---------- save ----------
// Select everything and copy it with the editor's own Copy; then run
// scripts/save-scene.ps1 to write the clipboard to a .excalidraw file.
async function copyAll() {
  await emptyClick();
  await kb.press('Control+a'); await wait(250);
  const vp = await vpSize();
  await ms.click(vp.width / 2, vp.height / 2, { button: 'right' }); await wait(350);
  await page.locator('.context-menu-item', { hasText: /^Copy/ }).first().click(); await wait(700);
  const r = await page.evaluate(async () => { const j = JSON.parse(await navigator.clipboard.readText()); return { type: j.type, n: j.elements.length }; });
  await emptyClick();
  const total = JSON.parse((await lsGet('excalidraw')) || '[]').filter((e) => !e.isDeleted).length;
  return { ...r, sceneTotal: total, ok: r.n === total };
}
async function shot() { await emptyClick(); await kb.press('Shift+1'); await wait(500); }   // fit everything before a screenshot

return { O, V, view, refresh, toScreen, wait, esc, tool, click, drag, emptyClick,
  statsOpen, info, field, setField, place, put, fit,
  panel, color, pick, font, style,
  text, shape, rect, ellipse, circle, line, arrow, label, toBack, lock,
  sel, marquee, align, nudge, move,
  libIds, loadLibraries, openLibrary, closeLibrary, icon,
  setup, items, audit, copyAll, shot };
