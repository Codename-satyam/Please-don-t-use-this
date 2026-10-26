import {useEffect,useRef,useState} from 'react';
import {Download,Mic,Music,RotateCcw,Share2} from 'lucide-react';
import {birthday as b} from '../data/birthday';
import {confetti} from './Confetti';
import {playTune,stopTune,lineOf,useTunePlaying} from '../lib/audio';
import {makeWishCard} from '../lib/wishCard';
import {capybara as C} from '../data/capybara';
import {capySay} from '../lib/capy';
const N=Math.max(1,Math.min(12,+b.candles||5));
const xs=Array.from({length:N},(_,i)=>N===1?150:80+i*(140/(N-1)));
const WAX=['#FFD76A','#A8D8F0','#F7B6C6','#BBDDB2'];
const SPR=[[70,196,'#FF6B6B',20],[104,214,'#FFD76A',-30],[142,200,'#A8D8F0',60],[176,218,'#fffaf0',10],[212,198,'#FF6B6B',-50],[236,214,'#FFD76A',35],[88,150,'#FFD76A',25],[132,158,'#A8D8F0',-20],[200,152,'#fffaf0',50],[226,160,'#C7B8FF',-40]];
const LYRICS=['Happy birthday to you','Happy birthday to you',`Happy birthday dear ${b.friendName}`,'Happy birthday to you'];
export default function BirthdayCake({photo}){
  const [lit,setLit]=useState(xs.map(()=>false)),[wished,setWished]=useState(false),[smoke,setSmoke]=useState([]);
  const [card,setCard]=useState(null),[listening,setListening]=useState(false),[micErr,setMicErr]=useState(''),[line,setLine]=useState(-1),[sung,setSung]=useState(false);
  const prev=useRef(lit),lastLine=useRef(-1),mic=useRef(null),tunePlaying=useTunePlaying(),ids=useRef(0);

  // react to candles changing: smoke puffs, and the wish when the last flame dies
  useEffect(()=>{
    const p=prev.current;prev.current=lit;
    const out=lit.map((v,i)=>p[i]&&!v?i:-1).filter(i=>i>=0);
    if(out.length){
      const puffs=out.map(i=>({id:++ids.current,x:xs[i]}));
      setSmoke(s=>[...s,...puffs]);
      setTimeout(()=>setSmoke(s=>s.filter(q=>!puffs.includes(q))),1700);
    }
    if(p.some(Boolean)&&!lit.some(Boolean)){
      setWished(true);stopTune();stopListen();
      confetti(110,{x:0,y:innerHeight,angle:62,spread:40});confetti(110,{x:innerWidth,y:innerHeight,angle:118,spread:40});
      setTimeout(()=>confetti(160),350);capySay(C.cheer,{cheer:true,ms:11000});
      makeWishCard({photo,name:b.friendName,line:b.closingLine,caption:b.entryCaption}).then(setCard).catch(()=>{});
    }
  },[lit]);// eslint-disable-line
  useEffect(()=>()=>{stopTune();stopListen()},[]);// eslint-disable-line

  const lightAll=()=>{setWished(false);setCard(null);setLit(xs.map(()=>true));confetti(50);capySay(C.lit,{auto:true})};
  const blowAll=()=>{lit.forEach((on,i)=>{if(on)setTimeout(()=>setLit(l=>l.map((v,j)=>j===i?false:v)),i*150)})};
  const toggle=i=>setLit(l=>l.map((v,j)=>j===i?!v:v));
  const main=()=>{lit.every(Boolean)?blowAll():lightAll()};

  const sing=()=>{
    if(tunePlaying){stopTune();setLine(-1);return}
    if(!lit.some(Boolean)){setWished(false);setCard(null);setLit(xs.map(()=>true))}
    setSung(false);lastLine.current=-1;
    playTune({onNote:i=>{const l=lineOf(i);setLine(l);if(l!==lastLine.current){lastLine.current=l;capySay(LYRICS[l],{ms:3400})}},onEnd:()=>{setLine(-1);setSung(true)}});
  };

  function stopListen(){
    const m=mic.current;if(!m)return;
    cancelAnimationFrame(m.raf);m.stream.getTracks().forEach(t=>t.stop());try{m.ctx.close()}catch{}
    mic.current=null;setListening(false);
  }
  const listen=async()=>{
    if(listening){stopListen();return}
    setMicErr('');
    if(!lit.some(Boolean)){setWished(false);setCard(null);setLit(xs.map(()=>true))}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      const AC=window.AudioContext||window.webkitAudioContext,ctx=new AC(),an=ctx.createAnalyser();an.fftSize=1024;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf=new Float32Array(an.fftSize);let loud=0;
      const m={stream,ctx,raf:0};mic.current=m;setListening(true);
      const tick=()=>{
        an.getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];
        loud=Math.sqrt(s/buf.length)>.1?loud+1:Math.max(0,loud-1);
        if(loud>9){stopListen();blowAll();return}
        m.raf=requestAnimationFrame(tick);
      };
      tick();
    }catch{setMicErr('No microphone access, so tap the candles or press the button instead.')}
  };

  const download=()=>{const a=document.createElement('a');a.href=card;a.download='birthday-card.png';a.click()};
  const share=async()=>{
    try{
      const f=new File([await (await fetch(card)).blob()],'birthday-card.png',{type:'image/png'});
      if(navigator.canShare?.({files:[f]}))await navigator.share({files:[f],title:'Happy birthday!'});else download();
    }catch{}
  };
  const allLit=lit.every(Boolean);
  const hint=wished?b.closingLine:sung?'Now make your wish and blow them out!':allLit?'Candles lit. Make a wish, then blow them out.':'Light the candles (tap them, or press the button).';

  return <section className="section finale" id="finale" aria-labelledby="f-h">
    <p className="eyebrow hand">the grand finale</p>
    <h2 id="f-h" className="display h2">{b.wishHeadline}</h2>
    <div className="cakewrap">
      <svg viewBox="0 0 300 270" className="cake" role="group" aria-label={`Birthday cake with ${N} candles`}>
        <defs><radialGradient id="glow"><stop offset="0" stopColor="#FFE9A8" stopOpacity=".95"/><stop offset="1" stopColor="#FFB02E" stopOpacity="0"/></radialGradient></defs>
        <ellipse cx="150" cy="240" rx="138" ry="15" fill="#fffaf0" stroke="#28251F" strokeWidth="3"/>
        <rect x="40" y="170" width="220" height="66" rx="10" fill="#C7B8FF" stroke="#28251F" strokeWidth="3"/>
        <rect x="60" y="120" width="180" height="55" rx="10" fill="#FF6B6B" stroke="#28251F" strokeWidth="3"/>
        <path d="M40 186q14 20 28 0t28 0 28 0 28 0 28 0 28 0 28 0 24 0" fill="#FFF4E5" stroke="#28251F" strokeWidth="3"/>
        <path d="M60 135q15 18 30 0t30 0 30 0 30 0 30 0" fill="#FFF4E5" stroke="#28251F" strokeWidth="3"/>
        {SPR.map(([x,y,c,r],i)=><rect key={i} x={x} y={y} width="12" height="4" rx="2" fill={c} stroke="#28251F" strokeWidth="1.2" transform={`rotate(${r} ${x+6} ${y+2})`}/>)}
        {xs.map((x,i)=><g key={i} role="button" tabIndex={0} aria-pressed={lit[i]} aria-label={`Candle ${i+1}, ${lit[i]?'lit, press to blow out':'out, press to light'}`} className="candle" onClick={()=>toggle(i)} onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&(e.preventDefault(),toggle(i))}>
          <rect x={x-14} y="40" width="28" height="84" fill="transparent"/>
          <rect x={x-5} y="80" width="10" height="42" fill={WAX[i%4]} stroke="#28251F" strokeWidth="2.5"/>
          <path d={`M${x-5} 92l10 -6M${x-5} 104l10 -6M${x-5} 116l10 -6`} stroke="#28251F" strokeOpacity=".28" strokeWidth="2"/>
          <path d={`M${x} 80v-4`} stroke="#28251F" strokeWidth="2"/>
          {lit[i]&&<g className="flamewrap"><circle className="glow" cx={x} cy="64" r="26" fill="url(#glow)"/><path className="flame" d={`M${x} 52q-10 14 0 26q10-12 0-26z`} fill="#FFB02E" stroke="#28251F" strokeWidth="2"/><path className="flame in" d={`M${x} 62q-4 7 0 13q4-6 0-13z`} fill="#FFF1B8"/></g>}
        </g>)}
        {smoke.map(s=><circle key={s.id} className="smoke" cx={s.x} cy="64" r="5" fill="#28251F"/>)}
      </svg>
    </div>
    <p className="serif closing" role="status">{hint}</p>
    {(tunePlaying||line>=0)&&<ol className="lyrics" aria-label="Lyrics">{LYRICS.map((t,i)=><li key={i} className={line===i?'on':''}>{t}</li>)}</ol>}
    <div className="actions">
      <button className="btn" onClick={main}>{allLit?'BLOW THEM OUT':'MAKE A WISH'}</button>
      <button className="btn alt" onClick={sing} aria-pressed={tunePlaying}><Music size={16}/> {tunePlaying?'STOP SINGING':'SING ALONG'}</button>
      {navigator.mediaDevices?.getUserMedia&&<button className={`btn lav ${listening?'live':''}`} onClick={listen} aria-pressed={listening}><Mic size={16}/> {listening?'LISTENING... BLOW!':'BLOW (USE MIC)'}</button>}
    </div>
    {micErr&&<p className="entry-err" role="alert">{micErr}</p>}
    {listening&&<p className="serif small">The mic is only listening for a puff of air. Nothing is recorded.</p>}
    {wished&&<div className="wishcard">
      <p className="hand sub2">your wish card</p>
      {card?<><img src={card} alt={`Birthday card for ${b.friendName}`}/>
        <div className="actions"><button className="btn" onClick={download}><Download size={16}/> SAVE THE CARD</button>
        {navigator.canShare&&<button className="btn alt" onClick={share}><Share2 size={16}/> SHARE</button>}
        <button className="btn lav" onClick={lightAll}><RotateCcw size={16}/> WISH AGAIN</button></div></>
      :<p className="serif small">painting your card...</p>}
    </div>}
  </section>;
}
