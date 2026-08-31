/* =====================================================================
   CONFIGURAÇÃO — editem aqui para personalizar o site
   ===================================================================== */
const CONFIG = {
  kissDateISO: "2026-04-04T21:30:00",     // data e hora do primeiro beijo
  kissDateDisplay: "4 de abril de 2026",
  place: "O céu estrelado sobre Recife",
 

  // Foto que aparece "presa" no céu do primeiro beijo.
  // Caminho relativo à pasta do site (funciona com a pasta "imagens" ao lado do index.html).
  skyPhoto: "imagens/04 de abril.png",

  memories: [
    { date: "—", title: "Primeiro \"eu te amo\"", desc: "12 de junho de 2026", photo: "imagens/12 de junho.png" },
    { date: "—", title: "Primeiro encontro", desc: "27 de abril de 2026", photo: "imagens/27 de abril .png" },
    { date: "—", title: "Primeira viagem juntas", desc: "17 de abril de 2026", photo: "imagens/17 de abril.png" }
  ],
  // Em cada memória acima, "photo" funciona igual ao skyPhoto: um caminho de
  // arquivo relativo à pasta "imagens". Sem foto, a estrela abre com um fundo
  // de galáxia no lugar.

  dreams: [
    "Viajar juntas para um lugar novo",
    "Ter a nossa casa",
    "Viver para sempre juntas",
    "Conhecer aquele país que a gente sempre fala",
    "Ver o mar em algum lugar diferente juntas"
  ]
};

/* ===================================================================== */

document.getElementById('hero-date').textContent = CONFIG.kissDateDisplay;


if(CONFIG.skyPhoto){
  document.getElementById('sky-photo').src = CONFIG.skyPhoto;
}

