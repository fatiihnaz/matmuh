export default function AnnouncementBody({ html }) {
  if (!html) return null;
  return (
    <div
      className="announcement-body text-[13px] text-primary-500/70 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
