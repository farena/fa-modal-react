import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import { createPortal } from "react-dom";
import type { FaModalProps } from "./types";
import { useScrollLock } from "./useScrollLock";

export default function FaModal({
  header,
  footer,
  children,
  position = "center",
  size = "md",
  onClose,
}: FaModalProps) {
  const [open, setOpen] = useState(false);
  const pressedOnBackdrop = useRef(false);

  useScrollLock();

  const modalClasses = [
    `fa-modal`,
    `fa-modal-position--${position}`,
    `fa-modal-size--${size}`,
    `fa-modal--${open ? "open" : "close"}`,
  ].join(" ");

  const contentClasses = [
    `fa-modal-content`,
    `fa-modal-content--${open ? "open" : "close"}`,
  ].join(" ");

  function close() {
    setOpen(false);
  }

  function onTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (!open) onClose();
  }

  function onBackdropPointerDown(e: PointerEvent<HTMLDivElement>) {
    pressedOnBackdrop.current = e.target === e.currentTarget;
  }

  /** Closes only when the click both starts and ends on the backdrop, so a drag from the content doesn't close it. */
  function onClickOutside(e: MouseEvent<HTMLDivElement>) {
    if (pressedOnBackdrop.current && e.target === e.currentTarget) close();
    pressedOnBackdrop.current = false;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return createPortal(
    <div
      className={modalClasses}
      onPointerDown={onBackdropPointerDown}
      onClick={onClickOutside}
    >
      <div className={contentClasses} onTransitionEnd={onTransitionEnd}>
        <div className="fa-modal-content__header">
          {header}

          <button className="fa-modal-content__header-closebtn" onClick={close}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="fa-modal-content__body">
          <div className="fa-modal-content__body-wrapper">{children}</div>
        </div>
        {footer && (
          <div className="fa-modal-content__footer">{footer({ close })}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
