// Add photos to public/images/memories/. They are discovered automatically.
// Give each photo its own caption, message, date and emoji by editing `details` below.
import files from 'virtual:memory-files';

const details = [
  {
    caption: 'My favourite kind of magic',
    quote: 'Some people make ordinary days feel like a little bit of magic.',
    pointer: 'KEEP THIS FEELING', chapter: 'the magic', kind: 'dreamy',
    message: 'There is something about you that makes the smallest moments feel like they belong in a story I will want to tell forever.',
    date: 'A moment close to my heart',
    emoji: '💖',
    alt: 'A favourite memory',
    size: 'large',
    shape: 'portrait',
    rotation: -3,
  },
  {
    caption: 'That smile',
    quote: 'A smile that makes the whole day feel softer.',
    pointer: 'INSTANT MOOD LIFT', chapter: 'little joys', kind: 'playful',
    message: 'If happiness had a little signature, I think it would look a lot like your smile. It has a way of making everything feel lighter.',
    date: 'One for the keepsake box',
    emoji: '✨',
    size: 'medium',
    shape: 'portrait',
    rotation: 2,
  },
  {
    caption: 'A little piece of us',
    quote: 'The best memories are the ones that feel like home.',
    pointer: 'A PIECE OF US', chapter: 'our little world', kind: 'tender',
    message: 'Out of all the ordinary days, some quietly turn into the ones we hold closest. This is one of those moments for me.',
    date: 'A day worth remembering',
    emoji: '🫶',
    size: 'small',
    shape: 'square',
    rotation: -2,
  },
  {
    caption: 'The little things',
    quote: 'One day, we will look back and realise these were the big things.',
    pointer: 'NOTICE THE LITTLE THINGS', chapter: 'small details', kind: 'classic',
    message: 'It is never only about what we were doing. It is the laughter, the tiny details, and the way the memory still makes me smile.',
    date: 'A small moment, a big feeling',
    emoji: '🌷',
    size: 'medium',
    shape: 'landscape',
    rotation: 3,
  },
  {
    caption: 'Freeze this feeling',
    quote: 'If only a photograph could keep the feeling, too.',
    pointer: 'TIME, STAY HERE', chapter: 'time capsules', kind: 'dreamy',
    message: 'I wish photographs could hold a feeling as clearly as they hold a face. If they could, this one would be full of warmth.',
    date: 'Saved with love',
    emoji: '🎞️',
    size: 'medium',
    shape: 'portrait',
    rotation: -4,
  },
  {
    caption: 'My kind of peace',
    quote: 'Somewhere between the noise, there is a kind of quiet that feels like you.',
    pointer: 'A SOFTER PLACE', chapter: 'the calm', kind: 'tender',
    message: 'Some people make the world feel a little less loud. You have that kind of presence, and I hope you always know how special it is.',
    date: 'A breath of calm',
    emoji: '🩷',
    size: 'small',
    shape: 'square',
    rotation: 2,
  },
  {
    caption: 'One for the books',
    quote: 'A favourite chapter in a story that keeps getting better.',
    pointer: 'FAVOURITE CHAPTER', chapter: 'the good chapters', kind: 'classic',
    message: 'Maybe we will forget a few details with time, but I hope the feeling behind this memory stays with us for a long, long while.',
    date: 'A favourite chapter',
    emoji: '🥹',
    size: 'large',
    shape: 'landscape',
    rotation: -2,
  },
  {
    caption: 'To all that comes next',
    quote: 'The story is still unfolding; there are more beautiful pages ahead.',
    pointer: 'TO BE CONTINUED', chapter: 'what comes next', kind: 'playful',
    message: 'This is one lovely page in a story that is still being written. Here is to more laughs, more little adventures, and more memories to keep.',
    date: 'To be continued…',
    emoji: '♾️',
    size: 'small',
    shape: 'portrait',
    rotation: 4,
  },
  {
    caption: 'Golden hours',
    quote: 'Some light does not just touch the skin; it warms the very soul.',
    pointer: 'BASK IN THIS', chapter: 'golden hues', kind: 'dreamy',
    message: 'There is a certain kind of light that only exists when I am with you, casting everything in a warm, eternal glow.',
    date: 'A sunset of the heart',
    emoji: '🌅',
    alt: 'Golden hour memory',
    size: 'large',
    shape: 'landscape',
    rotation: 2,
  },
  {
    caption: 'Quiet symphony',
    quote: 'In the silence between our words, I found my favourite song.',
    pointer: 'LISTEN CLOSELY', chapter: 'the calm', kind: 'tender',
    message: 'Not every beautiful moment needs to be spoken. Sometimes, just sitting quietly beside you is the most profound poetry.',
    date: 'A shared silence',
    emoji: '🕊️',
    size: 'medium',
    shape: 'portrait',
    rotation: -1,
  },
  {
    caption: 'Stolen glances',
    quote: 'Eyes speak the words that the heart is too shy to say.',
    pointer: 'EYES MEET', chapter: 'silent words', kind: 'playful',
    message: 'A single look can hold a thousand unwritten letters. I catch you looking, and suddenly the whole world makes perfect sense.',
    date: 'A look that lingered',
    emoji: '👀',
    size: 'small',
    shape: 'square',
    rotation: 4,
  },
  {
    caption: 'Anchored here',
    quote: 'A drifting heart finds its true harbour in your laughter.',
    pointer: 'SAFE HARBOUR', chapter: 'our little world', kind: 'classic',
    message: 'When the tides of life get too rough, this memory is the anchor that quietly pulls me back to a place of perfect peace.',
    date: 'Safe and sound',
    emoji: '⚓',
    size: 'medium',
    shape: 'portrait',
    rotation: -3,
  },
  {
    caption: 'Painted skies',
    quote: 'We were just two brushstrokes in a masterpiece we did not know was being painted.',
    pointer: 'A MASTERPIECE', chapter: 'the magic', kind: 'dreamy',
    message: 'Every time I revisit this memory, the colours seem a little brighter, as if time itself is trying to preserve its perfection.',
    date: 'Art in motion',
    emoji: '🎨',
    size: 'large',
    shape: 'landscape',
    rotation: 1,
  },
  {
    caption: 'Echoes of joy',
    quote: 'True joy leaves an echo that gently outlasts the laughter.',
    pointer: 'FEEL THE ECHO', chapter: 'little joys', kind: 'playful',
    message: 'I can still hear the resonance of this day ringing in my mind. It is a melody I replay whenever I need a reason to smile.',
    date: 'A lingering laugh',
    emoji: '🎶',
    size: 'small',
    shape: 'square',
    rotation: -2,
  },
  {
    caption: 'Woven threads',
    quote: 'Two separate paths, beautifully tangled into one shared destiny.',
    pointer: 'ENTANGLED', chapter: 'what comes next', kind: 'tender',
    message: 'This is the moment I realised our stories were no longer just running parallel, but weaving together into something unbreakable.',
    date: 'Tied together',
    emoji: '🧶',
    size: 'medium',
    shape: 'portrait',
    rotation: 3,
  },
  {
    caption: 'Infinite seconds',
    quote: 'Some seconds are so heavy with beauty, they outweigh the years.',
    pointer: 'TIMELESS', chapter: 'time capsules', kind: 'classic',
    message: 'If time were measured in meaning instead of minutes, this single frame would span a lifetime of happiness.',
    date: 'Beyond time',
    emoji: '⏳',
    size: 'large',
    shape: 'portrait',
    rotation: -4,
  },
];

