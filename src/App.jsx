import {useEffect,useRef,useState} from 'react';
import Confetti,{confetti} from './components/Confetti';
import BirthdayHero from './components/BirthdayHero';
import MemoryGallery from './components/MemoryGallery';
import PinBoard from './components/PinBoard';
import PhotoBook from './components/PhotoBook';
import BirthdayGame from './components/BirthdayGame';
import BirthdayLetter from './components/BirthdayLetter';
import {LilyDivider,Garden} from './components/Lilies';
import Reveal from './components/Reveal';
import BirthdayCake from './components/BirthdayCake';
import Entry from './components/Entry';
import NavDock from './components/NavDock';
import Marquee from './components/Marquee';
import Capybara from './components/Capybara';
import {birthday as b} from './data/birthday';
export default function App(){
  const [entered,setEntered]=useState(false),[photo,setPhoto]=useState(null),main=useRef();
  // keep the page behind the welcome screen out of the tab order
  useEffect(()=>{if(main.current)main.current.inert=!entered},[entered]);
  const done=p=>{setPhoto(p||null);setEntered(true);scrollTo(0,0);setTimeout(()=>confetti(130),250)};
  return <>
    <Confetti/>
    <div className="ambient" aria-hidden="true"><i/><i/><i/><i/></div>
    <Garden/>
    <main ref={main}>
      <BirthdayHero photo={photo}/><Marquee/>
      <Reveal><MemoryGallery/></Reveal><LilyDivider/>
      <Reveal><PinBoard/></Reveal><LilyDivider/>
      <Reveal><PhotoBook photo={photo}/></Reveal><LilyDivider/>
      <Reveal><BirthdayGame/></Reveal><LilyDivider/>
      <Reveal><BirthdayLetter photo={photo}/></Reveal><LilyDivider/>
      <Reveal><BirthdayCake photo={photo}/></Reveal>
      <footer className="foot"><p className="hand">made with {'\u2665'} by {b.signature}</p><a className="hand" href="#top">back to the top {'\u2191'}</a></footer>
    </main>
    {entered&&<NavDock/>}
    {entered&&<Capybara/>}
    {!entered&&<Entry onDone={done}/>}
  </>;
}
