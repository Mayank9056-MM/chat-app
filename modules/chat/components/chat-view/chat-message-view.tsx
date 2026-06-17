"use client";

import { User } from "@/modules/auth/types";
import React, { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

type ChatMessageViewProps = {
  user: User | null;
};

const ChatMessageView = ({user}: ChatMessageViewProps) => {
  const [message, setMessage] = useState("");

  const handleMessageSelect = (msg: string) => {
    setMessage(msg);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-10">
      <ChatWelcomeTabs
        userName={user?.name ?? "User"}
        onMessageSelect={handleMessageSelect}
      />

      <ChatMessageForm message={message} setMessage={setMessage} />
    </div>
  );
};

export default ChatMessageView;
