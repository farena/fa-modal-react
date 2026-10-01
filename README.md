# FaModal

A modal and drawer component for React 19. It can open centered or slide in from any edge of the screen, comes in five sizes, and can be stacked.

- Five positions: `center`, `top`, `bottom`, `left`, `right`.
- Five sizes: `xs`, `sm`, `md`, `lg`, `xl`.
- Animated open and close. `onClose` fires after the close animation finishes.
- Locks page scrolling while any modal is open. Only the modal body scrolls, including when several modals are stacked.
- Light and dark themes through CSS custom properties.

## Installation

```bash
npm install @farena/fa-modal-react
```

`react` and `react-dom` 19 are peer dependencies.

Import the stylesheet once, for example in your app entry:

```tsx
import "@farena/fa-modal-react/style.css";
```

## Usage

`FaModal` is open while it is mounted. To open it, render it. To close it, unmount it from `onClose`:

```tsx
import { useState } from "react";
import FaModal from "@farena/fa-modal-react";

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>

      {open && (
        <FaModal
          header={<h2>Edit profile</h2>}
          footer={({ close }) => (
            <>
              <button onClick={close}>Cancel</button>
              <button
                onClick={() => {
                  save();
                  close();
                }}
              >
                Save
              </button>
            </>
          )}
          onClose={() => setOpen(false)}
        >
          <p>Modal content.</p>
        </FaModal>
      )}
    </>
  );
}
```

Don't unmount the modal yourself to close it. Call `close` (from `footer`) instead, or let the user close it, so the exit animation runs before `onClose` is called.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onClose` | `() => void` | required | Called once the close animation has finished. Unmount the modal here. |
| `children` | `ReactNode` | — | Body content. The body is the only part of the modal that scrolls. |
| `header` | `ReactNode` | — | Header content. The × close button is always shown at the top-right corner. |
| `footer` | `({ close }) => ReactNode` | — | Footer content. It receives `close`, which starts the animated close. If omitted, no footer is rendered. |
| `position` | `"center" \| "top" \| "bottom" \| "left" \| "right"` | `"center"` | Where the modal appears and which edge it slides in from. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Width of the modal. |

The package also exports the `FaModalProps`, `FooterProps`, `Position` and `Size` types, and `FaModal` as a named export.

## Positions

| Position | Behavior |
|---|---|
| `center` | Box centered on screen that fades and scales in. Its height is capped at the viewport minus a 1em margin. |
| `left`, `right` | Full-height panel that slides in from that side. |
| `top`, `bottom` | Box centered horizontally and attached to that edge, sliding in from it. Its height follows the content. |

## Sizes

The size sets the width in every position. The height always follows the content and never exceeds the screen.

| Size | Width |
|---|---|
| `xs` | 300px |
| `sm` | 450px |
| `md` | 800px |
| `lg` | 1200px |
| `xl` | 100% |

The width is never larger than the screen. To use a custom width, override `--fa-modal-width` on the size class:

```css
.fa-modal.fa-modal-size--md {
  --fa-modal-width: 640px;
}
```

## Closing

A modal closes when the user:

- clicks the × button,
- clicks the backdrop (only when the click both starts and ends on the backdrop, so dragging out of a text selection doesn't close it),
- or triggers `close` from the footer.

In every case the close animation runs first and then `onClose` is called.

## Stacking modals

Several modals can be open at once. The one rendered last appears on top. Page scrolling stays locked until the last modal closes.

```tsx
{open && (
  <FaModal onClose={() => setOpen(false)}>
    <button onClick={() => setConfirm(true)}>Delete</button>
  </FaModal>
)}

{confirm && (
  <FaModal size="xs" header={<h2>Are you sure?</h2>} onClose={() => setConfirm(false)}>
    This can't be undone.
  </FaModal>
)}
```

## Theming

Colors and shape come from CSS custom properties on `:root`. A `prefers-color-scheme: dark` block overrides them for dark mode. Redefine them in your own stylesheet to match your design:

| Variable | Used for |
|---|---|
| `--fa-modals-text` | Text color |
| `--fa-modals-bg` | Modal background |
| `--fa-modals-bghover` | Close button hover background |
| `--fa-modals-border` | Borders and separators |
| `--fa-modals-shadow` | Modal shadow |
| `--fa-modals-radius` | Corner radius (`center`, `top`, `bottom`) |

```css
:root {
  --fa-modals-bg: #fafafa;
  --fa-modals-radius: 0.75rem;
}
```

## CSS classes

You can target these classes for further customization:

| Class | Element |
|---|---|
| `.fa-modal` | Full-screen backdrop |
| `.fa-modal-position--*`, `.fa-modal-size--*` | Variant modifiers on the backdrop |
| `.fa-modal--open` | Backdrop while open |
| `.fa-modal-content` | Modal box |
| `.fa-modal-content__header` | Header |
| `.fa-modal-content__header-closebtn` | × close button |
| `.fa-modal-content__body` | Scrollable body |
| `.fa-modal-content__footer` | Footer |

## Development

```bash
npm install
npm run dev     # playground with every position, size and a nested modal
npm run build     # type-check and build the playground
npm run build:lib # build the package into dist/
npm run lint
```

The playground lives in `src/App.tsx`.

### Releasing

Releases are published to npm from a clean `main` branch:

```bash
npm run release -- patch            # or minor, major, or an exact version like 1.2.0
npm run release -- patch --dry-run  # run every check and show the package contents, without publishing
```

The script checks that the working tree is clean and that you are logged in to npm. It then runs lint and both builds, bumps the version (commit + `vX.Y.Z` tag), publishes, and pushes the commit and tag when an `origin` remote exists.
