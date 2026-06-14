"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useGetChatById } from "../chat/hooks/use-chats";
import { useAIModels } from "../chat/hooks/use-ai-models";
import { Spinner } from "@/components/ui/spinner";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ModelSelector } from "../chat/components/chat-view/model-selector";
import { RotateCcwIcon, StopCircleIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
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

function parseMessageToUI(msg: {
  id: string;
  messageRole: string;
  content: string;
  createdAt: Date;
}) {
  const basePart = {
    type: "text",
    text: msg.content,
  };

  try {
    const parts = JSON.parse(msg.content);
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: Array.isArray(parts) ? parts : [basePart],
      createdAt: msg.createdAt,
    };
  } catch {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [basePart],
      createdAt: msg.createdAt,
    };
  }
}

function MessagePart({
  part,
  messageId,
  partIndex,
  role,
}: {
  part: {
    type: string;
    text: string;
  };
  messageId: string;
  partIndex: number;
  role: "user" | "system" | "assistant";
}) {
  const key = `${messageId}-${partIndex}`;

  if (part.type === "text") {
    return (
      <Message from={role} key={key}>
        <MessageContent>
          <MessageResponse>{part.text}</MessageResponse>
        </MessageContent>
      </Message>
    );
  }

  if (part.type === "reasoning") {
    return (
      <Reasoning
        className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
        key={key}
      >
        <ReasoningTrigger />
        <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
          {part.text}
        </ReasoningContent>
      </Reasoning>
    );
  }

  if (part.type === "step-start" && partIndex > 0) {
    return (
      <div key={key} className="my-4 text-gray-500">
        <hr className="border-gray-300" />
      </div>
    );
  }

  return null;
}

const MessageViewWithFrom = ({ chatId }: { chatId: string }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";
  const hasAutoTrigger = useRef(false);

  const [selectedModel, setSelectedmodel] = useState<string | undefined>(
    undefined,
  );
  const [input, setInput] = useState("");

  const { data: models, isPending: isModelsPending } = useAIModels();
  const { data, isPending } = useGetChatById(chatId);

  const initialMessages = useMemo(() => {
    if (!data?.data?.messages) return [];

    return data.data.messages
      .filter((msg) => msg.content?.trim() && msg.id)
      .map(parseMessageToUI);
  }, [data]);

  useEffect(() => {
    if (data?.data?.model && !selectedModel) {
      setSelectedmodel(data.data.model);
    }
  }, [data, selectedModel]);

  const handleSubmit = () => {};
  const isSteaming = false;
  const allMessages = [...initialMessages];

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        {/* Messsages */}
        <Conversation className="h-full">
          <ConversationContent>
            {allMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Start a coversation...
              </div>
            ) : (
              allMessages.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => (
                    <MessagePart
                      key={`${message.id}-${i}`}
                      part={part}
                      messageId={message.id}
                      partIndex={i}
                      role={message.role}
                    />
                  ))}
                </Fragment>
              ))
            )}
          </ConversationContent>
        </Conversation>

        {/* Input */}
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={false}
            />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools className="flex items-center gap-2 w-full">
              <div>
                {isModelsPending ? (
                  <Spinner />
                ) : (
                  <ModelSelector
                    models={models?.models}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedmodel}
                  />
                )}
              </div>
              <PromptInputSubmit status="ready" />
            </PromptInputTools>
          </PromptInputFooter>

          {/* {
        isSteaming ? (
            <PromptInputButton onClick={stop}>
                  <StopCircleIcon size={16} />
                  <span>Stop</span>
            </PromptInputButton>
        ) : (
            allMessages.length > 0 && (
                <PromptInputButton onClick={regenerate}>
                    <RotateCcwIcon size={16} />
                    <span>Retry</span>
                </PromptInputButton>
            )
        )
    } */}
        </PromptInput>
      </div>
    </div>
  );
};

export default MessageViewWithFrom;
