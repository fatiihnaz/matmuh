export default function StatStrip({ items }) {
  return (
    <div className="rounded-xl overflow-hidden bg-white/6 grid grid-cols-2 md:grid-cols-3 gap-px">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-1 px-5 py-4 bg-primary-500"
        >
          <span className="text-[22px] font-bold text-white leading-none">
            {item.value}
          </span>
          <span className="text-[11px] text-secondary-700 uppercase tracking-wider">
            {item.label}
          </span>
          {item.hint && (
            <span className="text-[11px] text-white/60 leading-snug">
              {item.hint}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
