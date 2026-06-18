# Troubleshooting

## Fast diagnostics

```bash
node --version
npm ci
npx prisma generate
npx prisma migrate status
npx tsc --noEmit
npm run lint
npm run build
```

## Prisma client cannot be found

**Symptoms:** imports under `lib/generated/prisma` fail.

**Fix:** run `npx prisma generate`. Generated output is intentionally ignored. Re-run after schema changes and ensure CI generates before type-check/build.

## Database connection errors

1. Run `docker compose ps` and `docker compose logs postgres`.
2. Verify `DATABASE_URL`, host, port, database, and credentials.
3. Test with `npx prisma migrate status`.
4. In containers, `localhost` refers to that container; use the database service hostname.
5. For managed PostgreSQL, verify TLS parameters, firewall rules, and pool limits.

## Migration errors

Do not edit an already-applied migration. Compare local and target migration state, restore backups before destructive repair, and use `prisma migrate resolve` only after understanding whether SQL was actually applied.

## “Invalid environment variables”

The central schema currently requires GitHub, Google, and OpenRouter credentials. Ensure all five OAuth/provider values exist before build/start. `DATABASE_URL` and Better Auth variables are additional requirements even though they are outside that schema.

## OAuth redirects to localhost or fails callback

`lib/auth-client.ts` currently hard-codes `http://localhost:3000`; change it to same-origin/production-safe configuration. Confirm the provider callback URL and `BETTER_AUTH_URL` exactly match the deployment origin and protocol.

## Signed-in user returns to sign-in

Check cookie domain, secure/SameSite behavior, reverse-proxy forwarded headers, system clock, session rows, canonical URL, and Better Auth secret consistency across instances.

## Model list is empty

Confirm the OpenRouter key, inspect `/api/ai/get-models`, and check upstream response status. The server intentionally returns only models with zero prompt and completion prices; OpenRouter may have no matching models or changed metadata.

## Messages do not send

Ensure a model is selected and inspect browser/network errors. The current transcript submit code checks `if (!isBuzy) return`, which appears inverted; idle submissions may be blocked. The first-message creation path also requires explicit model selection even when a first model is displayed.

## Streaming buffers or times out

- Confirm the hosting proxy supports chunked/streamed responses.
- Disable proxy buffering for `/api/chat`.
- Check provider/model availability and function duration limits.
- Inspect logs before and during `streamText`.
- Avoid middleware that reads or transforms the entire response body.

## Chat appears but assistant message is missing after refresh

Persistence happens in `onFinish`. Provider errors, aborts, process termination, or database failures after streaming can prevent the assistant write. Inspect `Error saving message` logs and database connectivity.

## Build failures

Build imports can trigger configuration validation. Supply required environment values, generate Prisma, run type-check separately, and use Node 22 to match CI. Note that the GitLab pipeline currently runs `npm tsx --noEmit`, likely a typo for `npx tsc --noEmit`.

