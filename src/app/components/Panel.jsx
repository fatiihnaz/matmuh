export default function Panel({ children, className = "", padding = "p-5" }) {
  return (
    <div
      className={`rounded-xl border border-primary-500/10 shadow-xs bg-white ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
