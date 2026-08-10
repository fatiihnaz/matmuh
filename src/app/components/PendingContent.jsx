import { Clock } from "lucide-react";

export default function PendingContent({ children }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-primary-500/2 border border-dashed border-primary-500/15">
      <Clock className="size-4 shrink-0 mt-0.5 text-primary-500/35" />
      <p className="text-[13px] text-primary-500/55 leading-relaxed">
        {children}
      </p>
    </div>
  );
}
