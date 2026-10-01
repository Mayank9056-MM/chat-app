"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NeuronMark } from "@/components/brand";
import { AlertTriangle, ChevronDown, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Neuron workspace runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07070A] text-[#F4F4F5] px-4 text-center select-none">
      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="font-mono text-xs text-red-400 font-semibold tracking-wider uppercase">
          Runtime Exception
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Something interrupted this session
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Neuron couldn’t complete this request due to an unexpected client state.
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={() => reset()}
          className="h-9 px-4 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border border-violet-500/30"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-2" />
          Try again
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="h-9 px-3 text-xs font-mono text-zinc-400 border-[#23232D] bg-[#0D0D12] hover:bg-[#13131A] hover:text-zinc-200"
        >
          Technical details
          <ChevronDown className={`h-3 w-3 ml-1.5 transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {showDetails && (
        <div className="mt-6 w-full max-w-lg p-3 rounded-lg bg-[#0D0D12] border border-[#23232D] text-left">
          <p className="font-mono text-[11px] text-red-400 break-words">
            {error.message || "An unexpected error occurred."}
          </p>
          {error.digest && (
            <p className="font-mono text-[10px] text-zinc-600 mt-1">
              Digest: {error.digest}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
