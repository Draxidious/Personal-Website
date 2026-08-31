# Portfolio Website Tech Stack — Design

**Date:** 2026-08-30
**Status:** Approved
**Author:** Jordan Muniz (with Claude)

## Context

This repository currently contains a bare Vite + Three.js skeleton (`index.html`,
an empty `main.js`, `three` as the only dependency). The goal is to turn it into
a personal portfolio site for an XR developer, built on Three.js, that satisfies
four requirements:

1. Scenes can be opened in the [Three.js Editor](https://threejs.org/editor/)
   for spatial tweaks (positions, lighting, materials, camera framing).
2. The site is hostable, with a clear story for backend/hosting choices and
   their compatibility with Three.js.
3. The code is organized using React-style components rather than imperative
   Three.js scene-graph code.
4. There is a strong test suite: unit tests, screenshot/visual-regression
   tests, and browser-driven behavior tests that Claude Code can run and use
   for debugging.

This document records the chosen stack and the reasoning behind it, most
importantly how points 1 and 3 are reconciled, since they pull in different
directions by default.

## Decisions

- **Language:** TypeScript.
- **Backend:** None. The site is fully static; project content is authored as
  local TypeScript/JSON/Markdown data, not fetched from a CMS or API.
- **WebXR:** Out of scope for the site itself. XR work is showcased via 3D
  scenes, video, and screenshots rather than live in-browser XR sessions.
- **Hosting:** GitHub Pages, deployed via GitHub Actions.

## Architecture

### Core stack

- **Vite** (already in place) as the build tool and dev server.
- **React** + **TypeScript** as the application layer.
- **React Three Fiber** (`@react-three/fiber`) as the Three.js renderer/
  reconciler — Three.js objects become JSX (`<mesh>`, `<pointLight>`, etc.),
  with hooks (`useFrame`, `useThree`) for per-frame updates and renderer/scene
  access.
- **drei** (`@react-three/drei`) for the standard helper layer on top of R3F:
  `useGLTF` for model loading, `OrbitControls`/camera helpers, `Environment`
  for lighting/reflections, `Html` for DOM overlays anchored in 3D space, etc.
- **Zustand**, added later and only if/when cross-component 3D scene state is
  actually needed (e.g. a scroll-driven camera path). Not part of the initial
  setup — YAGNI.

### Reconciling the Three.js Editor with React components

The Three.js Editor edits a serialized Three.js scene graph; it has no concept
of JSX or React component code. Building the entire site as one large
component tree would make it effectively impossible to open "the scene" in
the Editor for spatial tweaks. The resolution is a split between spatial
content and application logic:

- **Spatial content** — models, lighting rigs, object layout, camera framing —
  is authored as **`.glb` (glTF) files**. These can be built or tweaked
  directly in the Three.js Editor (import → adjust → File → Export → glTF) or
  produced in Blender and exported to glTF.
- **Application logic** — interactivity, animation triggers, routing, UI
  overlays, responsive behavior — lives in R3F components, which load the
  `.glb` files via `useGLTF` and reference specific objects by the node names
  they were given in the Editor (glTF preserves object names, so
  `nodes['DeskLamp']` etc. keep resolving after a pure spatial edit).

Practical implication: renaming objects in the Editor breaks the
name-based references in code, so node names should be treated as a stable
contract between the asset and the component that consumes it.

Workflow for a spatial tweak: open the relevant `.glb` in the Three.js Editor
→ adjust transforms/lighting/materials → export glTF → overwrite the asset
in the repo → R3F picks up the change on next reload, with no code changes
required.

### Data flow / project structure (indicative)

```
src/
  assets/            # .glb files authored/tweaked via Three.js Editor or Blender
  components/        # R3F components (scenes, meshes, cameras, UI overlays)
  data/              # portfolio content (project entries, copy) as local TS/JSON
  hooks/
public/
```

This is indicative, not prescriptive — the implementation plan can refine it.

### Testing

Three layers, each covering what the others can't:

1. **Unit tests — Vitest.** Covers logic, hooks, and data transforms that
   don't require a real GPU/WebGL context (jsdom, which Vitest runs against,
   has no real WebGL implementation, so rendered 3D output isn't meaningfully
   testable here). Vitest is chosen for its native Vite integration and
   Jest-compatible API.

2. **Screenshot / visual-regression tests — Playwright.** Playwright drives a
   real Chromium instance with a real WebGL context, so it's the layer that
   can actually validate rendered output. Uses `expect(page).toHaveScreenshot()`
   against committed baseline images, with a pixel-diff threshold tuned to
   tolerate GPU/anti-aliasing noise between runs. Also used for scripted E2E
   behavior tests (navigation, interaction, console-error assertions).

3. **Claude Code browser-driven debugging.** Not a separate framework —
   this is the browser automation already available to Claude Code in this
   environment. Used two ways: (a) live, interactive debugging during
   development ("does this lighting look right," "click through the site and
   check for console errors"), and (b) authoring and iterating on the
   Playwright spec files in (2), which then run repeatably and headlessly in
   CI.

**CI:** GitHub Actions runs Vitest and Playwright on push/PR, gating the
GitHub Pages deploy.

### Hosting

GitHub Pages, deployed via a GitHub Actions workflow: `vite build` → upload
`dist/` → `actions/deploy-pages`. Since this is a project page (not a custom
domain or user/org page), `base` in `vite.config.ts` must be set to the repo
name so built asset paths resolve correctly.

Because the site is fully static, there is no backend to provision. If a
dynamic feature (e.g. a contact form) is wanted later, it can be added
client-side (e.g. Formspree, EmailJS) without changing hosting providers,
since GitHub Pages serves static files only and has no serverless function
support.

