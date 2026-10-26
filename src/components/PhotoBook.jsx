import {useEffect,useMemo,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,RotateCcw} from 'lucide-react';
import {memories} from '../data/memories';
import {birthday as b} from '../data/birthday';
import {Pic} from './MemoryPhoto';
import {Heart} from './DoodleLayer';
import {Lily} from './Lilies';
import useMedia from '../hooks/useMedia';

// Every memory in src/data/memories.js becomes two pages: the photo, then its caption + message.
const buildSides=(single)=>{
  const s=[{k:'cover'},{k:'ded'},{k:'title'}];
  memories.forEach((m,i)=>s.push({k:'photo',m,i},{k:'text',m,i}));
  s.push({k:'end'},{k:'close'});
  if(!single)s.push({k:'back'});
  return s;
};
const TAPE=['rgba(255,215,106,.78)','rgba(168,216,240,.85)','rgba(247,182,198,.85)','rgba(199,184,255,.85)'];

function Side({s,idx,right,photo,onJump}){
  const no=<span className={`pgno hand ${right?'r':'l'}`}>{idx}</span>;
  switch(s.k){
    case 'cover':return <div className="pg cover"><div className="cv-frame">
      <p className="hand cv-kick">{b.bookKicker}</p>
      <h3 className="display cv-title">{b.bookTitle}</h3>
      <div className="cv-lilies"><Lily className="cv-l" v="white" bells={7}/><Lily className="cv-l big" v="pink" bells={6} delay={-2}/><Lily className="cv-l" v="blue" flip bells={7} delay={-4}/></div>
      <p className="hand cv-name">for {b.friendName}</p>
      <p className="hand cv-open">open me {'\u2192'}</p></div></div>;
    case 'ded':return <div className="pg center">
      {photo?<div className="pg-selfie"><span className="tape" style={{background:TAPE[1]}}/><img src={photo} alt="Your welcome photo"/><span className="hand">{b.entryCaption}</span></div>:<Heart className="pg-heart"/>}
      <p className="hand pg-small">made for</p>
      <h3 className="display pg-name">{b.friendName}</h3>
      <p className="hand pg-small">{memories.length} {memories.length===1?'memory':'memories'} inside</p>{no}</div>;
    case 'title':return <div className="pg">
      <p className="hand pg-small">what{'\u2019'}s inside</p>
      <h3 className="display pg-h">Moments I keep</h3>
      <ol className="toc">{memories.slice(0,9).map((m,i)=><li key={m.id}><button onClick={()=>onJump(3+2*i)}><span className="t">{m.caption}</span><i/><b>{3+2*i}</b></button></li>)}</ol>
      {memories.length>9&&<p className="hand pg-small">+ {memories.length-9} more to find</p>}{no}</div>;
    case 'photo':return <div className="pg center">
      <div className={`pg-frame ${s.m.shape}`}><span className="tape" style={{background:TAPE[s.i%4]}}/><Pic m={s.m}/></div>
      <p className="hand pg-cap">{s.m.caption}</p>{s.m.date&&<p className="hand pg-date">{s.m.date}</p>}{no}</div>;
    case 'text':return <div className={`pg quote-page quote-${s.m.kind || ['tender','playful','dreamy','classic'][s.i%4]}`}>
      <p className="hand pg-small">chapter {String(s.i+1).padStart(2,'0')} / {s.m.chapter || 'little things worth keeping'}</p>
      <h3 className="hand pg-title">{s.m.caption}</h3>
      <blockquote className="book-quote"><span className="book-quote-mark" aria-hidden="true">“</span><p>{s.m.quote || 'I did not know it then, but this was a moment I would keep coming back to.'}</p></blockquote>
      <div className={`pg-msg ${s.m.message.length>340?'long':''}`}><p className="serif">{s.m.message}</p></div>
      <p className="hand book-quote-signoff">— just something I wanted you to know</p>
      <Heart className="pg-heart sm"/>{no}</div>;
    case 'end':return <div className="pg center">
      <Lily className="pg-lily" v="pink" bells={7}/><h3 className="display pg-h">The end</h3><p className="hand pg-small">(of the book, not of the feeling)</p>{no}</div>;
    case 'close':return <div className="pg center">
      <p className="serif pg-closing">{b.closingLine}</p><p className="hand pg-sig">{b.signature}</p><Heart className="pg-heart"/>{no}</div>;
    case 'back':return <div className="pg cover back"><div className="cv-frame"><Heart className="pg-heart"/><p className="hand cv-name">made with love by {b.signature}</p></div></div>;
    default:return null;
  }
}

