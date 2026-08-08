const SYMBOLS = [
  "∂²u/∂t² = c²∇²u",
  "∮_C E · dl = -dΦ_B/dt",
  "O(n log n)",
  "∫_a^b f(x)dx = F(b) - F(a)",
  "d/dx [∫_a^x f(t)dt] = f(x)",
  "∇×B = μ₀J + μ₀ε₀(∂E/∂t)",
  "e^{iπ} + 1 = 0",
  "λ",
  "μ",
  "σ²",
  "∫_(-∞)^∞ e^{-x²} dx = √π",
  "y'' + p(x)y' + q(x)y = 0",
  "lim_{h→0} [f(x+h)-f(x)]/h",
  "w^T x + b = 0",
  "L = ∫ √(1 + (dy/dx)²) dx",
  "P(A|B) = [P(B|A)P(A)] / P(B)",
  "L(y, ŷ) = −Σ y log(ŷ)",
  "softmax(z)ᵢ = eᶻⁱ / Σ eᶻʲ",
  "ReLU(x) = max(0, x)",
  "E[X] = Σ x P(X=x)",
  "Var(X) = E[X²] − (E[X])²",
  "β̂ = (XᵀX)⁻¹Xᵀy",
  "MSE = (1/n) Σ (y - ŷ)²",
  "∇²ϕ = 0",
  "xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ)",
  "lim_{n→∞} (1 + 1/n)ⁿ = e",
  "K(x, y) = exp(−γ ||x - y||²)",
  "Cov(X, Y) = E[(X-μₓ)(Y-μᵧ)]",
  "det(A - λI) = 0",
  "Tr(A) = Σ aᵢᵢ",
  "C(n,k) = n! / (k!(n-k)!)",
];

export const DESKTOP_FIELD = {
  id: "hd",
  count: 24,
  cols: 6,
  rows: 7,
  seed: 20260809,
  nominalW: 1440,
  nominalH: 900,
  minFont: 14,
  maxFont: 20,
};

export const MOBILE_FIELD = {
  id: "hm",
  count: 12,
  cols: 2,
  rows: 10,
  seed: 71042,
  nominalW: 390,
  nominalH: 844,
  minFont: 10,
  maxFont: 13,
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function pickCell(rand, taken) {
  const free = [];
  for (let i = 0; i < taken.length; i++) {
    if (!taken[i]) free.push(i);
  }
  if (!free.length) return Math.floor(rand() * taken.length);
  return free[Math.floor(rand() * free.length)];
}

export function createNode(rand, field, cell) {
  const { cols, rows, nominalW, nominalH, minFont, maxFont } = field;

  const symbol = SYMBOLS[Math.floor(rand() * SYMBOLS.length)];
  const fontPx = minFont + rand() * (maxFont - minFont);

  const widthPct = ((symbol.length * fontPx * 0.6) / nominalW) * 100;
  const heightPct = (fontPx / nominalH) * 100;

  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const spreadX = Math.max(cellW * 0.35, cellW - widthPct);
  const spreadY = Math.max(cellH * 0.35, cellH - heightPct);

  const left = (cell % cols) * cellW + rand() * spreadX;
  const top = Math.floor(cell / cols) * cellH + rand() * spreadY;

  return {
    cell,
    symbol,
    left: `${clamp(left, 0.5, Math.max(0.5, 99 - widthPct)).toFixed(2)}%`,
    top: `${clamp(top, 1, Math.max(1, 97 - heightPct)).toFixed(2)}%`,
    fontSize: `clamp(8px, ${((fontPx / nominalW) * 100).toFixed(3)}vw, ${maxFont}px)`,
  };
}

export function buildSymbolNodes(field) {
  const rand = mulberry32(field.seed);
  const taken = new Array(field.cols * field.rows).fill(false);

  return Array.from({ length: field.count }, (_, i) => {
    const cell = pickCell(rand, taken);
    taken[cell] = true;

    return {
      id: `${field.id}-${i}`,
      duration: `${(8 + rand() * 10).toFixed(2)}s`,
      delay: `${(rand() * 4).toFixed(2)}s`,
      ...createNode(rand, field, cell),
    };
  });
}

export function buildCurvePaths({ mobile }) {
  const width = 1600;
  const height = 1000;
  const points = 96;

  const sineFreq = mobile ? 6 : 3;
  const sineAmp = mobile ? 200 : 180;
  const sigma = mobile ? 0.04 : 0.08;
  const cubicFactor = mobile ? 4.5 : 1.0;
  const dampedFreq = mobile ? 12 : 8;
  const decayRate = mobile ? 4 : 3;

  let sine = "";
  let gauss = "";
  let cubic = "";
  let damped = "";

  for (let i = 0; i <= points; i++) {
    const x = ((i / points) * width).toFixed(1);
    const nx = (i / points) * 2 - 1;
    const cmd = i === 0 ? "M" : "L";

    const ySin = height / 2 + Math.sin(nx * Math.PI * sineFreq) * sineAmp;
    sine += `${cmd} ${x} ${ySin.toFixed(1)} `;

    const yGauss = height / 2 - Math.exp(-(nx * nx) / sigma) * 280 + 120;
    gauss += `${cmd} ${x} ${yGauss.toFixed(1)} `;

    const yCubic = height / 2 - Math.pow(nx * cubicFactor, 3) * 300;
    cubic += `${cmd} ${x} ${yCubic.toFixed(1)} `;

    const yDamped =
      height / 2 +
      Math.exp(-Math.abs(nx) * decayRate) *
        Math.cos(nx * Math.PI * dampedFreq) *
        250;
    damped += `${cmd} ${x} ${yDamped.toFixed(1)} `;
  }

  return [
    { id: "sine", d: sine.trim(), stroke: "#626D9E", sw: mobile ? 2 : 1.5 },
    { id: "gauss", d: gauss.trim(), stroke: "#AD976F", sw: mobile ? 2.5 : 2 },
    { id: "damped", d: damped.trim(), stroke: "#8E99C2", sw: mobile ? 2 : 1.5 },
    { id: "cubic", d: cubic.trim(), stroke: "#4A5585", sw: mobile ? 2 : 1.5 },
  ];
}
