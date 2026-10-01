import React from "react";
import Header from "@/components/header";
import { currentUser } from "@/modules/auth/actions";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import { NeuronLogo } from "@/components/brand";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  // If user is authenticated, render the full workspace shell
  if (user) {
    return (
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
        {/* Tablet (md:w-16) & Desktop (lg:w-60) Sidebar */}
        <aside className="hidden md:flex shrink-0 h-full">
          <ChatSidebar user={user} />
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header user={user} />
          <div className="flex-1 min-h-0 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // If guest / unauthenticated, render the clean public shell
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Public Navbar */}
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <NeuronLogo variant="full" size="sm" href="/" />

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            asChild
            size="sm"
            className="h-8 px-3.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 border border-border text-foreground"
          >
            <Link href="/sign-in">
              Sign In
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-8 px-3.5 rounded-lg text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border border-violet-500/30"
          >
            <Link href="/sign-in">
              Get Started
            </Link>
          </Button>
        </div>
      </header>

      {/* Public Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;