"use client";

import { Reorder } from "framer-motion";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { useContentDispatch } from "@/lib/hooks/useContent";
import HeadingBlock from "./blocks/HeadingBlock";
import TextBlock from "./blocks/TextBlock";
import ImageBlock from "./blocks/ImageBlock";
import ListBlock from "./blocks/ListBlock";

const BLOCK_TYPES = [
  { value: "heading", label: "Başlık" },
  { value: "text", label: "Metin" },
  { value: "image", label: "Görsel" },
  { value: "list", label: "Liste" },
];

const BLOCK_COMPONENTS = {
  heading: HeadingBlock,
  text: TextBlock,
  image: ImageBlock,
  list: ListBlock,
};

const DEFAULT_BLOCK_DATA = {
  heading: { level: 2, text: "" },
  text: { body: "" },
  image: { url: "", alt: "", caption: "" },
  list: { style: "ul", items: [""] },
};

export default function BlockEditor({ slug, blocks }) {
  const { updateBlock, addBlock, removeBlock } = useContentDispatch();

  const handleBlockChange = (index, newData) => {
    updateBlock(slug, index, { ...blocks[index], data: newData });
  };

  const handleTypeChange = (index, newType) => {
    updateBlock(slug, index, {
      type: newType,
      data: { ...DEFAULT_BLOCK_DATA[newType] },
    });
  };

  const handleAddBlock = (afterIndex) => {
    addBlock(
      slug,
      { type: "text", data: { ...DEFAULT_BLOCK_DATA.text } },
      afterIndex
    );
  };

  const handleReorder = (newOrder) => {
    newOrder.forEach((block, index) => {
      if (blocks[index] !== block) {
        updateBlock(slug, index, block);
      }
    });
  };

  return (
    <div className="space-y-1">
      <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="space-y-2">
        {blocks.map((block, index) => {
          const BlockComponent = BLOCK_COMPONENTS[block.type];

          return (
            <Reorder.Item key={block.id || `${index}-${block.type}`} value={block} className="bg-white/3 rounded-lg border border-white/5 overflow-hidden">
              <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/5 bg-white/2">
                <GripVertical size={12} className="text-white/15 cursor-grab active:cursor-grabbing shrink-0"/>
                <select value={block.type} onChange={(e) => handleTypeChange(index, e.target.value)}
                  className="bg-transparent text-[10px] text-white/40 focus:outline-none cursor-pointer flex-1"
                >
                  {BLOCK_TYPES.map((bt) => (
                    <option key={bt.value} value={bt.value} className="bg-primary-500 text-white">
                      {bt.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => removeBlock(slug, index)} className="text-white/15 hover:text-red-400 transition-colors p-0.5">
                  <Trash2 size={11} />
                </button>
              </div>

              <div className="p-2">
                {BlockComponent ? (
                  <BlockComponent data={block.data} onChange={(newData) => handleBlockChange(index, newData)}/>
                ) : (
                  <p className="text-xs text-white/20">
                    Bilinmeyen blok tipi: {block.type}
                  </p>
                )}
              </div>

              <div className="flex justify-center -mb-1">
                <button onClick={() => handleAddBlock(index)} className="text-white/10 hover:text-secondary-500 transition-colors py-1">
                  <Plus size={14} />
                </button>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {blocks.length === 0 && (
        <button onClick={() => handleAddBlock(-1)} className="flex items-center justify-center gap-2 w-full py-4 rounded-lg border border-dashed border-white/10 text-white/20 hover:text-secondary-500 hover:border-secondary-500/30 transition-colors text-xs">
          <Plus size={14} />
          İlk bloğu ekle
        </button>
      )}
    </div>
  );
}