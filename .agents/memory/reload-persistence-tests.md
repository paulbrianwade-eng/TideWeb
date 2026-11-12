---
name: Reload persistence tests
description: Prevent false data-loss results when testing localStorage across a browser reload.
---

Clear localStorage exactly once after the first navigation, then initialize the app and use a direct page reload for the persistence assertion. Do not install storage clearing as an initialization script.

**Why:** Browser initialization scripts run on every document load, including reloads. A clear operation there erases the fixture immediately before the app reads it and falsely looks like an application persistence defect.

**How to apply:** For any reload roundtrip test, create a fresh context, navigate once, clear storage through a one-time page evaluation, reload to initialize clean state, write data, then reload directly without clearing or recreating the context.