/* ==========================================================================
   slides-def.js — the slide manifest plus shared rendering helpers.

   Classic script (no ES modules) so the deck runs straight off the file
   system with file:// — no server and no build step.
   ========================================================================== */

/* The deck, in order. `id` also keys the speaker notes in content.js. */
const SLIDES = [
  { id: "title", kind: "title", label: "Habit 5" },
  { id: "map", kind: "map", label: "Where Habit 5 sits" },
  { id: "intent", kind: "intent", label: "Reply vs. Understand" },
  { id: "signals", kind: "signals", label: "The 93% you never hear" },
  { id: "ears", kind: "ears", label: "Two ears, one mouth" },
  { id: "perception", kind: "perception", label: "Others' Perception" },
  { id: "styles", kind: "styles", label: "Five ways we fake it" },
  { id: "loop", kind: "loop", label: "The practice loop" },
  { id: "mirror", kind: "mirror", label: "Mirroring" },
  { id: "auto", kind: "auto", label: "Autobiographical vs. Empathic" },
  { id: "trap", kind: "trap", label: "Three traps" },
  { id: "understood", kind: "understood", label: "Then, to be understood" },
  { id: "lab", kind: "lab", label: "The Listening Lab" },
  { id: "timer", kind: "timer", label: "The silence challenge" },
  { id: "plan", kind: "plan", label: "Your commitment" },
  { id: "recap", kind: "recap", label: "Recap" },
  { id: "credits", kind: "credits", label: "Sources" },
];

/* Every renderer is registered here; deck.js looks them up by kind. */
const RENDERERS = {};

/* --- helpers ------------------------------------------------------------ */

/**
 * Build the attribute string for a staggered reveal element.
 * @param {number} d   delay in ms
 * @param {string} cls extra class names
 * @param {string} sty extra inline style
 */
function A(d, cls, sty) {
  const style = `--d:${d || 0}ms;${sty || ""}`;
  return `data-anim class="${cls || ""}" style="${style}"`;
}

/** Escape text for safe interpolation into HTML. */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/** Point on a circle, 0deg = 12 o'clock, clockwise. */
function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Arc path between two angles on a circle. */
function arcPath(cx, cy, r, a1, a2) {
  const [x1, y1] = polar(cx, cy, r, a1);
  const [x2, y2] = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/** Smooth (Catmull-Rom style) cubic path through a list of points. */
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/* --- reusable inline icons ---------------------------------------------- */

const ICON_EAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 15.5v-2.6a8 8 0 0 1 16 0v2.6"/>
  <rect x="2.2" y="14.2" width="4.6" height="7" rx="2.1"/>
  <rect x="17.2" y="14.2" width="4.6" height="7" rx="2.1"/>
</svg>`;

const ICON_MOUTH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3.6 12c1.9-3 5-4.7 8.4-4.7S18.5 9 20.4 12c-1.9 3-5 4.7-8.4 4.7S5.5 15 3.6 12Z"/>
  <path d="M3.6 12c2.7 1.7 5.5 2.6 8.4 2.6s5.7-.9 8.4-2.6"/>
</svg>`;

const ICON_WAVE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
  <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>
  <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4"/>
  <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 19.4a10.5 10.5 0 0 0 0-14.8"/>
</svg>`;

const ICON_WARN = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <path d="M12 3.6 22 20H2L12 3.6Z"/><path d="M12 10v4.4"/><path d="M12 17.4h.01"/>
</svg>`;
