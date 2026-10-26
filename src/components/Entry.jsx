import {useEffect,useRef,useState} from 'react';
import {birthday as b} from '../data/birthday';
import {confetti} from './Confetti';
import {Mascot} from './DoodleLayer';
import {Garden} from './Lilies';
import useReducedMotion from '../hooks/useReducedMotion';

// center-crop any image/video source to a 4:5 portrait and return a JPEG data URL
const crop=(src,sw,sh,mirror)=>{
  const W=720,H=900,c=document.createElement('canvas');c.width=W;c.height=H;
  const k=Math.max(W/sw,H/sh),w=sw*k,h=sh*k,x=c.getContext('2d');
  if(mirror){x.translate(W,0);x.scale(-1,1)}
  x.drawImage(src,(W-w)/2,(H-h)/2,w,h);
  return c.toDataURL('image/jpeg',.9);
};
function useTyped(text,on){
  const reduced=useReducedMotion(),[n,setN]=useState(0);
  useEffect(()=>{
    if(!on){setN(0);return}
    if(reduced){setN(text.length);return}
    setN(0);const id=setInterval(()=>setN(v=>{if(v>=text.length){clearInterval(id);return v}return v+1}),22);
    return()=>clearInterval(id);
  },[on,text,reduced]);
  return n;
}

export default function Entry({onDone}){
  const [stage,setStage]=useState('intro'); // intro | live | photo
  const [err,setErr]=useState(''),[count,setCount]=useState(0),[flash,setFlash]=useState(false);
  const [shot,setShot]=useState(null),[leaving,setLeaving]=useState(false);
  const vid=useRef(),stream=useRef(),file=useRef(),timer=useRef();
  const stop=()=>{stream.current?.getTracks().forEach(t=>t.stop());stream.current=null};
  useEffect(()=>{document.body.style.overflow='hidden';return()=>{document.body.style.overflow='';stop();clearInterval(timer.current)}},[]);
  useEffect(()=>{if(stage==='live'&&vid.current&&stream.current){vid.current.srcObject=stream.current;vid.current.play().catch(()=>{})}},[stage]);

  const start=async()=>{
    setErr('');
    if(!navigator.mediaDevices?.getUserMedia){setErr('This browser can\u2019t open the camera here. You can upload a selfie instead, or skip.');return}
    try{stream.current=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:1280}},audio:false});setStage('live')}
    catch{setErr('Camera permission was blocked. You can upload a selfie instead, or skip.')}
  };
  const grab=()=>{
    const v=vid.current;if(!v||!v.videoWidth)return;
    setFlash(true);setTimeout(()=>setFlash(false),350);
    setShot(crop(v,v.videoWidth,v.videoHeight,true));stop();setStage('photo');confetti(90);
  };
  const snap=()=>{
    if(count)return;let n=3;setCount(n);
    timer.current=setInterval(()=>{n--;if(n>0)setCount(n);else{clearInterval(timer.current);setCount(0);grab()}},900);
  };
  const upload=(e)=>{
    const f=e.target.files?.[0];if(!f)return;
    const img=new Image(),u=URL.createObjectURL(f);
    img.onload=()=>{setShot(crop(img,img.naturalWidth,img.naturalHeight,false));URL.revokeObjectURL(u);stop();setStage('photo');confetti(90)};
    img.src=u;
  };
  const retake=()=>{setShot(null);setStage('intro')};
  const enter=()=>{setLeaving(true);setTimeout(()=>onDone(shot),700)};

  const para=b.entryParagraph,n=useTyped(para,stage==='photo');

  return <div className={`entry ${leaving?'out':''}`} role="dialog" aria-modal="true" aria-label="Welcome">
    <Garden/>
    <div className="entry-in">
      {stage!=='photo'&&<>
        <p className="hand label">{b.label}</p>
        <h1 className="display entry-h">{b.entryTitle}</h1>
        <div className="cambox">
          <div className="print cam-print">
            <span className="tape"/>
            <div className="ph cam-ph portrait">
              {stage==='live'
                ?<video ref={vid} playsInline muted aria-label="Live camera preview"/>
                :<div className="cam-idle"><Mascot/><span className="hand">camera is asleep</span></div>}
              {count>0&&<div className="count display" aria-live="assertive">{count}</div>}
              {flash&&<div className="flash"/>}
            </div>
            <span className="cap hand">{b.entryCaption}</span>
          </div>
        </div>
        <p className="serif entry-hint">{b.entryHint}</p>
        {err&&<p className="entry-err" role="alert">{err}</p>}
        <div>
          {stage==='intro'&&<button className="btn" onClick={start}>TURN ON CAMERA</button>}
          {stage==='live'&&<button className="btn" onClick={snap} disabled={count>0}>{count?'HOLD STILL...':'TAKE MY PHOTO'}</button>}
          <button className="btn alt" onClick={()=>file.current.click()}>UPLOAD A SELFIE</button>
          <input ref={file} type="file" accept="image/*" capture="user" hidden onChange={upload}/>
        </div>
        <button className="skip hand" onClick={()=>{stop();setShot(null);setStage('photo')}}>skip, just let me in</button>
      </>}
      {stage==='photo'&&<div className="reveal-photo">
        <div className="entry-row">
          <div className="print big entry-print">
            <span className="tape"/>
            <div className="ph portrait">
              {shot?<img className="develop" src={shot} alt="Your photo, taken just now"/>:<div className="cam-idle"><Mascot happy/></div>}
            </div>
            <span className="cap hand">{b.entryCaption} ✿</span>
          </div>
          <div className="paper entry-note">
            <p className="hand big">{b.greeting}</p>
            <p className="serif" aria-label={para}>
              <span aria-hidden="true">{para.slice(0,n)}<span style={{opacity:0}}>{para.slice(n)}</span></span>
            </p>
          </div>
        </div>
        <div>
          <button className="btn" onClick={enter}>ENTER THE UNIVERSE</button>
          <button className="btn alt" onClick={retake}>RETAKE</button>
        </div>
      </div>}
    </div>
  </div>;
}
