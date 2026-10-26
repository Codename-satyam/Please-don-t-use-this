import { useState } from 'react';
import { Camera } from 'lucide-react';

export function Pic({ m }) {
  return <PicInner key={m.id} m={m}/>;
}

function PicInner({ m }) {
  const [bad, setBad] = useState(false);
  if (bad) {
    return (
      <span className="ph missing" role="img" aria-label={`Placeholder for ${m.alt}`}>
        <Camera size={30}/>
        <small>Add <b>{m.image.split('/').pop()}</b> to public/images/memories</small>
      </span>
    );
  }
  return <span className="ph"><img src={m.image} alt={m.alt} onError={() => setBad(true)}/></span>;
}

export default function MemoryPhoto({ m, onOpen, i = 0, loved, compact = false }) {
  return (
    <div className={`print ${m.size || 'medium'} ${m.shape || 'portrait'} ${compact ? 'memory-photo-compact' : ''}`} style={{'--r': `${m.rotation || 0}deg`, '--i': i}}>
      <button className="printbtn" type="button" onClick={() => onOpen?.(m.id)} aria-label={`Open memory: ${m.caption}${loved ? ' (loved)' : ''}`}>
        <span className="tape" aria-hidden="true"/>
        <Pic m={m}/>
        {!compact && <span className="cap hand">{m.caption}{m.date && <em>{m.date}</em>}</span>}
      </button>
    </div>
  );
}
