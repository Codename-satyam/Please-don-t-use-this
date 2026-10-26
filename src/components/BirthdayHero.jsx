import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {birthday as b} from '../data/birthday';
import {confetti} from './Confetti';
import {Mascot,Arrow,Scribble} from './DoodleLayer';
import DoodleLayer from './DoodleLayer';
import Balloons from './Balloons';
import {capybara as C} from '../data/capybara';
import {capySay} from '../lib/capy';
const Letters=({text,from=0})=><span aria-hidden="true">{[...text].map((ch,i)=><span className="hl" key={i} style={{'--i':i+from}}>{ch===' '?'\u00A0':ch}</span>)}</span>;
export default function BirthdayHero({photo}){
  const [open,setOpen]=useState(false);
  const go=()=>{if(open)return;setOpen(true);confetti(170);capySay(C.gift,{cheer:true})};
  const t='HAPPY BIRTHDAY,';
  return <header className="hero section" id="top">
    <DoodleLayer/><Balloons/>
    {b.age!==''&&b.age!=null&&<div className="sticker" aria-label={`Turning ${b.age}`}><small className="hand">turning</small><b className="display">{b.age}</b></div>}
    <p className="hand label">{b.label}</p>
    <h1 className="display"><span className="sr">{t} {b.friendName}</span><span className="l1"><Letters text={t}/></span><span className="name" aria-hidden="true"><Letters text={b.friendName} from={t.length}/></span></h1>
    <p className="serif sub">{b.subtitle}</p>
    <div className="stage">
      <Mascot happy={open}/>
      <button className={`gift ${open?'open':''}`} onClick={go} aria-label={open?'Gift opened':'Open your surprise gift'} aria-expanded={open}>
        <span className="sparkles" aria-hidden="true"/><span className="lid"/><span className="box"/><span className="ribbon"/>
      </button>
      {photo&&<div className="print mini-print"><span className="tape"/><span className="ph"><img src={photo} alt="You, in the photo you took a moment ago"/></span><span className="cap hand">{b.entryCaption}</span></div>}
      <Arrow className="arrow-hero"/>
    </div>
    {!open&&<button className="btn pulse" onClick={go}>OPEN YOUR SURPRISE</button>}
    <div className={`note paper ${open?'show':''}`} aria-live="polite">
      {open&&<><p className="serif">{b.openNote}</p><Scribble className="under"/>
      <a className="btn alt" href="#memories">SEE THE MEMORIES {'\u2193'}</a></>}
    </div>
    <a className="cue" href="#memories" aria-label="Scroll to the photos"><ChevronDown/></a>
  </header>;
}
