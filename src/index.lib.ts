// Bundle entry: pulls the styles into the build so Vite emits dist/style.css.
// Kept apart from index.ts so the published .d.ts files don't reference the .scss source.
import "./assets/_fa-modal.scss";

export * from "./index";
export { default } from "./index";
