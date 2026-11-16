// Monthly Spend — github.com/veraetogrex-portfolio · zero dependencies
// Every category is a pocket as wide as its share of the month, with its receipts tucked inside.
// Switch the month: the pockets resize, then the biggest one lifts and moves to the front.
// Open a pocket: its three biggest receipts come out and lie on top, the rest stay inside.

const MONTHS = ['August', 'September', 'October', 'November'];
const CATS = ['Groceries', 'Dining', 'Transit', 'Shopping', 'Bills'];
const SPEND = [                     // dollars per category, rows sum to the month total
  [410, 250, 200, 200, 150],        // Aug  1,210 (only for comparison)
  [400, 240, 190, 200, 150],        // Sep  1,180
  [420, 260, 180, 230, 150],        // Oct  1,240
  [430, 270, 150, 480, 150],        // Nov  1,480
];
// per category and month (Sep, Oct, Nov): three largest purchases [what, where, day, $] and how many smaller ones
const BUYS = {
  Groceries: [[['Weekly shop', 'Harvest Market', 27, 92], ['Weekly shop', 'Harvest Market', 13, 84], ['Produce box', 'Greenleaf Grocer', 20, 58], 9],
              [['Weekly shop', 'Harvest Market', 25, 96], ['Weekly shop', 'Harvest Market', 11, 88], ['Produce box', 'Greenleaf Grocer', 18, 64], 9],
              [['Weekly shop', 'Harvest Market', 22, 102], ['Weekly shop', 'Harvest Market', 8, 91], ['Produce box', 'Greenleaf Grocer', 15, 61], 10]],
  Dining:    [[['Dinner for two', 'Little Lisbon', 19, 74], ['Ramen delivery', 'Nori Bar', 6, 46], ['Coffee card', 'Bean & Ember', 2, 31], 6],
              [['Dinner for two', 'Little Lisbon', 17, 82], ['Ramen delivery', 'Nori Bar', 24, 52], ['Sushi delivery', 'Nori Bar', 9, 38], 7],
              [['Birthday dinner', 'Little Lisbon', 14, 78], ['Ramen delivery', 'Nori Bar', 21, 56], ['Coffee card', 'Bean & Ember', 3, 34], 8]],
  Transit:   [[['Monthly pass', 'Metro', 1, 80], ['Fuel', 'Route 9', 14, 41], ['Taxi home', 'CityRide', 22, 34], 3],
              [['Monthly pass', 'Metro', 1, 80], ['Fuel', 'Route 9', 12, 38], ['Taxi home', 'CityRide', 26, 27], 3],
              [['Monthly pass', 'Metro', 1, 80], ['Taxi home', 'CityRide', 18, 29], ['Fuel', 'Route 9', 9, 22], 2]],
  Shopping:  [[['Bookshelf', 'Halden Home', 7, 88], ['Notebooks', 'Paper Lane', 15, 42], ['Socks', 'Stride', 23, 26], 3],
              [['Knit sweater', 'Northline', 4, 96], ['Rug', 'Halden Home', 19, 72], ['Planner', 'Paper Lane', 28, 24], 2],
              [['Winter coat', 'Northline', 12, 268], ['Running shoes', 'Stride', 20, 134], ['Desk lamp', 'Halden Home', 26, 46], 2]],
  Bills:     [[['Electricity', 'Hearth Energy', 5, 64], ['Home internet', 'Fibrelink', 3, 45], ['Phone plan', 'Pulse Mobile', 10, 25], 1],
              [['Electricity', 'Hearth Energy', 5, 66], ['Home internet', 'Fibrelink', 3, 45], ['Phone plan', 'Pulse Mobile', 10, 25], 1],
              [['Electricity', 'Hearth Energy', 5, 72], ['Home internet', 'Fibrelink', 3, 45], ['Phone plan', 'Pulse Mobile', 10, 25], 1]],
};
const ICONS = {   // category icons on the pocket fronts
  Groceries: '<path d="M3 4h2.2l2.3 11h10.8l2-8H6.3"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
  Dining: '<path d="M7 3v8m-2.5-8v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.4 1.2-3.5 3.6-3.5 7.5V13H17"/>',
  Transit: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8.5 20l1-3m6 3-1-3"/>',
  Shopping: '<path d="M5 8h14l-1.2 12.5H6.2z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
  Bills: '<path d="M13 2.5 5.5 13.5H12l-1 8 7.5-11H12z"/>',
};
// what is printed on each receipt: a small drawing of the thing bought
const ART = {
  'Weekly shop':    '<path d="M5 8h14l-1.4 12H6.4z"/><path d="M9 8V6a3 3 0 0 1 6 0v2M9 13h6"/>',
  'Produce box':    '<path d="M3 9h18l-2 11H5z"/><path d="M12 9c0-3 2-5 5-5-0 3-2 5-5 5zM12 9c0-2.5-1.5-4-4-4 0 2.5 1.5 4 4 4z"/>',
  'Dinner for two': '<circle cx="12" cy="13" r="6.5"/><circle cx="12" cy="13" r="3"/><path d="M2.5 5v6m0-6v14M21.5 5c-1.5 1-2 3-2 6h2v8"/>',
  'Birthday dinner':'<path d="M4 20h16v-7H4z"/><path d="M4 16c2 1 4 1 6 0s4-1 6 0 3 1 4 0M8 13V9m4 4V8m4 5V9"/><path d="M8 7v-.5M12 6v-.5M16 7v-.5"/>',
  'Ramen delivery': '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 11 12 3m3 8 4-7M7 7h10"/>',
  'Sushi delivery': '<rect x="4" y="9" width="16" height="9" rx="4.5"/><circle cx="12" cy="13.5" r="2"/><path d="M6 6l12-2"/>',
  'Coffee card':    '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c0 1.5 1.5 1.5 1.5 3M12 3.5c0 1.5 1.5 1.5 1.5 3"/>',
  'Monthly pass':   '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M7 10h6M7 14h4M17 6v12"/>',
  'Fuel':           '<path d="M5 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h14M7 8h6"/><path d="M15 9l3 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
  'Taxi home':      '<path d="M4 16v-4l2-5h12l2 5v4z"/><path d="M4 16v2.5M20 16v2.5M9 4.5h6M4 12h16"/><circle cx="8" cy="14" r=".8"/><circle cx="16" cy="14" r=".8"/>',
  'Bookshelf':      '<path d="M4 3v18M20 3v18M4 12h16M4 21h16M7 12V5m3 7V6m4 6-1.5-6M16 21v-6m-4 6v-7"/>',
  'Notebooks':      '<rect x="6" y="3" width="13" height="18" rx="2"/><path d="M6 7H4M6 12H4M6 17H4M10 8h5"/>',
  'Socks':          '<path d="M8 3h6v9l3 3a3 3 0 0 1-4.2 4.2L8 14.5z"/><path d="M8 7h6"/>',
  'Knit sweater':   '<path d="M8 4h8l5 4-2 4-3-2v11H8V10l-3 2-2-4z"/><path d="M9 4c0 2 1.5 3 3 3s3-1 3-3M8 16h8"/>',
  'Rug':            '<rect x="5" y="4" width="14" height="16" rx="1"/><path d="M5 2v2m4-2v2m4-2v2m4-2v2M5 20v2m4-2v2m4-2v2m4-2v2"/><path d="M9 12l3-4 3 4-3 4z"/>',
  'Planner':        '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4m8-4v4M8 14h2m4 0h2"/>',
  'Winter coat':    '<path d="M9 3h6l3 3 3 4-3 2v9H6v-9L3 10l3-4z"/><path d="M9 3l3 4 3-4M12 7v14"/>',
  'Running shoes':  '<path d="M3 15c0-3 1-6 2-8l3 2c1 1 3 1 4 0l2 2c2 1 5 1.5 7 2.5V17H3z"/><path d="M3 17v2h18v-2M9 11l1 1m1-3 1 1"/>',
  'Desk lamp':      '<path d="M7 4h7l3 7H4z"/><path d="M10.5 11v7M6 21h9"/>',
  'Electricity':    '<path d="M13 2.5 5.5 13.5H12l-1 8 7.5-11H12z"/>',
  'Home internet':  '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.2" r="1"/>',
  'Phone plan':     '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
};
const W = 1216, H = 420, LIFT = 16, GAP = 10, R = 22;        // ribbon, px
const RW = 372, RH = 228;                                        // a receipt at full size
const ROW_Y = 262, PEEK_TALL = 112, PEEK_ROW = 36;              // pockets: tall, or a low row under the laid-out receipts

