import React from "react";

export function Divider({label,tone="hairline",style,...rest}){
  const c=tone==="strong"?"var(--border-strong)":tone==="accent"?"var(--border-accent)":"var(--border-hairline)";
  if(!label) return <hr {...rest} style={{border:0,height:1,background:c,margin:0,...style}}/>;
  return <div {...rest} style={{display:"flex",alignItems:"center",gap:"var(--space-5)",...style}}>
    <span style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
      color:"var(--text-muted)",flex:"0 0 auto"}}>{label}</span>
    <span style={{flex:1,height:1,background:c}}/>
  </div>;
}
