import React from "react";

const tones={
  neutral:{background:"transparent",color:"var(--text-muted)",borderColor:"var(--border-hairline)"},
  accent:{background:"var(--surface-accent-soft)",color:"var(--text-accent)",borderColor:"var(--lime-a32)"},
  solid:{background:"var(--accent)",color:"var(--text-on-accent)",borderColor:"var(--accent)"}
};

export function Tag({tone="neutral",children,style,...rest}){
  return <span {...rest} style={{display:"inline-flex",alignItems:"center",height:26,padding:"0 var(--space-4)",
    borderRadius:"var(--radius-tag)",border:"var(--border-width) solid",font:"var(--text-label-sm)",
    letterSpacing:"var(--tr-label)",textTransform:"uppercase",...tones[tone],...style}}>{children}</span>;
}
