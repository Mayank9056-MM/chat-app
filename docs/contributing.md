# Contributing

## Development workflow

1. Create a focused branch from the current integration branch.
2. Install exact dependencies with `npm ci`.
3. Start PostgreSQL and apply migrations.
4. Make the smallest coherent change in the owning feature module.
5. Update documentation, schema, migrations, and environment guidance together.
6. Run the validation suite before opening a pull request.

```bash
docker compose up -d postgres
npx prisma migrate dev
npx prisma generate
npm run lint
npx tsc --noEmit
npm run build
```

## Architecture rules

- Read `AGENTS.md` and relevant bundled Next.js 16 docs before framework changes.
- Keep `app/` route files thin and feature logic under `modules/`.
- Default to Server Components; add `"use client"` only for state, effects, event handlers, or browser APIs.
- Do not call internal Route Handlers from Server Components.
- Authenticate and authorize every Server Action/Route Handler independently.
- Validate untrusted runtime input with Zod.
- Never wrap imports in `try/catch`.
- Do not edit generated Prisma client files.

## Database changes

Use descriptive migrations:

```bash
npx prisma migrate dev --name add_message_usage
npx prisma generate
```

Review generated SQL, preserve backward compatibility, and include deployment/rollback implications in the pull request.

## UI changes

Compose existing shadcn and AI Elements before creating new primitives. Use semantic color tokens, preserve keyboard behavior and dark mode, and verify responsive layouts. Include screenshots for perceptible web changes.

## Commit and pull request guidance

Use imperative, scoped commits such as:

```text
docs: add production architecture guide
fix(chat): authorize streaming requests
```

Pull requests should explain motivation, implementation, tradeoffs, security/data impact, tests, screenshots, and follow-up work. Keep unrelated cleanup separate.

## Testing expectations

The repository currently has no automated unit/integration suite. New behavior should add the appropriate level:

- Unit tests for parsers and validation schemas
- Integration tests for Server Actions and Prisma ownership
- Route tests for auth, validation, and streaming failure modes
- End-to-end tests for OAuth stubs, chat creation, streaming, and deletion

At minimum, lint, type-check, build, and manually smoke-test affected flows.