export default function PhotoBook({photo}){
  const single=useMedia('(max-width:760px)');
  const sides=useMemo(()=>buildSides(single),[single]);
  const L=single?sides.length:sides.length/2,max=single?L-1:L;
  const [at,setAt]=useState(0),sx=useRef(0),wrap=useRef();
  useEffect(()=>setAt(0),[single]);
  const go=d=>setAt(a=>Math.min(Math.max(a+d,0),max));
  const jump=idx=>setAt(single?idx:(idx%2?(idx+1)/2:idx/2));
  const key=e=>{if(e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}};
  const click=e=>{
    if(e.target.closest('button,a'))return;
    const r=wrap.current.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;
    if(single)go(x<.3?-1:1);else if(at===0)go(1);else if(at===L)go(-1);else go(x<.5?-1:1);
  };
  const touchEnd=e=>{const dx=e.changedTouches[0].clientX-sx.current;if(Math.abs(dx)>45)go(dx<0?1:-1)};
  const status=single?`Page ${at+1} of ${sides.length}`:at===0?'Cover':at===L?'Back cover':`Pages ${2*at-1}\u2013${2*at}`;
  const vis=(j,face)=>single?(face==='front'&&j===at):(face==='front'?j===at:j===at-1);

  return <section className="section" id="book" aria-labelledby="book-h">
    <p className="eyebrow hand">bound &amp; printed</p>
    <h2 id="book-h" className="display h2">The Photo Book</h2>
    <p className="hand sub2">every moment of you ends up in here {'\u2193'}</p>
    <div className={`book-stage ${single?'single':''}`}>
      <div className={`book ${single?'single':''}`} ref={wrap} tabIndex={0} role="group" aria-roledescription="photo book" aria-label={`Photo book. ${status}. Use the left and right arrow keys to turn pages.`}
        onKeyDown={key} onClick={click} onTouchStart={e=>{sx.current=e.touches[0].clientX}} onTouchEnd={touchEnd}>
        <div className="book-slide" style={{transform:single?undefined:`translateX(${at===0?-25:at===L?25:0}%)`}}>
          {Array.from({length:L},(_,j)=>{
            const flipped=j<at,f=single?sides[j]:sides[2*j],bk=single?null:sides[2*j+1];
            return <div key={j} className={`leaf ${flipped?'flipped':''}`} style={{zIndex:flipped?j+1:L-j}}>
              <div className="face front" ref={el=>{if(el)el.inert=!vis(j,'front')}} aria-hidden={!vis(j,'front')}>
                <Side s={f} idx={single?j:2*j} right photo={photo} onJump={jump}/></div>
              <div className="face back" ref={el=>{if(el)el.inert=!vis(j,'back')}} aria-hidden={!vis(j,'back')}>
                {bk&&<Side s={bk} idx={2*j+1} right={false} photo={photo} onJump={jump}/>}</div>
            </div>;
          })}
        </div>
      </div>
    </div>
    <div className="book-ctl">
      <button className="btn sm" onClick={()=>go(-1)} disabled={at===0} aria-label="Previous page"><ChevronLeft size={16}/> Prev</button>
      <span className="hand book-status" aria-live="polite">{status}</span>
      <button className="btn sm" onClick={()=>go(1)} disabled={at===max} aria-label="Next page">Next <ChevronRight size={16}/></button>
    </div>
    {at>0&&<button className="btn sm alt" onClick={()=>setAt(0)}><RotateCcw size={16}/> Back to the cover</button>}
  </section>;
}
