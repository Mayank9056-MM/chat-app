# Security

## Current controls

| Area | Implemented control |
| --- | --- |
| Authentication | Better Auth OAuth and database sessions |
| Page access | Authenticated/anonymous route-group layout redirects |
| Chat CRUD authorization | Current-user resolution and `userId` ownership predicates |
| SQL injection | Prisma parameterized query generation |
| Secret isolation | Provider credentials are read in server modules |
| Environment validation | Zod fail-fast checks for OAuth/OpenRouter values |
| Data lifecycle | Cascading deletion for user/chat dependents |
| XSS baseline | React escaping; structured markdown renderer rather than raw interpolation |

## Trust boundaries

Browser input, URL parameters, AI-generated content, OpenRouter metadata, OAuth callbacks, and all request headers are untrusted. TypeScript interfaces do not validate runtime input.

## Authentication and session security

Use HTTPS, a high-entropy Better Auth secret, exact callback URLs, trusted-origin restrictions, secure cookie settings, and short/revocable sessions appropriate to risk. Protect account/provider tokens from client serialization. Layout redirects are not authorization; every server operation must verify the session.

## Input validation

The central environment schema is the only current Zod validation. Add schemas to all actions and handlers. Bound prompt size, message count, IDs, model names, and provider response fields. Reject unknown keys and malformed UI parts.

## SQL injection

Prisma protects current query construction by parameterization. This guarantee can be lost if future code uses `$queryRawUnsafe` or interpolated SQL. Prefer Prisma APIs or tagged `$queryRaw` and still enforce authorization.

## XSS and AI content

React escapes strings, while AI Elements/Streamdown render rich markdown and code. Keep dependencies patched, do not enable unsanitized HTML, sanitize any future HTML/artifact previews, and apply a Content Security Policy. Treat model output as attacker-controlled because prompts can request executable markup.

## CSRF

Better Auth should provide its documented cookie/origin protections, but custom mutations still need review. Server Actions have framework origin protections; Route Handlers must authenticate and validate origin/content type where appropriate. SameSite cookies do not replace authorization.

## Production hardening backlog

### Critical

1. Authenticate `/api/chat` and verify `chatId` ownership.
2. Authenticate or deliberately rate-limit `/api/ai/get-models`.
3. Add Zod request/response validation.
4. Remove the hard-coded localhost auth base URL.
5. Add per-user/IP AI rate limits, quotas, and concurrency controls.

### High

- Constrain model selection to an approved catalog.
- Add prompt/message/token size limits and provider timeouts.
- Add CSP, security headers, and a dependency scanning/update process.
- Decide data retention, deletion, privacy, and AI-provider disclosure policies.
- Avoid exposing raw internal errors to clients.
- Add audit/structured logs without prompt, token, or secret leakage.

### Defense in depth

- Add `server-only` imports to secret/database modules.
- Encrypt especially sensitive provider tokens at rest where required.
- Use least-privilege database credentials and network restrictions.
- Test cross-user access, session expiry, stream abuse, and deletion.
- Review whether reasoning parts should be transmitted or persisted.

## Security response

Do not disclose vulnerabilities in public issues. Establish a private reporting channel and document supported versions before public release.

