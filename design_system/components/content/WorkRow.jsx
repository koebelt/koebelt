import React from "react";
import {Icon} from "../core/Icon.jsx";

export function WorkRow({index,title,discipline,year,href="#",style,...rest}){
  const [hover,setHover]=React.useState(false);
  return <a {...rest} href={href}
    onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{display:"grid",gridTemplateColumns:"48px 1fr 200px 80px 24px",alignItems:"center",
      gap:"var(--space-5)",padding:"var(--space-6) 0",textDecoration:"none",border:0,
      borderTop:"var(--border-width) solid var(--border-hairline)",
      color:hover?"var(--accent)":"var(--text-primary)",
      transition:"var(--transition-control)",...style}}>
    <span style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",color:"var(--text-faint)"}}>{index}</span>
    <span style={{font:"var(--text-heading-sm)",letterSpacing:"var(--tr-heading)"}}>{title}</span>
    <span style={{font:"var(--text-body-sm)",color:hover?"var(--accent)":"var(--text-muted)"}}>{discipline}</span>
    <span style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",color:"var(--text-faint)"}}>{year}</span>
    <Icon name="arrow-right" size={18} style={{opacity:hover?1:0,transform:hover?"none":"translateX(-6px)",
      transition:"var(--transition-control)"}}/>
  </a>;
}
