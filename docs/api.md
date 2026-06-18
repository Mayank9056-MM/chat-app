# API and server interface

Neuron exposes three HTTP route groups plus internal Server Actions.

## HTTP endpoints

| Method/path | Authentication today | Purpose | Response |
| --- | --- | --- | --- |
| `GET/POST /api/auth/[...all]` | Better Auth-managed | OAuth, callbacks, sessions, sign-out | Provider redirects or auth JSON |
| `GET /api/ai/get-models` | None | Fetch and filter free OpenRouter models | `{ models: AIModel[] }` |
| `POST /api/chat` | None | Stream a model response and persist messages | AI SDK UI-message stream |

The lack of explicit session checks on the two AI handlers is a production blocker.

## Model catalog

The endpoint forwards a bearer-authenticated request to `https://openrouter.ai/api/v1/models`, retains entries whose prompt and completion prices parse to zero, and returns selected metadata.

Example:

```json
{
  "models": [{
    "id": "provider/model",
    "name": "provider/model",
    "description": "...",
    "context_length": 131072,
    "architecture": {},
    "pricing": {},
    "top_provider": {}
  }]
}
```

There is currently no response schema, timeout, cache policy, or rate limit. Upstream shape changes can break the selector.

## Chat stream

Request body:

```ts
type ChatRequest = {
  chatId: string;
  messages: UIMessage[];
  model: string;
  skipUserMessage?: boolean;
};
```

`skipUserMessage` is true only for the first auto-generated response because the creation action already stored that user message. The handler converts UI messages, applies the system prompt, streams OpenRouter output, and writes completed records in `onFinish`.

Errors before streaming return:

```json
{ "error": "Internal server error" }
```

Once streaming starts, HTTP status can no longer describe late persistence failures; those are logged.

## Server Actions

| Action | Input | Authorization | Effect |
| --- | --- | --- | --- |
| `currentUser` | none | Session optional | Returns selected user fields or `null` |
| `requireAuth` | none | Session required | Returns session or redirects |
| `requireUnAuth` | none | Anonymous required | Redirects signed-in users |
| `createChatWithMessage` | `{content, model}` | Current user | Creates chat and initial message |
| `getAllChats` | none | Current user | Returns owned chats and messages |
| `getChatById` | `chatId` | Current user + ownership | Returns one owned chat |
| `deleteChat` | `chatId` | Current user + ownership | Cascades chat deletion |

## Validation contract

Environment data is validated by Zod, but endpoint and action inputs are not. Production handlers should parse with schemas, reject unknown/oversized values, constrain model IDs to an allowlist, and return consistent error codes:

```ts
const chatRequestSchema = z.object({
  chatId: z.string().cuid(),
  messages: z.array(uiMessageSchema).min(1).max(200),
  model: z.string().min(1).max(200),
  skipUserMessage: z.boolean().optional(),
});
```

Also verify that `chatId` belongs to the current user before contacting OpenRouter or persisting records.

