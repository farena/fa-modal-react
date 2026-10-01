import type { ReactNode } from "react";

export type Position = "center" | "top" | "bottom" | "left" | "right";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export interface FooterProps {
  close: () => void;
}

export interface FaModalProps {
  header?: ReactNode;
  footer?: (props: FooterProps) => ReactNode;
  children?: ReactNode;
  position?: Position;
  size?: Size;
  onClose: () => void;
}
