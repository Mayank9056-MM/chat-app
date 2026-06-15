export type Chats = [
  {
    id: string;
    title: string;
    model: string;
    userId: string;
    messages: Messages;
    createdAt: Date;
    updatedAt: Date;
  },
];

export type Messages = [Message];

export type Message = {
  id: string;
  messageRole: string;
  messageType: string;
  content: string;
  model?: string | undefined;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
};
