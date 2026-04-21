
/* ═══════════════════════════════════════════════════
   NECRO-NEON v3.0 — JS Systems
   ═══════════════════════════════════════════════════ */

/* ── District Switcher ── */
const DISTRICT_COLORS = {
  'tokyo-night':'#00eaff', 'ghoul':'#9d00ff', 'ritual':'#ffd700', 'void':'#ff2d78'
};
function setDistrict(d, btn){
  document.body.setAttribute('data-district', d);
  document.querySelectorAll('.district-btn').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  setRainColor(DISTRICT_COLORS[d] || '#00eaff');
  setTimeout(redrawAllCities, 80);
}

/* ── Rain Engine ── */
const rainCvs = document.getElementById('rain-canvas');
const rainCtx = rainCvs.getContext('2d');
let drops = [], rainActive = true, rainColor = '#00eaff';
let RAIN_COUNT = 180, RAIN_SPEED = 13, RAIN_ANGLE = 0;

function resizeRain(){ rainCvs.width = innerWidth; rainCvs.height = innerHeight; }
resizeRain();

class Drop {
  constructor(){ this.reset(true) }
  reset(init=false){
    this.x = Math.random() * rainCvs.width;
    this.y = init ? Math.random() * rainCvs.height : -30;
    this.len = Math.random() * 20 + 8;
    this.spd = (Math.random() * .5 + .75) * RAIN_SPEED;
    this.op  = Math.random() * .35 + .08;
    this.w   = Math.random() * .7 + .2;
  }
  tick(){
    const rad = RAIN_ANGLE * Math.PI / 180;
    this.y += this.spd; this.x += Math.sin(rad) * this.spd * .5;
    if(this.y > rainCvs.height + 40 || this.x > rainCvs.width + 60 || this.x < -60) this.reset();
  }
  draw(){
    const rad = RAIN_ANGLE * Math.PI / 180;
    rainCtx.save();
    rainCtx.beginPath();
    rainCtx.moveTo(this.x, this.y);
    rainCtx.lineTo(this.x + Math.sin(rad)*this.len, this.y + Math.cos(rad)*this.len);
    rainCtx.strokeStyle = rainColor; rainCtx.lineWidth = this.w;
    rainCtx.globalAlpha = this.op; rainCtx.shadowBlur = 3; rainCtx.shadowColor = rainColor;
    rainCtx.stroke(); rainCtx.restore();
  }
}
function initDrops(){ drops = []; for(let i=0;i<RAIN_COUNT;i++) drops.push(new Drop()); }
initDrops();

(function rainLoop(){
  rainCtx.clearRect(0,0,rainCvs.width,rainCvs.height);
  if(rainActive){
    drops.forEach(d=>{ d.tick(); d.draw(); });
    if(Math.random()<.005){
      rainCtx.save(); rainCtx.fillStyle = rainColor; rainCtx.globalAlpha = Math.random()*.05;
      rainCtx.fillRect(0, Math.random()*rainCvs.height, rainCvs.width, Math.random()*2+.5);
      rainCtx.restore();
    }
  }
  requestAnimationFrame(rainLoop);
})();

function toggleRain(){
  rainActive = !rainActive;
  document.getElementById('rain-status').textContent = rainActive ? 'ACTIVE' : 'OFFLINE';
  rainCvs.style.opacity = rainActive ? '.55' : '0';
}
function setRainColor(c){ rainColor = c; }
document.getElementById('rain-intensity').addEventListener('input',e=>{ RAIN_COUNT=+e.target.value; initDrops(); });
document.getElementById('rain-speed').addEventListener('input',e=>{ RAIN_SPEED=+e.target.value; drops.forEach(d=>d.spd=(Math.random()*.5+.75)*RAIN_SPEED); });
document.getElementById('rain-angle').addEventListener('input',e=>{ RAIN_ANGLE=+e.target.value; });

