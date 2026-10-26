import {useState} from 'react';
import {confetti} from './Confetti';
// Heart balloons. Pop them! They float back a few seconds later.
const B=[{c:'#FF5C7A',l:3,b:46,s:1,d:7,z:0},{c:'#F7B6C6',l:12,b:14,s:.8,d:6,z:-2},{c:'#FFFBF2',l:20,b:60,s:.7,d:8,z:-4},
  {c:'#C7B8FF',l:92,b:50,s:1,d:6.5,z:-1},{c:'#F7B6C6',l:84,b:12,s:.85,d:7.5,z:-3},{c:'#E5365F',l:76,b:62,s:.7,d:9,z:-5}];
export default function Balloons(){
  const [gone,setGone]=useState({});
  const pop=(i,e)=>{
    const r=e.currentTarget.getBoundingClientRect();
    confetti(26,{x:r.left+r.width/2,y:r.top+r.height/3});
    setGone(g=>({...g,[i]:true}));
    setTimeout(()=>setGone(g=>({...g,[i]:false})),5000);
  };
  return <div className="balloons">
    {B.map((b,i)=>!gone[i]&&<button key={i} className="balloon" aria-label="Pop the balloon" onClick={e=>pop(i,e)}
      style={{left:`${b.l}%`,bottom:`${b.b}%`,'--s':b.s,'--d':`${b.d}s`,animationDelay:`${b.z}s`}}>
      <svg viewBox="0 0 60 100" aria-hidden="true">
        <path d="M30 98C23 90 37 84 30 76" fill="none" stroke="#28251F" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 66C6 50 1 33 9 19C16 8 27 10 30 21C33 10 44 8 51 19C59 33 54 50 30 66z" fill={b.c} stroke="#28251F" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M26 66l4 8 4-8z" fill={b.c} stroke="#28251F" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M14 24c1-6 5-9 9-9" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    </button>)}
  </div>;
}
