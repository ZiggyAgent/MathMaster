// Visual helpers — return SVG/HTML strings injected into lesson slides and
// question cards. Colors lean on the app palette; SVG inherits CSS variables
// because everything is inlined into the DOM.

const VIZ_INK = "#1e293b", VIZ_SOFT = "#64748b", VIZ_PRIMARY = "#4f46e5",
      VIZ_SOFTBG = "#eef2ff", VIZ_LINE = "#cbd5e1", VIZ_ACCENT = "#b45309",
      VIZ_GOOD = "#047857";

// A grid of emoji objects, e.g. 13 apples in rows of 5 (grouping helps counting)
function vizObjects(emoji, count, perRow = 5) {
  let html = `<div class="viz-objects">`;
  for (let i = 0; i < count; i++) {
    if (i > 0 && i % perRow === 0) html += `<span class="viz-break"></span>`;
    html += `<span>${emoji}</span>`;
  }
  return html + `</div>`;
}

// Two groups side by side (for addition/comparison stories)
function vizTwoGroups(emoji, a, b, sep = "+") {
  return `<div class="viz-groups"><div>${vizObjects(emoji, a)}</div>` +
         `<div class="viz-sep">${sep}</div><div>${vizObjects(emoji, b)}</div></div>`;
}

// Ten frames: filled dots for n (up to 20 across two frames)
function vizTenFrame(n) {
  const frames = n > 10 ? 2 : 1;
  let svg = `<svg viewBox="0 0 ${frames * 130 + 10} 60" class="viz" role="img">`;
  for (let f = 0; f < frames; f++) {
    const ox = f * 130 + 5;
    for (let i = 0; i < 10; i++) {
      const x = ox + (i % 5) * 24, y = 5 + Math.floor(i / 5) * 24;
      const idx = f * 10 + i;
      svg += `<rect x="${x}" y="${y}" width="22" height="22" rx="3" fill="${idx < n ? VIZ_SOFTBG : "#fff"}" stroke="${VIZ_LINE}"/>`;
      if (idx < n) svg += `<circle cx="${x + 11}" cy="${y + 11}" r="7" fill="${VIZ_PRIMARY}"/>`;
    }
  }
  return svg + `</svg>`;
}

// Base-ten blocks: rods of ten + unit cubes for a number up to 120
function vizBaseTen(n) {
  const tens = Math.floor(n / 10), ones = n % 10;
  const w = tens * 26 + (ones ? 40 : 10) + 10;
  let svg = `<svg viewBox="0 0 ${Math.max(w, 60)} 110" class="viz" style="max-width:${Math.max(w, 60) * 2.2}px" role="img">`;
  for (let t = 0; t < tens; t++) {
    for (let i = 0; i < 10; i++) {
      svg += `<rect x="${5 + t * 26}" y="${3 + i * 10.4}" width="20" height="9" rx="2" fill="${VIZ_PRIMARY}" opacity="0.85" stroke="#fff"/>`;
    }
  }
  for (let o = 0; o < ones; o++) {
    const x = 5 + tens * 26 + (o % 3) * 11, y = 3 + Math.floor(o / 3) * 11;
    svg += `<rect x="${x}" y="${y}" width="9" height="9" rx="2" fill="${VIZ_ACCENT}"/>`;
  }
  return svg + `</svg>`;
}

