const bg=document.getElementById('burger'),mn=document.getElementById('mnav');
if(bg&&mn){bg.onclick=()=>mn.classList.toggle('open');mn.querySelectorAll('a').forEach(a=>a.onclick=()=>mn.classList.remove('open'));}
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('vis'),io.unobserve(e.target))),{threshold:.12});
document.querySelectorAll('.reveal').forEach(n=>io.observe(n));
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const n=e.target,t=+n.dataset.count;let v=0;const iv=setInterval(()=>{v+=Math.ceil(t/30);if(v>=t){v=t;clearInterval(iv)}n.textContent=v},50);co.unobserve(n)}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(n=>co.observe(n));
// курсор-звездочёт
const cdot=document.createElement('div'),cring=document.createElement('div');
cdot.className='cur-dot';cring.className='cur-ring';document.body.append(cdot,cring);
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cdot.style.transform=`translate(${mx-4}px,${my-4}px)`;
document.querySelectorAll('.m-pupil').forEach(p=>{const r=p.getBoundingClientRect();const dx=Math.max(-1,Math.min(1,(mx-(r.left+r.width/2))/60));const dy=Math.max(-1,Math.min(1,(my-(r.top+r.height/2))/60));p.style.transform=`translate(${dx*4}px,${dy*4}px)`})},{passive:true});
(function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;cring.style.transform=`translate(${rx-cring.offsetWidth/2}px,${ry-cring.offsetHeight/2}px)`;requestAnimationFrame(loop)})();
document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>cring.classList.add('big'));el.addEventListener('mouseleave',()=>cring.classList.remove('big'))});
// звёзды по клику в арт-блоке
document.querySelectorAll('.playground').forEach(z=>z.addEventListener('click',e=>{const r=z.getBoundingClientRect();const s=document.createElement('span');s.className='burst';s.textContent=['★','✦','●'][Math.floor(Math.random()*3)];s.style.left=(e.clientX-r.left)+'px';s.style.top=(e.clientY-r.top)+'px';s.style.fontSize=(18+Math.random()*26)+'px';z.appendChild(s);setTimeout(()=>s.remove(),1000)}));
// цели: клики по связи (сработают, когда подключишь Метрику)
document.querySelectorAll('a[href*="t.me"],a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>{
try{if(typeof ym!=='undefined'&&window.YM_ID)ym(window.YM_ID,'reachGoal','lead_click')}catch(e){}
try{if(typeof gtag!=='undefined')gtag('event','lead_click')}catch(e){}
}));
