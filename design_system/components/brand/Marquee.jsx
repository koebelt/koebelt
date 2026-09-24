import React from "react";

export function Marquee({items=[],speed=28,separator="/",style,...rest}){
  const run=[...items,...items];
  // useId, not Math.random: the name must match between a prerendered page and hydration.
  const id="kb-mq-"+React.useId().replace(/[^a-zA-Z0-9]/g,"");
  return <div {...rest} style={{overflow:"hidden",borderTop:"var(--border-width) solid var(--border-hairline)",
    borderBottom:"var(--border-width) solid var(--border-hairline)",padding:"var(--space-5) 0",...style}}>
    <style>{"@keyframes "+id+"{from{transform:translateX(0)}to{transform:translateX(-50%)}}"}</style>
    <div style={{display:"flex",width:"max-content",gap:"var(--space-9)",
      animation:id+" "+speed+"s linear infinite"}}>
      {run.map((t,i)=><span key={i} style={{display:"inline-flex",gap:"var(--space-9)",alignItems:"center",
        font:"var(--text-label-md)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
        color:"var(--text-secondary)",whiteSpace:"nowrap"}}>
        {t}<span style={{color:"var(--accent)"}}>{separator}</span></span>)}
    </div>
  </div>;
}
