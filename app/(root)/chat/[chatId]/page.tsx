import MessageViewWithForm from "@/modules/messages/messsage-view-form";
import { requireAuth } from "@/modules/auth/actions";
import React from "react";

const ChatIdPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  await requireAuth();
  const { chatId } = await params;

  return <MessageViewWithForm chatId={chatId} />;
};

export default ChatIdPage;
