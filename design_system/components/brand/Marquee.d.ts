import * as React from "react";
/**
 * Continuous horizontal ticker of disciplines or client names, bounded by hairlines.
 * The one moving element on the site.
 */
export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: string[];
  /** Seconds for one full loop. 28 default; slower reads calmer. */
  speed?: number;
  /** Lime glyph between items. */
  separator?: string;
}
export declare function Marquee(props: MarqueeProps): JSX.Element;
