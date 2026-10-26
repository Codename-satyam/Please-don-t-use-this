import {useCallback,useEffect,useRef,useState} from 'react';
import {Volume2} from 'lucide-react';
import {capybara as C} from '../data/capybara';
import {birthday as b} from '../data/birthday';
import {confetti} from './Confetti';
import {onCapySay} from '../lib/capy';
import {beep} from '../lib/audio';

const fill=t=>String(t).replaceAll('{name}',b.friendName);
const QUIET='bu:capyquiet';
const canSpeak=typeof window!=='undefined'&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';

function CapySvg(){
  const ink='#28251F';
  return <svg viewBox="0 -8 210 158" className="capy-svg" aria-hidden="true">
    <ellipse cx="105" cy="141" rx="84" ry="7" fill="rgba(40,37,31,.16)"/>
    <g className="leg legB"><rect x="66" y="100" width="21" height="38" rx="9" fill="#8A5E3B" stroke={ink} strokeWidth="3"/></g>
    <g className="leg legA"><rect x="116" y="100" width="21" height="38" rx="9" fill="#8A5E3B" stroke={ink} strokeWidth="3"/></g>
    <g className="capy-body">
      <path d="M26 82Q24 44 66 42L132 44Q160 46 164 76L164 104Q164 120 146 120L46 120Q26 120 26 100Z" fill="#B98A5B" stroke={ink} strokeWidth="3" strokeLinejoin="round"/>
      <ellipse cx="96" cy="108" rx="44" ry="8" fill="#D9B88A" opacity=".75"/>
      <path d="M52 62q4 4 8 0M86 58q4 4 8 0M114 68q4 4 8 0M60 84q4 4 8 0" fill="none" stroke="#8A5E3B" strokeWidth="2.5" strokeLinecap="round"/>
      <g className="orange">
        <circle cx="82" cy="36" r="12" fill="#FFA53B" stroke={ink} strokeWidth="3"/>
        <path d="M82 24q2-7 9-5-1 7-9 5z" fill="#6BBF59" stroke={ink} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M75 34q2-5 6-5" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <ellipse className="ear" cx="150" cy="43" rx="8" ry="9" fill="#A87A4F" stroke={ink} strokeWidth="3"/>
      <path d="M140 56Q142 38 166 38Q194 40 197 66L198 86Q198 104 180 104L156 104Q140 102 140 86Z" fill="#C69A68" stroke={ink} strokeWidth="3" strokeLinejoin="round"/>
      <ellipse cx="190" cy="69" rx="9" ry="8" fill="#6B4A32" stroke={ink} strokeWidth="2.5"/>
      <circle cx="187" cy="68" r="1.6" fill={ink}/><circle cx="194" cy="68" r="1.6" fill={ink}/>
      <ellipse cx="172" cy="82" rx="7" ry="4.5" fill="#F7B6C6" opacity=".8"/>
      <g className="eye"><circle cx="166" cy="62" r="4.5" fill={ink}/><circle cx="167.6" cy="60.4" r="1.6" fill="#fff"/></g>
      <path className="eye-happy" d="M160 64q6-8 12 0" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round"/>
      <path className="mouth-c" d="M178 91q6 5 12 0" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round"/>
      <path className="mouth-o" d="M177 89q7 12 14 0z" fill="#8B2F2F" stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
      <g className="hat" transform="rotate(7 172 42)">
        <path d="M154 42L172 6L190 42Z" fill="#C7B8FF" stroke={ink} strokeWidth="3" strokeLinejoin="round"/>
        <path d="M160 30L184 30M164 20L180 20" stroke="#FFD76A" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="172" cy="5" r="6" fill="#FF6B6B" stroke={ink} strokeWidth="2.5"/>
      </g>
    </g>
    <g className="leg legA"><rect x="38" y="100" width="22" height="38" rx="9" fill="#9C6F45" stroke={ink} strokeWidth="3"/></g>
    <g className="leg legB"><rect x="138" y="100" width="22" height="38" rx="9" fill="#9C6F45" stroke={ink} strokeWidth="3"/></g>
  </svg>;
}

