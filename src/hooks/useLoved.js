import {useCallback,useEffect,useState} from 'react';
// Shared "loved photos" store (same key the photo wall always used), so every section stays in sync.
const KEY='bu:loved',subs=new Set();
const read=()=>{try{return new Set(JSON.parse(localStorage.getItem(KEY)||'[]'))}catch{return new Set()}};
let store=read();
export default function useLoved(){
  const [,tick]=useState(0);
  useEffect(()=>{const f=()=>tick(n=>n+1);subs.add(f);return()=>subs.delete(f)},[]);
  const toggle=useCallback(id=>{
    const t=new Set(store);t.has(id)?t.delete(id):t.add(id);store=t;
    try{localStorage.setItem(KEY,JSON.stringify([...t]))}catch{}
    subs.forEach(f=>f());
  },[]);
  return [store,toggle];
}
