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
    <div className="flex flex-col items-center w-full px-4">
      <div className="w-full max-w-2xl space-y-8">

        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-[2rem] font-semibold tracking-tight text-white leading-tight">
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

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2">
          {CHAT_TAB_MESSAGE.map((tab, index) => (
            <Button
              key={tab.tabName}
              variant="ghost"
              onClick={() => setActiveTab(index)}
              className={`
                h-8 px-3 gap-1.5 rounded-full text-xs font-medium
                border transition-all duration-150
                ${
                  activeTab === index
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20"
                    : "bg-white/[0.03] border-white/[0.07] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200 hover:border-white/[0.12]"
                }
              `}
            >
              <span className="opacity-80">{tab.icon}</span>
              {tab.tabName}
            </Button>
          ))}
        </div>

        {/* Message suggestions */}
        <div className="w-full min-h-[220px]">
          <ul className="divide-y divide-white/[0.05]">
            {CHAT_TAB_MESSAGE[activeTab].messages.map((msg, index) => (
              <li key={index}>
                <button
                  onClick={() => onMessageSelect(msg)}
                  className="
                    group w-full text-left py-3 px-1
                    text-sm text-zinc-400
                    hover:text-white
                    transition-colors duration-150
                    flex items-center justify-between gap-4
                    focus-visible:outline-none focus-visible:text-white
                  "
                >
                  <span>{msg}</span>
                  {/* Arrow hint on hover */}
                  <span
                    className="
                      flex-shrink-0 opacity-0 group-hover:opacity-100
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