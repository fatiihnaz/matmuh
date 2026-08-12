import Image from "next/image";
import StarMark from "@/app/components/StarMark";

export default function NewsThumb({ cover, sizes, priority = false, className = "" }) {
  if (!cover) {
    return (
      <div className={`aspect-4/3 p-2 ${className}`}>
        <div className="h-full w-full rounded-lg border border-dashed border-primary-500/15 bg-primary-500/2 flex items-center justify-center">
          <StarMark className="w-1/5 text-primary-500/12" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-4/3 overflow-hidden bg-primary-500/4 ${className}`}>
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}