/* ── Infestation Engine ── */
const infCvs = document.getElementById('infestation-canvas');
const infCtx = infCvs.getContext('2d');
let infActive = false, infRAF = null, infAmount = 0;
function resizeInf(){ infCvs.width = innerWidth; infCvs.height = innerHeight; }
resizeInf();

function drawInf(){
  infCtx.clearRect(0,0,infCvs.width,infCvs.height);
  const rate = parseInt(document.getElementById('infest-rate').value) / 10;
  infAmount = Math.min(1, infAmount + rate * .003);
  const t = Date.now() / 1000;
  for(let i=0;i<18;i++){
    const x0 = Math.sin(t*.3+i)*infCvs.width*.5+infCvs.width*.5;
    const y0 = Math.cos(t*.2+i*.7)*infCvs.height*.5+infCvs.height*.5;
    const x1 = Math.sin(t*.5+i*1.3)*infCvs.width*.4+infCvs.width*.5;
    const y1 = Math.cos(t*.4+i*.9)*infCvs.height*.4+infCvs.height*.5;
    infCtx.save();
    infCtx.beginPath();
    infCtx.moveTo(x0,y0);
    infCtx.bezierCurveTo(x0+Math.sin(t+i)*130,y0+Math.cos(t*1.3+i)*90,x1+Math.cos(t*.7+i)*110,y1+Math.sin(t+i*.5)*100,x1,y1);
    infCtx.strokeStyle = `rgba(204,0,24,${infAmount*.12*Math.abs(Math.sin(t+i))})`;
    infCtx.lineWidth = Math.random()*2+.5;
    infCtx.shadowBlur = 8; infCtx.shadowColor = 'rgba(204,0,24,.4)';
    infCtx.stroke(); infCtx.restore();
  }
  for(let i=0;i<6;i++){
    const gx = (infCvs.width*.15*(i+1)) + Math.sin(t*.4+i)*35;
    const gy = infCvs.height*.5 + Math.cos(t*.3+i*1.2)*infCvs.height*.3;
    const gr = infCtx.createRadialGradient(gx,gy,0,gx,gy,130*infAmount);
    gr.addColorStop(0,`rgba(204,0,24,${infAmount*.09})`);
    gr.addColorStop(.5,`rgba(100,0,10,${infAmount*.04})`);
    gr.addColorStop(1,'transparent');
    infCtx.fillStyle = gr; infCtx.fillRect(0,0,infCvs.width,infCvs.height);
  }
  if(infActive) infRAF = requestAnimationFrame(drawInf);
}

function toggleInfestation(){
  infActive = !infActive;
  const badge = document.getElementById('infest-status');
  if(infActive){
    badge.textContent='SPREADING'; badge.className='nn-badge badge-danger badge-dot';
    infCvs.style.opacity='1'; infRAF=requestAnimationFrame(drawInf);
  } else {
    badge.textContent='DORMANT'; badge.className='nn-badge badge-warn badge-dot';
    if(infRAF) cancelAnimationFrame(infRAF);
    infCvs.style.opacity='0'; infAmount=0; infCtx.clearRect(0,0,infCvs.width,infCvs.height);
  }
}

/* ── Glitch Engine ── */
function triggerGlitchBurst(){
  const freq = parseInt(document.getElementById('glitch-freq').value);
  const dur = 60 + Math.random()*130;
  document.body.style.filter = `hue-rotate(${Math.random()*40}deg) saturate(${1+Math.random()*1.5})`;
  document.body.style.transform = `skewX(${(Math.random()-.5)*freq*.3}deg)`;
  setTimeout(()=>{ document.body.style.filter=''; document.body.style.transform=''; }, dur);
  const els = document.querySelectorAll('.nn-card,.nn-btn');
  if(els.length){
    const el = els[Math.floor(Math.random()*els.length)];
    el.style.transform = `translateX(${(Math.random()-.5)*freq*5}px)`;
    setTimeout(()=>{ el.style.transform=''; }, dur);
  }
}
function triggerMassGlitch(){
  let f=0; const frames=24;
  const iv = setInterval(()=>{
    if(f>=frames){ clearInterval(iv); document.body.style.filter=''; document.body.style.transform=''; return; }
    const t = f/frames;
    document.body.style.filter = `hue-rotate(${Math.sin(f)*80}deg) saturate(${1+Math.random()*3}) contrast(${1+Math.random()*.5})`;
    document.body.style.transform = `skewX(${(Math.random()-.5)*(1-t)*5}deg) translateY(${(Math.random()-.5)*(1-t)*8}px)`;
    f++;
  }, 45);
}

