"use client";

export default function HeadingBlock({ data, onChange }) {
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <select
          value={data.level || 2}
          onChange={(e) => onChange({ ...data, level: Number(e.target.value) })}
          className="bg-white/5 text-white/60 text-[10px] px-2 py-1 rounded border border-white/10 focus:outline-none w-16"
        >
          <option value={2} className="bg-primary-500">H2</option>
          <option value={3} className="bg-primary-500">H3</option>
          <option value={4} className="bg-primary-500">H4</option>
          <option value={5} className="bg-primary-500">H5</option>
          <option value={6} className="bg-primary-500">H6</option>
        </select>
      </div>
      <input
        type="text"
        value={data.text || ""}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        placeholder="Başlık metni..."
        className="w-full bg-white/5 text-white text-sm px-2.5 py-1.5 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/15 font-medium"
      />
    </div>
  );
}
