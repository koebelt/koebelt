import React from "react";
import {Logo} from "../brand/Logo.jsx";
import {IconButton} from "../core/IconButton.jsx";

export function FooterBar({email="hello@koebelt.com",socials=[],note,assetBase="/assets/",style,...rest}){
  return <footer {...rest} style={{display:"flex",flexDirection:"column",gap:"var(--space-9)",
    borderTop:"var(--border-width) solid var(--border-hairline)",
    padding:"var(--space-10) var(--gutter-inline-lg) var(--space-8)",
    background:"var(--surface-sunken)",...style}}>
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"var(--space-9)",
      flexWrap:"wrap"}}>
      <a href={"mailto:"+email} style={{font:"var(--text-display-md)",letterSpacing:"var(--tr-display)",
        border:0,color:"var(--text-primary)"}}>{email}</a>
      <div style={{display:"flex",gap:"var(--space-3)"}}>
        {socials.map(s=><IconButton key={s.name} name={s.name} label={s.label||s.name}/>)}
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-7)",
      borderTop:"var(--border-width) solid var(--border-hairline)",paddingTop:"var(--space-6)",
      font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
      color:"var(--text-faint)",flexWrap:"wrap"}}>
      <Logo size={24} assetBase={assetBase}/>
      <span>{note||"Thomas Koebel — Software Engineer"}</span>
      <span>{"© "+new Date().getFullYear()}</span>
    </div>
  </footer>;
}
