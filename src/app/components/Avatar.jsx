export const AVATAR_COLORS = ["#1D2445", "#2a3158", "#33295a", "#1a3348", "#2d3a2e", "#3a2d2d", "#2a2d45"];

export function getInitials(name) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, idx = 0, size = "size-9", textSize = "text-[11px]" }) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center rounded-full ${size}`}
      style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
    >
      <span className={`${textSize} font-semibold tracking-wide text-secondary-500`}>
        {getInitials(name)}
      </span>
    </div>
  );
}
