# State management

Neuron deliberately uses three state mechanisms rather than one global store.

| State class | Owner | Examples |
| --- | --- | --- |
| Server state | TanStack Query | Chat lists, one chat, model catalog |
| Streaming conversation state | AI SDK `useChat` | Messages, status, stop, regenerate, stream error |
| Ephemeral view state | React `useState`/refs | Search, selected model, modal, prompt, active tab |

## Query provider

`QueryProvider` creates one `QueryClient` per browser application instance with lazy `useState`, preventing recreation on rerender. No custom defaults are configured, so TanStack Query’s standard stale, retry, and garbage-collection behavior applies.

## Query keys

| Key | Data |
| --- | --- |
| `["ai-models"]` | Filtered OpenRouter catalog |
| `["chats"]` | Current user’s conversations |
| `["chats", chatId]` | One owned conversation with messages |

Keys are hierarchical, making broad chat invalidation straightforward.

## Mutations and invalidation

Creating a chat invalidates `["chats"]` then navigates to the new route. Deleting invalidates the same key. There are no optimistic updates; this avoids rollback complexity but makes UI confirmation dependent on a round trip.

## Loading and errors

Query `isPending` drives spinners. Mutation errors are logged and surfaced through Sonner. Action-level `{success:false}` responses do not automatically enter Query’s `onError`, because the promise resolves; callers must inspect `success`. For a consistent contract, throw typed errors from actions or centralize result handling.

## Cache strategy recommendations

- Give the model catalog a long `staleTime`; it changes less frequently than chats.
- Keep user-specific queries isolated by session and clear Query cache on logout.
- Invalidate `["chats", chatId]` after persisted stream completion if Query data must reflect it.
- Paginate chat history and transcript data.
- Consider server-prefetch/dehydration only when it materially improves first paint; avoid duplicate server/action fetches.
- Do not put in-progress AI messages into the Query cache unless one synchronization owner is defined.