const root   = document.querySelector('#spend');
const tabs   = [...root.querySelectorAll('.ms-month')];
const pill   = root.querySelector('.ms-month-pill');
const label  = root.querySelector('.ms-label');
const totalEl = root.querySelector('.ms-total');
const back   = root.querySelector('.ms-back');
const ribbon = root.querySelector('.ms-ribbon');

const money = v => '$' + Math.round(v).toLocaleString('en-US');
const sum = a => a.reduce((s, v) => s + v, 0);
const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => 1 - Math.pow(1 - t, 3);
const inOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const span = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));   // local progress of p inside [a, b]

// each category: a cell with three receipts tucked behind a front panel
ribbon.innerHTML = CATS.map((c, i) => `<span class="ms-cell" role="listitem">
  <span class="ms-rc is-stub"></span><span class="ms-rc is-stub"></span>
  ${[0, 1, 2].map(() => `<span class="ms-rc"><span class="ms-art"></span><p class="ms-what"></p><p class="ms-where"></p>
    <span class="ms-cut"></span><p class="ms-tot">TOTAL</p><p class="ms-sum"></p></span>`).join('')}
  <button class="ms-front" data-c="${i}" aria-expanded="false"><span class="ms-face"><span class="ms-ico">${svg(ICONS[c])}</span>
    <span class="ms-face-t"><p class="ms-name">${c}</p><p class="ms-amt"><span class="ms-v">$0</span><span class="ms-small"></span></p></span></span></button></span>`).join('');
