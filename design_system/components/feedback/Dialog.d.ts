import * as React from "react";
/** Centred modal over a blurred scrim — used for the contact form and project detail overlays. */
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title?: string;
  onClose?: () => void;
  /** Right-aligned action row. */
  footer?: React.ReactNode;
  /** Max width in px. Default 520. */
  width?: number;
  children?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element;
