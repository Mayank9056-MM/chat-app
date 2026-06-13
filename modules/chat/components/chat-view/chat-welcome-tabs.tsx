"use client";

import React, { useState } from "react";
import { CHAT_TAB_MESSAGE } from "../../constant";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type WelcomeTabsProps = {
  userName: string;
  onMessageSelect: (message: string) => void;
};

const ChatWelcomeTabs = ({ userName="John Doe", onMessageSelect }: WelcomeTabsProps) => {

    const [activeTab,setActiveTab] = useState(0);

   return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-4xl font-semibold">
          How can i help you ,{" "}
          {userName.slice(0, userName.indexOf(" ")) || userName}?
        </h1>

        <div className="flex flex-wrap gap-2 w-full">
          {CHAT_TAB_MESSAGE.map((tab, index) => (
            <Button
              key={tab.tabName}
              variant={activeTab === index ? "default" : "secondary"}
              onClick={() => setActiveTab(index)}
              className="w-[110px] justify-start"
            >
              {tab.icon}
              <span className="ml-2">{tab.tabName}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-3 w-full min-h-[240px]">
          {CHAT_TAB_MESSAGE[activeTab].messages.map((message, index) => (
            <div key={index}>
                <button
                onClick={()=>onMessageSelect(message)}
                   className="w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out py-2"
                >
                    {message}
                </button>
                  {index < CHAT_TAB_MESSAGE[activeTab].messages.length - 1 && (
                <Separator />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeTabs;
