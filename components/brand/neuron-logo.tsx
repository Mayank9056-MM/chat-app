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
    badgeText: string;
    gap: string;
  }
> = {
  xs: {
    container: "h-6",
    iconSize: 20,
    text: "text-sm font-semibold tracking-tight",
    badge: "px-1.5 py-0.5 rounded text-[9px]",
    badgeText: "text-[9px]",
    gap: "gap-1.5",
  },
  sm: {
    container: "h-8",
    iconSize: 24,
    text: "text-base font-bold tracking-tight",
    badge: "px-1.5 py-0.5 rounded-md text-[10px]",
    badgeText: "text-[10px]",
    gap: "gap-2",
  },
  md: {
    container: "h-9",
    iconSize: 28,
    text: "text-lg font-bold tracking-tight",
    badge: "px-2 py-0.5 rounded-md text-[11px]",
    badgeText: "text-[11px]",
    gap: "gap-2.5",
  },
  lg: {
    container: "h-11",
    iconSize: 36,
    text: "text-2xl font-extrabold tracking-tight",
    badge: "px-2.5 py-0.5 rounded-md text-xs",
    badgeText: "text-xs",
    gap: "gap-3",
  },
  xl: {
    container: "h-14",
    iconSize: 48,
    text: "text-3xl font-extrabold tracking-tight",
    badge: "px-3 py-1 rounded-lg text-xs",
    badgeText: "text-xs",
    gap: "gap-3.5",
  },
};

/**
 * NeuronLogo: Production-grade primary branding component for Neuron.
 *
 * Supports full horizontal lockup (icon + wordmark + AI chip), icon-only,
 * or wordmark-only modes with adaptive sizing, dark/light theme awareness,
 * and optional route navigation.
 */
export const NeuronLogo = ({
  variant = "full",
  size = "sm",
  animated = false,
  withBadge = true,
  badgeText = "AI",
  href,
  className,
  iconClassName,
  textClassName,
  badgeClassName,
  glow = true,
  onClick,
}: NeuronLogoProps) => {
  const config = sizeConfig[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center select-none",
        config.container,
        config.gap,
        href && "transition-opacity duration-150 hover:opacity-95 active:scale-[0.99]",
        className,
      )}
      role="img"
      aria-label="Neuron — AI Workspace"
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

      {/* Typographic Wordmark & AI Badge */}
      {variant !== "icon" && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-heading font-bold text-zinc-900 dark:text-white transition-colors",
              config.text,
              textClassName,
            )}
          >
            Neuron
          </span>

          {withBadge && (
            <span
              className={cn(
                "inline-flex items-center justify-center font-mono font-semibold uppercase tracking-wider",
                "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
                "dark:bg-cyan-400/10 dark:text-cyan-300 dark:border-cyan-400/30",
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
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg"
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
