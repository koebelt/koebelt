import React from "react";

export function Card({padding="var(--space-7)",interactive=false,children,style,...rest}){
  const [hover,setHover]=React.useState(false);
  return <div {...rest}
    onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{background:"var(--surface-raised)",borderRadius:"var(--radius-card)",
      border:"var(--border-width) solid var(--border-hairline)",padding,
      transition:"var(--transition-control)",
      ...(interactive?{cursor:"pointer"}:null),
      ...(interactive&&hover?{borderColor:"var(--border-subtle)",background:"var(--surface-hover)"}:null),
      ...style}}>{children}</div>;
}
