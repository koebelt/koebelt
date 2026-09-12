import React from "react";

const SRC={white:"logo-mark-white.png",dark:"logo-mark-dark.png",accent:"logo-mark-accent.png"};
const RES_ID={white:"logowhite",dark:"logodark",accent:"logoaccent"};

export function Logo({variant="white",size=36,wordmark=false,assetBase="/assets/",style,...rest}){
  const color=variant==="dark"?"var(--ink-700)":variant==="accent"?"var(--accent)":"var(--white)";
  const resolvedSrc=(typeof window!=="undefined"&&window.__resources&&window.__resources[RES_ID[variant]])||(assetBase+SRC[variant]);
  return <span {...rest} style={{display:"inline-flex",alignItems:"center",gap:"var(--space-4)",...style}}>
    <img src={resolvedSrc} alt="KOEBELT" width={size} height={size}
      style={{display:"block",width:size,height:size}}/>
    {wordmark&&<span style={{font:"var(--fw-semibold) "+size*0.55+"px/1 var(--font-display)",
      letterSpacing:"0.04em",textTransform:"uppercase",color}}>KOEBELT</span>}
  </span>;
}
