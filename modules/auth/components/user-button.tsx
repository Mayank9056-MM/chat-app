"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, CreditCard, LogOut, Settings, UserIcon } from "lucide-react";
import { UserButtonProps } from "../types";
import { cn } from "@/lib/utils";

export default function UserButton({
  user,
  onLogout,
  onSettings,
  onProfile,
  onBilling,
  showBadge = false,
  badgeText = "Pro",
  badgeVariant = "default",
  size = "md",
  showEmail = true,
  showMemberSince = true,
  collapsed = false,
  showDetails = false,
  className,
}: UserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("sign-in");
        },
      },
    });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onSignOut();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials for avatar feedback
  const getUserInitials = (name: string, email: string): string => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }

    return "U";
  };

  // Format member since date
  const formatMemberSince = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  // Avatar sizes
  const avatarSizes = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {showDetails ? (
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center transition-colors cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring text-left group",
              collapsed
                ? "h-9 w-9 p-0 justify-center mx-auto rounded-lg hover:bg-sidebar-accent"
                : "h-auto p-2 justify-start gap-2.5 rounded-lg hover:bg-sidebar-accent",
              className
            )}
            disabled={isLoading}
          >
            <div className="relative shrink-0">
              <Avatar className={avatarSizes[size]}>
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User avatar"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xs">
                  {getUserInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              {showBadge && (
                <Badge
                  variant={badgeVariant}
                  className="absolute -bottom-1 -right-1 h-4 px-1 text-[10px]"
                >
                  {badgeText}
                </Badge>
              )}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-sidebar-foreground truncate leading-tight group-hover:text-foreground">
                  {user.name || "User"}
                </p>
                {showEmail && user.email && (
                  <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono mt-0.5">
                    {user.email}
                  </p>
                )}
              </div>
            )}

            {!collapsed && (
              <ChevronsUpDown className="size-3.5 text-muted-foreground/60 shrink-0 ml-auto group-hover:text-sidebar-foreground transition-colors" />
            )}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              `relative ${avatarSizes[size]} rounded-full p-0 hover:bg-accent`,
              className
            )}
            disabled={isLoading}
          >
            <Avatar className={avatarSizes[size]}>
              <AvatarImage
                src={user.image || ""}
                alt={user.name || "User avatar"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {getUserInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            {showBadge && (
              <Badge
                variant={badgeVariant}
                className="absolute -bottom-1 -right-1 h-5 px-1 text-xs"
              >
                {badgeText}
              </Badge>
            )}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64"
        side={collapsed ? "right" : "top"}
        align={collapsed ? "center" : "start"}
        sideOffset={8}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User avatar"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                  {getUserInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
                <p className="text-sm font-medium leading-none truncate">
                  {user.name || "User"}
                </p>
                {showEmail && user.email && (
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
                {showBadge && (
                  <Badge variant={badgeVariant} className="w-fit text-[10px] mt-0.5">
                    {badgeText}
                  </Badge>
                )}
              </div>
            </div>
            {showMemberSince && (
              <p className="text-[11px] text-muted-foreground font-mono">
                Member since {formatMemberSince(user.createdAt)}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {onProfile && (
          <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        )}

        {onBilling && (
          <DropdownMenuItem onClick={onBilling} className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
        )}

        {onSettings && (
          <DropdownMenuItem onClick={onSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}