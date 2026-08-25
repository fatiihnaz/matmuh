const TICKS = [-3, -2, -1, 1, 2, 3];

const UNIT = 56;
const MAJOR = UNIT * 4;

// Cizgiyi karonun ortasina cizip karoyu merkeze oturtuyoruz. `repeating-linear-
// gradient` elemanin sol ustunden basladigi icin izgaranin eksene gore hizasi
// bolumun boyutuna gore kayiyordu; boyle bir izgara cizgisi her zaman tam
// orijinden geciyor ve tikler kesisim noktalarina denk geliyor.
const rule = (direction, color, width) =>
  `linear-gradient(${direction}, transparent calc(50% - ${width}), ${color} calc(50% - ${width}) calc(50% + ${width}), transparent calc(50% + ${width}))`;

const MINOR = "rgba(98,109,158,0.34)";
const MAJOR_COLOR = "rgba(98,109,158,0.6)";

const FADE = "radial-gradient(ellipse 82% 78% at 50% 50%, #000 38%, transparent 100%)";

// Dikey sonum ayri bir katmanda. Iki maskeyi tek elemanda birlestirmek
// `mask-composite` isterdi; Safari'nin sozdizimi farkli oldugu icin ic ice iki
// eleman kullaniyoruz — maskeler carpiliyor, ek ozellik gerekmiyor.
const EDGE =
  "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)";

export default function CartesianField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ maskImage: EDGE, WebkitMaskImage: EDGE }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `${rule("to right", MINOR, "0.5px")}, ${rule("to bottom", MINOR, "0.5px")}`,
            backgroundSize: `${UNIT}px ${UNIT}px`,
            backgroundPosition: "center",
            maskImage: FADE,
            WebkitMaskImage: FADE,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `${rule("to right", MAJOR_COLOR, "0.5px")}, ${rule("to bottom", MAJOR_COLOR, "0.5px")}`,
            backgroundSize: `${MAJOR}px ${MAJOR}px`,
            backgroundPosition: "center",
            maskImage: FADE,
            WebkitMaskImage: FADE,
          }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 22rem at 50% 50%, rgba(194,176,140,0.055), transparent 70%)",
        }}
      />

      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-secondary-500/45 to-transparent" />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-secondary-500/45 to-transparent" />

      {TICKS.map((n) => (
        <div key={`x${n}`}>
          <span
            className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-secondary-500/45"
            style={{ left: `calc(50% + ${n * UNIT}px)` }}
          />
          <span
            className="absolute left-1/2 h-px w-2 -translate-x-1/2 bg-secondary-500/45"
            style={{ top: `calc(50% + ${n * UNIT}px)` }}
          />
        </div>
      ))}

      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary-500/70 bg-primary-500" />
      <span className="absolute left-1/2 top-1/2 ml-2.5 mt-1.5 font-mono text-[10px] text-secondary-500/50">
        0
      </span>

      <span className="absolute right-4 top-1/2 -mt-5 font-mono text-[11px] text-secondary-500/50 sm:right-8">
        x
      </span>
      <span className="absolute left-1/2 top-4 ml-3 font-mono text-[11px] text-secondary-500/50 sm:top-8">
        y
      </span>
    </div>
  );
}
