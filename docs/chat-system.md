# Chat system

## Responsibilities

The chat feature spans `modules/chat` (conversation lifecycle and navigation), `modules/messages` (active stream), `/api/chat` (provider transport), and Prisma (durable history).

## New conversation

1. The welcome view supplies suggestion tabs and a controlled prompt.
2. The user chooses a model from the OpenRouter-derived free list.
3. `useCreateChat` invokes `createChatWithMessage`.
4. Prisma creates the chat and initial user message together.
5. TanStack Query invalidates `["chats"]`.
6. Navigation adds `?autoTrigger=true`.
7. The transcript loads persisted data and calls `regenerate` with `skipUserMessage: true`.

```mermaid
flowchart TD
  Prompt --> Create[Create chat + first message]
  Create --> Navigate[/chat/id?autoTrigger=true]
  Navigate --> Load[Load persisted messages]
  Load --> Regenerate[AI SDK regenerate]
  Regenerate --> Stream[/api/chat stream]
  Stream --> Persist[Persist assistant message]
```

The auto-trigger ref prevents duplicate generation during React rerenders; removing the query parameter prevents generation after refresh/navigation.

## Continuing a conversation

`useChat` sends the new text and current UI-message history through `DefaultChatTransport`. The server stores the latest user message and resulting assistant message after completion. Client rendering supports `text`, `reasoning`, and `step-start` parts; unsupported parts are ignored.

## Persistence and reconstruction

`partsToJSON` normalizes both part-based and legacy content messages. On load, `parseMessageToUI` attempts JSON parsing and falls back to a text part. This preserves compatibility across the initial plain-text action and newer AI SDK persistence format.

## Model semantics

`chat.model` is the model selected at creation. Each `Message.model` records the model associated with that turn. The active selector can change during a conversation, so message-level storage is required for auditability. The chat row is not currently updated when the selection changes.

## Sidebar

The sidebar queries all owned chats, filters titles/message content locally, groups by creation date, identifies the active route, and deletes via a confirmation modal. Query invalidation refreshes the list.

## Known limitations

- `/api/chat` does not authenticate or verify chat ownership.
- Message order is not explicitly specified in Prisma reads.
- `handleSubmit` currently returns when `!isBuzy`; this condition appears inverted and can prevent normal sends.
- The entire history is sent on each turn with no token budgeting or summarization.
- No pagination, optimistic update, retry UI, edit/branch, attachment, or tool-call persistence exists.
- Stream aborts may leave UI and database histories different.

Treat these as implementation facts when debugging and as priorities before production launch.

