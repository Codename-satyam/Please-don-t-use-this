import {useEffect,useRef} from 'react';
let fire=()=>{};
// confetti(count, {x, y, angle, spread}) - x/y in px; angle (deg, 90 = up) + spread aims a cannon; omit for a round burst
export const confetti=(n,o)=>fire(n,o);
const COLS=['#FF6B8B','#F7B6C6','#FFFBF2','#E5365F','#C7B8FF','#FFD76A','#FFC8D6'];
export default function Confetti(){
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current,x=c.getContext('2d');let ps=[],raf=0;
    const dpr=Math.min(2,devicePixelRatio||1);
    const size=()=>{c.width=innerWidth*dpr;c.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0)};
    size();addEventListener('resize',size);
    const step=()=>{
      x.clearRect(0,0,innerWidth,innerHeight);
      ps=ps.filter(p=>p.l>0&&p.y<innerHeight+40);
      for(const p of ps){
        p.l--;p.vy+=.3;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
        x.globalAlpha=Math.min(1,p.l/30);x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.r);
        if(p.k===0)x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);
        else if(p.k===1){x.beginPath();x.arc(0,0,p.s/3,0,7);x.fill()}
        else if(p.k===3){const h=p.s/2;x.beginPath();x.moveTo(0,h*.9);x.bezierCurveTo(-h*1.7,-h*.1,-h*.8,-h*1.4,0,-h*.5);x.bezierCurveTo(h*.8,-h*1.4,h*1.7,-h*.1,0,h*.9);x.fill()}
        else{x.beginPath();x.moveTo(0,-p.s/2);x.lineTo(p.s/2.5,p.s/2);x.lineTo(-p.s/2.5,p.s/2);x.closePath();x.fill()}
        x.restore();
      }
      x.globalAlpha=1;
      if(ps.length)raf=requestAnimationFrame(step);
    };
    fire=(n=120,o={})=>{
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)n=Math.min(n,20);
      const ox=o.x??innerWidth/2,oy=o.y??innerHeight*.6;
      for(let i=0;i<n;i++){
        let vx,vy;
        if(o.angle!=null){const a=(o.angle+(Math.random()-.5)*(o.spread??50))*Math.PI/180,sp=9+Math.random()*13;vx=Math.cos(a)*sp;vy=-Math.sin(a)*sp}
        else{vx=(Math.random()-.5)*16;vy=-Math.random()*16-4}
        ps.push({x:ox,y:oy,vx,vy,r:Math.random()*6,vr:(Math.random()-.5)*.4,s:Math.random()*8+7,c:COLS[i%COLS.length],k:i%2===0?3:i%5===1?1:i%7===0?2:0,l:110+Math.random()*90});
      }
      cancelAnimationFrame(raf);step();
    };
    return()=>{removeEventListener('resize',size);cancelAnimationFrame(raf);fire=()=>{}};
  },[]);
  return <canvas ref={ref} aria-hidden="true" style={{position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:200}}/>;
}