const cells = [...ribbon.children];
const fronts = cells.map(c => c.querySelector('.ms-front'));
const faces = cells.map(c => c.querySelector('.ms-face'));
const texts = cells.map(c => c.querySelector('.ms-face-t'));
const vals = cells.map(c => c.querySelector('.ms-v'));
const smalls = cells.map(c => c.querySelector('.ms-small'));
const receipts = cells.map(c => [...c.querySelectorAll('.ms-rc:not(.is-stub)')]);
const stubEls = cells.map(c => [...c.querySelectorAll('.ms-rc.is-stub')]);   // the small receipts that stay in an open pocket

let month = 2, open = -1, leaving = -1, rolls = new Map(), anim = 0;   // leaving: the pocket whose receipts are going back in
let shown = { rects: [], out: 0 };   // what is on screen right now

// ── geometry: a pocket is a rect plus how far its receipts stick out (peek) and how deep they are pushed in (sink) ──
const orderOf = m => CATS.map((_, i) => i).sort((a, b) => SPEND[m][b] - SPEND[m][a] || a - b);   // biggest first
function row(order, v, y, h, peek, sink = 0) {
  const free = W - GAP * (order.length - 1), total = sum(order.map(i => v[i])), out = [];
  let x = 0;
  for (const i of order) { const w = free * v[i] / total; out[i] = { x, y, w, h, peek, sink }; x += w + GAP; }
  return out;
}
const tallRects = (m, order = orderOf(m)) => row(order, SPEND[m], 0, H, PEEK_TALL);
const rowRects = (m, keep) => row(orderOf(m), SPEND[m], ROW_Y, H - ROW_Y, PEEK_ROW, 1).map((r, i) => i === keep ? { ...r, sink: 0 } : r);
const mix = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t),
  peek: lerp(a.peek, b.peek, t), sink: lerp(a.sink, b.sink, t) });

