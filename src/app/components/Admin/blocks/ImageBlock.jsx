"use client";

export default function ImageBlock({ data, onChange }) {
  return (
    <div className="space-y-1.5">
      <input
        type="text"
        value={data.url || ""}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        placeholder="Görsel URL..."
        className="w-full bg-white/5 text-white/60 text-xs px-2.5 py-1.5 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/15"
      />
      <input
        type="text"
        value={data.alt || ""}
        onChange={(e) => onChange({ ...data, alt: e.target.value })}
        placeholder="Alt metin..."
        className="w-full bg-white/5 text-white/60 text-xs px-2.5 py-1.5 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/15"
      />
      <input
        type="text"
        value={data.caption || ""}
        onChange={(e) => onChange({ ...data, caption: e.target.value })}
        placeholder="Açıklama..."
        className="w-full bg-white/5 text-white/60 text-xs px-2.5 py-1.5 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/15"
      />
      {data.url && (
        <div className="rounded border border-white/10 overflow-hidden">
          <img
            src={data.url}
            alt={data.alt || ""}
            className="w-full h-24 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