// Number line with optional labeled marks and hop arrows
function vizNumberLine(min, max, opts = {}) {
  const W = 320, H = opts.jumps ? 70 : 46, pad = 16;
  const X = (v) => pad + ((v - min) / (max - min)) * (W - 2 * pad);
  const base = H - 18;
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="viz" role="img">`;
  svg += `<line x1="${pad - 6}" y1="${base}" x2="${W - pad + 6}" y2="${base}" stroke="${VIZ_INK}" stroke-width="2"/>`;
  const step = opts.step || 1;
  const labelEvery = opts.labelEvery || 1;
  for (let v = min; v <= max; v += step) {
    svg += `<line x1="${X(v)}" y1="${base - 5}" x2="${X(v)}" y2="${base + 5}" stroke="${VIZ_INK}"/>`;
    if ((v - min) % (step * labelEvery) === 0)
      svg += `<text x="${X(v)}" y="${base + 16}" font-size="11" text-anchor="middle" fill="${VIZ_SOFT}">${opts.fracDen ? fracStr(v, opts.fracDen) : v}</text>`;
  }
  for (const m of opts.marks || []) {
    svg += `<circle cx="${X(m.at)}" cy="${base}" r="6" fill="${m.color || VIZ_PRIMARY}"/>`;
    if (m.label !== undefined) svg += `<text x="${X(m.at)}" y="${base - 12}" font-size="12" font-weight="700" text-anchor="middle" fill="${m.color || VIZ_PRIMARY}">${m.label}</text>`;
  }
  for (const j of opts.jumps || []) {
    const x1 = X(j.from), x2 = X(j.to), mid = (x1 + x2) / 2;
    svg += `<path d="M ${x1} ${base - 6} Q ${mid} ${base - 34} ${x2} ${base - 6}" fill="none" stroke="${j.color || VIZ_ACCENT}" stroke-width="2"/>`;
    if (j.label) svg += `<text x="${mid}" y="${base - 30}" font-size="11" font-weight="700" text-anchor="middle" fill="${j.color || VIZ_ACCENT}">${j.label}</text>`;
  }
  return svg + `</svg>`;
}

// Analog clock
function vizClock(h, m) {
  const cx = 60, cy = 60, r = 52;
  let svg = `<svg viewBox="0 0 120 120" class="viz" style="max-width:170px" role="img">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${VIZ_INK}" stroke-width="3"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    svg += `<text x="${cx + Math.cos(a) * 42}" y="${cy + Math.sin(a) * 42 + 4}" font-size="11" font-weight="700" text-anchor="middle" fill="${VIZ_INK}">${i}</text>`;
  }
  const ha = ((h % 12) * 30 + m * 0.5 - 90) * Math.PI / 180;
  const ma = (m * 6 - 90) * Math.PI / 180;
  svg += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ha) * 24}" y2="${cy + Math.sin(ha) * 24}" stroke="${VIZ_INK}" stroke-width="4" stroke-linecap="round"/>`;
  svg += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ma) * 36}" y2="${cy + Math.sin(ma) * 36}" stroke="${VIZ_PRIMARY}" stroke-width="3" stroke-linecap="round"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="${VIZ_INK}"/>`;
  return svg + `</svg>`;
}

// Coins & bills as labeled circles/rectangles (clearer than photos at small sizes)
const COIN_STYLE = {
  1:  { label: "1¢",  name: "penny",   bg: "#d97706", fg: "#fff", r: 16 },
  5:  { label: "5¢",  name: "nickel",  bg: "#94a3b8", fg: "#fff", r: 20 },
  10: { label: "10¢", name: "dime",    bg: "#cbd5e1", fg: "#334155", r: 14 },
  25: { label: "25¢", name: "quarter", bg: "#64748b", fg: "#fff", r: 22 },
};
function vizMoney(coins, bills = []) {
  let html = `<div class="viz-money">`;
  for (const b of bills) html += `<span class="viz-bill">$${b}</span>`;
  for (const c of coins) {
    const s = COIN_STYLE[c];
    html += `<span class="viz-coin" style="width:${s.r * 2.4}px;height:${s.r * 2.4}px;background:${s.bg};color:${s.fg}">${s.label}</span>`;
  }
  return html + `</div>`;
}

// Rectangular array of dots (multiplication/odd-even)
function vizArray(rows, cols) {
  const W = cols * 22 + 10, H = rows * 22 + 10;
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="viz" style="max-width:${W * 1.6}px" role="img">`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    svg += `<circle cx="${16 + c * 22}" cy="${16 + r * 22}" r="8" fill="${VIZ_PRIMARY}" opacity="0.85"/>`;
  return svg + `</svg>`;
}

// Fraction bar: den parts, num shaded
function vizFractionBar(num, den, color = VIZ_PRIMARY) {
  const W = 300, H = 40;
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="viz" role="img">`;
  const w = (W - 4) / den;
  for (let i = 0; i < den; i++)
    svg += `<rect x="${2 + i * w}" y="2" width="${w}" height="${H - 4}" fill="${i < num ? color : "#fff"}" opacity="${i < num ? 0.85 : 1}" stroke="${VIZ_INK}"/>`;
  return svg + `</svg>`;
}
// Two stacked bars for comparing fractions
function vizFractionBars(n1, d1, n2, d2) {
  return `<div>${vizFractionBar(n1, d1)}${vizFractionBar(n2, d2, VIZ_ACCENT)}</div>`;
}

// Circle split into den slices, num shaded
function vizFractionCircle(num, den, color = VIZ_PRIMARY) {
  const cx = 50, cy = 50, r = 44;
  let svg = `<svg viewBox="0 0 100 100" class="viz" style="max-width:140px" role="img">`;
  for (let i = 0; i < den; i++) {
    const a1 = (i / den) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const large = (a2 - a1) > Math.PI ? 1 : 0;
    if (den === 1) {
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${i < num ? color : "#fff"}" stroke="${VIZ_INK}" stroke-width="1.5"/>`;
    } else {
      svg += `<path d="M ${cx} ${cy} L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z" fill="${i < num ? color : "#fff"}" opacity="${i < num ? 0.85 : 1}" stroke="${VIZ_INK}" stroke-width="1.5"/>`;
    }
  }
  return svg + `</svg>`;
}

