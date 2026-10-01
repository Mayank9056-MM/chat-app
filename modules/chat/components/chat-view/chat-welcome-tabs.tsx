"use client";

import React, { useState } from "react";
import { CHAT_TAB_MESSAGE } from "../../constant";
import { Button } from "@/components/ui/button";
import { NeuronMark } from "@/components/brand";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type WelcomeTabsProps = {
  userName: string;
  onMessageSelect: (message: string) => void;
};

export const ChatWelcomeTabs = ({
  userName = "Developer",
  onMessageSelect,
}: WelcomeTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const firstName = userName ? userName.split(" ")[0] : "Developer";

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto space-y-6">

        {/* ── Brand Badge & Greeting ── */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary border border-border text-xs text-muted-foreground">
            <NeuronMark size={14} animated glow={false} />
            <span className="font-mono text-foreground text-[11px]">Neuron Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-500 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-400">
              {firstName}
            </span>
            .
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select a prompt category or type an instruction to start streaming.
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Prompt categories"
        >
          {CHAT_TAB_MESSAGE.map((tab, index) => {
            const isSelected = activeTab === index;

            return (
              <Button
                key={tab.tabName}
                variant="ghost"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "h-7 px-2.5 gap-1.5 rounded-md text-xs font-medium border transition-all duration-150 whitespace-nowrap",
                  isSelected
                    ? "bg-violet-500/15 border-violet-500/30 text-violet-700 dark:text-violet-300 shadow-xs"
                    : "bg-secondary border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="opacity-70 text-violet-500 dark:text-violet-400" aria-hidden="true">{tab.icon}</span>
                {tab.tabName}
              </Button>
            );
          })}
        </div>

        {/* ── Suggestion Cards ── */}
        <div
          className="w-full min-h-[180px]"
          role="tabpanel"
          aria-label={`${CHAT_TAB_MESSAGE[activeTab].tabName} suggestions`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHAT_TAB_MESSAGE[activeTab].messages.map((msg, index) => (
              <button
                key={index}
                onClick={() => onMessageSelect(msg)}
                className="
                  group text-left p-3 rounded-lg
                  bg-card hover:bg-secondary
                  border border-border hover:border-violet-500/40
                  transition-all duration-150
                  flex items-start justify-between gap-3
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500
                  min-w-0 shadow-xs
                "
              >
                <span className="text-xs text-foreground group-hover:text-primary leading-relaxed line-clamp-2">
                  {msg}
                </span>

                <ArrowUpRight
                  className="
                    h-3.5 w-3.5 shrink-0 text-muted-foreground
                    group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-150
                    mt-0.5
                  "
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatWelcomeTabs;