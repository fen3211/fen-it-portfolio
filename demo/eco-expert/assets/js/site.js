// ECO-EXPERT site.js — nav, reveal, counters, filters, forms, marquee
(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  // progress + nav shrink
  addEventListener('scroll',()=>{
    const h=document.documentElement,p=$('#progress');
    if(p) p.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
    const nav=$('header.nav'); if(nav) nav.classList.toggle('scrolled',scrollY>10);
  },{passive:true});
  // mobile nav
  const b=$('#burger'),m=$('#mnav');
  if(b&&m) b.onclick=()=>m.classList.toggle('open');
  // reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('vis'),io.unobserve(e.target))),{threshold:.1});
  $$('.reveal').forEach((n,i)=>{if(!n.dataset.d)n.dataset.d=i%3;io.observe(n)});
  // counters
  const co=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;const n=e.target,t=+n.dataset.count;let v=0;
    const iv=setInterval(()=>{v+=Math.max(1,Math.ceil(t/40));if(v>=t){v=t;clearInterval(iv)}n.textContent=v},50);
    co.unobserve(n);
  }),{threshold:.5});
  $$('[data-count]').forEach(n=>co.observe(n));
  // marquee build
  const mq=$('#marq');
  if(mq&&!mq.children.length){const items=['СЗЗ','ОЦЕНКА РИСКА','СЭЭ','УПРЗА · МРР-2017','ШУМ · SoundPLAN','ПАТ · 7 ПОДЗОН','ПДК · ОБУВ','ОВОС · ГГЭ'];mq.innerHTML=(items.map(x=>`<b>${x}</b> ● `).join('')).repeat(4);}
  // filters (cases/blog)
  $$('[data-filter-group]').forEach(group=>{
    const btns=$$('button',group), cards=$$('[data-cat]');
    btns.forEach(btn=>btn.onclick=()=>{
      btns.forEach(x=>x.classList.remove('on'));btn.classList.add('on');
      const f=btn.dataset.filter;
      cards.forEach(c=>c.style.display=(f==='all'||c.dataset.cat.includes(f))?'':'none');
    });
  });
  // file input UX
  $$('input[type=file]').forEach(inp=>{
    const box=inp.closest('.file')||inp;
    inp.addEventListener('change',()=>{
      const n=inp.files.length;
      const label=box.querySelector('small')||box;
      if(n) label.textContent=`Выбрано файлов: ${n} — ${[...inp.files].slice(0,3).map(f=>f.name).join(', ')}${n>3?'…':''}`;
    });
  });
  // ajax forms — замените ACTION на свой бэкенд / Bitrix / Formspree
  $$('form[data-lead]').forEach(f=>{
    f.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!f.checkValidity()){f.reportValidity();return}
      const btn=$('button[type=submit]',f);const old=btn.textContent;btn.textContent='Отправляем…';btn.disabled=true;
      const fd=new FormData(f);
      try{
        // const r=await fetch(f.action,{method:'POST',body:fd}); if(!r.ok) throw 0;
        await new Promise(r=>setTimeout(r,700)); // демо-задержка
        const id='EE-'+Math.floor(1000+Math.random()*9000);
        f.innerHTML=`<b>Заявка ${id} ушла.</b><p style="color:#555;font-size:14px">Ответим в течение рабочего дня. Копия ушла на вашу почту. Трек-номер сохраните для договора.</p>`;
      }catch(_){btn.textContent=old;btn.disabled=false;alert('Не отправилось. Напишите на info@eco-expert.ru');}
    });
  });
  // active nav
  const path=location.pathname.split('/').pop()||'index.html';
  $$('.links a, .mnav a').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('on')});
})();
