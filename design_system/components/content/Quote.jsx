import React from "react";

export function Quote({children,attribution,role,style,...rest}){
  return <figure {...rest} style={{margin:0,display:"flex",flexDirection:"column",gap:"var(--space-7)",
    borderLeft:"var(--border-width-strong) solid var(--accent)",paddingLeft:"var(--space-8)",...style}}>
    <blockquote style={{margin:0,font:"var(--text-heading-md)",letterSpacing:"var(--tr-heading)",
      color:"var(--text-primary)",maxWidth:"32ch",textWrap:"pretty"}}>{children}</blockquote>
    {(attribution||role)&&<figcaption style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",
      textTransform:"uppercase",color:"var(--text-muted)"}}>
      {attribution}{role&&<span style={{color:"var(--text-faint)"}}>{" / "}{role}</span>}</figcaption>}
  </figure>;
}
