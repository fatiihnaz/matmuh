const W = 260;
const H = 150;
const CX = W / 2;
const CY = H / 2;
const UNIT = 26;

function hyperbolaBranch(sign) {
  const points = [];
  for (let step = 0; step <= 90; step += 1) {
    const x = sign * (0.34 + (step / 90) * 4.4);
    const px = CX + UNIT * x;
    const py = CY - UNIT / x;
    if (py < 4 || py > H - 4 || px < 4 || px > W - 4) continue;
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return points.join(" ");
}

function Frame({ children }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="presentation"
      className="w-full max-w-65 text-primary-500"
    >
      <defs>
        <pattern id="mm-plot-grid" width={UNIT / 2} height={UNIT / 2} patternUnits="userSpaceOnUse">
          <path
            d={`M ${UNIT / 2} 0 L 0 0 0 ${UNIT / 2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.12"
          />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="url(#mm-plot-grid)" />
      <line x1="0" y1={CY} x2={W} y2={CY} stroke="currentColor" strokeWidth="0.9" opacity="0.28" />
      <line x1={CX} y1="0" x2={CX} y2={H} stroke="currentColor" strokeWidth="0.9" opacity="0.28" />

      {children}
    </svg>
  );
}

export function UndefinedPlot() {
  return (
    <Frame>
      <line
        x1={CX}
        y1="0"
        x2={CX}
        y2={H}
        stroke="var(--color-secondary-500)"
        strokeWidth="1.4"
        strokeDasharray="4 4"
        opacity="0.55"
      />
      {[1, -1].map((sign) => (
        <polyline
          key={sign}
          points={hyperbolaBranch(sign)}
          fill="none"
          stroke="var(--color-secondary-500)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ))}
    </Frame>
  );
}

const REACH = 2.5;

// 2x/x, (x - x²/2)/x ve (0.6x² - x)/x: üçü de x=0'da 0/0, üçü farklı limit.
const RATIOS = [
  { limit: 2, slope: 0 },
  { limit: 1, slope: -0.5 },
  { limit: -1, slope: 0.6 },
];

export function IndeterminatePlot() {
  return (
    <Frame>
      {RATIOS.map(({ limit, slope }) => (
        <g key={limit}>
          <line
            x1={CX - UNIT * REACH}
            y1={CY - UNIT * (limit - slope * REACH)}
            x2={CX + UNIT * REACH}
            y2={CY - UNIT * (limit + slope * REACH)}
            stroke="var(--color-secondary-500)"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle
            cx={CX}
            cy={CY - UNIT * limit}
            r="3.6"
            fill="var(--color-background, #fff)"
            stroke="var(--color-secondary-500)"
            strokeWidth="1.6"
          />
        </g>
      ))}
    </Frame>
  );
}
