export type Chats = [
  {
    id: string;
    title: string;
    model: string;
    userId: string;
    messages: [
      {
        id: string;
        messageRole: string;
        messageType: string;
        content: string;
        model?: string;

        chatId: string;

        createdAt: Date;
        updatedAt: Date;
      },
    ];
    createdAt: Date;
    updatedAt: Date;
  },
];