// a receipt tucked in its pocket: scaled to fit, its top sticking out; sunk = pushed fully behind the front
function tucked(r, j) {
  const front = r.y + r.peek, room = r.h - 24 - j * r.peek * .16;
  const s = Math.max(.2, Math.min(1, (r.w - 30 - j * 10) / RW, room / RH)), h = RH * s;
  const up = { x: r.x + (r.w - RW * s) / 2 + (j - 1) * 5, y: Math.max(r.y + 8 + j * r.peek * .16, front + 14 - h), s,
    rot: [-2.2, 1.6, -.8][j] * (r.peek > 60 ? 1 : .6) };
  const ds = Math.max(.15, Math.min(s, (r.h - r.peek - 16) / RH));
  const down = { x: r.x + (r.w - RW * ds) / 2, y: front + 8, s: ds, rot: 0 };
  return { x: lerp(up.x, down.x, r.sink), y: lerp(up.y, down.y, r.sink), s: lerp(up.s, down.s, r.sink), rot: lerp(up.rot, down.rot, r.sink) };
}
// a receipt laid out above the row, at full size
const laid = j => ({ x: 24 + j * 406, y: 6 + [0, 8, 4][j], s: 1, rot: [-2.4, 1.4, -1][j] });
const place = (el, t) => { el.style.transform = `translate(${t.x - (1 - t.s) * RW / 2}px, ${t.y - (1 - t.s) * RH / 2}px) rotate(${t.rot}deg) scale(${t.s})`; };

let pressed = -1, stubs = 0;   // the pocket under a pressed pointer; how visible the leftover receipts of the open pocket are

// draw one frame: pocket rects and how far the open pocket's receipts have come out
function draw(rects, out = 0, lifted = -1) {
  shown = { rects, out };
  rects.forEach((r0, i) => {
    const r = i === pressed ? { ...r0, x: r0.x + 4, y: r0.y + 4, w: r0.w - 8, h: r0.h - 8 } : r0;   // pressed: the pocket gives a little
    const top = r.y + r.peek + LIFT, f = fronts[i];
    f.style.clipPath = `inset(${top}px ${W - r.x - r.w}px ${H - r.y - r.h}px ${r.x}px round ${R}px)`;
    faces[i].style.transform = `translate(${r.x}px, ${r.y + r.h - 300 + LIFT}px)`;
    texts[i].style.transform = `scale(${lerp(.86, 1, (r.peek - PEEK_ROW) / (PEEK_TALL - PEEK_ROW))})`;
    receipts[i].forEach((el, j) => {
      const t = tucked(r, j);
      if (i === open || (i === leaving && out > 0)) {
        const q = inOut(span(out, j * .1, .72 + j * .1)), L = laid(j);   // the top receipt comes out first
        place(el, { x: lerp(t.x, L.x, q), y: lerp(t.y, L.y, q) - 70 * Math.sin(Math.PI * q) * (1 - q), s: lerp(t.s, 1, q), rot: lerp(t.rot, L.rot, q) });
        el.style.zIndex = q > .28 ? 11 : 5 - j;                            // in front of its pocket once it has risen
        el.classList.toggle('is-out', q > .5);
      } else { place(el, t); el.style.zIndex = 5 - j; el.classList.remove('is-out'); }
    });
    stubEls[i].forEach((el, k) => { place(el, tucked({ ...r, sink: 0 }, k + 1)); el.style.opacity = i === open || i === leaving ? stubs : 0; });
    cells[i].style.zIndex = i === lifted ? 5 : i === open || i === leaving ? 4 : 1;
    const up = i === lifted ? Math.min(1, -r.y / LIFT * 1.6) : 0;         // shadow grows with the lift
    cells[i].style.filter = up > 0 ? `drop-shadow(0 ${14 * up}px ${22 * up}px rgba(0, 0, 0, ${.6 * up}))` : '';
  });
}

