import React from "react";
const fieldBase={width:"100%",background:"var(--surface-sunken)",color:"var(--text-primary)",
border:"var(--border-width) solid var(--border-hairline)",borderRadius:"var(--radius-control)",
font:"var(--text-body-md)",padding:"0 var(--space-5)",height:48,outline:"none",
transition:"var(--transition-control)"};

export function Textarea({rows=5,invalid=false,style,...rest}){
  const [focus,setFocus]=React.useState(false);
  return <textarea {...rest} rows={rows}
    onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
    style={{...fieldBase,height:"auto",padding:"var(--space-4) var(--space-5)",resize:"vertical",
      lineHeight:"var(--lh-body)",fontFamily:"var(--font-text)",
      borderColor:invalid?"var(--signal-negative)":focus?"var(--accent)":"var(--border-hairline)",...style}}/>;
}