/* ─────────────────────────────────────────────────
   CITY BACKDROP SYSTEM
   ─────────────────────────────────────────────────
   toggleCityBackdrop(canvasId)
   setCityBackdropVisible(canvasId, bool)
   ───────────────────────────────────────────────── */
function getColors(){
  const d = document.body.getAttribute('data-district') || 'tokyo-night';
  return {
    'tokyo-night':{ sky:'#000810', mid:'#000d18', neon:['#00eaff','#ff2d78','#ffd700','#00ff88','#9d00ff'], glow:'rgba(0,234,255,' },
    'ghoul':      { sky:'#060003', mid:'#0a0008', neon:['#9d00ff','#ff2d78','#cc0018','#ff8c00','#550080'], glow:'rgba(157,0,255,' },
    'ritual':     { sky:'#050203', mid:'#090405', neon:['#ffd700','#cc0018','#ff8c00','#ff2d78','#aa8800'], glow:'rgba(255,215,0,' },
    'void':       { sky:'#000',    mid:'#020002', neon:['#333','#ff2d78','#1a1a1a','#220011','#111'],       glow:'rgba(255,45,120,' },
  }[d] || {sky:'#000810',mid:'#000d18',neon:['#00eaff','#ff2d78','#ffd700'],glow:'rgba(0,234,255,'};
}

