const bg=document.getElementById('burger'),mn=document.getElementById('mnav');
if(bg&&mn){bg.onclick=()=>mn.classList.toggle('open');mn.querySelectorAll('a').forEach(a=>a.onclick=()=>mn.classList.remove('open'));}
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('vis'),io.unobserve(e.target))),{threshold:.12});
document.querySelectorAll('.reveal').forEach(n=>io.observe(n));
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const n=e.target,t=+n.dataset.count;let v=0;const iv=setInterval(()=>{v+=Math.ceil(t/30);if(v>=t){v=t;clearInterval(iv)}n.textContent=v},50);co.unobserve(n)}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(n=>co.observe(n));
// курсор-звезда со шлейфом
const cur=document.createElement('div');cur.className='cur';cur.textContent='✦';document.body.append(cur);
let lx=0,ly=0,last=0;
addEventListener('mousemove',e=>{cur.classList.add('on');cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';
const now=performance.now(),d=Math.hypot(e.clientX-lx,e.clientY-ly);
if(d>28&&now-last>60){last=now;lx=e.clientX;ly=e.clientY;const t=document.createElement('span');t.className='trail';t.textContent='✦';t.style.left=e.clientX+'px';t.style.top=e.clientY+'px';document.body.append(t);setTimeout(()=>t.remove(),700)}},{passive:true});
document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>cur.classList.add('big'));el.addEventListener('mouseleave',()=>cur.classList.remove('big'))});
// звёзды по клику в арт-блоке
document.querySelectorAll('.playground').forEach(z=>z.addEventListener('click',e=>{const r=z.getBoundingClientRect();const s=document.createElement('span');s.className='burst';s.textContent=['★','✦','●'][Math.floor(Math.random()*3)];s.style.left=(e.clientX-r.left)+'px';s.style.top=(e.clientY-r.top)+'px';s.style.fontSize=(18+Math.random()*26)+'px';z.appendChild(s);setTimeout(()=>s.remove(),1000)}));
// цели: клики по связи (сработают, когда подключишь Метрику)
document.querySelectorAll('a[href*="t.me"],a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>{
try{if(typeof ym!=='undefined'&&window.YM_ID)ym(window.YM_ID,'reachGoal','lead_click')}catch(e){}
try{if(typeof gtag!=='undefined')gtag('event','lead_click')}catch(e){}
}));
// прелоадер
addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('done'),900));
setTimeout(()=>{const l=document.getElementById('loader');if(l)l.classList.add('done')},3500);
// печать букв hero
document.querySelectorAll('.hero-word .solid,.hero-word .line').forEach(line=>{
const t=line.textContent;line.textContent='';
[...t].forEach((ch,i)=>{const s=document.createElement('span');s.className='ltr';s.style.animationDelay=(1000+i*38)+'ms';s.textContent=ch===' '?'\u00A0':ch;line.append(s)})});
// 3d-tilt мокапов
document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-4px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
const bws=document.querySelectorAll('.bgword');
if(bws.length&&matchMedia('(prefers-reduced-motion: no-preference)').matches){addEventListener('scroll',()=>{bws.forEach(w=>{const r=w.getBoundingClientRect();w.style.translate=`0 ${r.top/innerHeight*-34}px`})},{passive:true})}
