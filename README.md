# Cache Components + loading.tsx Bug Reproduction

This is a minimal reproduction for a Next.js bug where **ISR/caching stops working when `loading.tsx` is present**.

## Bug Description

When using Next.js 16 with `cacheComponents: true` and a `loading.tsx` file (which creates a Suspense boundary), the `"use cache"` directive with `  cacheLife("minutes")` is not being honored for dynamically generated routes. Instead of caching the result after the first request, the page re-executes on every subsequent request, showing the loading state each time.

### Expected Behavior

For routes with `"use cache"` and `  cacheLife("minutes")`:
1. First visit to a dynamic route (e.g., `/posts/2`) → shows loading, fetches data, renders page, **caches result**
2. Subsequent visits → serves **cached content directly** (no loading shown, timestamp unchanged)

### Actual Behavior (with loading.tsx)

1. First visit to `/posts/2` → shows loading, fetches data, renders page
2. Subsequent visits → **shows loading again**, re-executes the page component (timestamp changes on each visit)

The presence of `loading.tsx` appears to trigger Partial Prerendering (PPR) mode, and the caching behavior breaks for the dynamic content.

### Environment-Specific Behavior

The behavior varies across different Next.js runtime environments:

**Development mode (`npm run dev`)**
- Loading state is **never shown** (unexpected)
- Caching **works correctly**

**Local production mode (`npm run start`)**
- Loading state is **always shown** for a few miliseconds
- Caching **works correctly** (content is cached after first request)
- The loading.tsx is displayed during the initial fetch, but cached content is served on subsequent requests. The computation is running just once and being cached.

**Vercel production environment**
- Loading state appears on every request
- Caching is **broken** (pages re-execute on each visit)
- This is where the primary bug manifests

### Working Correctly (without loading.tsx)

Routes in `/posts-no-loading/[id]` (identical code, no `loading.tsx`) work as expected:
- First visit → ISR cache miss, generates page
- Subsequent visits → serves from cache (timestamp stays the same)

## Observations from Vercel Logs

- `/posts-no-loading/[id]` → Shows "ISR Function Invocation" with "ISR Cache Miss" (standard ISR)
- `/posts/[id]` → Shows "Cache: Partial Prerender" with status "PRERENDER" (PPR mode)

The PPR mode seems to be breaking the `"use cache"` behavior for the dynamic segment.

## Setup

This reproduction uses:
- Next.js `canary` (verified against latest)
- `cacheComponents: true` in `next.config.ts`
- `"use cache"` directive with `  cacheLife("minutes")`
- `generateStaticParams` returning `[{ id: "1" }]` for build-time generation
- 5-second delay to make the issue more obvious

## How to Reproduce

1. Install dependencies:
```bash
npm install
```

2. Build the app:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

4. Test the bug:
   - Visit `/posts/2` (with loading.tsx)
   - Wait 5 seconds for it to load
   - **Refresh the page** → Notice "Loading..." appears again and timestamp changes
   - Visit `/posts-no-loading/2` (without loading.tsx)
   - Wait 5 seconds for it to load
   - **Refresh the page** → Content loads instantly, timestamp is the same (cached)

## Key Files

- `app/posts/[id]/page.tsx` - Route WITH `loading.tsx` (broken caching)
- `app/posts/[id]/loading.tsx` - The loading component that triggers the bug
- `app/posts-no-loading/[id]/page.tsx` - Route WITHOUT `loading.tsx` (working correctly)
- `next.config.ts` - Has `cacheComponents: true`

## Note

Static generation at build time (post ID 1) works correctly even with `loading.tsx`. The bug only affects dynamically generated routes that should be cached via ISR.

## Links

- Next.js Issue: [Link to issue]
- Deployed reproduction: [Link to Vercel deployment]