function h2r(hex){
  hex = hex.replace('#','');
  if(hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  const n=parseInt(hex,16); return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
}

function drawCity(canvasId, style='neon'){
  const cvs = document.getElementById(canvasId); if(!cvs) return;
  const W = cvs.offsetWidth||800, H = cvs.offsetHeight||300;
  cvs.width=W; cvs.height=H;
  const ctx = cvs.getContext('2d');
  const {sky,mid,neon,glow} = getColors();

  // Sky
  const sg = ctx.createLinearGradient(0,0,0,H);
  if(style==='ruined')   { sg.addColorStop(0,'rgba(20,2,2,1)'); sg.addColorStop(.6,'rgba(10,1,1,1)'); sg.addColorStop(1,'rgba(5,0,0,1)'); }
  else if(style==='ritual'){ sg.addColorStop(0,'rgba(8,5,2,1)'); sg.addColorStop(.6,mid); sg.addColorStop(1,'rgba(3,1,0,1)'); }
  else if(style==='ghoul') { sg.addColorStop(0,'rgba(4,0,8,1)'); sg.addColorStop(.6,'rgba(8,0,12,1)'); sg.addColorStop(1,'rgba(2,0,4,1)'); }
  else                     { sg.addColorStop(0,sky); sg.addColorStop(.7,mid); sg.addColorStop(1,'rgba(1,3,6,1)'); }
  ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);

  // Moon / orb
  if(style==='ruined'){
    const mx=W*.78,my=H*.16;
    const mg=ctx.createRadialGradient(mx,my,0,mx,my,38);
    mg.addColorStop(0,'rgba(204,0,24,.4)'); mg.addColorStop(.5,'rgba(100,0,10,.15)'); mg.addColorStop(1,'transparent');
    ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mx,my,38,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(204,0,24,.25)'; ctx.lineWidth=.5;
    for(let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(mx+(Math.random()-.5)*65,my+(Math.random()-.5)*65); ctx.stroke(); }
  } else {
    const mx=W*.12,my=H*.14;
    const mg=ctx.createRadialGradient(mx,my,0,mx,my,30);
    mg.addColorStop(0,`${glow}.2)`); mg.addColorStop(.5,`${glow}.06)`); mg.addColorStop(1,'transparent');
    ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mx,my,30,0,Math.PI*2); ctx.fill();
  }

  // Stars
  for(let i=0;i<(style==='ruined'?15:45);i++){
    ctx.fillStyle=neon[Math.floor(Math.random()*neon.length)];
    ctx.globalAlpha=Math.random()*.35+.04;
    ctx.beginPath(); ctx.arc(Math.random()*W,Math.random()*(H*.5),.7,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
  }

  // Fog layers
  for(let l=0;l<3;l++){
    const fg=ctx.createLinearGradient(0,H*(.3+l*.15),0,H*(.5+l*.15));
    fg.addColorStop(0,'transparent');
    fg.addColorStop(1, style==='ruined' ? `rgba(30,3,3,${.12+l*.07})` : `${glow}${.04+l*.02})`);
    ctx.fillStyle=fg; ctx.fillRect(0,H*(.3+l*.15),W,H*.22);
  }

  // Building layers
  const layerCount = 4;
  for(let layer=layerCount;layer>=0;layer--){
    const bottom = H - layer*H*.04;
    ctx.globalAlpha = .4+layer*.12;
    let bx=0;
    while(bx<W+90){
      const bw = Math.floor(Math.random()*55)+18;
      const bh = Math.floor(Math.random()*H*(.25+layer*.12))+H*.1;
      paintBuilding(ctx,bx,bw,bh,bottom,neon,glow,style==='ruined'&&layer<2?'ruined':'normal');
      bx += bw + Math.floor(Math.random()*5);
    }
    ctx.globalAlpha=1;
  }

  // Ritual sigil
  if(style==='ritual'){
    ctx.save(); ctx.strokeStyle='rgba(255,215,0,.07)'; ctx.lineWidth=.5;
    const cx2=W/2,cy2=H*.38,r=Math.min(W,H)*.24;
    ctx.beginPath(); ctx.arc(cx2,cy2,r,0,Math.PI*2); ctx.stroke();
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx2,cy2); ctx.lineTo(cx2+Math.cos(a)*r,cy2+Math.sin(a)*r); ctx.stroke(); }
    ctx.restore();
  }

  // Floor reflection
  const rg=ctx.createLinearGradient(0,H-50,0,H);
  rg.addColorStop(0,'transparent'); rg.addColorStop(1,`${glow}.1)`);
  ctx.fillStyle=rg; ctx.fillRect(0,H-50,W,50);

  // Neon base streaks
  for(let i=0;i<4;i++){
    ctx.strokeStyle=neon[i%neon.length]; ctx.globalAlpha=.04+Math.random()*.04; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,H-Math.random()*25); ctx.lineTo(W,H-Math.random()*25); ctx.stroke();
    ctx.globalAlpha=1;
  }
}