const SIZES = ['large', 'medium', 'small', 'medium', 'medium', 'small', 'large', 'small'];
const ROT = [-4, 3, -2, 5, -5, 2, -3, 4];
const FALLBACK_MESSAGES = [
  'A little moment that deserves a place in the memory box.',
  'The details may change with time, but the feeling is worth keeping.',
  'One more reason to smile whenever this photo finds its way back to us.',
];

const list = files.length
  ? files
  : Array.from({ length: 8 }, (_, i) => `/images/memories/photo-${String(i + 1).padStart(2, '0')}.jpg`);

const build = (imgs) => imgs.map((image, i) => {
  const custom = details[i] || {};
  return {
    id: `memory-${String(i + 1).padStart(2, '0')}`,
    image,
    alt: `Photo ${i + 1}`,
    caption: `A memory to keep ${i + 1}`,
    message: FALLBACK_MESSAGES[i % FALLBACK_MESSAGES.length],
    date: '',
    rotation: ROT[i % ROT.length],
    size: SIZES[i % SIZES.length],
    shape: 'portrait',
    photobomb: false,
    ...custom,
  };
});

export const memories = build(list);

const opens = (src) => new Promise((resolve) => {
  const image = new Image();
  image.onload = () => resolve(true);
  image.onerror = () => resolve(false);
  image.src = src;
});

export const ready = files.length
  ? Promise.all(list.map(opens)).then((ok) => {
      const good = list.filter((_, i) => ok[i]);
      if (good.length && good.length !== list.length) memories.splice(0, memories.length, ...build(good));
    })
  : Promise.resolve();
