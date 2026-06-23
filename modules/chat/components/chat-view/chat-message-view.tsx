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
    /*
      h-full fills the parent's flex column; overflow-hidden clips the glow blob.
      flex-col lets us push the input to the bottom via mt-auto.
    */
    <div className="relative flex flex-col h-full w-full overflow-hidden">

      {/* ── Ambient glow ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Primary glow — indigo, centred above-mid */}
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] sm:h-[500px] sm:w-[900px] rounded-full bg-indigo-600/[0.07] blur-[120px] sm:blur-[140px]" />
        {/* Subtle violet accent — bottom-right corner, adds depth */}
        <div className="absolute right-0 bottom-0 h-[300px] w-[400px] rounded-full bg-violet-700/[0.04] blur-[100px]" />
      </div>

      {/*
        Scrollable welcome area.
        flex-1 + overflow-y-auto means content scrolls if viewport is very short
        (e.g. landscape mobile) rather than getting clipped.
        pb-4 ensures last suggestion is never hidden under the input bar.
      */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center py-8 sm:py-12">
          <ChatWelcomeTabs
            userName={user?.name ?? "User"}
            onMessageSelect={handleMessageSelect}
          />
        </div>
      </div>

      {/*
        Input bar — flex-shrink-0 keeps it from collapsing; it sticks to the
        bottom because it follows the flex-1 scroll area above.
        The subtle top border + backdrop blur give it visual elevation without
        a harsh divider.
      */}
      <div className="relative z-10 flex-shrink-0 border-t border-white/[0.05] bg-zinc-950/70 backdrop-blur-md">
        <ChatMessageForm message={message} setMessage={setMessage} />
      </div>
    </div>
  );
};

export default ChatMessageView;