import {useEffect,useState} from 'react';
export default function useReducedMotion(){
  const q='(prefers-reduced-motion: reduce)';
  const [r,setR]=useState(()=>matchMedia(q).matches);
  useEffect(()=>{const m=matchMedia(q),f=()=>setR(m.matches);m.addEventListener('change',f);return()=>m.removeEventListener('change',f)},[]);
  return r;
}