export default function Capybara(){
  const [msg,setMsg]=useState(null),[walking,setWalking]=useState(true),[hop,setHop]=useState(false),[happy,setHappy]=useState(false);
  const [hearts,setHearts]=useState([]),[quiet,setQuiet]=useState(()=>{try{return localStorage.getItem(QUIET)==='1'}catch{return false}});
  const root=useRef(),timer=useRef(),msgRef=useRef(null),quietRef=useRef(quiet),lastAuto=useRef(0),pets=useRef(0),uid=useRef(0),seen=useRef(new Set());
  msgRef.current=msg;quietRef.current=quiet;

  const burst=useCallback(()=>{
    const r=root.current?.getBoundingClientRect();if(!r)return;
    confetti(55,{x:r.left+r.width*.7,y:r.top+24,angle:90,spread:80});
  },[]);
  const jump=useCallback(()=>{setHop(true);setTimeout(()=>setHop(false),750)},[]);
  const say=useCallback((text,o={})=>{
    if(!text)return false;
    if(o.auto){const now=Date.now();if(quietRef.current||msgRef.current||now-lastAuto.current<5000)return false;lastAuto.current=now}
    setMsg({id:++uid.current,text:fill(text)});
    setHappy(!!o.cheer);if(o.cheer)jump();if(o.burst)burst();
    clearTimeout(timer.current);
    timer.current=setTimeout(()=>{setMsg(null);setHappy(false)},o.ms||(o.cheer?9000:6500));
    return true;
  },[jump,burst]);

  // other parts of the page can talk through Capy
  useEffect(()=>onCapySay(say),[say]);

  // walk in, then wish happy birthday
  useEffect(()=>{
    const t=setTimeout(()=>{setWalking(false);say(C.greeting,{cheer:true,burst:true,ms:10000})},2300);
    return()=>clearTimeout(t);
  },[say]);

  // comment on each chapter the first time you reach it (waits politely if Capy is mid-sentence)
  useEffect(()=>{
    let cur='',retry=0;
    const attempt=id=>{
      if(seen.current.has(id)||cur!==id)return;
      if(say(C.sections[id],{auto:true}))seen.current.add(id);
      else retry=setTimeout(()=>attempt(id),2500);
    };
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      const id=e.target.id;
      if(e.isIntersecting&&C.sections?.[id]){cur=id;clearTimeout(retry);attempt(id)}
    }),{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(C.sections||{}).forEach(id=>{const el=document.getElementById(id);el&&io.observe(el)});
    return()=>{io.disconnect();clearTimeout(retry)};
  },[say]);
  useEffect(()=>()=>{clearTimeout(timer.current);try{speechSynthesis.cancel()}catch{}},[]);

  const pet=()=>{
    pets.current++;const n=pets.current;
    const id=++uid.current;
    setHearts(h=>[...h,{id,x:30+Math.random()*50}]);setTimeout(()=>setHearts(h=>h.filter(q=>q.id!==id)),1200);
    beep(700+(n%4)*90,.09,.06,'triangle');
    if(n%5===0)say(C.party,{cheer:true,burst:true});
    else say(C.pets[(n-1)%C.pets.length],{cheer:true,ms:5500});
    if(n%5!==0)jump();
  };
  const speak=()=>{
    if(!msg)return;
    try{
      const u=new SpeechSynthesisUtterance(msg.text.replace(/[\p{Extended_Pictographic}\uFE0F]/gu,'').trim());
      u.pitch=1.5;u.rate=.95;speechSynthesis.cancel();speechSynthesis.speak(u);
    }catch{}
  };
  const toggleQuiet=()=>setQuiet(q=>{const v=!q;try{localStorage.setItem(QUIET,v?'1':'0')}catch{}return v});

  return <div ref={root} className={`capy ${walking?'walk':''} ${hop?'hop':''} ${msg?'talk':''} ${happy?'happy':''}`}>
    <div className="capy-live" aria-live="polite">
      {msg&&<div className="capy-bubble paper" key={msg.id}>
        <p className="serif">{msg.text}</p>
        <div className="capy-ctl">
          {canSpeak&&<button onClick={speak} aria-label="Hear Capy say it out loud"><Volume2 size={15}/> hear it</button>}
          <button onClick={toggleQuiet} aria-pressed={quiet}>{quiet?'chat again':'hush'}</button>
        </div>
      </div>}
    </div>
    <button className="capy-btn" onClick={pet} aria-label={`Pet ${C.name} the capybara`}><CapySvg/></button>
    {hearts.map(h=><span key={h.id} className="pheart" style={{'--x':`${h.x}%`}} aria-hidden="true">{'\u2665'}</span>)}
  </div>;
}
