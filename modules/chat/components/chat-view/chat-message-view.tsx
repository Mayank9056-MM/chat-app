"use client";

import { User } from "@/modules/auth/types";
import React, { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

type ChatMessageViewProps = {
  user: User | null;
};

const ChatMessageView = ({ user }: ChatMessageViewProps) => {
  const [message, setMessage] = useState("");

  const handleMessageSelect = (msg: string) => {
    setMessage(msg);
  };

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden">
      {/* Subtle ambient glow — consistent with auth page identity */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/[0.07] blur-[140px]" />
      </div>

      {/* Main content: vertically centered, grows to fill */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-40">
        <ChatWelcomeTabs
          userName={user?.name ?? "User"}
          onMessageSelect={handleMessageSelect}
        />
      </div>

      {/* Input bar: pinned to bottom */}
      <div className="relative z-10 flex-shrink-0">
        <ChatMessageForm message={message} setMessage={setMessage} />
      </div>
    </div>
  );
};

export default ChatMessageView;