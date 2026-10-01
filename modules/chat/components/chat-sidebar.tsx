"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EllipsisIcon,
  MessageSquare,
  PlusIcon,
  SearchIcon,
  Trash,
  X,
} from "lucide-react";
import { isToday, isWithinInterval, isYesterday, subDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NeuronLogo, NeuronMark } from "@/components/brand";
import UserButton from "@/modules/auth/components/user-button";
import DeleteChatModal from "@/components/delete-chat-model";
import SidebarSkeleton from "@/components/feedback/sidebar-skeleton";
import { useGetChats } from "../hooks/use-chats";
import { User } from "@/modules/auth/types";
import { Chat, Chats } from "../types";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ChatSidebarProps = {
  user: User;
  /** Called when a nav item is clicked on mobile so the sheet can close. */
  onNavigate?: () => void;
  /** Explicitly force collapsed icon-only mode if desired */
  collapsed?: boolean;
};

type ChatGroupKey = "today" | "yesterday" | "lastWeek" | "older";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupChatsByDate(chats: Chats) {
  const groups: Record<ChatGroupKey, Chat[]> = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  };
  const now = new Date();
  chats?.forEach((chat: Chat) => {
    const date = new Date(chat.createdAt);
    if (isToday(date)) groups.today.push(chat);
    else if (isYesterday(date)) groups.yesterday.push(chat);
    else if (isWithinInterval(date, { start: subDays(now, 7), end: now }))
      groups.lastWeek.push(chat);
    else groups.older.push(chat);
  });
  return groups;
}

const DATE_GROUPS: { key: ChatGroupKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "lastWeek", label: "Last 7 Days" },
  { key: "older", label: "Older" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const ChatSidebar = ({ user, onNavigate, collapsed = false }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const pathName = usePathname();
  const activeChatId = pathName?.startsWith("/chat/")
    ? pathName.split("/")[2]
    : null;
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isPending } = useGetChats();
  const chats = useMemo(() => data?.data ?? [], [data?.data]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query) ||
        chat.messages.some((msg) => msg.content.toLowerCase().includes(query)),
    );
  }, [searchQuery, chats]);

  const groupedChats = useMemo(
    () => groupChatsByDate(filteredChats),
    [filteredChats],
  );

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsModalOpen(true);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "flex h-full flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground select-none transition-all duration-200",
          collapsed ? "w-16 items-center" : "w-full md:w-16 lg:w-60"
        )}
        aria-label="Workspace Sidebar"
      >
        {/* ── Brand Header ── */}
        <div className="flex items-center h-12 px-3 border-b border-sidebar-border w-full shrink-0 justify-between">
          {/* Full Logo: desktop */}
          <div className={cn("items-center", collapsed ? "hidden" : "hidden lg:flex")}>
            <NeuronLogo variant="full" size="sm" href="/" onClick={onNavigate} />
          </div>

          {/* Mark Icon: tablet */}
          <div className={cn("mx-auto", collapsed ? "flex" : "flex lg:hidden")}>
            <Link href="/" onClick={onNavigate} className="p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 rounded">
              <NeuronMark size={24} />
            </Link>
          </div>
        </div>

        {/* ── New Chat CTA ── */}
        <div className="p-2.5 w-full shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                className={cn(
                  "w-full h-8 text-xs font-medium rounded-lg border-border bg-card hover:bg-muted text-foreground transition-all duration-150 shadow-xs",
                  collapsed ? "px-0 justify-center" : "px-2.5 justify-center md:px-0 lg:px-2.5 md:justify-center lg:justify-start"
                )}
              >
                <Link href="/" onClick={onNavigate} className="flex items-center gap-2">
                  <PlusIcon className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400 shrink-0" />
                  <span className={collapsed ? "hidden" : "hidden lg:inline truncate"}>
                    New chat
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className={cn(collapsed ? "block" : "block lg:hidden")}>
              New chat
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ── Search Input (Desktop) ── */}
        <div className={cn("px-2.5 pb-2 shrink-0 w-full", collapsed ? "hidden" : "hidden lg:block")}>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search conversations..."
              className="h-7 pl-8 pr-7 text-xs rounded-md bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-violet-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search chats"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* ── Chat List ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 w-full">
          {isPending ? (
            <SidebarSkeleton />
          ) : filteredChats.length === 0 ? (
            <div className={cn("flex flex-col items-center justify-center py-10 px-2 text-center", collapsed && "py-4")}>
              <MessageSquare className="h-4 w-4 text-muted-foreground mb-1.5 opacity-60" />
              <p className={cn("text-[11px] text-muted-foreground leading-tight", collapsed ? "hidden" : "hidden lg:block")}>
                {searchQuery ? "No matches found" : "No chats yet"}
              </p>
            </div>
          ) : (
            DATE_GROUPS.map((group) => {
              const chatsInGroup = groupedChats[group.key];
              if (!chatsInGroup || chatsInGroup.length === 0) return null;

              return (
                <div key={group.key} className="mb-4">
                  {/* Group Label */}
                  <div className={cn("px-2 mb-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium", collapsed ? "hidden" : "hidden lg:block")}>
                    {group.label}
                  </div>

                  <div className="space-y-0.5">
                    {chatsInGroup.map((chat) => {
                      const isActive = chat.id === activeChatId;

                      return (
                        <div key={chat.id} className="relative group/item flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/chat/${chat.id}`}
                                onClick={onNavigate}
                                className={cn(
                                  "flex items-center w-full rounded-md text-xs transition-colors duration-150 py-1.5",
                                  collapsed ? "justify-center px-0" : "px-2 md:justify-center lg:justify-between lg:px-2",
                                  isActive
                                    ? "bg-violet-500/15 text-violet-700 dark:text-violet-300 font-medium border border-violet-500/30"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
                                )}
                              >
                                <MessageSquare className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground")} />
                                
                                <span className={cn("truncate flex-1 ml-2 text-left", collapsed ? "hidden" : "hidden lg:inline")}>
                                  {chat.title}
                                </span>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className={cn(collapsed ? "block max-w-xs" : "block lg:hidden max-w-xs")}>
                              {chat.title}
                            </TooltipContent>
                          </Tooltip>

                          {/* Options Menu (Desktop) */}
                          <div className={cn("absolute right-1", collapsed ? "hidden" : "hidden lg:block")}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={(e) => e.preventDefault()}
                                  aria-label="Chat options"
                                >
                                  <EllipsisIcon className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground shadow-xl">
                                <DropdownMenuItem
                                  className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-500/10 cursor-pointer gap-2 text-xs"
                                  onClick={(e) => handleDelete(e, chat.id)}
                                >
                                  <Trash className="h-3 w-3" />
                                  Delete conversation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── User Footer ── */}
        <div className="shrink-0 border-t border-sidebar-border p-2 w-full">
          <UserButton
            user={user}
            collapsed={collapsed}
            showDetails={true}
            className="w-full"
          />
        </div>

        {/* ── Modal ── */}
        <DeleteChatModal
          chatId={selectedChatId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </aside>
    </TooltipProvider>
  );
};

export default ChatSidebar;