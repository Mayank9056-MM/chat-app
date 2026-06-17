"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserButton from "@/modules/auth/components/user-button";
import { User } from "@/modules/auth/types";
import { EllipsisIcon, PlusIcon, SearchIcon, Trash } from "lucide-react";
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

type ChatSidebarProps = {
  user: User;
};

type ChatGroupProps = {
  label: string;
  chats: Chats;
  activeChatId: string | null;
  onDelete: (e: React.MouseEvent, chatId: string) => void;
};

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onDelete: (e: React.MouseEvent, chatId: string) => void;
};

type ChatGroupKey =
  | "today"
  | "yesterday"
  | "lastWeek"
  | "older";

function groupChatsByDate(chats: Chats) {
  const groups: Record<"today" | "yesterday" | "lastWeek" | "older", Chat[]> = {
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
    else {
      groups.older.push(chat);
    }
  });

  return groups;
}

const DATE_GROUPS: {
  key: ChatGroupKey;
  label: string;
}[] = [
  {
    key: "today",
    label: "Today",
  },
  {
    key: "yesterday",
    label: "Yesterday",
  },
  {
    key: "lastWeek",
    label: "Last 7 Days",
  },
  {
    key: "older",
    label: "Older",
  },
];

function ChatItem({ chat, isActive, onDelete }: ChatItemProps) {
  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
        isActive && "bg-sidebar-accent",
      )}
    >
      <span className="truncate flex-1">{chat.title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size="icon"
            className="h-6 w-6 shrink-0 hover:bg-sidebar-accent-foreground/10"
            onClick={(e) => e.preventDefault()}
          >
            <EllipsisIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-red-500 cursor-pointer"
            onClick={(e) => onDelete(e, chat.id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
}

function ChatGroup({ label, chats, activeChatId, onDelete }: ChatGroupProps) {
  if (chats?.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mbl-2 px-2 text-xs font-semibold text-muted-foreground">
        {label}
      </div>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

const ChatSidebar = ({ user }: ChatSidebarProps) => {
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
        chat.messages.some((msg) =>
          msg.content.toLowerCase().includes(query),
        ),
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

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center border-b border-sidebar-border px-4 py-3">
        <Image src={"logo.svg"} alt="Logo" width={100} height={100} />
      </div>

      <div className="p-4">
        <Button asChild className="w-full">
          <Link href={"/"}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Chat
          </Link>
        </Button>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your threads..."
            className="pl-9 pr-8 bg-sidebar-accent border-sidebar-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:cursor-pointer"
              onClick={() => setSearchQuery("")}
            >
              X
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {filteredChats.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            {searchQuery ? "No chats found" : "No chats yet"}
          </div>
        ) : (
          DATE_GROUPS.map((group) => (
            <ChatGroup
              key={group.key}
              label={group.label}
              chats={groupedChats[group.key]}
              activeChatId={activeChatId}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Footer */}

      <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
        <UserButton user={user} />
        <span className="flex-1 text-sm text-sidebar-foreground truncate">
          {user?.email}
        </span>
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
