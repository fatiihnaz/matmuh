import PageLayout from "@/app/components/PageLayout";
import { SkeletonCard, SkeletonBlock } from "@/app/components/Skeleton";

export default function PageSkeleton() {
  return (
    <>
      <div className="w-full bg-primary-500">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <SkeletonBlock className="h-3 w-48 bg-white/10" />
          <SkeletonBlock className="mt-4 h-7 w-72 bg-white/15" />
          <SkeletonBlock className="mt-3 h-3 w-96 max-w-full bg-white/10" />
        </div>
      </div>

      <PageLayout>
        <SkeletonCard />
      </PageLayout>
    </>
  );
}
