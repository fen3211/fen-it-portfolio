const bg=document.getElementById('burger'),mn=document.getElementById('mnav');
if(bg&&mn){bg.onclick=()=>mn.classList.toggle('open');mn.querySelectorAll('a').forEach(a=>a.onclick=()=>mn.classList.remove('open'));}
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('vis'),io.unobserve(e.target))),{threshold:.12});
document.querySelectorAll('.reveal').forEach(n=>io.observe(n));
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const n=e.target,t=+n.dataset.count;let v=0;const iv=setInterval(()=>{v+=Math.ceil(t/30);if(v>=t){v=t;clearInterval(iv)}n.textContent=v},50);co.unobserve(n)}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(n=>co.observe(n));
// цели: клики по связи (сработают, когда подключишь Метрику)
document.querySelectorAll('a[href*="t.me"],a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>{
try{if(typeof ym!=='undefined'&&window.YM_ID)ym(window.YM_ID,'reachGoal','lead_click')}catch(e){}
try{if(typeof gtag!=='undefined')gtag('event','lead_click')}catch(e){}
}));
