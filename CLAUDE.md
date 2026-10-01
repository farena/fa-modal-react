# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with the playground (`src/App.tsx`).
- `npm run build` — type-check (`tsc -b`) and production build. This is the main correctness check.
- `npm run lint` — ESLint (typescript-eslint, react-hooks, react-refresh).
- `npm run build:lib` — builds the npm package into `dist/` (`vite.lib.config.ts` for JS + `style.css`, `tsconfig.lib.json` for `.d.ts`). The playground build goes to `dist-playground/` so the two don't collide.
- `npm run release -- <patch|minor|major|x.y.z> [--dry-run]` — `scripts/release.mjs`: requires clean `main` and `npm login`, runs lint + both builds, `npm version`, `npm publish` (as `@farena/fa-modal-react`, public), then pushes with tags if `origin` exists.

There is no test runner configured. Verify behavior through the playground in a browser.

## Architecture

The repo is a single React 19 component, `FaModal`, plus a Vite playground that exercises it.

- `src/components/FaModal.tsx` — the component. It renders into `document.body` through a portal.
- `src/components/types.ts` — the public props (`FaModalProps`, `Position`, `Size`, `FooterProps`).
- `src/components/useScrollLock.ts` — page scroll lock shared by all mounted modals.
- `src/assets/_fa-modal.scss` — all modal styles and the `--fa-modals-*` theme variables. The component does not import it: package consumers import `@farena/fa-modal-react/style.css`, and the playground imports the SCSS in `App.tsx`.
- `src/index.ts` — public exports; it is the types entry. `src/index.lib.ts` is the bundle entry and only adds the SCSS import, so the published `.d.ts` files never reference `.scss`.
- `src/App.tsx` + `src/App.scss` — the playground. `src/index.css` is leftover Vite template styling used only by the playground.

### Lifecycle contract (spans the component and the SCSS)

- `FaModal` is open while mounted. The parent opens it by rendering it and closes it by unmounting it inside `onClose`.
- On mount, a 100ms timer adds the `--open` classes, which starts the enter transition.
- Every close path (× button, click on the backdrop, `close` passed to `footer`) only sets the internal state to closed. `onClose` fires on the content's `transitionend` for the `transform` property. Every position in the SCSS must therefore animate `transform`, or `onClose` never fires.
- A backdrop click closes the modal only when the pointer both goes down and comes up on the backdrop, so dragging from inside the content doesn't close it.
- `useScrollLock` keeps a module-level counter. The first mounted modal sets `overflow: hidden` (plus scrollbar-width `padding-right`) on `<html>`. The last one to unmount restores the previous values. Nested or stacked modals depend on this counter.

### Styling conventions

- Class names follow BEM under `fa-modal`. Modifiers are `fa-modal-position--*`, `fa-modal-size--*` and `--open`/`--close`.
- A size only sets `--fa-modal-width` and applies the same way to every position (xs 300px, sm 450px, md 800px, lg 1200px, xl 100%). The height follows the content. This scale mirrors the doormate project's `_modal.scss`.
- Theme colors live only in the `--fa-modals-*` custom properties, with a `prefers-color-scheme: dark` override.
- The playground UI is English only.
