"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

type HeaderProps = {
  user?: User;
};

const Header = ({ user }: HeaderProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="flex h-12 w-full flex-row items-center border-b border-white/[0.06] bg-transparent px-3 sm:px-4">
        {/* Mobile menu button — only visible below lg where the sidebar is hidden */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden mr-2 h-8 w-8 rounded-lg flex-shrink-0",
              "text-zinc-400 hover:text-zinc-200",
              "hover:bg-white/[0.06] active:bg-white/[0.08]",
              "border border-transparent hover:border-white/[0.08]",
              "transition-all duration-150",
              "focus-visible:ring-1 focus-visible:ring-indigo-500/50",
            )}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        {/* Spacer — pushes ModeToggle to the right */}
        <div className="flex-1 min-w-0" />

        <ModeToggle />
      </header>

      {/* Mobile sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          id="mobile-sidebar"
          side="left"
          className={cn(
            "w-[280px] sm:w-60 p-0",
            "bg-zinc-950 border-r border-white/[0.06]",
            // Hide shadcn's default close button — we render our own
            "[&>button[data-radix-dialog-close]]:hidden",
          )}
          aria-label="Navigation sidebar"
        >
          {/* Accessible title (visually hidden) */}
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>

          {/* Custom close button — top-right of the sheet */}
          <button
            className={cn(
              "absolute top-3 right-3 z-10",
              "h-7 w-7 rounded-lg flex items-center justify-center",
              "text-zinc-500 hover:text-zinc-200",
              "hover:bg-white/[0.06] active:bg-white/[0.08]",
              "border border-transparent hover:border-white/[0.08]",
              "transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50",
            )}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>

          {user && (
            <ChatSidebar
              user={user}
              onNavigate={() => setSidebarOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Header;