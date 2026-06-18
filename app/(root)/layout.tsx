import Header from "@/components/header";
import { requireAuth } from "@/modules/auth/actions";
import { User } from "@/modules/auth/types";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireAuth();
  const user: User = session.user;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <ChatSidebar user={user} />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;