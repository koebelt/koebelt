import React from "react";

const tones={
  positive:"var(--signal-positive)",warning:"var(--signal-warning)",
  negative:"var(--signal-negative)",info:"var(--signal-info)",accent:"var(--accent)"
};

export function Badge({tone="positive",dot=true,children,style,...rest}){
  const c=tones[tone];
  return <span {...rest} style={{display:"inline-flex",alignItems:"center",gap:"var(--space-3)",
    font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
    color:c,...style}}>
    {dot&&<span style={{width:6,height:6,borderRadius:"var(--radius-pill)",background:c,flex:"0 0 auto"}}/>}
    {children}
  </span>;
}
