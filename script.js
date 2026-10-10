// Fade sections/folders in as you scroll
const items = document.querySelectorAll('.section, .folder');
items.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  });
}, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
items.forEach(el => io.observe(el));

// Order numbers so the pixel squares pop in one after another
document.querySelectorAll('.hero-card .px').forEach((el, i) => el.style.setProperty('--i', i));
document.querySelectorAll('.fpx').forEach((el, i) => el.style.setProperty('--i', i));

// Typewriter effect
const typers = document.querySelectorAll('.type');
typers.forEach(el => {
  el.dataset.text = el.textContent;
  el.style.minHeight = el.offsetHeight + 'px';
  el.textContent = '';
});
const typeIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    typeIO.unobserve(e.target);
    const el = e.target, text = el.dataset.text;
    let i = 0;
    el.classList.add('typing');
    const t = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(t); el.classList.remove('typing'); }
    }, 60);
  });
}, { threshold: 0.5 });
typers.forEach(el => typeIO.observe(el));

// "What I bring" list animation
const bring = document.querySelector('.bring');
if (bring) {
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { bring.classList.add('go'); obs.disconnect(); }
  }, { threshold: 0.3 }).observe(bring);
}

// Folder shapes: drawn from the design's proportions (all values are fractions of folder width)
const NS = 'http://www.w3.org/2000/svg';
// red back layer: dx/dy = shift, gap = how far its bottom sits above (+) / below (-) the yellow bottom
const RED = {
  gd:     { dx: -.023, dy: -.065, gap: .178 },
  motion: { dx: -.023, dy: -.059, gap: .178 },
  video:  { dx: -.025, dy: -.058, gap: .181 },
  art:    { dx: -.029, dy: -.062, gap: .181 },
  skills: { dx: -.025, dy:  .041, gap: -.037 },
  bring:  { dx: -.025, dy:  .041, gap: -.036 }
};
function shapePath(W, H) {
  const d = .058 * W, r = .032 * W, tf = .357 * W, L = .075 * W, rr = .025 * W, br = .033 * W;
  return `M0,${r} A${r},${r} 0 0 1 ${r},0 H${tf} C${tf + L / 2},0 ${tf + L / 2},${d} ${tf + L},${d} H${W - rr} A${rr},${rr} 0 0 1 ${W},${d + rr} V${H - br} A${br},${br} 0 0 1 ${W - br},${H} H${br} A${br},${br} 0 0 1 0,${H - br} Z`;
}
function folderKind(f) {
  if (f.querySelector('.g-gd')) return 'gd';
  if (f.querySelector('.g-2')) return 'motion';
  if (f.querySelector('.g-1')) return 'video';
  if (f.querySelector('.g-3')) return 'art';
  if (f.querySelector('.tools')) return 'skills';
  return 'bring';
}
document.querySelectorAll('.folder').forEach(f => {
  const kind = folderKind(f), k = RED[kind];
  if (kind === 'gd') {
    const front = f.querySelector('.folder-front');
    front.insertAdjacentHTML('beforeend', '<i class="dia"></i><i class="dia r"></i>');
  }
  const svgs = ['back', 'front'].map(c => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'fshape ' + c);
    const p = document.createElementNS(NS, 'path');
    s.append(p);
    f.insertBefore(s, f.querySelector('.folder-front'));
    return { s, p };
  });
  const draw = () => {
    const W = f.offsetWidth, H = f.offsetHeight;
    f.style.setProperty('--W', W + 'px');
    svgs[0].p.setAttribute('d', shapePath(W, H - k.gap * W - k.dy * W));
    svgs[0].s.style.transform = `translate(${k.dx * W}px, ${k.dy * W}px)`;
    svgs[1].p.setAttribute('d', shapePath(W, H));
  };
  new ResizeObserver(draw).observe(f);
  draw();
});
// rise-up on scroll (all work boxes and the tool icons)
const riseItems = document.querySelectorAll('.g-gd > *, .g-2 > *, .g-1 > *, .g-3 > *, .tools figure, .folder-note');
riseItems.forEach(el => {
  el.classList.add('rise');
  el.style.setProperty('--d', ([...el.parentElement.children].indexOf(el) * 0.12) + 's');
});
const riseIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); riseIO.unobserve(e.target); }
  });
}, { threshold: 0.15 });
riseItems.forEach(el => riseIO.observe(el));

// hover overlay with the description (not on the tool icons)
document.querySelectorAll('.g-gd > *, .g-2 > *, .g-1 > *, .g-3 > *').forEach(el => {
  if (el.tagName === 'IMG' || el.tagName === 'VIDEO') return;
  const h = document.createElement('div');
  h.className = 'hov';
  h.textContent = el.dataset.desc || 'Description goes here';
  el.append(h);
});