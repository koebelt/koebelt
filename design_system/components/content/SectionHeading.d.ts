import * as React from "react";
/** Section opener: hairline rule, lime mono eyebrow, 40px title, optional action on the right. */
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** Short uppercase kicker, rendered in lime. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Right-aligned control, usually a ghost or secondary Button. */
  action?: React.ReactNode;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
