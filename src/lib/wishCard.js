// Paints the shareable birthday card (PNG data URL) on a canvas. Everything stays on the device.
const loadImg = src => new Promise(r => { if (!src) return r(null); const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });

function wrap(x, text, maxW, maxLines) {
  const words = String(text).split(/\s+/), lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '\u2026'; }
  return lines;
}

export async function makeWishCard({photo, name, line, caption = 'you, right now'}) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  try { await Promise.all(['80px "Bagel Fat One"', '60px Caveat', '40px Fraunces'].map(f => document.fonts.load(f))); } catch {}
  const img = await loadImg(photo);
  const INK = '#28251F';

  // paper + soft colour blobs
  x.fillStyle = '#FFF4E5'; x.fillRect(0, 0, W, H);
  [[120, 160, 300, 'rgba(255,215,106,.45)'], [980, 260, 320, 'rgba(168,216,240,.5)'], [140, 1200, 340, 'rgba(199,184,255,.45)'], [960, 1180, 300, 'rgba(247,182,198,.5)']].forEach(([cx, cy, r, col]) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,244,229,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  });
  // confetti scatter (deterministic)
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const cols = ['#FFD76A', '#FF6B6B', '#A8D8F0', '#C7B8FF', '#F7B6C6'];
  for (let i = 0; i < 70; i++) {
    x.save(); x.translate(rnd() * W, rnd() * H); x.rotate(rnd() * 6); x.fillStyle = cols[i % 5]; x.globalAlpha = .75;
    x.fillRect(-9, -4, 18, 8); x.restore();
  }
  x.globalAlpha = 1; x.textAlign = 'center'; x.textBaseline = 'alphabetic';

  // headline
  x.fillStyle = INK; x.font = '92px "Bagel Fat One", Impact, sans-serif';
  x.fillText('HAPPY BIRTHDAY', W / 2, 160);
  let size = 120; x.font = `${size}px "Bagel Fat One", Impact, sans-serif`;
  while (x.measureText(name).width > 900 && size > 40) { size -= 4; x.font = `${size}px "Bagel Fat One", Impact, sans-serif`; }
  x.fillStyle = '#FF6B6B'; x.fillText(name, W / 2, 160 + size + 6);

  // polaroid
  const pw = 640, ph = 810, px = (W - pw) / 2, py = 370;
  x.save(); x.translate(W / 2, py + ph / 2); x.rotate(-.035); x.translate(-W / 2, -(py + ph / 2));
  x.shadowColor = 'rgba(40,37,31,.35)'; x.shadowBlur = 40; x.shadowOffsetY = 18;
  x.fillStyle = '#fbf6ec'; x.fillRect(px, py, pw, ph); x.shadowColor = 'transparent';
  const ix = px + 30, iy = py + 30, iw = pw - 60, ih = 640;
  x.save(); x.beginPath(); x.rect(ix, iy, iw, ih); x.clip();
  if (img) {
    const k = Math.max(iw / img.width, ih / img.height), w = img.width * k, h = img.height * k;
    x.drawImage(img, ix + (iw - w) / 2, iy + (ih - h) / 2, w, h);
  } else { // no selfie: a friendly smiley
    x.fillStyle = '#f3e6cf'; x.fillRect(ix, iy, iw, ih);
    x.fillStyle = '#FFD76A'; x.strokeStyle = INK; x.lineWidth = 8;
    x.beginPath(); x.arc(ix + iw / 2, iy + ih / 2, 200, 0, 7); x.fill(); x.stroke();
    x.fillStyle = INK; x.beginPath(); x.arc(ix + iw / 2 - 70, iy + ih / 2 - 30, 15, 0, 7); x.arc(ix + iw / 2 + 70, iy + ih / 2 - 30, 15, 0, 7); x.fill();
    x.beginPath(); x.arc(ix + iw / 2, iy + ih / 2 + 10, 100, .2, Math.PI - .2); x.lineWidth = 9; x.lineCap = 'round'; x.stroke();
  }
  x.restore();
  x.fillStyle = INK; x.font = '58px Caveat, cursive'; x.fillText(`${caption} \u273F`, W / 2, py + ph - 46);
  x.fillStyle = 'rgba(255,215,106,.8)'; x.save(); x.translate(W / 2, py); x.rotate(-.07); x.fillRect(-70, -18, 140, 40); x.restore();
  x.restore();

  // closing line
  x.fillStyle = INK; x.font = 'italic 38px Fraunces, Georgia, serif';
  wrap(x, line, 880, 2).forEach((l, i) => x.fillText(l, W / 2, 1262 + i * 48));
  return c.toDataURL('image/png');
}
