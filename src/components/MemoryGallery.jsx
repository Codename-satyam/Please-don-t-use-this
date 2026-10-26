import { useCallback, useEffect, useMemo, useState } from 'react';
import { Heart, Play, Pause, Shuffle, Search, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { memories } from '../data/memories';
import { Pic } from './MemoryPhoto';
import MemoryMessage from './MemoryMessage';
import useLoved from '../hooks/useLoved';
import './MemoryExperience.css';

export default function MemoryGallery() {
  const [id, setId] = useState(null);
  const [auto, setAuto] = useState(false);
  const [loved, toggleLoved] = useLoved();
  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const activeIndex = memories.findIndex((m) => m.id === id);
  const active = activeIndex >= 0 ? memories[activeIndex] : null;
  const count = memories.filter((m) => loved.has(m.id)).length;

  const visibleMemories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return memories.filter((m) => {
      const matchesText = !q || [m.caption, m.message, m.date, m.alt].some((v) => String(v || '').toLowerCase().includes(q));
      return matchesText && (!favoritesOnly || loved.has(m.id));
    });
  }, [query, favoritesOnly, loved]);

  const step = useCallback((direction) => {
    if (!memories.length) return;
    setId((current) => {
      const currentIndex = memories.findIndex((m) => m.id === current);
      return memories[(Math.max(currentIndex, 0) + direction + memories.length) % memories.length].id;
    });
  }, []);

  const close = () => { setId(null); setAuto(false); };
  const surprise = () => {
    if (!memories.length) return;
    const candidates = memories.filter((m) => m.id !== id);
    const pool = candidates.length ? candidates : memories;
    setId(pool[Math.floor(Math.random() * pool.length)].id);
  };
  const toggleSlideshow = () => {
    setAuto((playing) => !playing);
    if (activeIndex < 0 && memories.length) setId(memories[0].id);
  };

  useEffect(() => {
    if (!auto || activeIndex < 0) return undefined;
    const timer = window.setTimeout(() => step(1), 5200);
    return () => window.clearTimeout(timer);
  }, [auto, activeIndex, step]);

  return (
    <section className="section memory-experience" id="memories" aria-labelledby="mem-h">
      <div className="memory-heading">
        <div className="memory-heading-copy">
          <p className="memory-kicker"><span>01</span> · A LITTLE ARCHIVE OF YOU</p>
          <h2 id="mem-h" className="memory-title">The moments <em>I keep.</em></h2>
          <p className="memory-intro">Every picture holds a little piece of how I see you. Tap one and see what it says.</p>
        </div>
        <div className="memory-heading-stamp" aria-hidden="true">
          <span>made</span><Heart size={20} fill="currentColor"/><span>with love</span>
        </div>
      </div>

      <div className="memory-toolbar">
        <label className="memory-search">
          <Search size={17} aria-hidden="true"/>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a memory…" aria-label="Search memories"/>
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}
        </label>
        <div className="memory-actions">
          <button className={`memory-action ${favoritesOnly ? 'is-active' : ''}`} onClick={() => setFavoritesOnly((v) => !v)} aria-pressed={favoritesOnly}>
            <Heart size={16} fill={favoritesOnly ? 'currentColor' : 'none'}/> Favourites <span>{count}</span>
          </button>
          <button className="memory-action" onClick={surprise}><Shuffle size={16}/> Surprise me</button>
          <button className={`memory-action memory-play ${auto ? 'is-active' : ''}`} onClick={toggleSlideshow} aria-pressed={auto}>
            {auto ? <Pause size={16}/> : <Play size={16}/>} {auto ? 'Pause story' : 'Play story'}
          </button>
        </div>
      </div>

      <div className="memory-meta" aria-live="polite">
        <span>{visibleMemories.length} {visibleMemories.length === 1 ? 'memory' : 'memories'} in view</span>
        <span className="memory-meta-note"><Sparkles size={14}/> {count ? `${count} saved as favourites` : 'Save the ones that make your heart skip'}</span>
      </div>

      {visibleMemories.length ? (
        <div className="memory-grid">
          {visibleMemories.map((m, index) => (
            <article className={`memory-card ${m.shape || 'portrait'}`} key={m.id} style={{'--card-index': index, '--card-tilt': `${m.rotation || 0}deg`}}>
              <button className="memory-card-open" onClick={() => setId(m.id)} aria-label={`Open ${m.caption}`}>
                <div className="memory-card-image"><span className="memory-card-photo"><Pic m={m}/></span></div>
                <div className="memory-card-copy">
                  <div className="memory-card-topline"><span>MEMORY {String(memories.findIndex((x) => x.id === m.id) + 1).padStart(2, '0')}</span><ArrowUpRight size={16}/></div>
                  <h3>{m.caption}</h3>
                  {m.date && <p className="memory-card-date">{m.date}</p>}
                  <p className="memory-card-teaser">{m.message}</p>
                </div>
              </button>
              <button className={`memory-fav ${loved.has(m.id) ? 'is-loved' : ''}`} onClick={() => toggleLoved(m.id)} aria-label={`${loved.has(m.id) ? 'Remove from' : 'Add to'} favourites: ${m.caption}`} aria-pressed={loved.has(m.id)}>
                <Heart size={17} fill={loved.has(m.id) ? 'currentColor' : 'none'}/>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="memory-empty">
          <span>♡</span><h3>No memories found</h3>
          <p>Try another search, or turn off the favourites filter.</p>
          <button className="memory-action" onClick={() => { setQuery(''); setFavoritesOnly(false); }}>Show every memory</button>
        </div>
      )}

      <div className="memory-footer-note">
        <span className="memory-footer-line"/>
        <p>Some moments deserve more than a camera roll.</p>
        <span className="memory-footer-line"/>
      </div>

      <MemoryMessage
        m={active}
        index={Math.max(activeIndex, 0)}
        total={memories.length}
        loved={!!active && loved.has(active.id)}
        onLove={() => active && toggleLoved(active.id)}
        auto={auto}
        onAuto={toggleSlideshow}
        onClose={close}
        onStep={step}
      />
    </section>
  );
}
