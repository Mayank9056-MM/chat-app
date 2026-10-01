"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface NeuronMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  animated?: boolean;
  className?: string;
  glow?: boolean;
}

/**
 * NeuronMark: The core geometric Neural Nexus brand mark.
 *
 * Represents a synaptic neural network node topology forming the letter 'N':
 * - Continuous high-energy conduits with Ranvier synaptic terminals
 * - Central luminous Soma (nucleus) representing cognitive synthesis
 * - Strict 135deg gradient: #8B5CF6 (Violet) -> #6366F1 (Indigo) -> #22D3EE (Cyan)
 */
export const NeuronMark = ({
  size = 32,
  animated = false,
  className,
  glow = true,
  ...props
}: NeuronMarkProps) => {
  const rawId = useId();
  const id = rawId.replace(/:/g, "-");

  const flowGradId = `neuron-flow-${id}`;
  const pulseGradId = `neuron-pulse-${id}`;
  const auraGradId = `neuron-aura-${id}`;
  const glowFilterId = `neuron-glow-${id}`;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "flex-shrink-0 select-none",
        animated && "group",
        className,
      )}
      aria-hidden={props["aria-label"] ? undefined : true}
      role="img"
      {...props}
    >
      <defs>
        {/* Brand 135deg flow: Violet -> Indigo -> Cyan */}
        <linearGradient
          id={flowGradId}
          x1="20"
          y1="100"
          x2="100"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="45%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        {/* Counter-axon gradient */}
        <linearGradient
          id={pulseGradId}
          x1="24"
          y1="24"
          x2="96"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        {/* Ambient aura glow */}
        <radialGradient
          id={auraGradId}
          cx="60"
          cy="60"
          r="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#6366F1" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>

        {/* Phosphor glow filter */}
        <filter
          id={glowFilterId}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient background aura (restrained) */}
      {glow && (
        <circle
          cx="60"
          cy="60"
          r="36"
          fill={`url(#${auraGradId})`}
          className={cn(animated && "animate-pulse motion-reduce:hidden")}
        />
      )}

      {/* Background synaptic trace lattice */}
      <path
        d="M28 92 L28 28 L92 92 L92 28"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="28"
        y1="92"
        x2="92"
        y2="28"
        stroke={`url(#${pulseGradId})`}
        strokeWidth="1.5"
        strokeDasharray="3 4"
        opacity="0.6"
      />

      {/* Main Neural Conduits forming 'N' */}
      <path
        d="M28 92 V28"
        stroke={`url(#${flowGradId})`}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M28 28 L92 92"
        stroke={`url(#${flowGradId})`}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M92 92 V28"
        stroke={`url(#${flowGradId})`}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* High-Energy Core Rails */}
      <path
        d="M28 84 V36"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M34 34 L86 86"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M92 84 V36"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Synaptic Ranvier Nodes */}
      <circle
        cx="28"
        cy="28"
        r="6.5"
        fill="#8B5CF6"
        filter={`url(#${glowFilterId})`}
      />
      <circle cx="28" cy="28" r="3" fill="#FFFFFF" />

      <circle
        cx="28"
        cy="92"
        r="6.5"
        fill="#7C3AED"
        filter={`url(#${glowFilterId})`}
      />
      <circle cx="28" cy="92" r="3" fill="#FFFFFF" />

      <circle
        cx="92"
        cy="28"
        r="6.5"
        fill="#6366F1"
        filter={`url(#${glowFilterId})`}
      />
      <circle cx="92" cy="28" r="3" fill="#FFFFFF" />

      <circle
        cx="92"
        cy="92"
        r="6.5"
        fill="#22D3EE"
        filter={`url(#${glowFilterId})`}
      />
      <circle cx="92" cy="92" r="3" fill="#FFFFFF" />

      {/* Central Synaptic Nucleus (Soma - Multi-Model Synthesis) */}
      <circle
        cx="60"
        cy="60"
        r="10"
        fill="#0D0D12"
        stroke={`url(#${flowGradId})`}
        strokeWidth="2.2"
      />
      <circle
        cx="60"
        cy="60"
        r="5"
        fill="#22D3EE"
        filter={`url(#${glowFilterId})`}
        className={cn(animated && "transition-transform duration-300 group-hover:scale-125")}
      />
      <circle cx="60" cy="60" r="2" fill="#FFFFFF" />
    </svg>
  );
};
