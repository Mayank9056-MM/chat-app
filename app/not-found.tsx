"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NeuronMark } from "@/components/brand";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07070A] text-[#F4F4F5] px-4 text-center select-none">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D0D12] border border-[#23232D] shadow-2xl mb-6">
        <NeuronMark size={32} animated glow />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="font-mono text-xs text-violet-400 font-semibold tracking-wider uppercase">
          404 Error · Node Missing
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Synaptic path not found
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          The requested conversation, model, or route does not exist in this Neuron cluster.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          className="h-9 px-4 text-xs font-medium border-[#23232D] bg-[#0D0D12] hover:bg-[#13131A] text-zinc-200"
        >
          <Link href="/">
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Go back
          </Link>
        </Button>

        <Button
          asChild
          className="h-9 px-4 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border border-violet-500/30"
        >
          <Link href="/">
            <Home className="h-3.5 w-3.5 mr-2" />
            Open workspace
          </Link>
        </Button>
      </div>
    </div>
  );
}
