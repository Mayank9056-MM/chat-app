"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-8 w-8 rounded-lg flex-shrink-0",
        "text-zinc-400 hover:text-zinc-200",
        "hover:bg-white/[0.06] active:bg-white/[0.08]",
        "border border-transparent hover:border-white/[0.08]",
        "transition-all duration-150",
        "focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:outline-none",
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}