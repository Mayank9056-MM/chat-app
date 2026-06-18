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

type ChatMessageFormProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const ChatMessageForm = ({ message, setMessage }: ChatMessageFormProps) => {
  const { data, isPending } = useAIModels();
  const models = data?.models ?? [];

  const [selectedModel, setSelectedModel] = useState<string>();
  const activeModel = selectedModel ?? models[0]?.id;

  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  const hasMessage = message.trim().length > 0;

  const submitMessage = async () => {
    if (!selectedModel) {
      toast.error("Please select a model");
      return;
    }

    await mutateAsync({
      content: message,
      model: activeModel,
    });

    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await submitMessage();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  if (!activeModel) {
    toast.error("Please select a model");
    return;
  }

  return (
    <div className="w-full px-4 pb-6 pt-2">
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Input card */}
          <div
            className={`
              relative rounded-2xl
              bg-zinc-900/80 backdrop-blur-md
              border transition-all duration-200
              shadow-lg shadow-black/30
              ${hasMessage
                ? "border-white/[0.12]"
                : "border-white/[0.07] hover:border-white/[0.10]"
              }
              focus-within:border-indigo-500/50 focus-within:shadow-indigo-950/40
            `}
          >
            {/* Textarea */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything…"
              className="
                min-h-[56px] max-h-[200px] resize-none
                border-0 bg-transparent
                px-4 pt-4 pb-2
                text-sm text-zinc-100 placeholder:text-zinc-600
                focus-visible:ring-0 focus-visible:ring-offset-0
                leading-relaxed
              "
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  await submitMessage();
                }
              }}
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
              {/* Model selector */}
              <div className="flex items-center">
                {isPending ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <Spinner className="h-3 w-3 text-zinc-500" />
                    <span className="text-xs text-zinc-600">Loading models…</span>
                  </div>
                ) : (
                  <ModelSelector
                    models={models}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedModel}
                  />
                )}
              </div>

              {/* Send button */}
              <Button
                type="submit"
                disabled={!hasMessage || isChatPending || !selectedModel}
                size="sm"
                className={`
                  h-8 w-8 p-0 rounded-full flex-shrink-0
                  transition-all duration-150
                  ${hasMessage && !isChatPending
                    ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-900/50"
                    : "bg-white/[0.06] text-zinc-600 cursor-not-allowed"
                  }
                  border-0
                  focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
                `}
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

        {/* Hint text */}
        <p className="mt-2.5 text-center text-[11px] text-zinc-700">
          Press <kbd className="font-sans text-zinc-600">Enter</kbd> to send · <kbd className="font-sans text-zinc-600">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default ChatMessageForm;