import AnnouncementItem from "./AnnouncementItem";

export default function AnnouncementList({ items, variant = "compact", emptyMessage = "Bu kriterlere uygun duyuru bulunamadı." }) {
  if (!items.length) {
    return (
      <div className="py-16 text-center text-sm text-primary-500/70 font-medium border border-dashed border-primary-500/10 rounded-xl">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-y divide-primary-500/6">
      {items.map((item) => (
        <AnnouncementItem key={item.id} item={item} variant={variant} />
      ))}
    </div>
  );
}