/* ---------- fundo estrelado ---------- */
(function starfield(){
  const canvas = document.getElementById('stars-bg');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.body.scrollHeight;
    const count = Math.floor((w*h)/9000);
    stars = Array.from({length: Math.min(count, 380)}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.3 + 0.3,
      phase: Math.random()*Math.PI*2,
      speed: Math.random()*0.015 + 0.006
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  let t = 0;
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      const tw = reduced ? 1 : 0.55 + 0.45*Math.sin(t*s.speed*10 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(234,231,246,${(0.35+0.55*tw).toFixed(2)})`;
      ctx.fill();
    }
    t += 1;
    if(!reduced) requestAnimationFrame(draw);
  }
  draw();

  // estrela cadente ocasional
  if(!reduced){
    function shoot(){
      const el = document.createElement('div');
      const startX = Math.random()*window.innerWidth*0.7;
      const startY = Math.random()*window.innerHeight*0.4;
      el.style.cssText = `position:fixed;top:${startY}px;left:${startX}px;width:2px;height:2px;
        background:#fff;border-radius:50%;z-index:1;pointer-events:none;
        box-shadow:0 0 6px 2px rgba(255,255,255,0.8);
        transition:transform 1.1s ease-out, opacity 1.1s ease-out;opacity:1;`;
      document.body.appendChild(el);
      requestAnimationFrame(()=>{
        el.style.transform = 'translate(220px, 140px)';
        el.style.opacity = '0';
      });
      setTimeout(()=> el.remove(), 1200);
      setTimeout(shoot, 6000 + Math.random()*9000);
    }
    setTimeout(shoot, 4000);
  }
})();

/* ---------- contador em tempo real ---------- */
(function counter(){
  const start = new Date(CONFIG.kissDateISO);

  function calendarDiff(now, start){
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();
    if(seconds<0){ seconds+=60; minutes--; }
    if(minutes<0){ minutes+=60; hours--; }
    if(hours<0){ hours+=24; days--; }
    if(days<0){
      months--;
      const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if(months<0){ months+=12; years--; }
    return {years,months,days,hours,minutes,seconds};
  }

  function tick(){
    const now = new Date();
    const d = calendarDiff(now, start);
    document.getElementById('c-years').textContent = Math.max(d.years,0);
    document.getElementById('c-months').textContent = Math.max(d.months,0);
    document.getElementById('c-days').textContent = Math.max(d.days,0);
    document.getElementById('c-hours').textContent = Math.max(d.hours,0);
    document.getElementById('c-min').textContent = Math.max(d.minutes,0);
    document.getElementById('c-sec').textContent = Math.max(d.seconds,0);

    const ms = Math.max(now - start, 0);
    document.getElementById('uu-days').textContent = Math.floor(ms/86400000).toLocaleString('pt-BR');
    document.getElementById('uu-hours').textContent = Math.floor(ms/3600000).toLocaleString('pt-BR');
    document.getElementById('uu-minutes').textContent = Math.floor(ms/60000).toLocaleString('pt-BR');
    document.getElementById('uu-seconds').textContent = Math.floor(ms/1000).toLocaleString('pt-BR');
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- lightbox de fotos ---------- */
const Lightbox = (function(){
  const el = document.getElementById('lightbox');
  const photo = document.getElementById('lightbox-photo');
  const photoEmpty = document.getElementById('lightbox-photo-empty');
  const closeBtn = document.getElementById('lightbox-close');

  function open(item){
    document.getElementById('lb-date').textContent = item.date;
    document.getElementById('lb-title').textContent = '  ' + item.title;
    document.getElementById('lb-desc').textContent = item.desc;
    if(item.photo){
      photo.src = item.photo;
      photo.style.display = 'block';
      photoEmpty.style.display = 'none';
    } else {
      photo.style.display = 'none';
      photoEmpty.style.display = 'flex';
    }
    el.classList.add('show');
  }
  function close(){ el.classList.remove('show'); }

  closeBtn.addEventListener('click', close);
  el.addEventListener('click', (e)=>{ if(e.target === el) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });

  return { open, close };
})();

/* ---------- constelação de memórias ---------- */
(function constellation(){
  const svg = document.getElementById('const-svg');
  const ns = 'http://www.w3.org/2000/svg';
  const items = CONFIG.memories;
  const n = items.length;

  // posições em arco suave dentro do viewBox 400x250
  const positions = [];
  for(let i=0;i<n;i++){
    const t = i/(n-1);
    const x = 40 + t*320;
    const y = 130 + Math.sin(t*Math.PI)*-70 + (i%2===0? 10:-10);
    positions.push([x,y]);
  }

  const line = document.createElementNS(ns,'polyline');
  line.setAttribute('class','const-line');
  line.setAttribute('points', positions.map(p=>p.join(',')).join(' '));
  svg.appendChild(line);

  positions.forEach(([x,y], i)=>{
    const g = document.createElementNS(ns,'g');
    g.setAttribute('class','const-star');
    g.setAttribute('tabindex','0');
    g.setAttribute('role','button');
    g.setAttribute('aria-label', items[i].title);

    const halo = document.createElementNS(ns,'circle');
    halo.setAttribute('cx',x); halo.setAttribute('cy',y); halo.setAttribute('r',14);
    halo.setAttribute('fill','transparent');
    g.appendChild(halo);

    const c = document.createElementNS(ns,'circle');
    c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',4.5);
    g.appendChild(c);

    function open(e){ e.stopPropagation(); Lightbox.open(items[i]); }
    g.addEventListener('click', open);
    g.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); Lightbox.open(items[i]); } });

    svg.appendChild(g);
  });
})();

/* ---------- planetas orbitando ---------- */
(function planets(){
  const visual = document.getElementById('orbit-visual');
  const specs = [
    { r: 55, color: '#ff8fb3', dur: 14 },
    { r: 85, color: '#f3d98b', dur: 20 },
    { r: 115, color: '#8d6fd1', dur: 27 },
    { r: 145, color: '#7fd6c9', dur: 34 }
  ];
  specs.forEach(s=>{
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.style.width = ring.style.height = (s.r*2)+'px';
    visual.appendChild(ring);

    const spin = document.createElement('div');
    spin.className = 'orbit-spin';
    spin.style.animationDuration = s.dur+'s';
    ring.appendChild(spin);

    const dot = document.createElement('div');
    dot.className = 'orbit-dot';
    dot.style.color = s.color;
    dot.style.background = s.color;
    spin.appendChild(dot);
  });
})();

/* ---------- telescópio de sonhos ---------- */
(function dreams(){
  const list = document.getElementById('dream-list');
  CONFIG.dreams.forEach((text, i)=>{
    const item = document.createElement('div');
    item.className = 'dream-item';
    item.innerHTML = `<span class="d-star">✦</span><span class="d-text"></span>`;
    item.querySelector('.d-text').textContent = text;
    item.addEventListener('click', ()=>{
      item.classList.toggle('done');
      item.querySelector('.d-star').textContent = item.classList.contains('done') ? '✓' : '✦';
    });
    list.appendChild(item);
  });
})();

/* ---------- final: linhas surgindo ---------- */
(function ending(){
  const lines = document.querySelectorAll('#ending .fade-line');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = Array.from(lines).indexOf(entry.target);
        setTimeout(()=> entry.target.classList.add('in'), idx*450);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  lines.forEach(l=> obs.observe(l));
})();