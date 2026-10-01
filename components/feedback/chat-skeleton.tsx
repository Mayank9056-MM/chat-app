import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ChatSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 w-full animate-pulse" aria-label="Loading conversation">
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="w-2/3 sm:w-1/2 p-3.5 rounded-xl bg-[#13131A] border border-[#23232D] space-y-2">
          <Skeleton className="h-3 w-full bg-white/[0.04]" />
          <Skeleton className="h-3 w-4/5 bg-white/[0.03]" />
        </div>
      </div>

      {/* Assistant message skeleton */}
      <div className="flex justify-start">
        <div className="w-full sm:w-4/5 p-4 rounded-xl bg-[#0D0D12] border border-[#23232D] space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-violet-500/20" />
            <Skeleton className="h-3 w-24 bg-white/[0.04]" />
          </div>
          <Skeleton className="h-3.5 w-full bg-white/[0.04]" />
          <Skeleton className="h-3.5 w-11/12 bg-white/[0.04]" />
          <Skeleton className="h-3.5 w-3/4 bg-white/[0.03]" />
          
          <div className="p-3 rounded-lg bg-[#13131A] border border-[#23232D] space-y-2 mt-2">
            <Skeleton className="h-3 w-full bg-white/[0.04]" />
            <Skeleton className="h-3 w-5/6 bg-white/[0.03]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
