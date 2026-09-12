import React from "react";

export function Field({label,hint,error,required=false,htmlFor,children,style,...rest}){
  return <div {...rest} style={{display:"flex",flexDirection:"column",gap:"var(--space-3)",...style}}>
    {label&&<label htmlFor={htmlFor} style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",
      textTransform:"uppercase",color:"var(--text-muted)",display:"flex",gap:"var(--space-2)"}}>
      {label}{required&&<span style={{color:"var(--accent)"}}>*</span>}</label>}
    {children}
    {(error||hint)&&<span style={{font:"var(--text-body-sm)",color:error?"var(--signal-negative)":"var(--text-faint)"}}>
      {error||hint}</span>}
  </div>;
}
