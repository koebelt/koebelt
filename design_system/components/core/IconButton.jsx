import React from "react";
import {Icon} from "./Icon.jsx";

const sizes={sm:32,md:40,lg:48};

export function IconButton({name,label,size="md",variant="outline",style,disabled=false,...rest}){
  const [hover,setHover]=React.useState(false);
  const d=sizes[size];
  const v=variant==="solid"
    ?{background:"var(--accent)",color:"var(--text-on-accent)",borderColor:"var(--accent)"}
    :variant==="bare"
    ?{background:"transparent",color:"var(--text-secondary)",borderColor:"transparent"}
    :{background:"transparent",color:"var(--text-primary)",borderColor:"var(--border-subtle)"};
  const h=variant==="solid"?{background:"var(--accent-hover)",borderColor:"var(--accent-hover)"}
    :variant==="bare"?{color:"var(--text-primary)",background:"var(--white-a08)"}
    :{borderColor:"var(--border-strong)"};
  return <button {...rest} aria-label={label} disabled={disabled}
    onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{width:d,height:d,display:"inline-flex",alignItems:"center",justifyContent:"center",
      border:"var(--border-width) solid",borderRadius:"var(--radius-control)",cursor:"pointer",
      transition:"var(--transition-control)",...v,...(hover&&!disabled?h:null),
      ...(disabled?{opacity:.38,cursor:"not-allowed"}:null),...style}}>
    <Icon name={name} size={size==="sm"?16:18}/>
  </button>;
}
