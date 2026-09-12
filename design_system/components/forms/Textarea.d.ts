import * as React from "react";
/** Multi-line text field for project briefs and messages. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  invalid?: boolean;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
