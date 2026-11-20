(function(){
  var root=document.querySelector('.sp'); if(!root) return;
  var $=function(s){return root.querySelector(s)}, $$=function(s){return [].slice.call(root.querySelectorAll(s))};
  var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage=$('#sp-stage');

  // relógio
  var clock=$('#sp-clock');
  function tick(){var d=new Date();clock.textContent=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
  tick(); setInterval(tick,15000);

  // faíscas
  function burst(x,y,n,spread){
    if(calm) return;
    for(var i=0;i<n;i++){
      var s=document.createElement('span'); s.className='sp-fx'; s.textContent=i%3?'✦':'♥';
      s.style.left=x+'px'; s.style.top=y+'px'; s.style.fontSize=(10+Math.random()*14)+'px'; root.appendChild(s);
      var a=Math.random()*6.28, r=spread*(.4+Math.random()*.6);
      s.animate([{transform:'translate(-50%,-50%)',opacity:1},{transform:'translate('+(Math.cos(a)*r-7)+'px,'+(Math.sin(a)*r+20)+'px) rotate(140deg) scale(.3)',opacity:0}],{duration:650+Math.random()*350,easing:'ease-out'}).onfinish=(function(e){return function(){e.remove()}})(s);
    }
  }
  function center(el){var r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}

  // stop-motion da foto
  var frames=$$('.sp-fig img'), counter=$('#sp-frame'), flip=$('#sp-flip'), busy=false;
  function show(i){frames.forEach(function(f,k){f.classList.toggle('is-on',k===i)}); counter.textContent=(i+1)+'/'+frames.length}
  function play(){
    if(busy) return; busy=true; var i=0; show(0);
    var t=setInterval(function(){i++; show(i); if(i>=frames.length-1){clearInterval(t); busy=false}}, i===0?300:300);
  }
  flip.addEventListener('click',function(){if(!moved) play()});
  flip.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  if(!calm){ setTimeout(play,900); setInterval(function(){if(!document.hidden) play()},7000); flip.addEventListener('mouseenter',play); }

  // celular
  var screen=$('#sp-screen'), hit=$('#sp-phone-hit'), phone=$('#sp-phone'), step=0;
  var screens=[
    '<b>msg (1)</b><span>1 nova<br>mensagem ♥</span><em><i>ler</i><i>abc</i></em>',
    '<b>de: sabrina</b><span>oi! qual ideia anda ocupando suas abas?</span><em><i>responder</i><i>1/1</i></em>',
    '<b>responder</b><span><a href="https://wa.me/5511946094530">chamar no whatsapp →</a></span><em><i>voltar</i><i>ok</i></em>'
  ];
  hit.addEventListener('click',function(){
    if(moved) return;
    step=(step+1)%screens.length; screen.innerHTML=screens[step];
    hit.style.top=step===2?'45%':'0'; // no último passo o link da tela fica clicável; o teclado volta ao início
    hit.setAttribute('aria-label',step===2?'Voltar para o início das mensagens':'Ler a mensagem no celular');
  });
  if(!calm) setTimeout(function(){phone.classList.add('is-ring'); var c=center(phone); burst(c[0],c[1]-80,5,60)},2600);

  // estrela e coração
  $$('[data-fx]').forEach(function(el){
    el.addEventListener('click',function(){
      if(moved) return; var c=center(el);
      if(el.dataset.fx==='star'){ burst(c[0],c[1],14,120); if(!calm) el.animate([{rotate:'0deg',scale:1},{rotate:'200deg',scale:1.25},{rotate:'360deg',scale:1}],{duration:700,easing:'ease-in-out'}); }
      else { burst(c[0],c[1],8,90); if(!calm) el.animate([{rotate:'0deg'},{rotate:'32deg'},{rotate:'-26deg'},{rotate:'16deg'},{rotate:'-8deg'},{rotate:'0deg'}],{duration:1600,easing:'ease-in-out'}); }
    });
  });

  // player e CD
  var pb=$('#sp-play-btn');
  pb.addEventListener('click',function(){var on=stage.classList.toggle('is-playing'); pb.textContent=on?'❚❚':'▶'; pb.setAttribute('aria-label',on?'Pausar animação':'Tocar animação')});

  // menu iniciar e janelas
  var st=$('#sp-start'), menu=$('#sp-menu');
  st.addEventListener('click',function(){menu.hidden=!menu.hidden; st.setAttribute('aria-expanded',!menu.hidden)});
  document.addEventListener('click',function(e){if(!menu.hidden&&!e.target.closest('.sp-task')){menu.hidden=true;st.setAttribute('aria-expanded',false)}});
  $$('[data-close]').forEach(function(b){b.addEventListener('click',function(){b.closest('.sp-win').hidden=true})});
  var messageButton = $('#open-message');
  var messageDialog = $('#message-dialog');
  messageButton.addEventListener('click', function(){
    menu.hidden = true;
    st.setAttribute('aria-expanded', 'false');
    messageDialog.showModal();
  });
  messageDialog.addEventListener('close', function(){ messageButton.focus({preventScroll:true}); });
  var tidyDialog = $('#tidy-dialog');
  $('#sp-restore').addEventListener('click', function(){
    $$('[data-drag]').forEach(function(item){
      item.hidden = false;
      item.style.translate = '';
      item.style.zIndex = '';
      item._x = item._y = 0;
    });
    menu.hidden = true;
    st.setAttribute('aria-expanded', 'false');
    tidyDialog.showModal();
  });
  tidyDialog.addEventListener('close', function(){ st.focus({preventScroll:true}); });
  menu.addEventListener('click', function(event){
    if(event.target.closest('a')){ menu.hidden = true; st.setAttribute('aria-expanded','false'); }
  });

  // arrastar: janelas pela barra de título, objetos por inteiro (só com mouse, em tela grande)
  var z=10, moved=false;
  $$('[data-drag]').forEach(function(w){
    var handle=w.querySelector('.sp-tb')||w; w._x=0; w._y=0;
    handle.addEventListener('pointerdown',function(e){
      moved=false;
      var sticker = w.dataset.drag === 'sticker';
      if(!e.isPrimary || e.button !== 0 || e.target.closest('[data-close],a')) return;
      if(!sticker && (e.pointerType !== 'mouse' || innerWidth < 1101)) return;
      if(sticker) handle.setPointerCapture(e.pointerId);
      var sx=e.clientX-w._x, sy=e.clientY-w._y, x0=e.clientX, y0=e.clientY;
      w.style.zIndex=++z;
      function mv(ev){
        if(ev.pointerId !== e.pointerId) return;
        if(!moved&&Math.abs(ev.clientX-x0)+Math.abs(ev.clientY-y0)<5) return;
        moved=true; w.classList.add('is-drag'); w._x=ev.clientX-sx; w._y=ev.clientY-sy; w.style.translate=w._x+'px '+w._y+'px';
      }
      function up(ev){if(ev.pointerId !== e.pointerId) return; removeEventListener('pointercancel',up); w.classList.remove('is-drag'); removeEventListener('pointermove',mv); removeEventListener('pointerup',up); setTimeout(function(){moved=false},0)}
      addEventListener('pointermove',mv); addEventListener('pointerup',up); addEventListener('pointercancel',up);
    });
  });

  // brilho seguindo o cursor
  if(!calm&&matchMedia('(pointer:fine)').matches){
    var last=0;
    root.addEventListener('pointermove',function(e){
      var t=Date.now(); if(t-last<80) return; last=t;
      var s=document.createElement('span'); s.className='sp-fx'; s.textContent='✦'; s.style.left=(e.clientX+8)+'px'; s.style.top=(e.clientY+10)+'px'; root.appendChild(s);
      s.animate([{opacity:1},{transform:'translateY(22px) scale(.3) rotate(90deg)',opacity:0}],{duration:700,easing:'ease-out'}).onfinish=function(){s.remove()};
    });
  }
})();
