import React from "react";

export function SectionHeading({eyebrow,title,description,align="left",action,style,...rest}){
  return <header {...rest} style={{display:"flex",flexDirection:"column",gap:"var(--space-5)",
    borderTop:"var(--border-width) solid var(--border-hairline)",paddingTop:"var(--space-6)",
    textAlign:align,...style}}>
    {eyebrow&&<span style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",
      textTransform:"uppercase",color:"var(--text-accent)"}}>{eyebrow}</span>}
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"var(--space-8)",
      flexWrap:"wrap"}}>
      <h2 style={{font:"var(--text-heading-lg)",letterSpacing:"var(--tr-heading)",maxWidth:"20ch"}}>{title}</h2>
      {action}
    </div>
    {description&&<p style={{font:"var(--text-body-lg)",color:"var(--text-muted)",
      maxWidth:"var(--measure-prose)"}}>{description}</p>}
  </header>;
}
