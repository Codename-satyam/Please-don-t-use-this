import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Play, Pause, X, CalendarDays } from 'lucide-react';
import { Pic } from './MemoryPhoto';

export default function MemoryMessage({ m, index, total, loved, onLove, auto, onAuto, onClose, onStep }) {
  const dialog = useRef(null);
  const lastMemory = useRef(m);
  const touchX = useRef(0);
  if (m) lastMemory.current = m;
  const shown = m || lastMemory.current;

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (m && !el.open) el.showModal();
    if (!m && el.open) {
      el.classList.add('memory-viewer-out');
      const timer = window.setTimeout(() => {
        if (el.open) el.close();
        el.classList.remove('memory-viewer-out');
      }, 220);
      return () => window.clearTimeout(timer);
    }
    el.classList.remove('memory-viewer-out');
  }, [m]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') onStep(1);
    if (event.key === 'ArrowLeft') onStep(-1);
    if (event.key === 'Escape') onClose();
  };

  return (
    <dialog
      ref={dialog}
      className="viewer memory-viewer"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === dialog.current) onClose(); }}
      aria-labelledby="memory-viewer-title"
    >
      {shown && (
        <div className="memory-viewer-inner" key={shown.id}
          onTouchStart={(event) => { touchX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            const delta = event.changedTouches[0].clientX - touchX.current;
            if (Math.abs(delta) > 50) onStep(delta < 0 ? 1 : -1);
          }}>
          <div className="memory-viewer-visual">
            <div className={`memory-viewer-photo ${shown.shape || 'portrait'}`}><Pic m={shown}/></div>
            <span className="memory-viewer-index">{String(index + 1).padStart(2, '0')} <i>/</i> {String(total).padStart(2, '0')}</span>
          </div>
          <article className="memory-viewer-note">
            <div className="memory-viewer-note-top"><span>FROM ME, TO YOU</span><button className="memory-viewer-close" onClick={onClose} aria-label="Close memory"><X size={19}/></button></div>
            <p className="memory-viewer-eyebrow">A MOMENT I KEEP</p>
            <h2 id="memory-viewer-title">{shown.caption}</h2>
            {shown.date && <p className="memory-viewer-date"><CalendarDays size={14}/>{shown.date}</p>}
            <p className="memory-viewer-message">{shown.message}</p>
            <div className="memory-viewer-controls">
              <button className="memory-circle-control" onClick={() => onStep(-1)} aria-label="Previous memory"><ChevronLeft size={19}/></button>
              <button className={`memory-viewer-love ${loved ? 'is-loved' : ''}`} onClick={onLove} aria-pressed={loved}><Heart size={17} fill={loved ? 'currentColor' : 'none'}/>{loved ? 'Saved to favourites' : 'Keep this one'}</button>
              <button className="memory-circle-control" onClick={() => onStep(1)} aria-label="Next memory"><ChevronRight size={19}/></button>
            </div>
            <button className="memory-viewer-slideshow" onClick={onAuto} aria-pressed={auto}>{auto ? <Pause size={15}/> : <Play size={15}/>} {auto ? 'Pause the story' : 'Let the memories play'}</button>
            {auto && <div className="memory-viewer-progress"><span key={shown.id}/></div>}
          </article>
        </div>
      )}
    </dialog>
  );
}
