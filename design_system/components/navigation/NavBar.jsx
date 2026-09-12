import React from "react";
import {Logo} from "../brand/Logo.jsx";
import {Button} from "../core/Button.jsx";

export function NavBar({items=[],active,onNavigate,action,assetBase="/assets/",sticky=true,style,...rest}){
  return <header {...rest} style={{position:sticky?"sticky":"static",top:0,zIndex:20,
    display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-8)",
    padding:"var(--space-5) var(--gutter-inline-lg)",
    background:"rgba(40,37,38,.82)",backdropFilter:"var(--blur-glass)",
    WebkitBackdropFilter:"var(--blur-glass)",
    borderBottom:"var(--border-width) solid var(--border-hairline)",...style}}>
    <a href="#" onClick={e=>{e.preventDefault();onNavigate&&onNavigate(items[0])}}
      style={{border:0,display:"flex"}}>
      <Logo size={32} assetBase={assetBase}/>
    </a>
    <nav style={{display:"flex",gap:"var(--space-8)"}}>
      {items.map(it=>{const on=it===active;
        return <a key={it} href={"#"+it} onClick={e=>{e.preventDefault();onNavigate&&onNavigate(it)}}
          style={{font:"var(--text-label-md)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
            color:on?"var(--accent)":"var(--text-secondary)",border:0,
            transition:"var(--transition-control)"}}>{it}</a>;})}
    </nav>
    {action!==undefined?action:<Button size="sm" variant="secondary">Contact</Button>}
  </header>;
}
