import * as React from "react";
/** Dense list row for the work index — numbered, hairline-separated, arrow reveals on hover. */
export interface WorkRowProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Zero-padded ordinal, e.g. "01". */
  index?: string;
  title: string;
  discipline?: string;
  year?: string;
  href?: string;
}
export declare function WorkRow(props: WorkRowProps): JSX.Element;
