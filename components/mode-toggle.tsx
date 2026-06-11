"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Sunrise, Sunset } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? (
        <Sunset className="size-5" />
      ) : (
        <Sunrise className="size-5" />
      )}
    </Button>
  );
}
