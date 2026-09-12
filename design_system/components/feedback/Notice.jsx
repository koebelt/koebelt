import React from "react";
import {Icon} from "../core/Icon.jsx";

const tones={
  info:{c:"var(--signal-info)",icon:"info"},
  positive:{c:"var(--signal-positive)",icon:"check"},
  warning:{c:"var(--signal-warning)",icon:"triangle-alert"},
  negative:{c:"var(--signal-negative)",icon:"circle-alert"}
};

export function Notice({tone="info",title,children,style,...rest}){
  const t=tones[tone];
  return <div {...rest} style={{display:"flex",gap:"var(--space-5)",padding:"var(--space-5) var(--space-6)",
    border:"var(--border-width) solid var(--border-hairline)",borderLeft:"var(--border-width-strong) solid "+t.c,
    borderRadius:"var(--radius-xs)",background:"var(--surface-sunken)",...style}}>
    <Icon name={t.icon} size={18} style={{background:t.c,marginTop:3}}/>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
      {title&&<strong style={{font:"var(--text-label-md)",letterSpacing:"var(--tr-label)",
        textTransform:"uppercase",color:t.c}}>{title}</strong>}
      <span style={{font:"var(--text-body-sm)",color:"var(--text-secondary)"}}>{children}</span>
    </div>
  </div>;
}
