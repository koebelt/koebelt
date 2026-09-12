import React from "react";
import {ICONS} from "./icons-data.js";

export function Icon({name,size=18,color="currentColor",style,...rest}){
  const els=ICONS[name];
  if(!els) return null;
  return (
    <svg {...rest} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{display:"inline-block",flex:"0 0 auto",...style}}
      dangerouslySetInnerHTML={{__html:els.join("")}}/>
  );
}
