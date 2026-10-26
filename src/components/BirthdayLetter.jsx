import {useState} from 'react';
import {birthday as b} from '../data/birthday';
import {confetti} from './Confetti';
import {capybara as C} from '../data/capybara';
import {capySay} from '../lib/capy';
export default function BirthdayLetter({photo}){
  const [open,setOpen]=useState(false);
  const toggle=()=>{if(!open){confetti(50);capySay(C.letterOpen,{auto:true})}setOpen(o=>!o)};
  const paras=[...b.letter.map(t=>({t})),b.favoriteMemory&&{t:b.favoriteMemory,em:true},b.finalWish&&{t:b.finalWish}].filter(Boolean);
  return <section className="section" id="letter" aria-labelledby="l-h">
    <p className="eyebrow hand">chapter three</p>
    <h2 id="l-h" className="display h2">A Letter From My Heart</h2>
    <button className={`env ${open?'open':''}`} onClick={toggle} aria-expanded={open} aria-controls="letter-body"><span className="flap"/><span className="seal" aria-hidden="true">{'\u2665'}</span><span className="hand">{open?'close the envelope':'open the envelope'}</span></button>
    <div className={`letter-wrap ${open?'open':''}`}><div className="letter-clip">
      <article id="letter-body" className="letter paper" aria-hidden={!open}>
        {photo&&<div className="stamp" aria-hidden="true"><img src={photo} alt=""/><svg viewBox="0 0 60 30"><path d="M0 8q7-6 15 0t15 0 15 0 15 0M0 15q7-6 15 0t15 0 15 0 15 0M0 22q7-6 15 0t15 0 15 0 15 0" fill="none" stroke="#28251F" strokeOpacity=".5" strokeWidth="1.4"/></svg></div>}
        <p className="hand big" style={{'--d':'.2s'}}>{b.greeting}</p>
        {paras.map((p,i)=><p className="serif" key={i} style={{'--d':`${.4+i*.2}s`}}>{p.em?<em>{p.t}</em>:p.t}</p>)}
        {b.ps&&<p className="serif ps" style={{'--d':`${.4+paras.length*.2}s`}}><b>P.S.</b> {b.ps}</p>}
        <p className="hand big sig" style={{'--d':`${.6+paras.length*.2}s`}}>{b.signature}</p>
      </article>
    </div></div>
  </section>;
}
