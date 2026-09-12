/** 40×22 pill toggle for immediate binary settings (theme, motion, grid/list). */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}
export declare function Switch(props: SwitchProps): JSX.Element;
