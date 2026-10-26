import {useEffect,useRef,useState} from 'react';
import {Volume2,VolumeX} from 'lucide-react';
import {gameMessages,momentWords,rewards,achievements} from '../data/gameMessages';
import {confetti} from './Confetti';
import {Mascot} from './DoodleLayer';
import {beep,useSfx} from '../lib/audio';
import {capybara as C} from '../data/capybara';
import {capySay} from '../lib/capy';
const DUR=25,GOAL=35,KINDS=['💗','💖','🌷','💌'],BONUS='🌹',CLOCK='⏳',BEST='bu:best';
const fresh=()=>({caught:0,bonus:0,clocks:0,maxCombo:0});
export default function BirthdayGame(){
  const [st,setSt]=useState('idle'),[score,setScore]=useState(0),[left,setLeft]=useState(DUR),[total,setTotal]=useState(DUR);
  const [items,setItems]=useState([]),[bursts,setBursts]=useState([]),[tray,setTray]=useState([]);
  const [combo,setCombo]=useState(0),[sound,setSound]=useSfx();
  const [best,setBest]=useState(()=>{try{return +localStorage.getItem(BEST)||0}catch{return 0}});
  const [newBest,setNewBest]=useState(false),[stats,setStats]=useState(fresh());
  const t0=useRef(0),ids=useRef(0),last=useRef(0),streak=useRef(0),extra=useRef(0),sr=useRef(fresh()),sc=useRef(0);

  const start=()=>{
    sc.current=0;sr.current=fresh();extra.current=0;streak.current=0;
    setScore(0);setLeft(DUR);setTotal(DUR);setItems([]);setBursts([]);setTray([]);setCombo(0);setNewBest(false);setSt('play');
  };
  useEffect(()=>{
    if(st!=='play')return;let alive=true;const tms=new Set();
    const later=(f,ms)=>{const t=setTimeout(()=>{tms.delete(t);f()},ms);tms.add(t)};
    t0.current=Date.now();
    const tick=setInterval(()=>{
      const tot=DUR+extra.current,l=Math.max(0,tot-Math.floor((Date.now()-t0.current)/1000));
      setTotal(tot);setLeft(l);
      if(!l){setSt('done');setItems([])}
    },250);
    const spawn=()=>{
      if(!alive)return;
      const el=(Date.now()-t0.current)/1000,id=++ids.current,r=Math.random(),type=r<.1?'bonus':r<.17?'clock':'norm',life=Math.max(1500,2700-el*45);
      setItems(a=>[...a,{id,life,type,x:6+Math.random()*80,y:12+Math.random()*64,k:type==='bonus'?BONUS:type==='clock'?CLOCK:KINDS[Math.random()*4|0],pts:type==='bonus'?5:1}]);
      later(()=>setItems(a=>a.filter(o=>o.id!==id)),life);
      later(spawn,Math.max(420,1000-el*24));
    };
    spawn();
    return()=>{alive=false;clearInterval(tick);tms.forEach(clearTimeout)};
  },[st]);
  // Capy steps out of the way while you play
  useEffect(()=>{document.body.toggleAttribute('data-playing',st==='play');return()=>document.body.removeAttribute('data-playing')},[st]);
  useEffect(()=>{
    if(st!=='done')return;
    confetti(140);capySay(C.gameDone.replace('{score}',sc.current),{cheer:true});setStats({...sr.current});
    const fin=sc.current;let prev=0;
    try{prev=+localStorage.getItem(BEST)||0;if(fin>prev)localStorage.setItem(BEST,String(fin))}catch{}
    setNewBest(fin>prev&&prev>0);setBest(Math.max(prev,fin));
  },[st]);

  const catchIt=o=>{
    const now=Date.now();
    streak.current=now-last.current<1600?streak.current+1:1;last.current=now;
    const pts=o.pts+(streak.current>=3?1:0),s=sr.current;
    s.caught++;s.maxCombo=Math.max(s.maxCombo,streak.current);
    if(o.type==='bonus')s.bonus++;
    if(o.type==='clock'){s.clocks++;extra.current+=3}
    sc.current+=pts;setScore(sc.current);setCombo(streak.current);
    setItems(a=>a.filter(x=>x.id!==o.id));setTray(t=>[...t.slice(-11),o.k]);
    beep(o.pts>1?880:o.type==='clock'?660:520+streak.current*40);
    const id=++ids.current,w=momentWords[Math.random()*momentWords.length|0];
    setBursts(b=>[...b,{id,x:o.x,y:o.y,t:o.type==='clock'?'+3 seconds':`${w} +${pts}`}]);
    setTimeout(()=>setBursts(b=>b.filter(x=>x.id!==id)),900);
  };

  const pct=Math.min(100,Math.round(score/GOAL*100));
  const msg=[...gameMessages].reverse().find(m=>score>=m.min)||gameMessages[0];
  const val={score,...stats},badges=achievements.filter(a=>(val[a.stat]||0)>=a.min);
  const meter=<div className="pocket"><div className="meter" role="img" aria-label={`Heart ${pct}% full`}><i style={{width:`${pct}%`}}/></div><div className="tray" aria-hidden="true">{tray.map((e,i)=><span key={i}>{e}</span>)}</div></div>;
  return <section className="section" id="game" aria-labelledby="g-h">
    <p className="eyebrow hand">chapter two</p>
    <h2 id="g-h" className="display h2">Catch What I Adore About You</h2>
    <p className="hand sub2">fill your heart before the candles burn down</p>
    <div className={`arena paper ${st}`}>
      <button className="sound" onClick={()=>setSound(!sound)} aria-pressed={sound} aria-label={sound?'Mute sound':'Turn sound on'}>{sound?<Volume2/>:<VolumeX/>}</button>
      {st==='idle'&&<div className="center"><Mascot/><p className="serif">Little things I adore about you are floating by. Tap, click, or Tab + Enter to catch them. Catch several quickly for a combo, grab {BONUS} for bonus points and {CLOCK} for extra time!</p>
        {best>0&&<p className="hand best">your best: {best}</p>}<button className="btn" onClick={start}>LET'S PLAY</button></div>}
      {st==='play'&&<><div className="timebar" aria-hidden="true"><i style={{width:`${left/total*100}%`}} className={left<=5?'low':''}/></div>
        <div className="hud"><span>⏱ {left}s</span><span>Score {score}</span>{combo>=3&&<span className="combo" key={combo}>Combo ×{combo}</span>}</div>
        {meter}
        {items.map(o=><button key={o.id} className={`orb ${o.pts>1?'bonus':''} ${o.type==='clock'?'clock':''}`} style={{left:`${o.x}%`,top:`${o.y}%`,'--life':`${o.life}ms`}} onClick={()=>catchIt(o)} aria-label={o.type==='bonus'?'Bonus: something extra special':o.type==='clock'?'Extra time':'Something I adore'}>{o.k}</button>)}
        {bursts.map(b=><span key={b.id} className="burst" style={{left:`${b.x}%`,top:`${b.y}%`}} aria-hidden="true">{b.t}</span>)}</>}
      {st==='done'&&<div className="center results" role="status"><Mascot happy/><h3 className="hand">{msg.title}</h3><p className="serif">{msg.text}</p>{meter}
        <p className="serif small">{score} points · heart {pct}% full{newBest?' · ✨ new personal best!':best>0?` · best ${best}`:''}</p>
        {badges.length>0&&<ul className="badges" aria-label="Badges earned">{badges.map(a=><li key={a.title} title={a.desc}><span aria-hidden="true">{a.emoji}</span> {a.title}</li>)}</ul>}
        <h4 className="hand">Rewards</h4>
        <ul className="coupons">{rewards.map(r=>{const ok=score>=r.min;return <li key={r.title} className={`coupon ${ok?'':'locked'}`}><span className="em" aria-hidden="true">{ok?r.emoji:'🔒'}</span><span><b>{ok?r.title:'Locked'}</b><small>{ok?r.text:`Score ${r.min} to unlock`}</small></span></li>})}</ul>
        <button className="btn" onClick={start}>PLAY AGAIN</button></div>}
    </div>
  </section>;
}
