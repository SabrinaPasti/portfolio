(function(){
  var root=document.querySelector('.sp'); if(!root) return;
  var $=function(s){return root.querySelector(s)}, $$=function(s){return [].slice.call(root.querySelectorAll(s))};
  var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- CASES. Para ligar um vídeo: preencha "video" com o endereço do arquivo .mp4 ---- */
  var cases=[
    {id:'gocase',nome:'gocase',novo:true,cor:'#ff6f9f',poster:'',video:'',
     tipo:'e-commerce · site desktop e mobile',
     desafio:'Como levar alguém da escolha da estampa ao carrinho sem transformar o cadastro em mais uma tarefa?',
     decisoes:['Login e cadastro com o mínimo de campos e de passos','Carrinho com confirmação clara de item adicionado e barra de progresso legível','Página de marca que não depende de desconto: a personalização é o diferencial','Componentes publicados em biblioteca, para desktop e mobile']},
    {id:'equillibra',nome:'equillibra',cor:'#ff5a4f',poster:'img/eq.jpg',video:'',
     tipo:'plataforma web · bem-estar no trabalho (NR-1)',
     desafio:'RH precisava entender os riscos psicossociais de uma equipe. Para o painel fazer sentido, a pessoa do outro lado precisava se sentir segura ao responder.',
     decisoes:['Painel com a pontuação geral da empresa e o risco em quatro níveis, de baixo a muito alto','Campanhas de avaliação por link ou QR Code, com adesão em tempo real','Questionários prontos (COPSOQ, ISTAS21, WHO-5) e um construtor próprio','Resposta anônima, em qualquer tela, com perguntas em texto, imagem ou vídeo']},
    {entrega:'Uma base personalizável reúne contas, transferências, cartões e agendamentos. Cada marca pode mudar a identidade visual e preservar a hierarquia das ações financeiras.',id:'tfes',nome:'t-fes',cor:'#5b6cff',poster:'img/tfes.jpg',video:'',
     tipo:'banco digital white label · app',
     desafio:'Como deixar saldo, cartões e transferências fáceis de encontrar em um aplicativo que precisa vestir a identidade de várias marcas?',
     decisoes:['Saldo e ações principais logo no topo da tela','Cartões para organizar a vida financeira','Interface modular, pronta para receber outra marca','Ícones familiares e fluxos curtos para as tarefas que se repetem']},
    {entrega:'A proposta conecta a rotina da clínica no desktop ao acompanhamento no celular. A equipe organiza atendimentos e o paciente consulta planos, exames e o progresso das próprias metas.',id:'vitallia',nome:'vitallia',cor:'#7a55d8',poster:'img/vit.jpg',video:'',
     tipo:'gestão clínica white label · desktop e app',
     desafio:'Enquanto a clínica organiza prontuários, estoque e atendimentos, o paciente tenta acompanhar o tratamento em casa. Como conectar essas duas rotinas?',
     decisoes:['Um sistema só, com dois lados: clínica no desktop, paciente no app','Fluxo de atendimento e anamnese, estoque, financeiro e leads no mesmo lugar','App com consultas, plano alimentar, treinos, metas e exames','Gamificação para o paciente continuar o tratamento']}
  ];
  var tools=$('#sp-tools'), info=$('#sp-info'), poster=$('#sp-poster'), video=$('#sp-video'), bars=$('#sp-bars'), load=$('#sp-load'), badge=$('#sp-badge'), count=$('#sp-count'), timer;
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function fill(c,i){
    info.innerHTML='<h3>'+esc(c.nome)+'</h3><p class="sp-type">'+esc(c.tipo)+'</p><h4>o desafio</h4><p>'+esc(c.desafio)+'</p><h4>o que eu decidi</h4><ul>'+c.decisoes.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul>'+(c.entrega?'<h4>solução proposta</h4><p>'+esc(c.entrega)+'</p>':'');
    poster.hidden=!c.poster||!!c.video; if(c.poster){poster.src=c.poster; poster.alt='Tela do projeto '+c.nome}
    video.hidden=!c.video; if(c.video){video.src=c.video; video.play().catch(function(){})} else {video.removeAttribute('src')}
    bars.hidden=!!(c.poster||c.video); bars.style.display=bars.hidden?'none':'';
    badge.hidden=!!c.video; badge.style.display=c.video?'none':'';
    count.textContent=(i+1)+'/'+cases.length;
    var crt=$('#sp-crt'); if(crt) crt.innerHTML='<small>C:\\cases&gt;</small><b>'+esc(c.nome)+'</b><small>'+(i+1)+' de '+cases.length+'<u>_</u></small>';
  }
  function pick(i,instant){
    $$('#sp-tools button').forEach(function(b,k){b.setAttribute('aria-selected',k===i)});
    clearTimeout(timer);
    if(instant||calm){fill(cases[i],i);return}
    load.hidden=false; timer=setTimeout(function(){fill(cases[i],i); load.hidden=true},650);
  }
  cases.forEach(function(c,i){
    var b=document.createElement('button'); b.type='button'; b.setAttribute('role','tab');
    b.innerHTML='<i style="--t:'+(c.poster?'url('+c.poster+')':c.cor)+'">'+(c.poster?'':c.nome.charAt(0).toUpperCase())+'</i>'+esc(c.nome)+(c.novo?'<em>novo!</em>':'');
    b.addEventListener('click',function(){pick(i)}); tools.appendChild(b);
  });
  pick(0,true);
  // links da hero que apontam para um case
  $$('.sp-list a').forEach(function(a,i){a.addEventListener('click',function(){pick(i)})});
  // paleta
  var pal=$('#sp-palette'), canvas=$('#sp-canvas');
  ['#ffffff','#ffd6ea','#ff9fd0','#d4006a','#cdbcff','#5b3fd0','#9fd0ff','#bdf0d2','#fff3a6','#ffd98a','#2b0a30','#8a8a8a'].forEach(function(c,i){
    var b=document.createElement('button'); b.type='button'; b.style.setProperty('--c',c); b.setAttribute('aria-label','Fundo '+c); b.setAttribute('aria-pressed',i===0);
    b.addEventListener('click',function(){canvas.style.setProperty('--mat',c); $$('#sp-palette button').forEach(function(x){x.setAttribute('aria-pressed',x===b)})});
    pal.appendChild(b);
  });


})();
