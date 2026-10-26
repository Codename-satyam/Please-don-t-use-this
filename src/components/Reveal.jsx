import {useEffect,useRef,useState} from 'react';
export default function Reveal({children}){
  const r=useRef(),[v,setV]=useState(false);
  useEffect(()=>{
    if(typeof IntersectionObserver==='undefined'){setV(true);return}
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect()}},{threshold:.08});
    o.observe(r.current);return()=>o.disconnect();
  },[]);
  return <div ref={r} className={`reveal ${v?'in':''}`}>{children}</div>;
}
