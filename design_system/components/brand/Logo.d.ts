import * as React from "react";
/**
 * The KOEBELT monogram — a solid square whose letterforms are cut out as negative space,
 * so the surface behind shows through. Never pad it, never place it on a busy image.
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `white` on dark surfaces, `dark` on light, `accent` for single-colour lime lockups. */
  variant?: "white" | "dark" | "accent";
  /** Square px size of the mark. Minimum 24. */
  size?: number;
  /** Append the KOEBELT wordmark to the right of the mark. */
  wordmark?: boolean;
  /** Path prefix to the asset folder. Default "/assets/". */
  assetBase?: string;
}
export declare function Logo(props: LogoProps): JSX.Element;
