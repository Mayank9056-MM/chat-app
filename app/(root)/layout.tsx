import Header from "@/components/header";
import { requireAuth } from "@/modules/auth/actions";
import { User } from "@/modules/auth/types";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireAuth();
  const user: User = session.user;

  return (
     <div className="flex h-dvh overflow-hidden bg-zinc-950">
      {/*
        Desktop sidebar — hidden on mobile (< lg), always visible on lg+.
        w-60 is fixed; flex-shrink-0 prevents the main area from compressing it.
      */}
      <aside className="hidden lg:flex flex-shrink-0 w-60 h-full">
        <ChatSidebar user={user} />
      </aside>
 
      {/*
        Main column.
        min-w-0 is critical: without it, flex children can overflow their
        parent on narrow viewports.
        overflow-hidden on the column itself clips any stray child overflow.
      */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/*
          Header receives the user so it can render a mobile menu button
          that opens the sidebar sheet (see header.tsx).
          We also pass `user` so the header can render the sheet with
          <ChatSidebar> inside it.
        */}
        <Header user={user} />
 
        {/* Content area fills remaining height; children scroll internally */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;