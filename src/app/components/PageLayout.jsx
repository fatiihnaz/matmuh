export default function PageLayout({ children, sidebar, sidebarFirst = false }) {
  return (
    <div className="w-full flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {sidebar ? (
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            <div className={`flex-1 min-w-0 lg:order-2 ${sidebarFirst ? "order-2" : ""}`}>
              {children}
            </div>
            <aside
              className={`w-full lg:w-68 shrink-0 lg:sticky lg:top-28 lg:order-1 ${
                sidebarFirst ? "order-1" : ""
              }`}
            >
              {sidebar}
            </aside>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
