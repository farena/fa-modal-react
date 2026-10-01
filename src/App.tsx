import { useState } from "react";
import FaModal from "./components/FaModal";
import type { FaModalProps } from "./components/types";
import "./assets/_fa-modal.scss";
import "./App.scss";

type Position = NonNullable<FaModalProps["position"]>;
type Size = NonNullable<FaModalProps["size"]>;

const POSITIONS: Position[] = ["center", "top", "bottom", "left", "right"];
const SIZES: Size[] = ["xs", "sm", "md", "lg", "xl"];

interface Variant {
  position: Position;
  size: Size;
}

function App() {
  const [variant, setVariant] = useState<Variant>({
    position: "center",
    size: "md",
  });
  const [withHeader, setWithHeader] = useState(true);
  const [withFooter, setWithFooter] = useState(true);
  const [longContent, setLongContent] = useState(false);
  const [opened, setOpened] = useState<(Variant & { id: number }) | null>(
    null,
  );
  const [clicks, setClicks] = useState(0);
  const [nested, setNested] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function addLog(message: string) {
    const time = new Date().toLocaleTimeString("en-US");
    setLog((prev) => [`${time} · ${message}`, ...prev].slice(0, 8));
  }

  function openModal(v: Variant) {
    setVariant(v);
    setOpened({ ...v, id: Date.now() });
    addLog(`opened: ${v.position} / ${v.size}`);
  }

  function onClose() {
    if (opened) addLog(`onClose: ${opened.position} / ${opened.size}`);
    setOpened(null);
  }

  const snippet = [
    `<FaModal`,
    `  position="${variant.position}"`,
    `  size="${variant.size}"`,
    withHeader && `  header={<h2>Title</h2>}`,
    withFooter &&
      `  footer={({ close }) => <button onClick={close}>Close</button>}`,
    `  onClose={() => setOpen(false)}`,
    `>`,
    `  …`,
    `</FaModal>`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <main className="playground">
      <header className="playground__intro">
        <h1>FaModal playground</h1>
        <p>
          Pick a variant and open the modal. Close it with the ×, by clicking
          outside the content, or from the footer buttons.
        </p>
      </header>

      <section className="playground__panel">
        <h2>Configuration</h2>

        <fieldset className="field">
          <legend>position</legend>
          <div className="segmented">
            {POSITIONS.map((p) => (
              <label key={p}>
                <input
                  type="radio"
                  name="position"
                  checked={variant.position === p}
                  onChange={() => setVariant((v) => ({ ...v, position: p }))}
                />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>size</legend>
          <div className="segmented">
            {SIZES.map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="size"
                  checked={variant.size === s}
                  onChange={() => setVariant((v) => ({ ...v, size: s }))}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>content</legend>
          <div className="toggles">
            <label>
              <input
                type="checkbox"
                checked={withHeader}
                onChange={(e) => setWithHeader(e.target.checked)}
              />
              header
            </label>
            <label>
              <input
                type="checkbox"
                checked={withFooter}
                onChange={(e) => setWithFooter(e.target.checked)}
              />
              footer
            </label>
            <label>
              <input
                type="checkbox"
                checked={longContent}
                onChange={(e) => setLongContent(e.target.checked)}
              />
              long body (scroll)
            </label>
          </div>
        </fieldset>

        <button
          className="btn btn--primary"
          onClick={() => openModal(variant)}
        >
          Open modal
        </button>

        <pre className="snippet">
          <code>{snippet}</code>
        </pre>
      </section>

      <section className="playground__panel">
        <h2>All variants</h2>
        <p className="hint">
          Each button opens a position × size combination, using the content
          options above.
        </p>
        <div className="matrix" role="table">
          <div role="row" className="matrix__row">
            <span role="columnheader" />
            {SIZES.map((s) => (
              <span role="columnheader" key={s} className="matrix__head">
                {s}
              </span>
            ))}
          </div>
          {POSITIONS.map((p) => (
            <div role="row" className="matrix__row" key={p}>
              <span role="rowheader" className="matrix__head">
                {p}
              </span>
              {SIZES.map((s) => (
                <button
                  role="cell"
                  key={s}
                  className={`btn${
                    opened?.position === p && opened.size === s
                      ? " btn--active"
                      : ""
                  }`}
                  onClick={() => openModal({ position: p, size: s })}
                >
                  Open
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="playground__panel">
        <h2>Events</h2>
        {log.length === 0 ? (
          <p className="hint">No events yet.</p>
        ) : (
          <ul className="log">
            {log.map((entry, i) => (
              <li key={`${entry}-${i}`}>{entry}</li>
            ))}
          </ul>
        )}
      </section>

      {opened && (
        <FaModal
          key={opened.id}
          position={opened.position}
          size={opened.size}
          header={
            withHeader ? (
              <h2 className="demo-title">
                {opened.position} / {opened.size}
              </h2>
            ) : undefined
          }
          footer={
            withFooter
              ? ({ close }) => (
                  <>
                    <button
                      className="btn"
                      onClick={() => setClicks((c) => c + 1)}
                    >
                      Action ({clicks})
                    </button>
                    <button className="btn" onClick={close}>
                      Cancel
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={() => {
                        addLog("save from footer");
                        close();
                      }}
                    >
                      Save
                    </button>
                  </>
                )
              : undefined
          }
          onClose={onClose}
        >
          <p>
            Modal with <code>position="{opened.position}"</code> and{" "}
            <code>size="{opened.size}"</code>.
          </p>
          <p>
            <button className="btn" onClick={() => setNested(true)}>
              Open nested modal
            </button>
          </p>
          {longContent &&
            Array.from({ length: 30 }, (_, i) => (
              <p key={i}>
                Paragraph {i + 1}. Filler content to test body scrolling while
                the header and footer stay in place.
              </p>
            ))}
        </FaModal>
      )}

      {nested && (
        <FaModal
          size="sm"
          header={<h2 className="demo-title">Nested modal</h2>}
          onClose={() => {
            addLog("onClose: nested");
            setNested(false);
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>
              Nested paragraph {i + 1}. Only this body should scroll while two
              modals are open.
            </p>
          ))}
        </FaModal>
      )}
    </main>
  );
}

export default App;
