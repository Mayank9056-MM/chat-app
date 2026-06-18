# Neuron

Neuron is an authenticated, multi-model AI chat application built on the Next.js 16 App Router. It discovers free models through OpenRouter, streams AI SDK responses into a React 19 interface, and persists user-owned conversations in PostgreSQL.

> **Project status:** active early-stage application. The core chat path works, but review the [security hardening backlog](docs/security.md#production-hardening-backlog) before exposing it publicly.

## Features

- GitHub and Google OAuth through Better Auth
- User-scoped conversation history, search, and deletion
- OpenRouter model discovery and searchable model metadata
- Streaming text and reasoning display through AI SDK UI messages
- PostgreSQL persistence with Prisma 7 and the `pg` driver adapter
- Responsive shadcn/ui component system, Tailwind CSS v4, and light/dark themes
- TanStack Query cache for chats, model metadata, and mutations

## Screenshots

Screenshots are not committed yet. Add stable captures to `docs/images/` and replace this section with:

```md
![Neuron welcome screen](docs/images/welcome.png)
![Neuron conversation](docs/images/conversation.png)
```

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.2 App Router, React 19.2, TypeScript |
| UI | Tailwind CSS v4, shadcn/ui, Radix UI, AI Elements |
| Server state | TanStack Query v5 |
| AI | AI SDK v6, `@ai-sdk/react`, OpenRouter provider |
| Authentication | Better Auth with GitHub and Google OAuth |
| Data | Prisma 7, PostgreSQL 17, `@prisma/adapter-pg` |
| Validation | Zod 4 (environment validation; request validation is pending) |

## Quick start

### Prerequisites

- Node.js 22 (the CI runtime; Node 20 is currently available locally)
- npm
- Docker with Compose, or another PostgreSQL instance
- GitHub and/or Google OAuth credentials
- An OpenRouter API key

```bash
git clone <repository-url>
cd chat-app
npm ci
docker compose up -d postgres
```

Create `.env.local`:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/t3chat"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENROUTER_API_KEY="..."
BETTER_AUTH_SECRET="replace-with-at-least-32-random-bytes"
BETTER_AUTH_URL="http://localhost:3000"
```

Then initialize and run the application:

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

Open <http://localhost:3000>. Configure OAuth callbacks according to Better Auth; the auth endpoint is rooted at `/api/auth`.

## Environment setup

All variables are server-only; none should use `NEXT_PUBLIC_`. The current Zod schema requires both OAuth providers even if only one is intended. `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `DATABASE_URL` are consumed by their respective libraries rather than the central schema. See [environment variables](docs/environment-variables.md).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Produce a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without emitting files |
| `npx prisma generate` | Generate the client into `lib/generated/prisma` |
| `npx prisma migrate dev` | Create/apply development migrations |
| `npx prisma migrate deploy` | Apply committed migrations in production |

## Folder structure

```text
app/          Routes, layouts, route handlers, and global styles
components/   Shared primitives, providers, and AI rendering elements
config/       Validated server configuration
hooks/        Cross-feature React hooks
lib/          Auth, database, prompt, generated client, and utilities
modules/      Feature modules for auth, chat, and messages
prisma/       Schema and migration history
public/       Static assets
types/        Shared TypeScript contracts
docs/         Architecture and operational documentation
```

Read the detailed [project structure guide](docs/project-structure.md).

## Architecture overview

```mermaid
flowchart LR
  B[Browser] --> N[Next.js App Router]
  N --> A[Better Auth]
  N --> S[Server Actions]
  N --> R[Route Handlers]
  S --> P[Prisma]
  A --> P
  R --> O[OpenRouter]
  R --> P
  P --> D[(PostgreSQL)]
```

Server layouts enforce page access, Server Actions own authenticated chat CRUD, and `/api/chat` streams provider output to `useChat`. TanStack Query coordinates client-side server state. See [architecture](docs/architecture.md), [chat system](docs/chat-system.md), and [AI integration](docs/ai-integration.md).

## Deployment

For Vercel, provision PostgreSQL, set all environment variables, run `npx prisma migrate deploy` as a release step, and deploy the Next.js project. For self-hosting, build with `npm run build`, run migrations, then serve with `npm run start` behind TLS. The repository’s Compose file starts PostgreSQL only; it is not a complete application image. See [deployment](docs/deployment.md).

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Authentication](docs/authentication.md)
- [Database](docs/database.md)
- [Chat system](docs/chat-system.md)
- [AI integration](docs/ai-integration.md)
- [Frontend](docs/frontend.md)
- [State management](docs/state-management.md)
- [Security](docs/security.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Glossary](docs/glossary.md)

## Contributing

Create a focused branch, preserve feature boundaries, add tests where feasible, and run lint, type-check, Prisma generation, and build before opening a pull request. Never commit `.env*` files or generated Prisma output. Read [CONTRIBUTING](docs/contributing.md) for the full workflow.
