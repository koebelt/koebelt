import * as React from "react";
/** Status line with a 6px dot — availability, project state. Text-only, no container. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "positive" | "warning" | "negative" | "info" | "accent";
  /** Show the leading dot. Default true. */
  dot?: boolean;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
