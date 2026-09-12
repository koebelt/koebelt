import React from "react";
const fieldBase={width:"100%",background:"var(--surface-sunken)",color:"var(--text-primary)",
border:"var(--border-width) solid var(--border-hairline)",borderRadius:"var(--radius-control)",
font:"var(--text-body-md)",padding:"0 var(--space-5)",height:48,outline:"none",
transition:"var(--transition-control)"};

export function Input({invalid=false,style,...rest}){
  const [focus,setFocus]=React.useState(false);
  return <input {...rest} onFocus={e=>{setFocus(true);rest.onFocus&&rest.onFocus(e)}}
    onBlur={e=>{setFocus(false);rest.onBlur&&rest.onBlur(e)}}
    style={{...fieldBase,
      borderColor:invalid?"var(--signal-negative)":focus?"var(--accent)":"var(--border-hairline)",
      ...style}}/>;
}
