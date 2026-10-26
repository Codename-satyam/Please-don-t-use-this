// Tiny event bus so any section can make Capy say something: capySay('Hello {name}', {cheer:true})
// options: auto (polite chatter: skipped if Capy is busy or hushed), cheer (happy hop + eyes), burst (confetti), ms (how long the bubble stays)
const subs = new Set();
export const capySay = (text, opts) => subs.forEach(f => f(text, opts));
export const onCapySay = f => { subs.add(f); return () => subs.delete(f); };
