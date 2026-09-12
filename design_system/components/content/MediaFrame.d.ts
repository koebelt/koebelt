import * as React from "react";
/** Fixed-ratio image container. Falls back to a labelled empty frame when no `src` is supplied. */
export interface MediaFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  /** CSS aspect-ratio string. Brand defaults: "4/3" grid, "16/9" hero, "3/4" portrait. */
  ratio?: string;
  /** Placeholder caption shown when `src` is missing. */
  label?: string;
  children?: React.ReactNode;
}
export declare function MediaFrame(props: MediaFrameProps): JSX.Element;
