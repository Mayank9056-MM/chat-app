import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SidebarSkeleton = () => {
  return (
    <div className="space-y-4 px-2 py-3" aria-label="Loading conversations">
      <div className="space-y-1">
        <Skeleton className="h-3 w-16 bg-white/[0.04]" />
        <Skeleton className="h-7 w-full rounded-md bg-white/[0.04]" />
        <Skeleton className="h-7 w-5/6 rounded-md bg-white/[0.03]" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3 w-20 bg-white/[0.04]" />
        <Skeleton className="h-7 w-full rounded-md bg-white/[0.04]" />
        <Skeleton className="h-7 w-4/5 rounded-md bg-white/[0.03]" />
        <Skeleton className="h-7 w-3/4 rounded-md bg-white/[0.03]" />
      </div>
    </div>
  );
};

export default SidebarSkeleton;
