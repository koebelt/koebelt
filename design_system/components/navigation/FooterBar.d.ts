import * as React from "react";
/** Page footer: oversized mailto, social icon buttons, monogram and legal line. */
export interface FooterBarProps extends React.HTMLAttributes<HTMLElement> {
  email?: string;
  /** Lucide slugs with labels, e.g. `[{name:"github",label:"GitHub"}]`. */
  socials?: Array<{ name: string; label?: string }>;
  /** Replaces the default byline. */
  note?: string;
  assetBase?: string;
}
export declare function FooterBar(props: FooterBarProps): JSX.Element;
