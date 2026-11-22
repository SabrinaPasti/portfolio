(function(){
  var root=document.querySelector('.sp'); if(!root) return;
  var $=function(s){return root.querySelector(s)}, $$=function(s){return [].slice.call(root.querySelectorAll(s))};
  var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- CASES (mesma ordem da lateral e dos atalhos) ---- */
  var cases=[
    {id:'gocase',nome:'gocase',novo:true,
     tipo:'e-commerce · facelift · desktop e mobile',
     pergunta:'Como levar alguém da escolha da estampa ao carrinho sem transformar a compra em mais uma tarefa?',
     decisoes:['Home mais leve, com categorias claras logo no começo','Página de produto com prévia ao vivo da personalização','Login, cadastro e carrinho com o mínimo de passos e confirmação clara','Componentes publicados em biblioteca, para desktop e mobile'],
     entrega:'Um facelift do site da home à página de produto. A pessoa vê o resultado da personalização antes de comprar, e a marca para de depender de desconto para convencer.',
     papel:['ux/ui','web design','design system']},
    {id:'equillibra',nome:'equillibra',
     tipo:'plataforma web · bem-estar no trabalho (NR-1)',
     pergunta:'Como o RH entende os riscos psicossociais da equipe, se quem responde não se sente seguro para responder?',
     decisoes:['Painel com a pontuação geral da empresa e o risco em quatro níveis, de baixo a muito alto','Campanhas de avaliação por link ou QR Code, com adesão em tempo real','Questionários prontos (COPSOQ, ISTAS21, WHO-5) e um construtor próprio','Resposta anônima, em qualquer tela, com perguntas em texto, imagem ou vídeo'],
     entrega:'Uma plataforma que ajuda empresas a identificar, acompanhar e reduzir riscos psicossociais, transformando avaliações em decisões.',
     papel:['discovery','ux research','product design','prototipação','design system','handoff']},
    {id:'tfes',nome:'t-fes',
     tipo:'banco digital white label · app',
     pergunta:'Como deixar saldo, cartões e transferências fáceis de achar num app que precisa vestir a identidade de várias marcas?',
     decisoes:['Saldo e ações principais logo no topo da tela','Cartões para organizar a vida financeira','Interface modular, pronta para receber outra marca','Ícones familiares e fluxos curtos para as tarefas que se repetem'],
     entrega:'Uma base personalizável reúne contas, transferências, cartões e agendamentos. Cada marca muda a identidade visual e preserva a hierarquia das ações financeiras.',
     papel:['ux/ui','white label','app']},
    {id:'vitallia',nome:'vitallia',
     tipo:'gestão clínica white label · desktop e app',
     pergunta:'A clínica organiza prontuários, estoque e atendimentos. O paciente tenta seguir o tratamento em casa. Como conectar as duas rotinas?',
     decisoes:['Um sistema só, com dois lados: clínica no desktop, paciente no app','Fluxo de atendimento e anamnese, estoque, financeiro e leads no mesmo lugar','App com consultas, plano alimentar, treinos, metas e exames','Gamificação para o paciente continuar o tratamento'],
     entrega:'A rotina da clínica no desktop fica ligada ao acompanhamento no celular. A equipe organiza atendimentos e o paciente consulta planos, exames e o progresso das próprias metas.',
     papel:['ux/ui','white label','desktop + app']}
  ];
  cases.forEach(function(c){c.video='media/'+c.id+'.mp4'; c.poster='media/'+c.id+'.webp'; c.thumb='media/'+c.id+'-thumb.webp'});

  var tools=$('#sp-tools'), info=$('#sp-info'), video=$('#sp-video'), box=$('#sp-screenbox'), load=$('#sp-load'), loadName=$('#sp-load-name'),
      count=$('#sp-count'), pp=$('#sp-pp'), seek=$('#sp-seek'), cur=$('#sp-cur'), dur=$('#sp-dur'), snd=$('#sp-snd'), full=$('#sp-full'), big=$('#sp-bigplay'),
      current=-1, timer, visible=false, userPaused=false;

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function icon(id){return '<svg class="px"><use href="#i-'+id+'"/></svg>'}
  function fmt(t){t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+('0'+t%60).slice(-2)}

  function fill(c,i){
    info.innerHTML='<h3>'+esc(c.nome)+'</h3><p class="sp-type">'+esc(c.tipo)+'</p>'+
      '<h4>o desafio</h4><p class="sp-q">'+esc(c.pergunta)+'</p>'+
      '<h4>o que eu decidi</h4><ul>'+c.decisoes.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul>'+
      '<h4>solução proposta</h4><p>'+esc(c.entrega)+'</p>'+
      '<div class="sp-roles">'+c.papel.map(function(p){return '<span>'+esc(p)+'</span>'}).join('')+'</div>';
    video.poster=c.poster; video.src=c.video; video.load();
    video.setAttribute('aria-label','Vídeo do case '+c.nome);
    count.textContent=(i+1)+'/'+cases.length;
    var crt=$('#sp-crt'); if(crt) crt.innerHTML='<small>C:\\cases&gt;</small><b>'+esc(c.nome)+'</b><small>'+(i+1)+' de '+cases.length+'<u>_</u></small>';
    seek.value=0; seek.style.setProperty('--p','0%'); cur.textContent='0:00'; dur.textContent='0:00';
    if(visible && !userPaused) play(); else syncUI();
  }
  function pick(i,instant){
    if(i===current) return; current=i;
    $$('#sp-tools button').forEach(function(b,k){b.setAttribute('aria-selected',k===i); b.tabIndex=k===i?0:-1});
    clearTimeout(timer);
    if(instant||calm){fill(cases[i],i);return}
    loadName.textContent=cases[i].nome; load.hidden=false; video.pause();
    timer=setTimeout(function(){fill(cases[i],i); load.hidden=true},560);
  }

  /* lateral com miniaturas */
  cases.forEach(function(c,i){
    var b=document.createElement('button'); b.type='button'; b.setAttribute('role','tab'); b.setAttribute('aria-controls','sp-info'); b.id='tab-'+c.id;
    b.innerHTML='<img src="'+c.thumb+'" alt="" width="320" height="180"><span>'+esc(c.nome)+'<small>0'+(i+1)+'</small></span>'+(c.novo?'<em>novo!</em>':'');
    b.addEventListener('click',function(){userPaused=false; pick(i)});
    b.addEventListener('keydown',function(e){
      var k={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key]; if(!k) return; e.preventDefault();
      var n=(i+k+cases.length)%cases.length; tools.children[n].focus(); userPaused=false; pick(n);
    });
    tools.appendChild(b);
  });

  /* player */
  function syncUI(){
    var paused=video.paused;
    pp.innerHTML=icon(paused?'play':'pause'); pp.setAttribute('aria-label',paused?'Tocar vídeo':'Pausar vídeo');
    box.classList.toggle('is-paused',paused); big.hidden=!paused||!load.hidden;
    snd.setAttribute('aria-pressed',!video.muted); snd.setAttribute('aria-label',video.muted?'Ligar o som':'Desligar o som');
    snd.innerHTML=icon(video.muted?'mute':'sound')+'<span>'+(video.muted?'som':'som on')+'</span>';
  }
  function play(){var p=video.play(); if(p&&p.catch) p.catch(function(){syncUI()})}
  function toggle(){ if(video.paused){userPaused=false; play()} else {userPaused=true; video.pause()} }
  pp.addEventListener('click',toggle);
  big.addEventListener('click',function(){userPaused=false; play()});
  box.addEventListener('click',function(e){ if(e.target===video) toggle() });
  ['play','pause','volumechange','loadeddata'].forEach(function(ev){video.addEventListener(ev,syncUI)});
  video.addEventListener('loadedmetadata',function(){dur.textContent=fmt(video.duration)});
  video.addEventListener('timeupdate',function(){
    if(!video.duration) return; var p=video.currentTime/video.duration;
    if(!seek._drag){seek.value=Math.round(p*1000)} seek.style.setProperty('--p',(p*100)+'%'); cur.textContent=fmt(video.currentTime);
  });
  seek.addEventListener('input',function(){seek._drag=true; if(video.duration){video.currentTime=seek.value/1000*video.duration; seek.style.setProperty('--p',(seek.value/10)+'%')}});
  seek.addEventListener('change',function(){seek._drag=false});
  snd.addEventListener('click',function(){video.muted=!video.muted; if(!video.muted){userPaused=false; play()}});
  full.addEventListener('click',function(){
    if(video.requestFullscreen){video.requestFullscreen().catch(function(){})}
    else if(video.webkitEnterFullscreen){video.webkitEnterFullscreen()}
    video.muted=false; userPaused=false; play();
  });
  document.addEventListener('fullscreenchange',function(){video.controls=document.fullscreenElement===video});

  /* toca só quando a janela está na tela */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      visible=es[0].isIntersecting;
      if(visible){ if(!userPaused && !calm) play() } else if(!video.paused){ video.pause() }
    },{threshold:.35}).observe(box);
  }

  pick(0,true);
  syncUI();

  /* atalhos da hero que apontam para um case */
  $$('[data-case]').forEach(function(a){a.addEventListener('click',function(){userPaused=false; pick(+a.dataset.case,true)})});

  /* paleta: troca o fundo da tela */
  var pal=$('#sp-palette'), canvas=$('#sp-canvas');
  ['#ffffff','#fbe1ee','#ffb0d8','#e5137c','#d9ccff','#6a4be0','#bfe2ff','#c9f0de','#fff1a8','#ffd98a','#2a0d2e','#9a8f9e'].forEach(function(c,i){
    var b=document.createElement('button'); b.type='button'; b.style.setProperty('--c',c); b.setAttribute('aria-label','Fundo '+c); b.setAttribute('aria-pressed',i===0);
    b.addEventListener('click',function(){canvas.style.setProperty('--mat',c); $$('#sp-palette button').forEach(function(x){x.setAttribute('aria-pressed',x===b)})});
    pal.appendChild(b);
  });
})();
