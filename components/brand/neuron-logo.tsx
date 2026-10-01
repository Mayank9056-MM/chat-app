"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NeuronMark } from "./neuron-mark";

export type LogoVariant = "full" | "icon" | "wordmark";
export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface NeuronLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  animated?: boolean;
  withBadge?: boolean;
  badgeText?: string;
  href?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  badgeClassName?: string;
  glow?: boolean;
  onClick?: () => void;
}

const sizeConfig: Record<
  LogoSize,
  {
    container: string;
    iconSize: number;
    text: string;
    badge: string;
    gap: string;
  }
> = {
  xs: {
    container: "h-6",
    iconSize: 18,
    text: "text-sm font-semibold tracking-tight",
    badge: "px-1.5 py-0.2 rounded text-[9px]",
    gap: "gap-1.5",
  },
  sm: {
    container: "h-7",
    iconSize: 22,
    text: "text-base font-bold tracking-tight",
    badge: "px-1.5 py-0.5 rounded text-[10px]",
    gap: "gap-2",
  },
  md: {
    container: "h-8",
    iconSize: 26,
    text: "text-lg font-bold tracking-tight",
    badge: "px-2 py-0.5 rounded text-[11px]",
    gap: "gap-2.5",
  },
  lg: {
    container: "h-10",
    iconSize: 32,
    text: "text-xl font-bold tracking-tight",
    badge: "px-2.5 py-0.5 rounded-md text-xs",
    gap: "gap-3",
  },
  xl: {
    container: "h-12",
    iconSize: 42,
    text: "text-2xl font-extrabold tracking-tight",
    badge: "px-3 py-1 rounded-md text-xs",
    gap: "gap-3.5",
  },
};

/**
 * NeuronLogo: Production brand lockup for Neuron.
 * Developer-focused, restrained, supporting dark & light mode natively.
 */
export const NeuronLogo = ({
  variant = "full",
  size = "sm",
  animated = false,
  withBadge = false,
  badgeText = "AI",
  href,
  className,
  iconClassName,
  textClassName,
  badgeClassName,
  glow = false,
  onClick,
}: NeuronLogoProps) => {
  const config = sizeConfig[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center select-none",
        config.container,
        config.gap,
        href && "transition-opacity duration-150 hover:opacity-90 active:scale-[0.99]",
        className,
      )}
      role="img"
      aria-label="Neuron Workspace"
    >
      {/* Icon Mark */}
      {variant !== "wordmark" && (
        <NeuronMark
          size={config.iconSize}
          animated={animated}
          glow={glow}
          className={cn(
            "transition-transform duration-200 group-hover:scale-105",
            iconClassName,
          )}
        />
      )}

      {/* Typographic Wordmark */}
      {variant !== "icon" && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-sans font-bold tracking-tight text-foreground",
              config.text,
              textClassName,
            )}
          >
            Neuron
          </span>

          {withBadge && (
            <span
              className={cn(
                "inline-flex items-center font-mono font-medium uppercase tracking-wider",
                "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
                config.badge,
                badgeClassName,
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 rounded-md"
      >
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={cn(onClick && "cursor-pointer")}>
      {content}
    </div>
  );
};

export default NeuronLogo;
