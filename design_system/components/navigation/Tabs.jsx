import React from "react";

export function Tabs({items=[],value,onChange,style,...rest}){
  const [inner,setInner]=React.useState(items[0]);
  const cur=value===undefined?inner:value;
  return <div {...rest} role="tablist" style={{display:"flex",gap:"var(--space-7)",
    borderBottom:"var(--border-width) solid var(--border-hairline)",...style}}>
    {items.map(it=>{const on=it===cur;
      return <button key={it} role="tab" aria-selected={on}
        onClick={()=>{if(value===undefined)setInner(it);onChange&&onChange(it)}}
        style={{background:"none",border:0,borderBottom:"var(--border-width-strong) solid",
          borderBottomColor:on?"var(--accent)":"transparent",
          padding:"0 0 var(--space-4)",marginBottom:-1,cursor:"pointer",
          font:"var(--text-label-md)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
          color:on?"var(--text-primary)":"var(--text-muted)",
          transition:"var(--transition-control)"}}>{it}</button>;})}
  </div>;
}