function paintBuilding(ctx,x,w,h,bottom,neon,glow,style){
  // Body
  const g=ctx.createLinearGradient(x,bottom-h,x,bottom);
  if(style==='ruined'){ g.addColorStop(0,`rgba(${h2r(neon[0])},.3)`); g.addColorStop(.5,'rgba(15,5,5,.9)'); g.addColorStop(1,'rgba(5,2,2,1)'); }
  else { g.addColorStop(0,'rgba(8,18,30,.95)'); g.addColorStop(.6,'rgba(5,12,20,.98)'); g.addColorStop(1,'rgba(2,4,8,1)'); }
  ctx.fillStyle=g;

  if(style==='ruined'){
    ctx.beginPath(); ctx.moveTo(x,bottom); ctx.lineTo(x,bottom-h*.7);
    ctx.lineTo(x+w*.1,bottom-h*.85); ctx.lineTo(x+w*.25,bottom-h*.75);
    ctx.lineTo(x+w*.4,bottom-h); ctx.lineTo(x+w*.55,bottom-h*.88);
    ctx.lineTo(x+w*.7,bottom-h*.94); ctx.lineTo(x+w*.85,bottom-h*.76);
    ctx.lineTo(x+w,bottom-h*.58); ctx.lineTo(x+w,bottom); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=`rgba(${h2r(neon[1])},.18)`; ctx.lineWidth=.5;
    for(let i=0;i<3;i++){ ctx.beginPath(); const sx=x+Math.random()*w,sy=bottom-h*.5; ctx.moveTo(sx,sy); for(let j=0;j<5;j++) ctx.lineTo(sx+(Math.random()-.5)*18,sy+j*14+Math.random()*8); ctx.stroke(); }
  } else {
    ctx.fillRect(x,bottom-h,w,h);
  }

  // Windows
  const density = style==='ruined' ? .12 : .42;
  const cols=Math.floor(w/12), rows=Math.floor(h/16);
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    if(Math.random()<density){
      const wy=bottom-h+8+r*16, wx=x+4+c*12;
      if(wy<bottom-4&&wy>bottom-h*.9){
        ctx.fillStyle=neon[Math.floor(Math.random()*neon.length)];
        ctx.globalAlpha=Math.random()*.5+.05;
        ctx.fillRect(wx,wy,6,8); ctx.globalAlpha=1;
      }
    }
  }

  // Neon strip
  if(Math.random()<.38&&w>28){
    const sc=neon[Math.floor(Math.random()*3)];
    ctx.shadowBlur=10; ctx.shadowColor=sc; ctx.fillStyle=sc; ctx.globalAlpha=.75;
    ctx.fillRect(x+w*.2,bottom-h*.32,w*.6,2); ctx.globalAlpha=1; ctx.shadowBlur=0;
  }

  // Antenna
  if(Math.random()<.28&&style!=='ruined'){
    ctx.fillStyle=neon[0]; ctx.globalAlpha=.5;
    ctx.fillRect(x+w*.45,bottom-h-14,2,14);
    ctx.shadowBlur=5; ctx.shadowColor=neon[0]; ctx.globalAlpha=.8;
    ctx.beginPath(); ctx.arc(x+w*.46,bottom-h-14,2.5,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1; ctx.shadowBlur=0;
  }
}

/* City backdrop visibility toggle */
const wrapMap = {
  'city-ruined':  'wrap-city-ruined',
  'city-neon':    'wrap-city-neon',
  'city-ghoul':   'wrap-city-ghoul',
  'city-ritual':  'wrap-city-ritual',
};

function toggleCityBackdrop(cvId){
  const wrId = wrapMap[cvId];
  const el = wrId ? document.getElementById(wrId) : null;
  if(el){
    const isOff = el.classList.contains('city-backdrop--off');
    el.classList.toggle('city-backdrop--off', !isOff);
    el.classList.toggle('city-backdrop--on', isOff);
    if(isOff) setTimeout(()=>drawCity(cvId, cvId.includes('ruined')?'ruined':cvId.includes('ritual')?'ritual':cvId.includes('ghoul')?'ghoul':'neon'), 50);
  }
}

function setCityBackdropVisible(cvId, visible){
  const wrId = wrapMap[cvId];
  const el = wrId ? document.getElementById(wrId) : null;
  if(el){
    el.classList.toggle('city-backdrop--off', !visible);
    el.classList.toggle('city-backdrop--on', visible);
    if(visible) setTimeout(()=>drawCity(cvId, cvId.includes('ruined')?'ruined':cvId.includes('ritual')?'ritual':cvId.includes('ghoul')?'ghoul':'neon'), 50);
  }
}

function hideAllCities(){ Object.keys(wrapMap).forEach(id => setCityBackdropVisible(id, false)); }
function showAllCities(){ Object.keys(wrapMap).forEach(id => setCityBackdropVisible(id, true)); }

