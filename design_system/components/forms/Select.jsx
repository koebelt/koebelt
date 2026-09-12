import React from "react";
import {Icon} from "../core/Icon.jsx";
const fieldBase={width:"100%",background:"var(--surface-sunken)",color:"var(--text-primary)",
border:"var(--border-width) solid var(--border-hairline)",borderRadius:"var(--radius-control)",
font:"var(--text-body-md)",padding:"0 var(--space-5)",height:48,outline:"none",
transition:"var(--transition-control)"};

export function Select({options=[],invalid=false,style,...rest}){
  const [focus,setFocus]=React.useState(false);
  return <span style={{position:"relative",display:"block",...style}}>
    <select {...rest} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
      style={{...fieldBase,appearance:"none",paddingRight:"var(--space-9)",cursor:"pointer",
        borderColor:invalid?"var(--signal-negative)":focus?"var(--accent)":"var(--border-hairline)"}}>
      {options.map(o=>{const v=typeof o==="string"?o:o.value,l=typeof o==="string"?o:o.label;
        return <option key={v} value={v} style={{background:"var(--ink-800)"}}>{l}</option>;})}
    </select>
    <Icon name="chevron-down" size={16} style={{position:"absolute",right:"var(--space-5)",top:"50%",
      transform:"translateY(-50%)",pointerEvents:"none",background:"var(--text-muted)"}}/>
  </span>;
}
