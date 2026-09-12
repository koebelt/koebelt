import * as React from "react";
/** 1px rule, optionally with a leading mono label — the primary sectioning device of the brand. */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** Uppercase mono caption placed left of the rule. */
  label?: string;
  tone?: "hairline" | "strong" | "accent";
}
export declare function Divider(props: DividerProps): JSX.Element;
