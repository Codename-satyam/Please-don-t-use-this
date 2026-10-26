import {birthday as b} from '../data/birthday';
export default function Marquee(){
  const words=b.marquee?.length?b.marquee:['HAPPY BIRTHDAY'];
  const row=[...words,...words,...words].map((w,i)=><span key={i}>{w}<i aria-hidden="true">{i%2?'\u2726':'\u2665'}</i></span>);
  return <div className="marquee" aria-hidden="true"><div className="track"><div>{row}</div><div>{row}</div></div></div>;
}
