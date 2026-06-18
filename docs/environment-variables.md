# Environment variables

## Required configuration

| Variable | Required | Consumer | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | Prisma config and `lib/db.ts` | PostgreSQL connection string |
| `GITHUB_CLIENT_ID` | Yes today | Central Zod config / Better Auth | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | Yes today | Central Zod config / Better Auth | GitHub OAuth secret |
| `GOOGLE_CLIENT_ID` | Yes today | Central Zod config / Better Auth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes today | Central Zod config / Better Auth | Google OAuth secret |
| `OPENROUTER_API_KEY` | Yes | Model and chat handlers | OpenRouter bearer credential |
| `BETTER_AUTH_SECRET` | Production-required | Better Auth convention | High-entropy signing/encryption secret |
| `BETTER_AUTH_URL` | Recommended | Better Auth convention | Canonical application origin |

Example:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/t3chat"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENROUTER_API_KEY="..."
BETTER_AUTH_SECRET="generate-a-strong-random-value"
BETTER_AUTH_URL="http://localhost:3000"
```

## Validation behavior

`config/config.ts` parses five provider variables at module load using Zod and throws if any is absent. Consequently, importing auth or AI configuration can fail the application build/start early. This fail-fast behavior is desirable, but the schema should eventually include all runtime variables and allow intentionally disabled OAuth providers.

`DATABASE_URL` is read directly because Prisma CLI loads it through `prisma.config.ts`; `BETTER_AUTH_*` variables are library conventions. Documenting these differences prevents developers from assuming the central schema is exhaustive.

## Secret management

- `.env*` is ignored by Git; never force-add it.
- Use hosting-platform secret stores in production.
- Use distinct values per local/preview/staging/production environment.
- Rotate exposed secrets immediately and revoke provider credentials.
- Never prefix these values with `NEXT_PUBLIC_`.
- Avoid printing parsed environment objects or full connection strings.

## Generating a secret

```bash
openssl rand -base64 32
```

## URL guidance

The current browser auth client hard-codes localhost. Prefer same-origin operation or a documented public URL variable. OAuth provider callback origins, Better Auth’s canonical URL, and the browser-visible application URL must agree.

