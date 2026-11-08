# Validation report

Executed 8 November 2026 in the managed Linux workspace.

## Build and dependencies

- Node 24.22.1, npm 11.9.0.
- Three.js 0.187.0, Rapier 0.21.0, Vite 8.3.6, Playwright 1.65.0.
- Dependency installation completed; dependency lockfile included.
- `npm run dev` started and served the actual WebGL game on port 5173.
- `npm run build` succeeded. Main JS: 4,937.9 kB uncompressed / approximately 1,823.4 kB gzip, mostly bundled physics/WASM and rendering libraries. Vite reports a large-chunk advisory, not a build error.
- `npm run preview -- --port 4173` started successfully.
- The final browser suite ran against the production preview with `?test=1`.

## Executed tests

`npm test`: one real Rapier integration test passed, asserting capsule grounding, blocking at a wall, jump height and landing.

`TEST_URL='http://localhost:4173/?test=1' node tests/browser.mjs`: **21 checks passed** in Chromium using SwiftShader WebGL2:

1. Browser loads WebGL2 scene and main menu.
2. Play and grounded idle.
3. Camera-relative walking and acceleration.
4. Keyboard sprint is faster than walking.
5. Space jumps, falls, lands and changes animation state.
6. Mouse drag orbits and wheel zooms.
7. Wall collision blocks escape.
8. Training ramp climbs onto raised platform.
9. Camera collision shortens orbit near walls.
10. Web Audio context starts after Play gesture.
11. Food/water recharge increases energy.
12. Toy interaction starts bouncing ball.
13. Rest interaction changes resting state.
14. Training interaction collects a beacon.
15. Discovery interaction records the memory.
16. Pause and resume controls.
17. Graphics presets, sensitivity, zoom, volume and fullscreen controls.
18. Return to menu and credits.
19. Narrow 390 × 844 viewport has no horizontal overflow.
20. Settings persist after reload.
21. No page errors, HTTP asset failures or failed network requests.

The suite combines real Playwright keyboard/pointer/UI actions with deterministic simulation stepping and controlled test positions. It does not claim a human played every route end to end. Development hot reload interrupted asset requests during an earlier run; the final stable production test had zero failures.

## Visual review and performance

Desktop menu/game screenshots were captured and reviewed. Original robot proportions, UI, procedural scene, exposure, and font delivery were checked. Fonts were moved from a network import into the build after a certificate error. An indexed/nonindexed geometry batching mismatch and a narrow-screen overflow were fixed before final production tests.

The cloud browser uses CPU software rendering (SwiftShader), which is much slower than a desktop GPU; early medium-preset wall-clock observations were below 2 FPS. No hardware 60 FPS claim is made. Low removes shadows; Medium uses 1024px shadows; High uses 2048px shadows and bloom. Static geometry is batched, common geometry/materials are reused, and render resolution adapts to measured wall-clock FPS. Test screenshots and correctness checks do not constitute a hardware benchmark.

## Not verified

Windows 11 was not available for execution; standard Node/Vite commands and platform-neutral source are provided. No public host deployment was performed. Audio context operation was checked, but synthesized audio was not auditioned through speakers. No mobile touch-control support is claimed. Complete session progress is intentionally not saved. Fullscreen passed in standalone Chromium but may be restricted inside embedded views.
