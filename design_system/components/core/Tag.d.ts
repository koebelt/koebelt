import * as React from "react";
/** Pill-shaped, uppercase mono metadata chip — disciplines, tools, years. Never interactive. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "accent" | "solid";
  children?: React.ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;
