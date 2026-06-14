import MessageViewWithFrom from "@/modules/messages/messsage-view-from";
import React from "react";

const ChatIdPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await params;

  return <MessageViewWithFrom chatId={chatId} />;
};

export default ChatIdPage;
