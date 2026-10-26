import {useEffect,useRef,useState} from 'react';
import {Image as ImageIcon,Pin,BookOpen,Gamepad2,Mail,Cake,Music,ArrowUp} from 'lucide-react';
import {playTune,stopTune,useTunePlaying} from '../lib/audio';
const ITEMS=[{id:'memories',label:'Photos',Icon:ImageIcon},{id:'pinboard',label:'Board',Icon:Pin},{id:'book',label:'Book',Icon:BookOpen},{id:'game',label:'Game',Icon:Gamepad2},{id:'letter',label:'Letter',Icon:Mail},{id:'finale',label:'Wish',Icon:Cake}];
export default function NavDock(){
  const [active,setActive]=useState(''),bar=useRef(),playing=useTunePlaying();
  useEffect(()=>{
    let raf=0;
    const upd=()=>{raf=0;const h=document.documentElement.scrollHeight-innerHeight;bar.current?.style.setProperty('--p',h>0?Math.min(1,scrollY/h):0)};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(upd)};
    addEventListener('scroll',onScroll,{passive:true});upd();
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:'-45% 0px -50% 0px'});
    ['top',...ITEMS.map(i=>i.id)].forEach(id=>{const el=document.getElementById(id);el&&io.observe(el)});
    return()=>{removeEventListener('scroll',onScroll);cancelAnimationFrame(raf);io.disconnect()};
  },[]);
  return <>
    <div className="progress" ref={bar} aria-hidden="true"/>
    <nav className="dock" aria-label="Sections">
      {ITEMS.map(({id,label,Icon})=><a key={id} href={`#${id}`} className={active===id?'on':''} aria-label={label} title={label} aria-current={active===id?'true':undefined}><Icon size={20}/><span className="lbl">{label}</span></a>)}
      <span className="sep" aria-hidden="true"/>
      <button className={playing?'on':''} onClick={()=>playing?stopTune():playTune()} aria-pressed={playing} aria-label={playing?'Stop the birthday tune':'Play the birthday tune'} title="Birthday tune"><Music size={20}/></button>
      <button onClick={()=>scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top" title="Back to top"><ArrowUp size={20}/></button>
    </nav>
  </>;
}
