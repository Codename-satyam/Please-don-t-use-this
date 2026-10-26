import {useEffect,useState} from 'react';
export default function useMedia(q){
  const [m,setM]=useState(()=>typeof matchMedia!=='undefined'&&matchMedia(q).matches);
  useEffect(()=>{const mq=matchMedia(q),f=()=>setM(mq.matches);f();mq.addEventListener('change',f);return()=>mq.removeEventListener('change',f)},[q]);
  return m;
}
