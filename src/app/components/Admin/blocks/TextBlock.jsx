"use client";

export default function TextBlock({ data, onChange }) {
  return (
    <textarea
      value={data.body || ""}
      onChange={(e) => onChange({ ...data, body: e.target.value })}
      placeholder="Metin içeriği..."
      rows={4}
      className="w-full bg-white/5 text-white text-xs px-2.5 py-2 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/15 resize-y leading-relaxed"
    />
  );
}
