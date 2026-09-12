import * as React from "react";
/**
 * Flat panel — hairline border, 4px radius, no shadow. Grouping device for facts,
 * services and form blocks.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS padding. Default `var(--space-7)` (24px). */
  padding?: string;
  /** Adds pointer cursor and a hover lift in border/background. */
  interactive?: boolean;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
