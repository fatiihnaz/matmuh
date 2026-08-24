const QUADRANTS = [
  { id: 1, label: "( +, + )", x: "right", y: "top" },
  { id: 2, label: "( −, + )", x: "left", y: "top" },
  { id: 3, label: "( −, − )", x: "left", y: "bottom" },
  { id: 4, label: "( +, − )", x: "right", y: "bottom" },
];

const TICKS = [-3, -2, -1, 1, 2, 3];

export default function CartesianField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(98,109,158,0.5) 0 1px, transparent 1px 56px)," +
            "repeating-linear-gradient(to bottom, rgba(98,109,158,0.5) 0 1px, transparent 1px 56px)",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-secondary-500/45" />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-secondary-500/45" />

      {TICKS.map((n) => (
        <div key={`x${n}`}>
          <span
            className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-secondary-500/45"
            style={{ left: `calc(50% + ${n * 56}px)` }}
          />
          <span
            className="absolute left-1/2 h-px w-2 -translate-x-1/2 bg-secondary-500/45"
            style={{ top: `calc(50% + ${n * 56}px)` }}
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

      {QUADRANTS.map((q) => (
        <span
          key={q.id}
          className="absolute hidden font-mono text-[11px] tracking-widest text-secondary-500/30 lg:block"
          style={{
            [q.x]: "3.5rem",
            [q.y]: "3.5rem",
          }}
        >
          {q.label}
        </span>
      ))}
    </div>
  );
}
