import * as React from "react";
/** Single-line text field. 48px tall, sunken background, lime border on focus. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}
export declare function Input(props: InputProps): JSX.Element;
