"use client";

import React, { useState } from "react";
import { Menu, X, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { User } from "@/modules/auth/types";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import { ModeToggle } from "./mode-toggle";
import { NeuronLogo } from "@/components/brand";
import { cn } from "@/lib/utils";

type HeaderProps = {
  user?: User;
};

export const Header = ({ user }: HeaderProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="flex h-12 w-full shrink-0 items-center border-b border-border bg-background/80 backdrop-blur-md px-3 sm:px-4 select-none justify-between z-20 transition-colors">
        <div className="flex items-center gap-2">
          {/* Mobile menu button (< md) */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border",
                "transition-all duration-150 focus-visible:ring-1 focus-visible:ring-violet-500",
              )}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile brand presence */}
          <div className="md:hidden flex items-center">
            <NeuronLogo variant="full" size="xs" href="/" />
          </div>

          {/* Desktop workspace indicator */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-muted-foreground px-2 py-0.5 rounded bg-secondary border border-border">
              workspace
            </span>
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {user && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border px-2.5 rounded-md"
            >
              <Link href="/">
                <Plus className="h-3.5 w-3.5 mr-1 text-violet-500 dark:text-violet-400" />
                <span className="hidden sm:inline">New conversation</span>
              </Link>
            </Button>
          )}

          <ModeToggle />
        </div>
      </header>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 bg-sidebar border-r border-sidebar-border [&>button[data-radix-dialog-close]]:hidden"
          aria-label="Navigation sidebar"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>

          {/* Accessible Close Button */}
          <button
            className="absolute top-2.5 right-2.5 z-20 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>

          {user && (
            <ChatSidebar
              user={user}
              onNavigate={() => setSidebarOpen(false)}
              collapsed={false}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Header;