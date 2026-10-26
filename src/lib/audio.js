import {useSyncExternalStore} from 'react';

// One shared AudioContext + a tiny store so the nav, game and cake all agree on sound state.
let ctx = null, sfx = false, playing = false, timers = [], nodes = [];
const subs = new Set(), emit = () => subs.forEach(f => f());
const sub = f => { subs.add(f); return () => subs.delete(f); };

export const getCtx = () => {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx ??= new C();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch { return null; }
};

export const useSfx = () => [
  useSyncExternalStore(sub, () => sfx),
  v => { sfx = v; if (v) getCtx(); emit(); }
];
export const useTunePlaying = () => useSyncExternalStore(sub, () => playing);

function tone(freq, dur, vol, type, when) {
  const a = getCtx(); if (!a) return null;
  const t = a.currentTime + when, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + .01);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t); o.stop(t + dur + .05);
  return o;
}
export const beep = (freq, dur = .12, vol = .05, type = 'sine') => { if (sfx) tone(freq, dur, vol, type, 0); };

// "Happy Birthday to You" (public domain) as a little music box.
const N = {G4:392, A4:440, B4:493.88, C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99};
const SONG = [['G4',.75],['G4',.25],['A4',1],['G4',1],['C5',1],['B4',2],
  ['G4',.75],['G4',.25],['A4',1],['G4',1],['D5',1],['C5',2],
  ['G4',.75],['G4',.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',1],
  ['F5',.75],['F5',.25],['E5',1],['C5',1],['D5',1],['C5',3]];
// note index where each of the four sung lines starts
export const LINE_STARTS = [0, 6, 12, 19];
export const lineOf = i => LINE_STARTS.filter(s => i >= s).length - 1;

export function stopTune(silent) {
  timers.forEach(clearTimeout); timers = [];
  nodes.forEach(o => { try { o.stop() } catch {} }); nodes = [];
  if (playing) { playing = false; if (!silent) emit(); }
}
export function playTune({beat = .46, onNote, onEnd} = {}) {
  stopTune(true);
  if (!getCtx()) return false;
  playing = true; emit();
  let t = .08;
  SONG.forEach(([n, b], i) => {
    const d = b * beat, f = N[n];
    [tone(f, d * 1.9, .09, 'sine', t), tone(f * 2, d * 1.2, .025, 'triangle', t)].forEach(o => o && nodes.push(o));
    timers.push(setTimeout(() => onNote?.(i), t * 1000));
    t += d;
  });
  timers.push(setTimeout(() => { playing = false; nodes = []; timers = []; emit(); onEnd?.(); }, t * 1000 + 300));
  return true;
}
