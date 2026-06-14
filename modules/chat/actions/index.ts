"use server";

import { prisma } from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { currentUser } from "@/modules/auth/actions";
import { User } from "@/modules/auth/types";
import { revalidatePath } from "next/cache";

interface ICreateChatWithMessage {
  content: string;
  model: string;
}

// Helpers

const requireUser = async (): Promise<User> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
};

// Main Actions

/**
 * Creates a new chat session and persists the user's initial message.
 * 
 * Flow:
 * 1. Validates the authenticated user.
 * 2. Generates a chat title from the first message
 * 3. Creates the chat and its inital message in a single transaction
 * 4. Revalidates the homepage cache so the new chat appears immediately.
 * 
 * @param content - Initial user message
 * @param model - AI model selected for the conversation 

 * @returns Success state with created chat data or an error message
 */
export async function createChatWithMessage({
  content,
  model,
}: ICreateChatWithMessage) {
  try {
    const user = await requireUser();

    const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");

    const chat = await prisma.chat.create({
      data: {
        title,
        model,
        userId: user?.id,
        messages: {
          create: {
            content,
            model,
            messageRole: MessageRole.USER,
            messageType: MessageType.NORMAL,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    revalidatePath("/", "page");

    if (!chat) {
      return {
        success: false,
        message: "Failed to create chat",
      };
    }

    return {
      success: true,
      data: chat,
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    return {
      success: false,
      message: "Failed to create chat",
    };
  }
}

/**
 * Retrieves all chats belonging to the authenticated user.
 *
 * Includes associated messages and returns chats ordered
 * by most recent creation date first.
 *
 * @returns Success response containing the user's chats,
 * or an error response if the request fails
 */
export async function getAllChats() {
  try {
    const user = await requireUser();

    const chats = await prisma.chat.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: chats,
    };
  } catch (error) {
    console.error("Error fetching chats:", error);
    return {
      success: false,
      message: "Failed to fetch chats",
    };
  }
}

/**
 * Retrieves a specific chat owned by the authenticated user.
 *
 * Includes all associated messages to provide the complete conversation history for the requested chat.
 *
 * @param chatId - Unique identifier for the chat to retrieve.
 * @returns Chat data on success or an error message
 */
export async function getChatById(chatId: string) {
  try {
    const user = await requireUser();

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: user?.id,
      },
      include: {
        messages: true,
      },
    });

    return {
      success: true,
      data: chat,
    };
  } catch (error) {
    console.error("Error fetching chat:", error);
    return {
      success: false,
      message: "Failed to fetch chat",
    };
  }
}

/**
 * Deletes a chat owned by the authenticated user.
 *
 * Ownership is verified to prevent users from deleting
 * conversation that do not belong to them.
 *
 * @param chatId - Unique identifier for the chat to delete.
 *
 * @returns Success status or an error response if the chat cannot be found or deleted.
 */
export async function deleteChat(chatId: string) {
  try {
    const user = await requireUser();

    const chat = await prisma.chat.delete({
      where: {
        id: chatId,
        userId: user?.id,
      },
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("Error deleting chat:", error);
    return {
      success: false,
      message: "Failed to delete chat",
    };
  }
}
