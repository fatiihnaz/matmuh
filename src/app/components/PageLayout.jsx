export default function PageLayout({ children, sidebar }) {
  return (
    <main className="w-full flex-1 py-12">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {sidebar ? (
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            <aside className="w-full lg:w-68 shrink-0 lg:sticky lg:top-28">{sidebar}</aside>
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
