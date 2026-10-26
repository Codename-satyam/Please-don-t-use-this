import {useCallback,useEffect,useRef,useState} from 'react';
import {Play,Pause,Shuffle} from 'lucide-react';
import {memories} from '../data/memories';
import {Pic} from './MemoryPhoto';
import MemoryMessage from './MemoryMessage';
import useLoved from '../hooks/useLoved';
import {Arrow} from './DoodleLayer';

// Default little emoji after each caption. Set `emoji` on a memory to change it, or emoji:'' to remove it.
const EMOJI=['\u{1F979}','\u{1F60D}','\u{1F451}','\u{1F4AB}','\u{1F337}','\u{1F497}','\u{1FAF6}','\u{1F98B}','\u{1F90D}','\u{1F339}'];
const POINTERS=['MY FAVOURITE PERSON','STILL THINKING ABOUT THIS','HEART ON REPEAT','MY SOFT SPOT','YOU, ALWAYS YOU','HOW IS THIS REAL','MY KIND OF MAGIC','KEEPING THIS ONE'];
const rnd=(i,k,seed)=>{const x=Math.sin((i+1)*127.1+k*311.7+seed*74.7)*43758.5453;return x-Math.floor(x)};

const HeartSticker=({on})=><svg viewBox="0 0 50 46" className={`hs ${on?'on':''}`} aria-hidden="true">
  <path d="M25 44C6 30 2 18 8 10c5-6 13-4 17 3 4-7 12-9 17-3 6 8 2 20-17 34z" fill="url(#pin-hg)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round"/>
  <ellipse cx="15" cy="15" rx="5" ry="3" transform="rotate(-35 15 15)" fill="#fff" opacity=".6"/>
</svg>;

const Butterfly=({t,dur,dl,s=1})=><span className="bfly" style={{'--t':t,'--dur':`${dur}s`,'--dl':`${dl}s`,width:46*s}} aria-hidden="true">
  <svg viewBox="0 0 60 50"><g className="bwings">
    <g className="wing wl"><path d="M29 24C20 4 2 2 3 16c1 10 13 16 26 11zM29 27C20 29 9 34 14 43c6 6 14-4 15-14z" fill="#b9c6ec" stroke="#28251F" strokeWidth="1.4" strokeLinejoin="round"/></g>
    <g transform="translate(60 0) scale(-1 1)"><g className="wing wr"><path d="M29 24C20 4 2 2 3 16c1 10 13 16 26 11zM29 27C20 29 9 34 14 43c6 6 14-4 15-14z" fill="#c9b8ee" stroke="#28251F" strokeWidth="1.4" strokeLinejoin="round"/></g></g>
  </g>
  <ellipse cx="30" cy="27" rx="2.2" ry="11" fill="#28251F"/><path d="M29 17C27 11 24 8 22 7M31 17C33 11 36 8 38 7" fill="none" stroke="#28251F" strokeWidth="1.3" strokeLinecap="round"/></svg>
</span>;