function redrawAllCities(){
  drawCity('city-ruined','ruined'); drawCity('city-neon','neon');
  drawCity('city-ghoul','ghoul');   drawCity('city-ritual','ritual');
  drawCityHero();
}

/* Hero city */
function drawCityHero(){
  const c = document.getElementById('city-hero-canvas'); if(!c) return;
  c.width = innerWidth; c.height = innerHeight;
  drawCity('city-hero-canvas','neon');
}
function toggleHeroBg(){
  const c = document.getElementById('city-hero-canvas');
  c.classList.toggle('city-hero-bg--off');
  c.classList.toggle('city-hero-bg--on');
}

/* Initial draw */
window.addEventListener('load',()=>{ redrawAllCities(); });
window.addEventListener('resize',()=>{ resizeRain(); resizeInf(); redrawAllCities(); });

/* ── UI helpers ── */
function openModal(id){ document.getElementById(id)?.classList.add('open') }
function closeModal(id){ document.getElementById(id)?.classList.remove('open') }
document.querySelectorAll('.nn-modal-overlay').forEach(o=>{
  o.addEventListener('click',e=>{ if(e.target===o) o.classList.remove('open') });
});

function showToast(title,msg,type='primary'){
  const stack = document.getElementById('toast-stack');
  const icons = {primary:'ℹ',danger:'☠',warn:'⚠',safe:'✔'};
  const t = document.createElement('div');
  t.className = `nn-toast toast-${type}`;
  t.innerHTML = `<span class="nn-toast-icon">${icons[type]||'·'}</span><div class="nn-toast-body"><div class="nn-toast-title">${title}</div><div class="nn-toast-msg">${msg}</div></div><button style="background:none;border:none;color:var(--nn-text-dim);cursor:crosshair;font-size:.9rem;line-height:1;padding:0;margin-left:.5rem" onclick="this.parentElement.remove()">✕</button>`;
  stack.appendChild(t);
  setTimeout(()=>t.style.opacity='0',4000);
  setTimeout(()=>t.remove(),4400);
}

function switchTab(btn,id){
  document.querySelectorAll('.nn-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nn-tab-content').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id)?.classList.add('active');
}

function toggleAcc(btn){
  const body = btn.nextElementSibling;
  const open = btn.classList.contains('open');
  btn.classList.toggle('open',!open); body.classList.toggle('open',!open);
}

function scrollTo(sel){ document.querySelector(sel)?.scrollIntoView({behavior:'smooth',block:'start'}); }

/* Scrollspy */
const navSections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.navbar-links a');
window.addEventListener('scroll',()=>{
  let cur=''; navSections.forEach(s=>{ if(scrollY>=s.offsetTop-80) cur=s.id; });
  navAs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
},{passive:true});

/* Terminal typing */
document.querySelectorAll('.terminal-prompt:not(.terminal-cursor),.terminal-ok,.terminal-warn,.terminal-err').forEach((el,i)=>{
  const raw = el.textContent; el.textContent='';
  setTimeout(()=>{
    let j=0;const iv=setInterval(()=>{
      el.textContent=raw.substring(0,j++);
      if(j>raw.length) clearInterval(iv);
    },32);
  },600+i*380);
});

/* Parallax on hero */
const heroEl = document.getElementById('home');
if(heroEl) window.addEventListener('mousemove',e=>{
  const c = document.getElementById('city-hero-canvas');
  if(c){ const rx=(e.clientX/innerWidth-.5)*12,ry=(e.clientY/innerHeight-.5)*8; c.style.transform=`translateX(${rx*.4}px) translateY(${ry*.3}px) scale(1.02)`; }
},{passive:true});

/* Glitch delay stagger */
document.querySelectorAll('.glitch').forEach((el,i)=>el.style.animationDelay=`${i*.55}s`);
