import * as React from "react";
/** Square glyph-only control for toolbars, dismiss affordances and social links. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon slug. */
  name: string;
  /** Required accessible label. */
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "solid" | "bare";
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
