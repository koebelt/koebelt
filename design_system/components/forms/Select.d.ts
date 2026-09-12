import * as React from "react";
/** Native select with brand chrome and a Lucide chevron. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Strings, or `{value,label}` pairs. */
  options?: Array<string | { value: string; label: string }>;
  invalid?: boolean;
}
export declare function Select(props: SelectProps): JSX.Element;
