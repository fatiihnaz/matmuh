export default function Panel({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-primary-500/10 shadow-xs bg-white p-5 ${className}`}
    >
      {children}
    </div>
  );
}
