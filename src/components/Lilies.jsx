import {birthday} from '../data/birthday';
const C={white:'#FFFBF2',pink:'#F7B6C6',blue:'#BCD6FF'};
const ink={stroke:'#28251F',strokeLinejoin:'round',strokeLinecap:'round'};
// point on the stem curve (cubic bezier) at t
const B=(t)=>{const p=[[40,200],[40,90],[50,30],[100,25]],u=1-t;
  return [0,1].map(k=>u*u*u*p[0][k]+3*u*u*t*p[1][k]+3*u*t*t*p[2][k]+t*t*t*p[3][k])};

// Hand-drawn lily-of-the-valley sprig. v: white | pink | blue. bells: 4-8. Turn off with showLilies:false in birthday.js
export function Lily({v='white',flip,className='',delay=0,bells=6,dur=7,style}){
  if(birthday.showLilies===false)return null;
  const pts=Array.from({length:bells},(_,i)=>{const t=.42+.58*(i/(bells-1)||0);const [x,y]=B(t);return {x,y,s:1.2-.5*(i/Math.max(bells-1,1))}});
  return <svg viewBox="0 0 120 200" className={`lily sway ${className}`} style={{animationDelay:`${delay}s`,animationDuration:`${dur}s`,transformOrigin:flip?'67% 100%':'33% 100%',...style}} aria-hidden="true">
    <g transform={flip?'translate(120 0) scale(-1 1)':undefined}>
      <path d="M40 200C10 170 0 125 28 92C46 128 46 170 40 200z" fill="#A9CFA3" strokeWidth="2.2" {...ink}/>
      <path d="M40 200C72 178 88 140 72 104C50 138 46 170 40 200z" fill="#BBDDB2" strokeWidth="2.2" {...ink}/>
      <path d="M31 190C27 160 28 130 28 100M46 188C58 164 64 140 66 118" fill="none" stroke="#28251F" strokeOpacity=".35" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M40 200C40 90 50 30 100 25" fill="none" strokeWidth="2.6" {...ink}/>
      {pts.map((p,i)=><g key={i}>
        <path d={`M${p.x} ${p.y}q4 2 5 9`} fill="none" strokeWidth="1.8" {...ink}/>
        <g transform={`translate(${p.x+5} ${p.y+11}) scale(${p.s})`}>
          <path d="M-6 0C-6-9 6-9 6 0c0 5 2 8 0 9H-6c-2-1 0-4 0-9z" fill={C[v]} strokeWidth="1.8" {...ink}/>
          <path d="M-3.5 -3C-3-6 -1-7 1-7" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M-5 7q2.5 3 5 0t5 0" fill="none" stroke="#28251F" strokeOpacity=".4" strokeWidth="1"/>
        </g>
      </g>)}
    </g>
  </svg>;
}

// ---- side garden: lots of sprigs of different sizes growing in from both edges ----
const rng=(seed)=>()=>((seed=Math.imul(seed^(seed>>>15),seed|1),seed^=seed+Math.imul(seed^(seed>>>7),seed|61),((seed^(seed>>>14))>>>0)/4294967296));
const VAR=['white','pink','blue','white','pink'];
function makeSide(side,seed){
  const r=rng(seed),out=[],push=(o)=>out.push({side,...o,v:VAR[(r()*VAR.length)|0],bells:4+((r()*5)|0),delay:-(r()*8),dur:5.5+r()*4});
  // back layer: small, faint, scattered up the edge
  for(let i=0;i<9;i++)push({layer:'back',w:34+r()*28,y:4+i*11+r()*6,x:-6+r()*26,rot:20+r()*50,o:.5});
  // front layer: bigger sprigs sprouting sideways from the edge
  for(let i=0;i<9;i++)push({layer:'front',w:62+r()*70,y:10+i*10.5+r()*5,x:-26+r()*16,rot:14+r()*68,o:1});
  // bottom clump: tall, upright, biggest
  for(let i=0;i<6;i++)push({layer:'front',w:90+r()*80,y:-4+r()*3,x:r()*(70+i*14),rot:-8+r()*30,o:1});
  // a few tiny buds tucked between
  for(let i=0;i<6;i++)push({layer:'front',w:26+r()*18,y:6+r()*88,x:14+r()*34,rot:r()*60,o:.9});
  return out;
}
const SIDES=[...makeSide('l',11),...makeSide('r',29)];
const HR=rng(77),FH=Array.from({length:16},(_,i)=>({l:i%2?88+HR()*10:HR()*10,s:10+HR()*16,d:11+HR()*10,dl:-HR()*18,c:['#F48FB1','#FF6B8B','#fffaf0','#E5365F'][i%4]}));
export function Garden(){
  if(birthday.showLilies===false)return null;
  return <div className="garden" aria-hidden="true">
    {FH.map((h,i)=><span key={'h'+i} className="fh" style={{left:`${h.l}%`,'--s':h.s,color:h.c,animationDuration:`${h.d}s`,animationDelay:`${h.dl}s`}}>{'\u2665'}</span>)}
    {SIDES.map((g,i)=>{const left=g.side==='l';
      return <div key={i} className={`gl ${g.layer}`} style={{'--w':g.w,[left?'left':'right']:`${g.x}px`,bottom:`${g.y}%`,'--rot':`${left?g.rot:-g.rot}deg`,opacity:g.o,zIndex:g.layer==='back'?0:1,transformOrigin:left?'33% 100%':'67% 100%'}}>
        <Lily v={g.v} flip={!left} delay={g.delay} dur={g.dur} bells={g.bells}/>
      </div>})}
  </div>;
}

export const LilyDivider=()=><div className="divider" aria-hidden="true"><i/><i/><i/></div>;
