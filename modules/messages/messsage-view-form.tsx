"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useGetChatById } from "../chat/hooks/use-chats";
import { useAIModels } from "../chat/hooks/use-ai-models";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ModelSelector } from "../chat/components/chat-view/model-selector";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { NeuronPulse } from "@/components/brand";
import { ChatSkeleton } from "@/components/feedback/chat-skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DBMessage = {
  id: string;
  content: string;
  messageRole: "USER" | "ASSISTANT";
  createdAt: string | Date;
};

type MessagePartShape = {
  type: string;
  text?: string;
  [key: string]: unknown;
};

function parseMessageToUI(msg: DBMessage): UIMessage {
  const role: UIMessage["role"] =
    msg.messageRole === "USER" ? "user" : "assistant";

  const basePart = {
    type: "text" as const,
    text: msg.content,
  };

  try {
    const parts = JSON.parse(msg.content);

    return {
      id: msg.id,
      role,
      parts: Array.isArray(parts) ? parts : [basePart],
    } as UIMessage;
  } catch {
    return {
      id: msg.id,
      role,
      parts: [basePart],
    } as UIMessage;
  }
}

function MessagePart({
  part,
  messageId,
  partIndex,
  role,
  isStreaming,
}: {
  part: MessagePartShape;
  messageId: string;
  partIndex: number;
  role: UIMessage["role"];
  isStreaming: boolean;
}) {
  const key = `${messageId}-${partIndex}`;

  if (part.type === "text") {
    return (
      <Message from={role} key={key} className={role === "user" ? "items-end" : "items-start"}>
        <MessageContent
          className={cn(
            role === "user"
              ? "bg-secondary border border-border text-foreground rounded-xl px-4 py-2.5 max-w-[85%] text-xs sm:text-sm shadow-xs"
              : "text-foreground max-w-full text-xs sm:text-sm leading-relaxed"
          )}
        >
          <MessageResponse>{part.text || ""}</MessageResponse>
        </MessageContent>
      </Message>
    );
  }

  if (part.type === "reasoning") {
    return (
      <Reasoning
        className="max-w-2xl p-3.5 sm:p-4 border border-border/80 rounded-xl bg-secondary/30 dark:bg-card/50 text-xs text-muted-foreground my-2.5 shadow-xs"
        key={key}
        isStreaming={isStreaming}
      >
        <ReasoningTrigger className="text-muted-foreground hover:text-foreground font-mono text-[11px] sm:text-xs" />
        <ReasoningContent className="text-muted-foreground font-mono text-xs">
          {part.text ?? ""}
        </ReasoningContent>
      </Reasoning>
    );
  }

  if (part.type === "step-start" && partIndex > 0) {
    return (
      <div key={key} className="my-3 border-t border-border" />
    );
  }

  return null;
}

const MessageViewWithForm = ({ chatId }: { chatId: string }) => {
  const { data: chatData, isPending } = useGetChatById(chatId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <ChatSkeleton />
      </div>
    );
  }

  if (!chatData?.success || !chatData?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
        <div className="p-3 rounded-full bg-secondary border border-border text-muted-foreground">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Conversation not found</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          This conversation may have been deleted or you do not have permission to view it.
        </p>
      </div>
    );
  }

  const rawMessages = chatData.data.messages ?? [];

  const initialMessages: UIMessage[] = rawMessages
    .filter((m) => m?.id && m?.content?.trim())
    .map(parseMessageToUI);

  return (
    <ChatView
      chatId={chatId}
      initialMessages={initialMessages}
      initalModel={chatData.data.model}
    />
  );
};

const ChatView = ({
  chatId,
  initialMessages,
  initalModel,
}: {
  chatId: string;
  initialMessages: UIMessage[];
  initalModel: string | undefined;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";
  const hasAutoTriggered = useRef(false);

  const [selectedModel, setSelectedModel] = useState<string | undefined>(
    initalModel,
  );

  const { data: modelsData } = useAIModels();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const { messages, status, sendMessage, regenerate, stop, error } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
    onError: (err) => {
      console.error("Chat error:", err);
      toast.error("Failed to stream response from AI provider");
    },
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!shouldAutoTrigger) return;
    if (hasAutoTriggered.current) return;
    if (!selectedModel) return;
    if (messages.length === 0) return;
    if (messages.at(-1)?.role !== "user") return;

    hasAutoTriggered.current = true;

    regenerate({
      body: {
        chatId,
        model: selectedModel,
        skipUserMessage: true,
      },
    }).catch((err) => {
      console.error("Auto-trigger failed:", err);
      toast.error("Failed to generate response");
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("autoTrigger");
    const query = params.toString();

    router.replace(`/chat/${chatId}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [
    shouldAutoTrigger,
    selectedModel,
    messages,
    chatId,
    regenerate,
    router,
    searchParams,
  ]);

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text) return;
    if (!selectedModel) {
      toast.error("Please select a model");
      return;
    }

    if (isBusy) return;

    try {
      await sendMessage(
        { text },
        {
          body: {
            chatId,
            model: selectedModel,
            skipUserMessage: false,
          },
        },
      );
    } catch (err) {
      console.error("Send message failed:", err);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative size-full h-full flex flex-col justify-between overflow-hidden bg-background text-foreground transition-colors">
      <div className="flex flex-col h-full min-h-0 py-3 sm:py-4">
        {/* ── Conversation Message History ── */}
        <Conversation className="h-full flex-1 min-h-0">
          <ConversationContent className="space-y-4">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Conversation initialized"
                description="Send your prompt to start streaming thoughts and code."
              />
            ) : (
              messages.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => (
                    <MessagePart
                      key={`${message.id}-${i}`}
                      part={part as MessagePartShape}
                      messageId={message.id}
                      partIndex={i}
                      role={message.role}
                      isStreaming={
                        isBusy &&
                        message === messages.at(-1) &&
                        i === message.parts.length - 1
                      }
                    />
                  ))}
                </Fragment>
              ))
            )}

            {/* Neural Activity / Streaming Indicator */}
            {status === "submitted" && (
              <div className="flex items-center gap-2 py-2">
                <NeuronPulse size="sm" label="Synthesizing response..." />
              </div>
            )}

            {/* Error Banner with Inline Retry */}
            {error && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs my-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error.message || "An error occurred while streaming."}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => regenerate({ body: { chatId, model: selectedModel, skipUserMessage: true } })}
                  className="h-7 text-xs text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-500/20 gap-1 px-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </Button>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* ── Docked Composer ── */}
        <div className="shrink-0 pt-3">
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-xl bg-card border border-border focus-within:border-violet-500/50 shadow-md transition-all duration-150"
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Reply to Neuron or ask a follow-up..."
                disabled={isBusy}
                className="text-xs sm:text-sm text-foreground placeholder:text-muted-foreground min-h-[46px] max-h-[160px] bg-transparent border-0 px-3.5 pt-2.5 pb-1 focus-visible:ring-0 shadow-none leading-relaxed"
              />
            </PromptInputBody>

            <PromptInputFooter>
              <PromptInputTools className="flex items-center justify-between gap-2 w-full px-3 pb-2 pt-0.5">
                <div className="flex-1 min-w-0">
                  <ModelSelector
                    models={modelsData?.models ?? []}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedModel}
                  />
                </div>
                <PromptInputSubmit status={status} onStop={stop} />
              </PromptInputTools>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default MessageViewWithForm;
