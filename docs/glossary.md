# Glossary

| Term | Meaning in Neuron |
| --- | --- |
| AI Elements | Reusable UI components under `components/ai-elements` for prompts, messages, reasoning, and artifacts |
| AI SDK | Vercel’s provider-neutral library used for UI messages and streamed text generation |
| App Router | Next.js file-system router rooted at `app/` |
| Better Auth | Authentication library managing OAuth, sessions, and auth database records |
| Chat | A user-owned conversation containing a title, creation-time model, and messages |
| Client Component | React component marked `"use client"` and capable of browser state/effects/events |
| DAL | Data access layer; currently Prisma calls in auth/chat server modules |
| DefaultChatTransport | AI SDK browser transport posting `useChat` requests to `/api/chat` |
| Hydration | React attaching interactive behavior to server-rendered HTML |
| Message part | Structured AI SDK unit such as `text`, `reasoning`, or `step-start` |
| Modular monolith | One deployable application organized into internal feature modules |
| OpenRouter | External model gateway used for catalog discovery and inference |
| Prisma adapter | `PrismaPg`, which connects generated Prisma Client queries to `pg` |
| Query invalidation | Marking TanStack Query data stale so it refetches after mutation |
| Route group | Parenthesized App Router folder that organizes routes without changing URLs |
| Route Handler | HTTP endpoint implemented by `route.ts` |
| RSC | React Server Component, the default component type in App Router |
| Server Action | `"use server"` function callable through Next.js mutation transport |
| Session | Better Auth record/cookie pair identifying a logged-in user |
| Stream | Incremental AI response delivered before the complete answer exists |
| UIMessage | AI SDK client message containing a role, stable ID, and structured parts |

