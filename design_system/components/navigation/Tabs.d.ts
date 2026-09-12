import * as React from "react";
/** Filter row for the work index — underline indicator in lime, hairline baseline. */
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: string[];
  /** Controlled selection; omit for internal state. */
  value?: string;
  onChange?: (item: string) => void;
}
export declare function Tabs(props: TabsProps): JSX.Element;
