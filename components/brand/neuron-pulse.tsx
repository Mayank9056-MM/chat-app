"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface NeuronPulseProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  showLabel?: boolean;
}

const sizeMap = {
  sm: { icon: 14, text: "text-xs", gap: "gap-1.5" },
  md: { icon: 18, text: "text-sm", gap: "gap-2" },
  lg: { icon: 24, text: "text-base", gap: "gap-2.5" },
};

/**
 * NeuronPulse: Production-grade neural activity indicator.
 * Displays a technical pulsating synaptic node with brand gradient accents.
 * Automatically respects prefers-reduced-motion.
 */
export const NeuronPulse = ({
  size = "sm",
  className,
  label = "Neuron is thinking...",
  showLabel = true,
}: NeuronPulseProps) => {
  const currentSize = sizeMap[size];

  return (
    <div
      className={cn("inline-flex items-center text-zinc-400 select-none", currentSize.gap, className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative flex items-center justify-center" style={{ width: currentSize.icon, height: currentSize.icon }}>
        {/* Pulsing synaptic aura */}
        <span
          className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping motion-reduce:hidden"
          style={{ animationDuration: "2s" }}
        />
        {/* Synaptic core outer node */}
        <span className="relative flex items-center justify-center rounded-full bg-zinc-950 border border-violet-500/50 p-0.5 size-full shadow-[0_0_8px_rgba(139,92,246,0.35)]">
          {/* Central soma nucleus with brand gradient */}
          <span className="rounded-full size-full bg-gradient-to-tr from-violet-500 via-indigo-400 to-cyan-400" />
        </span>
      </div>

      {showLabel && (
        <span className={cn("font-mono text-zinc-400 font-medium tracking-tight", currentSize.text)}>
          {label}
        </span>
      )}
    </div>
  );
};

export default NeuronPulse;
