import * as React from "react";
/** Inline message block for form results and page-level states. */
export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "info" | "positive" | "warning" | "negative";
  title?: string;
  children?: React.ReactNode;
}
export declare function Notice(props: NoticeProps): JSX.Element;
