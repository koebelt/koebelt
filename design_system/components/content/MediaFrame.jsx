import React from "react";

export function MediaFrame({src,alt="",ratio="4/3",label="Image",style,children,...rest}){
  return <div {...rest} style={{position:"relative",aspectRatio:ratio,overflow:"hidden",
    borderRadius:"var(--radius-media)",background:"var(--surface-sunken)",
    boxShadow:"var(--shadow-inset-hairline)",...style}}>
    {src
      ? <img src={src} alt={alt} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
      : <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
          font:"var(--text-label-sm)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
          color:"var(--text-faint)"}}>{label}</span>}
    {children}
  </div>;
}
