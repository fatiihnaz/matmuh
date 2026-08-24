import PageLayout from "@/app/components/PageLayout";
import { SkeletonBlock, SkeletonCard, SkeletonLine } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="w-full bg-primary-500">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <SkeletonBlock className="h-3 w-48 bg-white/10" />
          <SkeletonBlock className="mt-4 h-7 w-72 bg-white/15" />
          <SkeletonBlock className="mt-3 h-3 w-96 max-w-full bg-white/10" />
        </div>
      </div>

      <PageLayout
        sidebar={
          <div className="rounded-xl border border-primary-500/10 bg-white p-6 shadow-xs">
            <SkeletonLine className="mb-5 w-28" />
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <SkeletonLine key={i} className="w-full" />
              ))}
            </div>
          </div>
        }
      >
        <SkeletonCard />
      </PageLayout>
    </>
  );
}
