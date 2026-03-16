import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
      <div className="h-8 w-64 rounded-lg bg-[var(--surface2)]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-[var(--surface2)]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-[var(--surface2)]" />
    </div>
  );
}
