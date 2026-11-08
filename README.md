# ROBOTIC DOG SIMULATOR

**Pawtek Sanctuary** — a cozy, playable desktop browser game starring Pip, a procedurally modeled robotic dog. Explore six indoor areas, collect three training beacons and a hidden memory, play with an orbit ball, rest, and recharge.

## Windows 11 quick start

1. Install **Node.js 22.12+ LTS** from https://nodejs.org/ (includes npm).
2. Download this repository using **Code → Download ZIP**, extract it, and open Terminal in the extracted directory.
3. Run:

```powershell
npm install
npm run dev
```

Open the localhost URL printed by Vite in current Chrome or Edge. Enable browser hardware acceleration. This game requires WebGL2, a keyboard and mouse. No VPS, account, backend, or paid hosting is needed. Fonts, art, physics and sound are bundled or generated locally; gameplay makes no external service requests.

## Controls

| Control | Action |
|---|---|
| W A S D | Camera-relative movement |
| Shift | Sprint |
| Space | Jump; wake from rest |
| Drag mouse | Orbit camera |
| Mouse wheel | Zoom |
| E | Use nearby highlighted interaction |
| Esc | Pause/resume or close menu dialog |

The HUD shows energy, joy, location, animation state, actual frame rate, and exploration objectives. Energy and joy are relaxed sandbox stats, without failure penalties. Progress lasts for the current page session. Settings persist locally.

## Production

```powershell
npm run build
npm run preview
```

Vite generates **dist/**. Open the preview URL, not `dist/index.html` through `file://`: browser modules require an HTTP server. Relative asset URLs support subdirectory hosting. The main bundle contains the embedded Rapier WASM runtime, approximately 1.8 MB gzipped before fonts. Node is used for development/building only.

## Free static deployment

### Cloudflare Pages (recommended)

Connect your GitHub account at Cloudflare → Workers & Pages → Create → Pages → Import an existing Git repository. Select this repository, choose Vite, set build command **npm run build**, output directory **dist**, and Node version **22**. Deploy. Alternatively build locally and upload `dist` through Pages Direct Upload. Cloudflare returns the actual public URL after successful deployment.

### Vercel / Netlify

Import this repository. Included `vercel.json` and `netlify.toml` configure the production build and `dist` output. Their free plans can host this static game subject to provider limits. No environment variables or server secrets are required.

No public deployment is claimed by this source release.

## Architecture

- `src/core`: lifecycle, fixed-timestep loop, PBR renderer, quality presets, adaptive resolution.
- `src/character`: original articulated dog, procedural animation, acceleration, jump and landing.
- `src/physics`: Rapier kinematic capsule, ground snapping, autostep, solid walls and props.
- `src/camera`: smoothed orbit/follow, zoom, obstacle raycasting.
- `src/world`: six areas, procedural props, baked static geometry batches.
- `src/controls`: keyboard and pointer events with cleanup.
- `src/interaction`: distance/height-aware activities and scout objectives.
- `src/audio`: original Web Audio ambient melody and synthesized effects.
- `src/ui`: loading, menu, HUD, pause, settings, credits, contextual prompts.

Three.js and Rapier are the only gameplay libraries. Vanilla JavaScript ES modules, HTML, CSS, WebGL2 and Vite; no frontend framework. PBR, environment reflections, antialiasing, tone mapping, contact shadow decal and soft shadow maps are enabled according to preset; High adds subtle bloom. Static scenery is merged by material and shadow behavior to reduce draw calls. Physics runs at 60 Hz; animation and camera use delta time. Slow frames are capped to avoid a simulation spiral, so software rendering can slow simulation time.

## Validation

```powershell
npm test
```

Runs a real Rapier floor/wall/jump test. Browser regression:

```powershell
# Terminal 1
npm run dev
# Terminal 2 (set CHROMIUM_PATH to an installed Chromium browser)
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
node tests/browser.mjs
```

The browser suite uses Playwright, actual browser controls, and deterministic fixed-step simulation. See `VALIDATION.md` for executed results and limitations. QA access is exposed only in Vite development or with `?test=1` in a production URL. This is a local game with no privileged server state.

## Asset and dependency credits

All dog/environment geometry, materials, signage, favicon and synthesized audio are original procedural work. Outfit and DM Sans are bundled via Fontsource under SIL Open Font License; their license files are included in installed packages and `public/assets/licenses`. Three.js: MIT. Rapier: Apache-2.0. Vite and Playwright retain their respective upstream licenses.

## Practical limits

- Desktop keyboard/mouse gameplay; responsive menus do not provide touch movement controls.
- No multiplayer, save-game progress, gamepad support, or imported skeletal animation.
- Audio begins after pressing Play, following browser autoplay rules. Sound is synthesized, not recorded.
- No expensive screen-space ambient occlusion or path tracing; contact shadows and soft shadow maps provide grounding.
- 60 FPS is a target, not a measured desktop hardware guarantee. The cloud QA environment renders through software; performance on a real GPU needs a separate check.
- Browser fullscreen availability depends on embedding and browser policy.
