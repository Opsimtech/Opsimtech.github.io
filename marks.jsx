/* global React */
const MARK_INK = '#0E1116';
const MARK_PAPER = '#F6F4EF';
const MARK_ACCENT = 'oklch(0.62 0.16 248)';

// ───────────────────────── PHASE ─────────────────────────
// O ring with a sine wave passing through.
function PhaseMark({ size = 200, color = MARK_INK, accent = null }) {
  const uid = React.useId().replace(/:/g, '');
  const a = accent || color;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <clipPath id={`pc-${uid}`}>
          <rect x="0" y="0" width="200" height="200" />
        </clipPath>
      </defs>
      <g clipPath={`url(#pc-${uid})`}>
        <circle cx="100" cy="100" r="78" fill="none" stroke={color} strokeWidth="14" />
        <path
          d="M 4 100 C 30 36, 70 36, 100 100 S 170 164, 196 100"
          fill="none"
          stroke={a}
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

// ───────────────────────── MESH ─────────────────────────
// FEM-style triangulated ring.
function MeshMark({ size = 200, color = MARK_INK }) {
  const N = 18;
  const R_OUT = 82;
  const R_IN = 50;
  const cx = 100;
  const cy = 100;
  const outer = [];
  const inner = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    outer.push([cx + R_OUT * Math.cos(a), cy + R_OUT * Math.sin(a)]);
    inner.push([cx + R_IN * Math.cos(a), cy + R_IN * Math.sin(a)]);
  }
  const lines = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    lines.push([outer[i], outer[j]]);
    lines.push([inner[i], inner[j]]);
    lines.push([outer[i], inner[i]]);
    lines.push([outer[i], inner[j]]);
  }
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block' }}>
      {lines.map(([p1, p2], i) => (
        <line
          key={i}
          x1={p1[0]}
          y1={p1[1]}
          x2={p2[0]}
          y2={p2[1]}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      {outer.map(([x, y], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r="3.2" fill={color} />
      ))}
      {inner.map(([x, y], i) => (
        <circle key={`i${i}`} cx={x} cy={y} r="2.4" fill={color} />
      ))}
    </svg>
  );
}

// ───────────────────────── STREAMLINE ─────────────────────────
// Curved arrow tangents forming a circular vector field.
function StreamlineMark({ size = 200, color = MARK_INK }) {
  const N = 10;
  const items = [];
  for (let i = 0; i < N; i++) {
    const ang = (i / N) * 360;
    items.push(ang);
  }
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block' }}>
      {items.map((ang, i) => (
        <g key={i} transform={`rotate(${ang} 100 100)`}>
          {/* tangent arc shaft, gently curving with the field */}
          <path
            d="M 60 32 A 78 78 0 0 1 96 26"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* arrowhead */}
          <path
            d="M 96 26 L 89 22 M 96 26 L 92 33"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────── GAUGE ─────────────────────────
// Industrial precision ring with graduated ticks + indicator notch.
function GaugeMark({ size = 200, color = MARK_INK, accent = null }) {
  const a = accent || color;
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const major = i % 5 === 0;
    const r1 = 92;
    const r2 = major ? 82 : 86;
    ticks.push({
      x1: 100 + r1 * Math.cos(ang),
      y1: 100 + r1 * Math.sin(ang),
      x2: 100 + r2 * Math.cos(ang),
      y2: 100 + r2 * Math.sin(ang),
      w: major ? 3 : 1.5,
    });
  }
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="100" cy="100" r="72" fill="none" stroke={color} strokeWidth="12" />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={color}
          strokeWidth={t.w}
          strokeLinecap="round"
        />
      ))}
      {/* indicator dot at the 1 o'clock position */}
      <circle cx={100 + 72 * Math.cos(-Math.PI / 2 + Math.PI / 3)} cy={100 + 72 * Math.sin(-Math.PI / 2 + Math.PI / 3)} r="7" fill={a} />
    </svg>
  );
}

// ───────────────────────── LATTICE ─────────────────────────
// Dot matrix forming an O shape — density falls off at edges.
function LatticeMark({ size = 200, color = MARK_INK }) {
  const dots = [];
  const step = 11;
  const cx = 100;
  const cy = 100;
  for (let x = -8; x <= 8; x++) {
    for (let y = -8; y <= 8; y++) {
      const r = Math.hypot(x, y);
      if (r >= 3.6 && r <= 7.4) {
        // fade the dot radius near the inner/outer edge for a softer ring
        const edgeDist = Math.min(Math.abs(r - 3.6), Math.abs(r - 7.4));
        const radius = Math.min(2.6, 1.3 + edgeDist * 0.9);
        dots.push({ x: cx + x * step, y: cy + y * step, r: radius });
      }
    }
  }
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block' }}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} />
      ))}
    </svg>
  );
}

Object.assign(window, {
  PhaseMark,
  MeshMark,
  StreamlineMark,
  GaugeMark,
  LatticeMark,
  MARK_INK,
  MARK_PAPER,
  MARK_ACCENT,
});