// what each receipt says this month
function print(m) {
  CATS.forEach((c, i) => BUYS[c][m - 1].slice(0, 3).forEach(([what, where, day, v], j) => {
    const el = receipts[i][j];
    el.querySelector('.ms-art').innerHTML = svg(ART[what] || ICONS[c]);
    el.querySelector('.ms-what').textContent = what;
    el.querySelector('.ms-where').textContent = where;
    el.querySelector('.ms-tot').textContent = `${MONTHS[m].slice(0, 3)} ${day}`;
    el.querySelector('.ms-sum').textContent = money(v);
  }));
}

function paintState() {
  const order = orderOf(month);
  fronts.forEach((f, i) => {
    f.dataset.rank = order.indexOf(i);
    f.setAttribute('aria-expanded', i === open);
    f.setAttribute('aria-label', `${CATS[i]}, ${money(SPEND[month][i])} in ${MONTHS[month]}`);
  });
  tabs.forEach((t, k) => { const on = k + 1 === month; t.setAttribute('aria-checked', on); t.tabIndex = on ? 0 : -1; });
  pill.style.transform = `translateX(${(month - 1) * 128}px)`;
  root.classList.toggle('is-open', open >= 0);
  back.tabIndex = open >= 0 ? 0 : -1;
  label.textContent = `Spent in ${MONTHS[month]}`;
}

// one animation at a time; p goes 0 → 1, step draws the frame
function run(ms, step) {
  const id = ++anim;
  return new Promise(done => {
    const t0 = performance.now();
    const tick = now => {
      if (id !== anim) return done(false);
      const p = Math.min(1, (now - t0) / ms); step(p);
      p < 1 ? requestAnimationFrame(tick) : done(true);
    };
    requestAnimationFrame(tick);
  });
}

function reset() {
  anim++; root.classList.add('is-reset');
  rolls = new Map(); month = 2; open = -1; leaving = -1;
  pressed = -1; stubs = 0; print(month); paintState(); draw(tallRects(month));
  vals.forEach((a, i) => roll(a, SPEND[month][i], 0)); roll(totalEl, sum(SPEND[month]), 0);
  smalls.forEach(s => s.style.opacity = 0);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-reset')));
}

// ── month: pockets resize in place, then the new leader lifts and moves to the front ──
// from an open pocket it is one motion: the receipts go back in while the pockets stand up, then the re-sort
async function setMonth(m) {
  if (m === month && open < 0) return;
  const from = shown.rects, before = [...cells.keys()].sort((a, b) => from[a].x - from[b].x), was = open;
  if (was >= 0) { open = -1; leaving = was; }
  month = m;
  const v = SPEND[m], resized = row(before, v, 0, H, PEEK_TALL), to = tallRects(m), lead = orderOf(m)[0], moves = before[0] !== lead;
  vals.forEach((a, i) => roll(a, v[i], 620)); roll(totalEl, sum(v), 720);
  if (was < 0) print(m); else smalls[was].style.opacity = 0;
  paintState(); if (was >= 0) segsOpen(was, true);
  let printed = was < 0;
  const A = moves ? .42 : 1;                                                   // share of time for phase 1
  await run(was >= 0 ? 1250 : moves ? 1100 : 520, p => {
    const back = was >= 0 ? 1 - span(p, 0, .36) : 0;                         // receipts slide back in first
    if (was >= 0) stubs = 1 - span(p, 0, .15);
    if (!printed && back === 0) { print(m); printed = true; }                // only tucked receipts change month
    draw(cells.map((_, i) => {
      if (p < A) return mix(from[i], resized[i], inOut(span(p, 0, A)));      // 1: stand up and resize, order stays
      const slide = i === lead ? inOut(span(p, A, A + .38 * (1 - A) / .58)) : inOut(span(p, A + .08 * (1 - A) / .58, 1));   // 2: the leader goes over
      const r = mix(resized[i], to[i], slide);
      if (i === lead) r.y = -LIFT * Math.sin(Math.PI * span(p, A, A + .48 * (1 - A) / .58));
      return r;
    }), back, moves && p >= A ? lead : -1);
  });
  if (was >= 0) { segsOpen(was, false); leaving = -1; }
}
const segsOpen = (i, on) => fronts[i].classList.toggle('is-open', on);

