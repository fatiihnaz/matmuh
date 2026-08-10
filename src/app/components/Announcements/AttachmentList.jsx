import DocumentLink from "@/app/components/DocumentLink";

export default function AttachmentList({ items }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
        Ekler
      </span>
      {items.map((item) => (
        <DocumentLink key={item.href} label={item.label} href={item.href} kind={item.kind} />
      ))}
    </div>
  );
}
