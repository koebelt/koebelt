import React from "react";
import {MediaFrame} from "./MediaFrame.jsx";
import {Tag} from "../core/Tag.jsx";
import {Icon} from "../core/Icon.jsx";

export function ProjectCard({title,year,summary,tags=[],image,ratio="4/3",href="#",style,...rest}){
  const [hover,setHover]=React.useState(false);
  return <a {...rest} href={href}
    onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{display:"flex",flexDirection:"column",gap:"var(--space-5)",textDecoration:"none",
      border:0,color:"var(--text-primary)",...style}}>
    <MediaFrame src={image} ratio={ratio} label={title}
      style={{transition:"var(--transition-control)",
        boxShadow:hover?"inset 0 0 0 1px var(--accent)":"var(--shadow-inset-hairline)"}}>
      <span style={{position:"absolute",top:"var(--space-4)",right:"var(--space-4)",width:32,height:32,
        display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"var(--radius-xs)",
        background:hover?"var(--accent)":"var(--ink-a70)",
        transition:"var(--transition-control)"}}>
        <Icon name="arrow-up-right" size={16}
          style={{background:hover?"var(--text-on-accent)":"var(--white)"}}/>
      </span>
    </MediaFrame>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-3)"}}>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:"var(--space-5)"}}>
        <h3 style={{font:"var(--text-heading-sm)",letterSpacing:"var(--tr-heading)",
          color:hover?"var(--accent)":"var(--text-primary)",transition:"var(--transition-control)"}}>{title}</h3>
        {year&&<span style={{font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",
          color:"var(--text-faint)",flex:"0 0 auto"}}>{year}</span>}
      </div>
      {summary&&<p style={{font:"var(--text-body-sm)",color:"var(--text-muted)",maxWidth:"var(--measure-narrow)"}}>{summary}</p>}
      {tags.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"var(--space-2)",marginTop:"var(--space-2)"}}>
        {tags.map(t=><Tag key={t}>{t}</Tag>)}</div>}
    </div>
  </a>;
}
