"use client";

import React, { useState } from "react";
import { useAIModels } from "../../hooks/use-ai-models";
import { ArrowUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ModelSelector } from "./model-selector";
import { useCreateChat } from "../../hooks/use-chats";
import { cn } from "@/lib/utils";

type ChatMessageFormProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ChatMessageForm = ({ message, setMessage }: ChatMessageFormProps) => {
  const { data, isPending } = useAIModels();
  const models = data?.models ?? [];

  const [selectedModel, setSelectedModel] = useState<string>();
  const activeModel = selectedModel || models[0]?.id;

  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  const hasMessage = message.trim().length > 0;

  const submitMessage = async () => {
    if (!hasMessage) return;

    if (!activeModel) {
      toast.error("Please select an AI model first");
      return;
    }

    try {
      await mutateAsync({
        content: message.trim(),
        model: activeModel,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to initialize conversation");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitMessage();
  };

  return (
    <div className="w-full px-3 sm:px-4 py-3 sm:py-4 pb-[max(12px,env(safe-area-inset-bottom))] select-none">
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit} noValidate>
          {/* ── Input Card ── */}
          <div
            className={cn(
              "relative rounded-xl bg-card border transition-all duration-200 shadow-md",
              hasMessage
                ? "border-violet-500/40 dark:border-[#3B3B4F]"
                : "border-border hover:border-zinc-300 dark:hover:border-[#2E2E3A]",
              "focus-within:border-violet-500/60 focus-within:ring-1 focus-within:ring-violet-500/30",
            )}
          >
            {/* ── Textarea ── */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything or request technical reasoning..."
              rows={1}
              className={cn(
                "min-h-[50px] max-h-[180px] resize-none",
                "border-0 bg-transparent shadow-none",
                "px-3.5 pt-3 pb-2",
                "text-xs sm:text-sm text-foreground placeholder:text-muted-foreground",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "leading-relaxed overflow-x-hidden",
              )}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  await submitMessage();
                }
              }}
              aria-label="Message input"
            />

            {/* ── Toolbar Row ── */}
            <div className="flex items-center justify-between gap-2 px-3 pb-2.5 pt-1 min-w-0">
              {/* Model Selector */}
              <div className="flex items-center min-w-0 flex-1">
                {isPending ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary border border-border">
                    <Spinner className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">Loading models...</span>
                  </div>
                ) : (
                  <ModelSelector
                    models={models}
                    selectedModelId={activeModel}
                    onModelSelect={setSelectedModel}
                  />
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!hasMessage || isChatPending || !activeModel}
                size="sm"
                aria-label="Send message"
                className={cn(
                  "h-7 w-7 p-0 rounded-md shrink-0 transition-all duration-150 border-0",
                  "focus-visible:ring-1 focus-visible:ring-violet-500",
                  hasMessage && !isChatPending
                    ? "bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white shadow-sm"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                )}
              >
                {isChatPending ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </form>

        {/* Keyboard Hint */}
        <p className="mt-2 text-center text-[10px] text-muted-foreground hidden sm:block select-none font-mono">
          <kbd className="text-foreground">Enter</kbd> to send · <kbd className="text-foreground">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default ChatMessageForm;