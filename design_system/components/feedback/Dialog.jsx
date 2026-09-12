import React from "react";
import {IconButton} from "../core/IconButton.jsx";

export function Dialog({open=false,title,onClose,children,footer,width=520,style,...rest}){
  if(!open) return null;
  return <div style={{position:"fixed",inset:0,zIndex:80,display:"flex",alignItems:"center",
    justifyContent:"center",padding:"var(--space-7)",background:"var(--scrim-page)",
    backdropFilter:"var(--blur-overlay)",WebkitBackdropFilter:"var(--blur-overlay)"}}
    onClick={onClose}>
    <div {...rest} role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}
      style={{width:"100%",maxWidth:width,background:"var(--surface-raised)",
        border:"var(--border-width) solid var(--border-subtle)",borderRadius:"var(--radius-card)",
        boxShadow:"var(--shadow-overlay)",display:"flex",flexDirection:"column",...style}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        gap:"var(--space-5)",padding:"var(--space-6) var(--space-7)",
        borderBottom:"var(--border-width) solid var(--border-hairline)"}}>
        <h3 style={{font:"var(--text-heading-xs)",letterSpacing:"var(--tr-heading)"}}>{title}</h3>
        <IconButton name="x" label="Close" size="sm" variant="bare" onClick={onClose}/>
      </div>
      <div style={{padding:"var(--space-7)",font:"var(--text-body-sm)",color:"var(--text-secondary)",
        display:"flex",flexDirection:"column",gap:"var(--space-5)"}}>{children}</div>
      {footer&&<div style={{display:"flex",justifyContent:"flex-end",gap:"var(--space-4)",
        padding:"var(--space-6) var(--space-7)",
        borderTop:"var(--border-width) solid var(--border-hairline)"}}>{footer}</div>}
    </div>
  </div>;
}
