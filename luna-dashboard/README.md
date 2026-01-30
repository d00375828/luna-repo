This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and wired to Supabase for auth + data.

## Local setup

1. Create a `.env.local` file in `luna-dashboard/` with:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   # Default is true while we build the UI
   NEXT_PUBLIC_DEV_BYPASS_AUTH=true
   ```

   The Supabase URL + anon key come from your project's settings. Keep the anon key scoped to the public anon key—admins stay in serverless workers.

2. Install deps and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Visit [http://localhost:3000](http://localhost:3000). The dashboard stays in “Dev Mode” while `NEXT_PUBLIC_DEV_BYPASS_AUTH=true`, which means Supabase auth + data calls are skipped so you can iterate on layout quickly.

## Dev mode surfaces

While Dev Mode is on we ship mock data from `src/data/dev/dashboardData.ts` to unblock layout work:

- **Navigation + hero** – gives PMs a quick readout of total tasks and repo status.
- **Activity feed** – shows pushes/PRs/deploys with relative timestamps.
- **Task board + composer** – add tasks, assign owners/repos/status, and highlight one task to see the auto-branch suggestion and file checklist.
- **Mind map** – interactive node graph that visualizes files/people/tasks/commits, highlights live editors, and links straight to the underlying files.
- **Repo detail pages** – go to `/repos/[slug]` (e.g. `/repos/luna-dashboard`) for per-repo files, activity, and open tasks.

## Supabase tables that power the dashboard

- `orgs`: populated by the Cloudflare worker whenever the GitHub App is installed. Displayed in the “Organizations” card.
- `repos`: linked to orgs and hydrated by GitHub installation + repository events. Displayed in the “Repositories” card.
- `webhook_events`: raw webhook audit trail. Recent events show up in “Recent Activity”.
- `users`: updated whenever someone signs up or logs in via the `/login` page. We upsert `{ id, email, full_name }` so you can join auth users with internal data.

Ensure each table either allows reads for authenticated users via RLS or expose the needed RPCs.

## Auth flow

- `/login` now supports both sign-in and sign-up. Creating an account calls `supabase.auth.signUp`, then mirrors the profile into `users`.
- Successful sign-in keeps the Supabase session in the browser. The dashboard uses that session to query the tables above.
- Use “Switch account” in the header to return to `/login`.

## Notes

- Fonts are powered by [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) (Geist family).
- Turbopack is configured via `next.config.mjs` to keep the workspace root scoped to `luna-dashboard`.
- Once the UI feels right, flip `NEXT_PUBLIC_DEV_BYPASS_AUTH=false` and re-enable the Supabase powered queries inside `src/app/page.tsx`.
