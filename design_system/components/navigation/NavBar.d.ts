import * as React from "react";
/**
 * Site header — monogram left, uppercase mono links centre-right, one action.
 * Translucent with a glass blur when sticky.
 */
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  items?: string[];
  /** Label of the current section; rendered lime. */
  active?: string;
  onNavigate?: (item: string) => void;
  /** Right-hand slot. Pass `null` to omit the default Contact button. */
  action?: React.ReactNode;
  assetBase?: string;
  sticky?: boolean;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
