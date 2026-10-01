"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Layers, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeuronMark } from "@/components/brand";

export const PublicLanding = () => {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden bg-background text-foreground px-4 sm:px-6 transition-colors">
      {/* Background Neural Lattice Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Ambient Brand Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-500/[0.06] dark:bg-violet-600/[0.08] blur-[140px] rounded-full"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl mx-auto pt-16 sm:pt-24 pb-12 text-center">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground mb-6 select-none shadow-xs">
          <NeuronMark size={14} animated glow={false} />
          <span className="font-mono text-foreground font-medium">Neuron v0.1</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-violet-600 dark:text-violet-400 font-medium">Multi-Model AI Workspace</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-3xl mx-auto">
          Technical intelligence for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-400">
            developers
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your workspace for thinking, coding, and architectural reasoning. Stream output across leading models with native Shiki syntax and persistent context.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto h-11 px-6 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-950/20 border border-violet-500/30 transition-all duration-150"
          >
            <Link href="/sign-in">
              Launch Workspace
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 rounded-lg text-sm font-medium border-border bg-card hover:bg-secondary text-foreground"
          >
            <Link href="/sign-in">
              Continue with GitHub or Google
            </Link>
          </Button>
        </div>

        {/* Technical Capabilities Matrix */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-card border border-border shadow-xs">
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 w-fit text-violet-600 dark:text-violet-400 mb-3">
              <Cpu className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">OpenRouter Integration</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Explore dynamic model discovery with zero-margin free models, context window stats, and token metrics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 w-fit text-indigo-600 dark:text-indigo-400 mb-3">
              <Terminal className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Code & Streamdown</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Full syntax-highlighted code blocks with copy actions, Mermaid diagram rendering, and KaTeX mathematical support.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 w-fit text-cyan-600 dark:text-cyan-400 mb-3">
              <Layers className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Reasoning Chains</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Collapsible step-by-step thinking traces so you can verify the model’s internal problem-solving logic.
            </p>
          </div>
        </div>
      </div>

      {/* Public Footer */}
      <footer className="relative z-10 border-t border-border py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <NeuronMark size={16} glow={false} />
          <span className="font-mono text-foreground font-medium">Neuron AI Workspace</span>
        </div>
        <div>
          <span>Technical sophistication through restraint.</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Link href="/sign-in" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
