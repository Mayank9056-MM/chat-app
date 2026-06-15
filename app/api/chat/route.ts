import { prisma } from "@/lib/db";
import { MessageRole } from "@/lib/generated/prisma/enums";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";
import { convertToModelMessages, streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { config } from "@/config/config";
import { NextRequest } from "next/server";

const openRouter = createOpenRouter({
  apiKey: config.OPENROUTER_API_KEY,
});

/**
 * Convert DB messages to UI format from AI SDK
 *
 * @param msg
 * @returns Formatted UI message or null if no text parts are present.
 */
function dbMessageToUI(msg) {
  try {
    const parts = JSON.parse(msg.content);
    const textParts = parts.filter((p) => p.type === "text");

    if (textParts.length === 0) return null;

    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: textParts,
      createdAt: msg.createdAt,
    };
  } catch {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [{ type: "text", text: msg.content }],
      createdAt: msg.content,
    };
  }
}

/**
 * Convert message parts to JSON string for DB storage
 */
function partsToJSON(message) {
  if (Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }

  return JSON.stringify([
    {
      type: "text",
      text: message.content || "",
    },
  ]);
}

/**
 * Fallback conversion when AI SDK conversion fails
 */
function fallbackConversion(messages) {
  return messages
    .map((msg) => ({
      role: msg.role,
      content: msg.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("\n"),
    }))
    .filter((m) => m.content);
}

export async function POST(request: NextRequest) {
  try {
    const {
      chatId,
      messages: newMessages,
      model,
      skipUserMessage,
    } = await request.json();

    // Load previour messages from DB
    const dbMessages = await prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Convert to UI format and combine with new messages
    const previousUI = dbMessages.map(dbMessageToUI).filter(Boolean);
    const newUI = Array.isArray(newMessages) ? newMessages : [newMessages];
    const allMessages = [...previousUI, ...newUI];

    const modelMessages = await convertToModelMessages(allMessages);

    const result = streamText({
        model: openRouter.chat(model),
        system: CHAT_SYSTEM_PROMPT,
        messages: modelMessages
    });

    reutrn result.toUIMessageStream({
        sendReasoning: true,
        originalMessages: allMessages,
        onFinish: async ({responseMessage}) => {
            try {
                const messageToSave = [];

                if(!skipUserMessage){
                    const lastUserMsg = newUI[newUI.length = 1];

                    if(lastUserMsg?.role === "user"){
                        messageToSave.push({
                            chatId,
                            content: partsToJSON(lastUserMsg),
                            MessageRole: MessageRole.USER,
                            messageType: "NORMAL",
                            model
                        })
                    }
                }

                if(response.message?.parts?.lengt > 0){
                    messageToSave.push({
                            chatId,
                            content: partsToJSON(lastUserMsg),
                            MessageRole: MessageRole.ASSISTANT,
                            messageType: "NORMAL",
                            model
                    })
                }

                if(messageToSave.length > 0){
                    await prisma.message.createMany({data: messageToSave})
                }
            } catch (error) {
                console.error("Error saving message", error)
            }
        }
    })
  } catch (error) {
    console.error("Error creating chat", error);
    return Response.json(
        {error: (error as Error).message || "Internal server error"},
        {status: 500}
    )
  }
}
