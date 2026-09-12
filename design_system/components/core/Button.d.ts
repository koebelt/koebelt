import * as React from "react";
/**
 * Primary action control. Uppercase mono label, 2px radius, lime fill for the single
 * most important action on a view.
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual weight. Only one `primary` per view. */
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Render as an anchor for navigation. */
  as?: "button" | "a";
  href?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
