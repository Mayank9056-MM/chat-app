export interface Message {
  id: string;
  messageRole: string;
  messageType: string;
  content: string;
  model: string | null;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Messages = Message[];

export type Chat = {
  id: string;
  title: string;
  model: string;
  userId: string;
  messages: Messages;
  createdAt: Date;
  updatedAt: Date;
};

export type Chats = Chat[];