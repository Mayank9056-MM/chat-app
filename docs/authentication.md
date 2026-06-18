# Authentication

## Overview

Better Auth handles OAuth, session cookies, provider accounts, and persistence through its Prisma adapter. GitHub and Google are configured in `lib/auth.ts`; the catch-all handler exposes Better Auth under `/api/auth/[...all]`. Browser calls use `authClient`.

## Login flow

1. The `(auth)` layout calls `requireUnAuth`; authenticated users are redirected home.
2. The sign-in page calls `authClient.signIn.social` with `github` or `google`.
3. Better Auth redirects to the provider and handles the callback.
4. Better Auth creates/updates `User`, `Account`, and `Session`.
5. The browser receives the session cookie and returns to `/`.
6. The `(root)` layout calls `requireAuth`, then renders the application shell.

```mermaid
flowchart LR
  SignIn --> Client[authClient.signIn.social]
  Client --> Handler[/api/auth/*]
  Handler --> Provider[GitHub / Google]
  Provider --> Handler
  Handler --> DB[(Auth tables)]
  Handler --> Cookie[Session cookie]
  Cookie --> Protected[Protected layout]
```

## Session handling

Server code resolves sessions with:

```ts
const session = await auth.api.getSession({
  headers: await headers(),
});
```

Passing request headers allows Better Auth to read the cookie in the current request. `currentUser` then performs a narrowed Prisma query and returns only UI-required fields.

## Protected routes

There is no `proxy.ts`/middleware. Protection is implemented with route-group layouts:

- `(root)/layout.tsx` redirects anonymous users to `/sign-in`.
- `(auth)/layout.tsx` redirects authenticated users to `/`.
- Chat Server Actions call `requireUser` independently and scope data by `userId`.

This is intentional defense in depth: layouts improve navigation UX, while each data operation enforces authorization.

## Logout flow

`UserButton` calls `authClient.signOut()`. On success it navigates to `sign-in`; the Better Auth endpoint invalidates the active session. Prefer `router.replace("/sign-in")` and `router.refresh()` in future work so protected content is not retained in browser history.

## Configuration caveat

`lib/auth-client.ts` currently hard-codes `http://localhost:3000`. That is unsuitable for previews and production. Prefer same-origin defaults or a validated public application URL. Better Auth should also receive an explicit high-entropy secret and trusted production URL through environment configuration.

## OAuth setup

Register provider applications with callback URLs rooted at the deployed Better Auth endpoint. Keep client secrets server-only. Use separate OAuth applications for local, preview, and production environments when provider policy or callback restrictions require it.

## Security considerations

- Use HTTPS in production so secure cookies are effective.
- Rotate `BETTER_AUTH_SECRET` and provider secrets through the hosting platform.
- Restrict trusted origins and callback URLs.
- Do not expose provider access/refresh tokens to Client Components.
- Keep session and account cascade behavior when deleting users.
- Add rate limiting and audit logging to authentication endpoints.
- The current `/api/chat` and model catalog handlers do not call `getSession`; add explicit authentication before public deployment.

