import Header from "@/components/header";
import { requireAuth } from "@/modules/auth/actions";
import { User } from "@/modules/auth/types";
import { getAllChats } from "@/modules/chat/actions";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireAuth();

  const user: User = session.user;

  const { data: chats } = await getAllChats();

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar user={user} chats={chats} />
      <main className="flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Layout;
