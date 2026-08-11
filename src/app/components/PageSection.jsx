export default function PageSection({ title, count, action, children }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-1.5 h-5 shrink-0 bg-secondary-500 rounded-xl" />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-primary-800 wrap-break-word">
            {title}
          </h2>
          {count !== undefined && (
            <span className="flex shrink-0 items-center justify-center px-2 py-0.5 rounded-xl bg-primary-500/5 text-[10px] font-bold text-primary-500/50">
              {count}
            </span>
          )}
        </div>
        <div className="h-px flex-1 min-w-4 bg-linear-to-r from-primary-500/10 via-primary-500/5 to-transparent" />
        {action}
      </div>
      {children}
    </section>
  );
}
