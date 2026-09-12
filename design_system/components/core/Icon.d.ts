/**
 * Lucide glyph rendered as an inline SVG (path data bundled in icons-data.js) so it always
 * takes the current stroke colour reliably, with no external asset fetch.
 * Icons are 1.5–2px-stroke outline only — never filled, never coloured except by `color`.
 */
export interface IconProps {
  /** Lucide icon slug, e.g. "arrow-up-right", "mail", "github". */
  name: string;
  /** Square px size. 16 inline, 18 in controls, 24 standalone. */
  size?: number;
  color?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
