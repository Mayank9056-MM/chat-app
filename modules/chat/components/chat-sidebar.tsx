"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserButton from "@/modules/auth/components/user-button";
import { User } from "@/modules/auth/types";
import { EllipsisIcon, PlusIcon, SearchIcon, Trash, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Chat, Chats } from "../types";
import { usePathname } from "next/navigation";
import { isToday, isWithinInterval, isYesterday, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteChatModal from "@/components/delete-chat-model";
import { useGetChats } from "../hooks/use-chats";
import { Spinner } from "@/components/ui/spinner";

// ─── Types ───────────────────────────────────────────────────────────────────

type ChatSidebarProps = {
  user: User;
  /** Called when a nav item is clicked on mobile so the sheet can close. */
  onNavigate?: () => void;
};
type ChatGroupProps = {
  label: string;
  chats: Chats;
  activeChatId: string | null;
  onDelete: (e: React.MouseEvent, chatId: string) => void;
  onNavigate?: () => void;
};
type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onDelete: (e: React.MouseEvent, chatId: string) => void;
  onNavigate?: () => void;
};
type ChatGroupKey = "today" | "yesterday" | "lastWeek" | "older";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupChatsByDate(chats: Chats) {
  const groups: Record<ChatGroupKey, Chat[]> = {
    today: [], yesterday: [], lastWeek: [], older: [],
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

// ─── ChatItem ─────────────────────────────────────────────────────────────────

function ChatItem({ chat, isActive, onDelete, onNavigate }: ChatItemProps) {
  return (
    <Link
      href={`/chat/${chat.id}`}
      onClick={onNavigate}
      className={cn(
        "group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-all duration-150 min-w-0",
        isActive
          ? "bg-white/[0.08] text-white"
          : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200",
      )}
    >
      {/* min-w-0 + truncate prevent title from pushing the button off-screen */}
      <span className="truncate flex-1 min-w-0 leading-snug pr-1">{chat.title}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 shrink-0 rounded-md transition-all duration-150",
              // Always visible on touch devices; hover-only on pointer devices
              "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
              "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08]",
            )}
            onClick={(e) => e.preventDefault()}
            aria-label="Chat options"
          >
            <EllipsisIcon className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-zinc-900 border-white/[0.08] text-zinc-200 shadow-xl shadow-black/40"
        >
          <DropdownMenuItem
            className="text-red-400 cursor-pointer hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 gap-2"
            onClick={(e) => onDelete(e, chat.id)}
          >
            <Trash className="h-3.5 w-3.5" />
            Delete chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
}

// ─── ChatGroup ────────────────────────────────────────────────────────────────

function ChatGroup({ label, chats, activeChatId, onDelete, onNavigate }: ChatGroupProps) {
  if (chats?.length === 0) return null;
  return (
    <div className="mb-5">
      <div className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        {label}
      </div>
      <div className="space-y-0.5">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onDelete={onDelete}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

// ─── ChatSidebar ──────────────────────────────────────────────────────────────

/**
 * The sidebar renders as a purely visual panel — it is the *content* of the
 * sidebar, whether that's a fixed <aside> on desktop or a Sheet on mobile.
 * The Sheet wrapper lives in the Header so this component stays focused.
 */
const ChatSidebar = ({ user, onNavigate }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const pathName = usePathname();
  const activeChatId = pathName?.startsWith("/chat/")
    ? pathName.split("/")[2]
    : null;
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isPending } = useGetChats();
  const chats = data?.data ?? [];

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
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
    /*
      h-full fills whatever container places this (the <aside> on desktop,
      or the SheetContent on mobile). flex-col ensures the footer stays
      pinned at the bottom.
    */
    <div className="flex h-full w-full flex-col bg-zinc-950 border-r border-white/[0.06]">

      {/* ── Logo ── */}
      <div className="flex items-center h-12 px-4 border-b border-white/[0.06] flex-shrink-0">
        <Image
          src="/logo.svg"
          alt="Neuron"
          width={88}
          height={32}
          className="object-contain"
          priority
        />
      </div>

      {/* ── New Chat ── */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <Button
          asChild
          className={cn(
            "w-full h-8 gap-2 text-xs font-medium rounded-lg",
            "bg-white/[0.06] hover:bg-white/[0.10]",
            "border border-white/[0.08] hover:border-white/[0.14]",
            "text-zinc-300 hover:text-white",
            "shadow-none transition-all duration-150",
            // Improve touch target
            "active:scale-[0.98]",
          )}
          variant="ghost"
        >
          <Link href="/" onClick={onNavigate}>
            <PlusIcon className="h-3.5 w-3.5" />
            New chat
          </Link>
        </Button>
      </div>

      {/* ── Search ── */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          <Input
            placeholder="Search chats…"
            className={cn(
              "h-8 pl-8 pr-7 text-xs rounded-lg",
              "bg-white/[0.04] border-white/[0.07]",
              "text-zinc-300 placeholder:text-zinc-600",
              "focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/30",
              "transition-all duration-150",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search chats"
          />
          {searchQuery && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors p-0.5 rounded"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Chat list ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/[0.06]">
        {isPending ? (
          <div className="flex items-center justify-center py-12" role="status" aria-label="Loading chats">
            <Spinner className="text-zinc-600" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-2 text-zinc-700">
              {/* Icon placeholder — keeps empty state from feeling sterile */}
              <SearchIcon className="h-5 w-5 mx-auto opacity-40" />
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No chats yet. Start a new conversation."}
            </p>
          </div>
        ) : (
          DATE_GROUPS.map((group) => (
            <ChatGroup
              key={group.key}
              label={group.label}
              chats={groupedChats[group.key]}
              activeChatId={activeChatId}
              onDelete={handleDelete}
              onNavigate={onNavigate}
            />
          ))
        )}
      </div>

      {/* ── User footer ── */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.05] active:bg-white/[0.07] transition-colors duration-150 cursor-pointer min-w-0">
          <UserButton user={user} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-300 truncate leading-tight">
              {user?.name}
            </p>
            <p className="text-[10px] text-zinc-600 truncate leading-tight">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <DeleteChatModal
        chatId={selectedChatId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default ChatSidebar;