// ── open: the other pockets sink into a low row, the receipts come out of the open one, then it settles too ──
async function openCat(i) {
  if (i === open) return closeCat();
  if (open >= 0) await closeCat(700);
  const from = shown.rects, to = rowRects(month, i);
  open = i; leaving = -1; paintState();
  const [a, b, c, more] = BUYS[CATS[i]][month - 1];
  const room = to[i].w - 40, fits = t => (smalls[i].textContent = t, texts[i].offsetWidth * .86 <= room);   // .86: label scale in the low row
  const shows = fits(`+${more} more ${money(SPEND[month][i] - a[3] - b[3] - c[3])}`) || fits(`+${more} more`) ? 1 : 0;
  await run(1250, p => {
    const sink = inOut(span(p, 0, .42)), settle = inOut(span(p, .5, .86));  // the open pocket stays tall while its receipts leave
    draw(cells.map((_, k) => mix(from[k], to[k], k === i ? settle : sink)), span(p, .06, .8));
    stubs = span(p, .75, 1); smalls[i].style.opacity = span(p, .75, 1) * shows;
  });
}
async function closeCat(ms = 950) {
  if (open < 0) return;
  const from = shown.rects, to = tallRects(month), i = open;
  open = -1; leaving = i; paintState();
  await run(ms, p => {
    smalls[i].style.opacity = stubs = 1 - span(p, 0, .2);
    const stand = inOut(span(p, 0, .4)), rise = inOut(span(p, .3, 1));     // the open pocket stands up first to take its receipts back
    draw(cells.map((_, k) => mix(from[k], to[k], k === i ? stand : rise)), 1 - span(p, .05, .7));
  });
  leaving = -1;
}

// a pressed pocket gives a little under the pointer
fronts.forEach((f, i) => {
  f.addEventListener('pointerdown', () => { pressed = i; draw(shown.rects, shown.out); });
  const up = () => { if (pressed === i) { pressed = -1; draw(shown.rects, shown.out); } };
  f.addEventListener('pointerup', up); f.addEventListener('pointerleave', up); f.addEventListener('pointercancel', up);
});
fronts.forEach((f, i) => f.addEventListener('click', () => openCat(i)));
back.addEventListener('click', () => closeCat());
tabs.forEach((t, k) => t.addEventListener('click', () => setMonth(k + 1)));
root.querySelector('.ms-months').addEventListener('keydown', e => {
  const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!dir) return;
  e.preventDefault(); const m = Math.min(3, Math.max(1, month + dir)); setMonth(m); tabs[m - 1].focus();
});
root.addEventListener('keydown', e => { if (e.key === 'Escape') closeCat(); });

// numbers count to their new value instead of jumping
function roll(el, to, ms = 600) {
  const id = {}; rolls.set(el, id);
  if (!ms) { el.textContent = money(to); return; }
  const from = parseFloat(el.textContent.replace(/[^0-9.]/g, '')) || 0, t0 = performance.now();
  const step = now => {
    if (rolls.get(el) !== id) return;
    const p = Math.min(1, (now - t0) / ms);
    el.textContent = money(from + (to - from) * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

reset();
root.spend = { reset, month: m => tabs[m - 1], front: i => fronts[i], back, rect: i => shown.rects[i], open: () => open };   // for scripted demos
