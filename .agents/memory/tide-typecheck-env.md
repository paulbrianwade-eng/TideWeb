---
name: TIDE typecheck under CPU load
description: Why `pnpm --filter @workspace/tide run typecheck` may hang, and how to verify instead.
---

When all artifact dev workflows are running (api-server build + 3 vite servers), `tsc -p tsconfig.json --noEmit` for an artifact can take >115s and repeatedly hit tool timeouts. This is CPU starvation, not a type error.

**Why:** Several node/vite/esbuild processes saturate the container CPU; a cold tsc pass is the casualty.

**How to apply:** For a data-only / shape-preserving change, trust these signals instead of fighting the timeout:
- Vite HMR hot-updates the changed modules with a clean browser console (no error overlay) — confirms it transpiles/imports fine.
- The `architect` code-review subagent can statically confirm interface conformance and ID uniqueness.
- Background `npx tsc` launched from a bash tool call does NOT survive across calls; even `setsid`+`disown` failed to produce output here. The pnpm-hoisted `tsc` lives at the workspace root `node_modules/.bin`, not in the artifact's local `node_modules/.bin`.
- Re-run a real `typecheck` later when contention is low for CI parity.
