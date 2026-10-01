"use client";

import { User } from "@/modules/auth/types";
import React, { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

type ChatMessageViewProps = {
  user: User | null;
};

export const ChatMessageView = ({ user }: ChatMessageViewProps) => {
  const [message, setMessage] = useState("");

  const handleMessageSelect = (msg: string) => {
    setMessage(msg);
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-background text-foreground transition-colors">
      {/* ── Ambient Restrained Glow ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[650px] rounded-full bg-violet-500/[0.04] dark:bg-violet-600/[0.05] blur-[140px]" />
      </div>

      {/* ── Scrollable Welcome Content Area ── */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center py-6 sm:py-10">
          <ChatWelcomeTabs
            userName={user?.name ?? "Developer"}
            onMessageSelect={handleMessageSelect}
          />
        </div>
      </div>

      {/* ── Bottom Input Composer Bar ── */}
      <div className="relative z-10 shrink-0 border-t border-border bg-background/80 backdrop-blur-md">
        <ChatMessageForm message={message} setMessage={setMessage} />
      </div>
    </div>
  );
};

export default ChatMessageView;