export default function PinBoard(){
  const n=memories.length;
  const [loved,toggle]=useLoved();
  const [seed,setSeed]=useState(0),[pos,setPos]=useState({}),[zs,setZs]=useState({}),[drag,setDrag]=useState(null);
  const [id,setId]=useState(null),[auto,setAuto]=useState(false);
  const board=useRef(),st=useRef(null),moved=useRef(false),zTop=useRef(10);
  const i=memories.findIndex(m=>m.id===id);

  // ---- lightbox (same viewer as the photo wall) ----
  const step=useCallback(d=>setId(cur=>{const k=memories.findIndex(m=>m.id===cur);return memories[(Math.max(k,0)+d+n)%n].id}),[n]);
  const close=()=>{setId(null);setAuto(false)};
  const slideshow=()=>{if(auto){setAuto(false);return}setAuto(true);if(i<0)setId(memories[0].id)};
  useEffect(()=>{if(!auto||i<0)return;const t=setTimeout(()=>step(1),5200);return()=>clearTimeout(t)},[auto,i,step]);

  // ---- dragging (mouse / pen; touch keeps scrolling the page, tap opens) ----
  const down=(e,m)=>{
    if(e.pointerType==='touch'||e.button!==0||e.target.closest('.pin-heart'))return;
    const r=e.currentTarget.getBoundingClientRect(),b=board.current.getBoundingClientRect();
    st.current={id:m.id,sx:e.clientX,sy:e.clientY,o:pos[m.id]||{x:0,y:0},r,b};moved.current=false;
    const mv=ev=>{const s=st.current;if(!s)return;let dx=ev.clientX-s.sx,dy=ev.clientY-s.sy;
      if(!moved.current){if(Math.hypot(dx,dy)<5)return;moved.current=true;setDrag(s.id);setZs(z=>({...z,[s.id]:++zTop.current}))}
      dx=Math.min(Math.max(dx,s.b.left+6-s.r.left),s.b.right-6-s.r.right);
      dy=Math.min(Math.max(dy,s.b.top+6-s.r.top),s.b.bottom-6-s.r.bottom);
      setPos(p=>({...p,[s.id]:{x:s.o.x+dx,y:s.o.y+dy}}))};
    const up=()=>{st.current=null;setDrag(null);removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};
    addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up);
  };
  const open=mid=>{if(moved.current){moved.current=false;return}setId(mid)};
  const shuffle=()=>{setPos({});setSeed(s=>s+1)};
  const count=memories.filter(m=>loved.has(m.id)).length;

  return <section className="section" id="pinboard" aria-labelledby="pin-h">
    <p className="eyebrow hand">pinned close to my heart</p>
    <h2 id="pin-h" className="display h2">The Pin Board</h2>
    <p className="hand sub2">tap a print to open it, tap its heart to love it <Arrow className="arrow-inline"/></p>
    <p className="hand dragtip">on a computer you can also drag the photos around</p>
    <div className="toolbar">
      <button className="btn alt" onClick={shuffle}><Shuffle size={16}/> SHUFFLE THE BOARD</button>
      <button className="btn" onClick={slideshow}>{auto?<Pause size={16}/>:<Play size={16}/>} {auto?'STOP SLIDESHOW':'SLIDESHOW'}</button>
    </div>
    <p className="hand lovecount" aria-live="polite">{count>0?`\u2665 ${count} of ${n} loved`:'\u00a0'}</p>
    <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true"><defs><linearGradient id="pin-hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff5c7a"/><stop offset="1" stopColor="#e0143c"/></linearGradient></defs></svg>
    <div className="board" ref={board}>
      <div className="pins">
        {memories.map((m,k)=>{
          const p=pos[m.id]||{x:0,y:0},isL=loved.has(m.id),emoji=m.emoji??EMOJI[k%EMOJI.length];
          return <div key={m.id} className={`pin ${m.size} ${m.shape} pin-kind-${m.kind || ['tender','playful','dreamy','classic'][k%4]} ${drag===m.id?'drag':''}`} onPointerDown={e=>down(e,m)}
            style={{'--i':k,'--r':`${(rnd(k,1,seed)-.5)*17}deg`,'--jx':(rnd(k,2,seed)-.5)*44,'--jy':(rnd(k,3,seed)-.5)*38,'--dx':p.x,'--dy':p.y,'--z':zs[m.id]||1+(k%3)}}>
            <button className="pin-btn" onClick={()=>open(m.id)} aria-label={`Open memory: ${m.caption}${isL?' (loved)':''}`}>
              <Pic m={m}/>
              <span className="pin-cap hand">{m.caption}{emoji?` ${emoji}`:''}</span>
              <span className={`pin-pointer pointer-${m.kind || ['tender','playful','dreamy','classic'][k%4]}`}>{m.pointer || POINTERS[k%POINTERS.length]}</span>
            </button>
            <button className={`pin-heart ${isL?'on':''}`} onClick={()=>toggle(m.id)} aria-pressed={isL} aria-label={`${isL?'Unlove':'Love'}: ${m.caption}`}><HeartSticker on={isL}/></button>
          </div>;
        })}
      </div>
      <Butterfly t="14%" dur={26} dl={0}/><Butterfly t="58%" dur={34} dl={-12} s={.8}/><Butterfly t="82%" dur={30} dl={-21} s={.65}/>
    </div>
    <MemoryMessage m={i>=0?memories[i]:null} index={Math.max(i,0)} total={n} loved={i>=0&&loved.has(memories[i].id)} onLove={()=>i>=0&&toggle(memories[i].id)}
      auto={auto} onAuto={slideshow} onClose={close} onStep={step}/>
  </section>;
}
