"use client";

import React, { useEffect, useState } from "react";
import { useAIModels } from "../../hooks/use-ai-models";
import { Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ModelSelector } from "./model-selector";
import { useCreateChat } from "../../hooks/use-chats";
import { AIModel } from "@/types/ai-model";

type ChatMessageFormProps = {
  initialMessage: string;
  onMessageChange: () => void;
};

const ChatMessageForm = ({
  initialMessage,
  onMessageChange,
}: ChatMessageFormProps) => {
  const { data, isPending } = useAIModels();

  const models: AIModel[] | undefined = data?.models;

  const [selectedModel, setSelectedModel] = useState<string | undefined>(
    models?.[0]?.id,
  );

  const [message, setMessage] = useState("");
  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  useEffect(() => {
    if (!selectedModel && models?.length) {
      setSelectedModel(models[0].id);
    }
  }, [models, selectedModel]);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.();
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!selectedModel) {
        toast.error("Please select a model");
        return;
      }

      await mutateAsync({ content: message, model: selectedModel as string });
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setMessage("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <form onSubmit={handleSubmit}>
        <div
          className="relative rounded-2xl border-border shadow-sm transition-all
            "
        >
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your mesage here..."
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0 "
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t">
            {/* Model Selector */}
            <div className="flex items-center gap-1">
              {isPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <ModelSelector
                    models={models}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedModel}
                    className="ml-1"
                  />
                </>
              )}
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || isChatPending || !selectedModel}
              size="sm"
              variant={message.trim() ? "default" : "ghost"}
              className="h-8 w-8 p-0 rounded-full "
            >
              {isChatPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageForm;
