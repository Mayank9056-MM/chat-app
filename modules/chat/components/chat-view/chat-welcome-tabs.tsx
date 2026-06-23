"use client";

import React, { useState } from "react";
import { CHAT_TAB_MESSAGE } from "../../constant";
import { Button } from "@/components/ui/button";

type WelcomeTabsProps = {
  userName: string;
  onMessageSelect: (message: string) => void;
};

const ChatWelcomeTabs = ({
  userName = "John Doe",
  onMessageSelect,
}: WelcomeTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const firstName = userName.slice(0, userName.indexOf(" ")) || userName;

  return (
    /*
      Full-width container; horizontal padding via px-* responds to screen size.
      We do NOT set a fixed height — the parent's flex centering handles vertical.
    */
    <div className="w-full px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8">

        {/* ── Greeting ── */}
        <div className="space-y-2">
          {/*
            Responsive heading scale:
              mobile  → text-3xl  (≈ 30px)
              tablet  → text-4xl  (≈ 36px)
              desktop → text-5xl  (≈ 48px)
            font-semibold keeps it authoritative without being heavy.
            leading-tight prevents double-line awkwardness on narrow screens.
          */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            Good to see you,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {firstName}
            </span>
            .
          </h1>
          <p className="text-sm text-zinc-500">
            Pick a category below or type anything to get started.
          </p>
        </div>

        {/* ── Tab pills ── */}
        {/*
          flex-wrap lets tabs reflow into multiple rows on very narrow screens
          rather than overflowing. gap-2 keeps them breathable.
          Each pill has a min-w that prevents single-character collapse.
        */}
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Message categories"
        >
          {CHAT_TAB_MESSAGE.map((tab, index) => (
            <Button
              key={tab.tabName}
              variant="ghost"
              role="tab"
              aria-selected={activeTab === index}
              onClick={() => setActiveTab(index)}
              className={`
                h-8 px-3 gap-1.5 rounded-full text-xs font-medium
                border transition-all duration-150
                whitespace-nowrap
                focus-visible:ring-1 focus-visible:ring-indigo-500/50
                ${
                  activeTab === index
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20"
                    : "bg-white/[0.03] border-white/[0.07] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200 hover:border-white/[0.12]"
                }
              `}
            >
              <span className="opacity-80" aria-hidden="true">{tab.icon}</span>
              {tab.tabName}
            </Button>
          ))}
        </div>

        {/* ── Message suggestions ── */}
        {/*
          min-h preserves vertical rhythm when tab content has fewer items.
          On very small screens the list is still readable because each item
          gets its own row with generous touch target (py-3).
        */}
        <div
          className="w-full min-h-[200px] sm:min-h-[220px]"
          role="tabpanel"
          aria-label={`${CHAT_TAB_MESSAGE[activeTab].tabName} suggestions`}
        >
          <ul className="divide-y divide-white/[0.05]">
            {CHAT_TAB_MESSAGE[activeTab].messages.map((msg, index) => (
              <li key={index}>
                <button
                  onClick={() => onMessageSelect(msg)}
                  className="
                    group w-full text-left py-3 px-1
                    text-sm text-zinc-400
                    hover:text-white
                    active:text-white
                    transition-colors duration-150
                    flex items-start justify-between gap-4
                    focus-visible:outline-none focus-visible:text-white
                    min-w-0
                  "
                >
                  {/*
                    min-w-0 + break-words prevent a very long suggestion from
                    overflowing its container at 320px.
                  */}
                  <span className="min-w-0 break-words">{msg}</span>

                  {/* Arrow hint — flex-shrink-0 so it never wraps */}
                  <span
                    className="
                      flex-shrink-0 mt-0.5
                      opacity-0 group-hover:opacity-100
                      group-focus-visible:opacity-100
                      transition-opacity duration-150
                      text-zinc-600 group-hover:text-indigo-400
                      text-base leading-none
                    "
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ChatWelcomeTabs;