// Area model rectangle with grid + side labels
function vizAreaGrid(w, h, opts = {}) {
  const cell = Math.min(24, 240 / Math.max(w, h));
  const W = w * cell + 50, H = h * cell + 30;
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="viz" role="img">`;
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++)
    svg += `<rect x="${30 + c * cell}" y="${5 + r * cell}" width="${cell}" height="${cell}" fill="${VIZ_SOFTBG}" stroke="${VIZ_LINE}"/>`;
  svg += `<text x="${30 + (w * cell) / 2}" y="${H - 8}" font-size="13" font-weight="700" text-anchor="middle" fill="${VIZ_INK}">${opts.wLabel ?? w}</text>`;
  svg += `<text x="${16}" y="${5 + (h * cell) / 2 + 4}" font-size="13" font-weight="700" text-anchor="middle" fill="${VIZ_INK}">${opts.hLabel ?? h}</text>`;
  return svg + `</svg>`;
}

// Volume: layered unit cubes drawn in simple oblique projection
function vizCubes(l, w, h) {
  const u = Math.min(20, 200 / Math.max(l + w, h + w));
  const ox = 10 + w * u * 0.5, oy = 8 + w * u * 0.4;
  const px = (x, y, z) => [ox + x * u + y * u * 0.5, oy + (h - z - 1) * u + (w - 1 - y) * u * 0.4];
  const W = l * u + w * u * 0.5 + 24, H = h * u + w * u * 0.4 + 20;
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="viz" style="max-width:${W * 1.7}px" role="img">`;
  for (let y = w - 1; y >= 0; y--) for (let z = 0; z < h; z++) for (let x = 0; x < l; x++) {
    const [X, Y] = px(x, y, z);
    svg += `<rect x="${X - x * u + x * u}" y="${Y}" width="${u}" height="${u}" fill="${VIZ_SOFTBG}" stroke="${VIZ_PRIMARY}" transform="translate(${0},0)" x="${X}"/>`;
    svg += `<path d="M ${X} ${Y} l ${u * 0.5} ${-u * 0.4} l ${u} 0 l ${-u * 0.5} ${u * 0.4} Z" fill="#c7d2fe" stroke="${VIZ_PRIMARY}"/>`;
    svg += `<path d="M ${X + u} ${Y} l ${u * 0.5} ${-u * 0.4} l 0 ${u} l ${-u * 0.5} ${u * 0.4} Z" fill="#a5b4fc" stroke="${VIZ_PRIMARY}"/>`;
    svg += `<rect x="${X}" y="${Y}" width="${u}" height="${u}" fill="${VIZ_SOFTBG}" stroke="${VIZ_PRIMARY}"/>`;
  }
  return svg + `</svg>`;
}

// Coordinate plane (quadrant 1 by default), optional plotted/labeled points
function vizCoordPlane(points = [], opts = {}) {
  const max = opts.max || 10, four = !!opts.fourQuadrant;
  const min = four ? -max : 0;
  const W = 240, pad = 24;
  const X = (v) => pad + ((v - min) / (max - min)) * (W - 2 * pad);
  const Y = (v) => W - pad - ((v - min) / (max - min)) * (W - 2 * pad);
  let svg = `<svg viewBox="0 0 ${W} ${W}" class="viz" style="max-width:260px" role="img">`;
  for (let v = min; v <= max; v++) {
    svg += `<line x1="${X(v)}" y1="${Y(min)}" x2="${X(v)}" y2="${Y(max)}" stroke="#e2e8f0"/>`;
    svg += `<line x1="${X(min)}" y1="${Y(v)}" x2="${X(max)}" y2="${Y(v)}" stroke="#e2e8f0"/>`;
  }
  svg += `<line x1="${X(min)}" y1="${Y(0)}" x2="${X(max)}" y2="${Y(0)}" stroke="${VIZ_INK}" stroke-width="2"/>`;
  svg += `<line x1="${X(0)}" y1="${Y(min)}" x2="${X(0)}" y2="${Y(max)}" stroke="${VIZ_INK}" stroke-width="2"/>`;
  const lblStep = max > 6 ? 2 : 1;
  for (let v = min; v <= max; v += lblStep) {
    if (v !== 0) {
      svg += `<text x="${X(v)}" y="${Y(0) + 14}" font-size="9" text-anchor="middle" fill="${VIZ_SOFT}">${v}</text>`;
      svg += `<text x="${X(0) - 8}" y="${Y(v) + 3}" font-size="9" text-anchor="end" fill="${VIZ_SOFT}">${v}</text>`;
    }
  }
  for (const p of points) {
    svg += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="${p.color || VIZ_ACCENT}"/>`;
    if (p.label) svg += `<text x="${X(p.x) + 8}" y="${Y(p.y) - 6}" font-size="12" font-weight="700" fill="${p.color || VIZ_ACCENT}">${p.label}</text>`;
  }
  return svg + `</svg>`;
}

// Bar chart for data questions: items [{label, value, color?}]
function vizBarChart(items, opts = {}) {
  const W = 300, H = 170, pad = 30;
  const maxV = opts.max || Math.max(...items.map((i) => i.value)) || 1;
  const bw = (W - pad - 10) / items.length;
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="viz" role="img">`;
  const gstep = maxV > 12 ? Math.ceil(maxV / 6) : maxV > 6 ? 2 : 1;
  for (let v = 0; v <= maxV; v += gstep) {
    const y = H - 25 - (v / maxV) * (H - 45);
    svg += `<line x1="${pad}" y1="${y}" x2="${W - 5}" y2="${y}" stroke="#e2e8f0"/>`;
    svg += `<text x="${pad - 5}" y="${y + 3}" font-size="9" text-anchor="end" fill="${VIZ_SOFT}">${v}</text>`;
  }
  items.forEach((it, i) => {
    const bh = (it.value / maxV) * (H - 45);
    svg += `<rect x="${pad + i * bw + bw * 0.15}" y="${H - 25 - bh}" width="${bw * 0.7}" height="${bh}" rx="3" fill="${it.color || VIZ_PRIMARY}" opacity="0.85"/>`;
    svg += `<text x="${pad + i * bw + bw * 0.5}" y="${H - 11}" font-size="10" text-anchor="middle" fill="${VIZ_INK}">${it.label}</text>`;
  });
  return svg + `</svg>`;
}

// Picture graph: rows of repeated emoji, each symbol worth `per`
function vizPicto(rows, per = 1) {
  let html = `<table class="viz-picto">`;
  for (const r of rows) html += `<tr><th>${r.label}</th><td>${r.emoji.repeat(Math.round(r.value / per))}</td></tr>`;
  html += `</table>`;
  if (per > 1) html += `<p class="viz-key">Key: each symbol = ${per}</p>`;
  return html;
}

// Line plot: x marks stacked above a number line. values = array of numbers.
function vizLinePlot(values, min, max, opts = {}) {
  const W = 300, H = 110, pad = 20;
  const X = (v) => pad + ((v - min) / (max - min)) * (W - 2 * pad);
  const counts = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="viz" role="img">`;
  svg += `<line x1="${pad - 6}" y1="${H - 22}" x2="${W - pad + 6}" y2="${H - 22}" stroke="${VIZ_INK}" stroke-width="2"/>`;
  const step = opts.step || 1;
  for (let v = min; v <= max + 1e-9; v += step) {
    const vv = Math.round(v * 1000) / 1000;
    svg += `<line x1="${X(vv)}" y1="${H - 27}" x2="${X(vv)}" y2="${H - 17}" stroke="${VIZ_INK}"/>`;
    svg += `<text x="${X(vv)}" y="${H - 6}" font-size="10" text-anchor="middle" fill="${VIZ_SOFT}">${opts.fracDen ? fracStr(Math.round(vv * opts.fracDen), opts.fracDen) : vv}</text>`;
    for (let i = 0; i < (counts[vv] || 0); i++)
      svg += `<text x="${X(vv)}" y="${H - 32 - i * 14}" font-size="13" font-weight="800" text-anchor="middle" fill="${VIZ_PRIMARY}">✕</text>`;
  }
  return svg + `</svg>`;
}

// Simple labeled polygon shapes for geometry questions
function vizShape(kind, opts = {}) {
  const fill = opts.fill || VIZ_SOFTBG, stroke = VIZ_PRIMARY;
  const shapes = {
    circle: `<circle cx="60" cy="50" r="40" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    triangle: `<path d="M 60 12 L 108 88 L 12 88 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    square: `<rect x="22" y="12" width="76" height="76" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    rectangle: `<rect x="10" y="25" width="100" height="55" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    rhombus: `<path d="M 60 10 L 100 50 L 60 90 L 20 50 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    trapezoid: `<path d="M 35 20 L 85 20 L 108 85 L 12 85 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    pentagon: `<path d="M 60 10 L 105 45 L 88 95 L 32 95 L 15 45 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    hexagon: `<path d="M 35 15 L 85 15 L 110 50 L 85 85 L 35 85 L 10 50 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    parallelogram: `<path d="M 35 20 L 110 20 L 85 80 L 10 80 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
  };
  return `<svg viewBox="0 0 120 100" class="viz" style="max-width:130px" role="img">${shapes[kind] || ""}</svg>`;
}

// A shape partitioned into equal (or unequal!) parts, some shaded
function vizPartitionedRect(parts, shaded, opts = {}) {
  return vizFractionBar(shaded, parts, opts.color || VIZ_PRIMARY);
}
function vizPartitionedCircle(parts, shaded) { return vizFractionCircle(shaded, parts); }
