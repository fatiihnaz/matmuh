"use client";

import { Plus, X } from "lucide-react";

export default function ListBlock({ data, onChange }) {
  const items = data.items || [""];

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({ ...data, items: [...items, ""] });
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    onChange({ ...data, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-1.5">
      <select
        value={data.style || "ul"}
        onChange={(e) => onChange({ ...data, style: e.target.value })}
        className="bg-white/5 text-white/60 text-[10px] px-2 py-1 rounded border border-white/10 focus:outline-none"
      >
        <option value="ul" className="bg-primary-500">Madde İşaretli</option>
        <option value="ol" className="bg-primary-500">Numaralı</option>
      </select>

      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/20 w-4 text-center shrink-0">
              {data.style === "ol" ? `${index + 1}.` : "•"}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder="Liste öğesi..."
              className="flex-1 bg-white/5 text-white/60 text-xs px-2 py-1.5 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/15"
            />
            <button
              onClick={() => removeItem(index)}
              className="text-white/10 hover:text-red-400 transition-colors p-0.5"
              disabled={items.length <= 1}
            >
              <X size={11} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-1 text-[10px] text-white/20 hover:text-secondary-500 transition-colors"
      >
        <Plus size={11} />
        Öğe ekle
      </button>
    </div>
  );
}
