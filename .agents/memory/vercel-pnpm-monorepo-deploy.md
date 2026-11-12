---
name: Vercel deploy of one artifact from this pnpm monorepo
description: How to deploy a single artifact (e.g. TIDE) to Vercel without breaking on catalog:/workspace deps
---

# Deploying one artifact to Vercel from the pnpm monorepo

**Rule:** Do NOT point Vercel's Root Directory at the artifact subfolder. Set Root Directory to the **repo root** and drive everything from a root-level `vercel.json`:
- `installCommand: "pnpm install"` (runs at root → resolves `catalog:` and `workspace:*`)
- `buildCommand: "pnpm --filter @workspace/<slug> run build"`
- `outputDirectory: "artifacts/<slug>/dist/public"` (Vite here outputs to `dist/public`, NOT `dist`)
- `framework: null` (stops Vercel auto-detecting some other artifact like mockup-sandbox)

**Why:** Building only a subfolder breaks because `catalog:` versions and `workspace:*` packages are defined in the root `pnpm-workspace.yaml`; a subfolder install can't resolve them. The "Vercel busca en mockup-sandbox" symptom = Root Directory was set to the wrong subfolder.

**Also:** every artifact's `vite.config.ts` originally `throw`s if `PORT`/`BASE_PATH` are missing (Replit sets them; Vercel does not). Make these optional with defaults (`port = rawPort ? Number(rawPort) : 5173`, `basePath = process.env.BASE_PATH ?? "/"`) or the Vercel build dies before bundling. bigg-at-home's config still throws — harden it too if it ever becomes a deploy target.

**Push note:** `git push origin` works through Replit's secure GitHub proxy in this workspace. A push can update GitHub successfully but exit nonzero when its follow-up local tracking-ref write is blocked; verify the remote SHA with `git ls-remote` before retrying.

**Why:** Treating that post-push guard error as a failed upload can cause unnecessary repeated pushes; the remote ref is the source of truth.

**How to apply:** Compare the exact remote ref with the pushed commit after any GitHub upload, and never force-push to bypass a guard.

**Preview URL fallback:** If the Vercel connector cannot list a team project, GitHub deployment statuses for the exact commit SHA can still return the app's preview URL. Use `environment_url` from a successful TIDE status, not the Vercel dashboard's `target_url`.

**Why:** The connected Vercel account could not list its team, but GitHub still reported a successful TIDE deployment and its direct URL.

**How to apply:** Query deployments by full commit SHA, then inspect their statuses; share a direct `environment_url` only when that deployment reports `success`.
