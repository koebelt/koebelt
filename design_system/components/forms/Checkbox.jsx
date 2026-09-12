import React from "react";
import {Icon} from "../core/Icon.jsx";

export function Checkbox({checked,defaultChecked,label,disabled=false,onChange,style,...rest}){
  const [on,setOn]=React.useState(defaultChecked??false);
  const val=checked===undefined?on:checked;
  return <label {...rest} style={{display:"inline-flex",alignItems:"center",gap:"var(--space-4)",
    cursor:disabled?"not-allowed":"pointer",opacity:disabled?.38:1,font:"var(--text-body-sm)",
    color:"var(--text-secondary)",...style}}>
    <span onClick={()=>{if(disabled)return;const n=!val;if(checked===undefined)setOn(n);onChange&&onChange(n)}}
      style={{width:20,height:20,flex:"0 0 auto",display:"inline-flex",alignItems:"center",justifyContent:"center",
        borderRadius:"var(--radius-xs)",border:"var(--border-width) solid",
        borderColor:val?"var(--accent)":"var(--border-subtle)",
        background:val?"var(--accent)":"transparent",transition:"var(--transition-control)"}}>
      {val&&<Icon name="check" size={14} style={{background:"var(--text-on-accent)"}}/>}
    </span>
    {label}
  </label>;
}
