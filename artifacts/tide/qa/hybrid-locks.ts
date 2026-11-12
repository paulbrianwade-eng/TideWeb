import assert from 'node:assert/strict';
import { createHybridLockCoordinator } from '../src/lib/hybrid';
import type { HybridLockIdentity, HybridLockRequest } from '../src/lib/hybrid';

const identity = (owner: string): HybridLockIdentity => ({ timerId: 'persisted-session:block-4', label: 'AMRAP', owner });
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const fakeWebLocks = () => {
  const host = {
    held: false,
    unavailable: 0,
    request: undefined as unknown as HybridLockRequest,
  };
  host.request = async (hold) => {
    await Promise.resolve();
    if (host.held) { host.unavailable++; await hold(false); return; }
    host.held = true;
    try { await hold(true); }
    finally {
      // Resolving the lease isn't an immediate browser unlock: model the
      // asynchronous host release that originally exposed the StrictMode race.
      await flush();
      host.held = false;
    }
  };
  return host;
};

const main = async () => {
  const host = fakeWebLocks();
  const claims: string[] = [];
  const acquire = createHybridLockCoordinator({ request: host.request, claim: (id) => { claims.push(id.owner); } });

  // React StrictMode setup -> cleanup -> setup before acquisition resolves.
  const first = new AbortController();
  const abandoned = acquire(identity('strict-old'), first.signal);
  const abandonedCheck = assert.rejects(abandoned, (e: Error) => e.name === 'AbortError');
  first.abort();
  const live = new AbortController();
  const releaseLive = await acquire(identity('strict-current'), live.signal);
  await abandonedCheck;
  assert.deepEqual(claims, ['strict-current']);
  assert.equal(host.unavailable, 0, 'old local acquisition cannot masquerade as another tab');

  // Reopen while an acquired lease is being asynchronously released.
  live.abort();
  const reopened = new AbortController();
  const releaseReopened = await acquire(identity('reopened'), reopened.signal);
  assert.equal(host.held, true);
  assert.equal(host.unavailable, 0, 'reopen waits for real release settlement');
  releaseLive(); // Idempotent late cleanup must not release the newer lease.
  assert.equal(host.held, true);

  // A genuinely different tab uses an independent coordinator but the same host.
  const otherTab = createHybridLockCoordinator({ request: host.request, claim: () => undefined });
  await assert.rejects(otherTab(identity('real-other-tab'), new AbortController().signal), /otra pestaña/);
  assert.equal(host.held, true, 'a failed competitor never steals the active tab lock');
  assert.equal(host.unavailable, 1);
  releaseReopened();
  await flush();
  const releaseOtherTab = await otherTab(identity('real-other-tab'), new AbortController().signal);
  releaseOtherTab();
  await flush();

  // Unmount while the host hasn't even invoked the lock callback yet.
  let openGate!: () => void;
  const gate = new Promise<void>((resolve) => { openGate = resolve; });
  const pendingHost = fakeWebLocks();
  let requests = 0;
  const pendingClaims: string[] = [];
  const pendingAcquire = createHybridLockCoordinator({
    request: async (hold) => { if (++requests === 1) await gate; return pendingHost.request(hold); },
    claim: (id) => { pendingClaims.push(id.owner); },
  });
  const unmounted = new AbortController();
  const pending = pendingAcquire(identity('unmounted-start'), unmounted.signal);
  const pendingCheck = assert.rejects(pending, (e: Error) => e.name === 'AbortError');
  await flush();
  unmounted.abort();
  const next = pendingAcquire(identity('next-mount'), new AbortController().signal);
  openGate();
  await pendingCheck;
  const releaseNext = await next;
  assert.deepEqual(pendingClaims, ['next-mount'], 'pending start/recover must never leak an orphaned held lease');
  assert.equal(pendingHost.unavailable, 0);
  releaseNext();
  await flush();

  // A claim/storage failure must also settle its host lock before the next try.
  const failureHost = fakeWebLocks();
  const failureAcquire = createHybridLockCoordinator({
    request: failureHost.request,
    claim: (id) => { if (id.owner === 'failure') throw new Error('Explicit storage failure'); },
  });
  const failed = failureAcquire(identity('failure'), new AbortController().signal);
  const failedCheck = assert.rejects(failed, /storage failure/);
  const recovered = failureAcquire(identity('after-failure'), new AbortController().signal);
  await failedCheck;
  const releaseRecovered = await recovered;
  assert.equal(failureHost.unavailable, 0);
  releaseRecovered();
  await flush();
  console.log('Hybrid lock QA passed: StrictMode pending cleanup, delayed unlock/reopen, orphaned async start cancellation, real cross-tab exclusion and failed-claim recovery.');
};
void main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
