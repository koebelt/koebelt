import * as React from "react";
/** Label + control + hint/error wrapper. Every form control on the site sits inside one. */
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase mono label. */
  label?: string;
  hint?: string;
  /** Replaces `hint` and turns it red when set. */
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children?: React.ReactNode;
}
export declare function Field(props: FieldProps): JSX.Element;
