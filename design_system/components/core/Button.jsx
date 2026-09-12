import React from "react";

const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"var(--space-3)",
border:"var(--border-width) solid transparent",borderRadius:"var(--radius-control)",
font:"var(--text-label-md)",letterSpacing:"var(--tr-label)",textTransform:"uppercase",
cursor:"pointer",transition:"var(--transition-control)",textDecoration:"none",whiteSpace:"nowrap"};

const sizes={
  sm:{height:32,padding:"0 var(--space-4)",fontSize:"var(--fs-label-sm)"},
  md:{height:44,padding:"0 var(--space-6)",fontSize:"var(--fs-label-md)"},
  lg:{height:56,padding:"0 var(--space-8)",fontSize:"var(--fs-label-md)"}
};

const variants={
  primary:{background:"var(--accent)",color:"var(--text-on-accent)",borderColor:"var(--accent)"},
  secondary:{background:"transparent",color:"var(--text-primary)",borderColor:"var(--border-subtle)"},
  ghost:{background:"transparent",color:"var(--text-secondary)",borderColor:"transparent"},
  inverse:{background:"var(--surface-inverse)",color:"var(--text-inverse)",borderColor:"var(--surface-inverse)"}
};

const hovers={
  primary:{background:"var(--accent-hover)",borderColor:"var(--accent-hover)"},
  secondary:{borderColor:"var(--border-strong)"},
  ghost:{color:"var(--text-primary)",background:"var(--white-a08)"},
  inverse:{background:"var(--ink-050)",borderColor:"var(--ink-050)"}
};

export function Button({variant="primary",size="md",iconLeft,iconRight,fullWidth=false,disabled=false,as="button",href,children,style,onClick,...rest}){
  const [hover,setHover]=React.useState(false);
  const [press,setPress]=React.useState(false);
  const Tag=as==="a"?"a":"button";
  const s={...base,...sizes[size],...variants[variant],
    ...(hover&&!disabled?hovers[variant]:null),
    ...(press&&!disabled?{transform:"scale(var(--press-scale))"}:null),
    ...(disabled?{opacity:.38,cursor:"not-allowed"}:null),
    ...(fullWidth?{width:"100%"}:null),...style};
  return (
    <Tag {...rest} href={Tag==="a"?href:undefined} style={s} disabled={Tag==="button"?disabled:undefined}
      onClick={disabled?undefined:onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>{setHover(false);setPress(false)}}
      onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}>
      {iconLeft}{children}{iconRight}
    </Tag>
  );
}
