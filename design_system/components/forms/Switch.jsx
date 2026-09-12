import React from "react";

export function Switch({checked,defaultChecked,label,disabled=false,onChange,style,...rest}){
  const [on,setOn]=React.useState(defaultChecked??false);
  const val=checked===undefined?on:checked;
  return <label {...rest} style={{display:"inline-flex",alignItems:"center",gap:"var(--space-4)",
    cursor:disabled?"not-allowed":"pointer",opacity:disabled?.38:1,font:"var(--text-label-sm)",
    letterSpacing:"var(--tr-label)",textTransform:"uppercase",color:"var(--text-muted)",...style}}>
    <span onClick={()=>{if(disabled)return;const n=!val;if(checked===undefined)setOn(n);onChange&&onChange(n)}}
      style={{width:40,height:22,flex:"0 0 auto",borderRadius:"var(--radius-pill)",
        border:"var(--border-width) solid",borderColor:val?"var(--accent)":"var(--border-subtle)",
        background:val?"var(--accent)":"transparent",position:"relative",
        transition:"var(--transition-control)"}}>
      <span style={{position:"absolute",top:2,left:val?20:2,width:16,height:16,borderRadius:"var(--radius-pill)",
        background:val?"var(--text-on-accent)":"var(--text-muted)",
        transition:"left var(--dur-fast) var(--ease-standard)"}}/>
    </span>
    {label}
  </label>;
}
