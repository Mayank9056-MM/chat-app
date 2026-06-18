# Frontend

## App Router structure

The root layout supplies global fonts, CSS, Query, theme, tooltips, and toast notifications. Route groups separate anonymous auth UI from the authenticated shell without changing URLs. Dynamic chat pages use Next.js 16’s promise-based `params`.

## Server versus Client Components

| Server Components | Client Components |
| --- | --- |
| Root and route-group layouts, route pages, header | Sign-in controls, sidebar, forms, selectors, transcript |
| Session resolution, redirects, composition | State, effects, router hooks, Query, AI streaming |

Pages stay thin and pass serializable data/identifiers into interactive features. This minimizes browser JavaScript while keeping database credentials and sessions on the server. The current home page fetches the user server-side; chat history is fetched by a hydrated Query hook.

## UI architecture

- `components/ui`: shadcn/Radix primitives with local source ownership.
- `components/ai-elements`: composable AI SDK renderers and prompt controls.
- `components/providers`: application-wide browser contexts.
- `modules/*/components`: feature-specific compositions.
- `app/globals.css`: Tailwind v4 imports, semantic tokens, radii, light/dark palettes.

The `cn` utility combines `clsx` and `tailwind-merge`, enabling variant components to accept safe class overrides.

## Styling conventions

- Prefer semantic tokens (`bg-background`, `text-muted-foreground`) over literal colors.
- Preserve dark-mode parity when adding tokens.
- Use shadcn variants before ad hoc class branches.
- Keep responsive sizing and accessible focus states.
- Use `next/image` for known image assets.

## Client state

Local state covers transient interaction: prompt text, active tab, selected model, search terms, dialogs, and auto-trigger guards. Remote data belongs to TanStack Query; live transcript state belongs to `useChat`. This ownership avoids duplicating one piece of state across stores.

## Loading and errors

Feature components show spinners, empty states, inline stream errors, and toasts. There are currently no App Router `loading.tsx`, `error.tsx`, `global-error.tsx`, or `not-found.tsx` files. Add route-level boundaries so failures remain recoverable and accessible.

## Accessibility

The primitives provide substantial keyboard/focus behavior, and icon-only controls generally include screen-reader text. New work should verify labels, focus restoration, contrast, reduced motion, mobile sidebar behavior, and streamed-content announcements.

