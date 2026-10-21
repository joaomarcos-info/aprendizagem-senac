/* ============================================================
   Conecta · Dinâmicas UC1 — motor comum
   Somente JavaScript, sem bibliotecas, sem servidor.
   Contém: armazenamento, grupo, sessão por blocos, tutorial,
   som, avisos e geração de relatório (PDF, CSV, TXT).
   ============================================================ */
(function (global) {
  var C = {};
  var K = { grupo: 'cs_grupo_v1', som: 'cs_som_v1', sessao: 'cs_sessao_' };

  /* ---------------- armazenamento ---------------- */
  C.ler = function (chave, padrao) {
    try { var v = localStorage.getItem(chave); return v === null ? padrao : JSON.parse(v); }
    catch (e) { return padrao; }
  };
  C.gravar = function (chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); return true; } catch (e) { return false; }
  };
  C.apagar = function (chave) { try { localStorage.removeItem(chave); } catch (e) {} };

  /* ---------------- grupo ---------------- */
  C.grupo = function () { return C.ler(K.grupo, null); };
  C.definirGrupo = function (nome, integrantes) {
    var g = {
      nome: String(nome || '').trim() || 'Grupo sem nome',
      integrantes: (integrantes || []).map(function (n) { return String(n).trim(); }).filter(Boolean),
      codigo: C.codigo(),
      criado: new Date().toISOString()
    };
    C.gravar(K.grupo, g);
    return g;
  };
  C.codigo = function () {
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    for (var i = 0; i < 4; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return 'CS-' + s;
  };
  C.portaVoz = function (indice) {
    var g = C.grupo() || {};
    var nomes = g.integrantes || [];
    if (!nomes.length) return 'porta-voz do grupo';
    return nomes[((indice || 0) % nomes.length + nomes.length) % nomes.length];
  };

  /* ---------------- utilitários ---------------- */
  C.esc = function (s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  C.num = function (n) { return Number(n || 0).toLocaleString('pt-BR'); };
  C.tempo = function (seg) {
    seg = Math.max(0, Math.floor(seg || 0));
    var h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    if (h) return h + 'h ' + (m < 10 ? '0' : '') + m + 'min';
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  };
  C.data = function (d) {
    var x = d ? new Date(d) : new Date();
    return x.toLocaleDateString('pt-BR') + ' às ' + x.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  C.embaralhar = function (lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  C.sortear = function (lista, n) { return C.embaralhar(lista).slice(0, n); };
  /* embaralha alternativas e informa onde ficou a correta */
  C.sortearOpcoes = function (opcoes) {
    var idx = [];
    opcoes.forEach(function (o, i) { if (o.correta) idx.push(i); });
    var a = C.embaralhar(opcoes);
    var letras = ['A', 'B', 'C', 'D', 'E'];
    a.forEach(function (o, i) { o.letra = letras[i] || ('#' + (i + 1)); });
    return a;
  };

  /* ---------------- som ---------------- */
  C.somLigado = function () { return C.ler(K.som, true); };
  C.alternarSom = function () {
    var novo = !C.somLigado(); C.gravar(K.som, novo);
    C.aviso(novo ? 'Som ligado' : 'Som desligado');
    return novo;
  };
  C.som = function (tipo) {
    if (!C.somLigado()) return;
    try {
      var Ctx = global.AudioContext || global.webkitAudioContext;
      if (!Ctx) return;
      C._ctx = C._ctx || new Ctx();
      var ctx = C._ctx;
      var mapas = {
        toque: [[520, 0]],
        registro: [[700, 0], [980, .07]],
        certo: [[660, 0], [990, .08]],
        fim: [[660, 0], [880, .1], [1170, .2]],
        alerta: [[320, 0], [240, .12]]
      };
      var notas = mapas[tipo] || mapas.toque;
      notas.forEach(function (n) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = (tipo === 'alerta') ? 'sawtooth' : 'triangle';
        o.frequency.value = n[0];
        var t0 = ctx.currentTime + n[1];
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.10, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.20);
        o.connect(g); g.connect(ctx.destination);
        o.start(t0); o.stop(t0 + 0.24);
      });
    } catch (e) {}
  };

  /* ---------------- avisos e efeitos ---------------- */
  C.aviso = function (msg, ms) {
    var el = document.querySelector('.aviso');
    if (!el) { el = document.createElement('div'); el.className = 'aviso'; document.body.appendChild(el); }
    el.innerHTML = msg;
    el.classList.add('aberto');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('aberto'); }, ms || 2600);
  };
  C.confete = function (qtd) {
    var cores = ['#ffd200', '#2fbf71', '#4c8dd8', '#8b7bf0', '#ff8a3d', '#ffffff'];
    for (var i = 0; i < (qtd || 36); i++) {
      var c = document.createElement('i');
      c.className = 'confete';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = cores[i % cores.length];
      c.style.animationDelay = (Math.random() * .6) + 's';
      document.body.appendChild(c);
      (function (el) { setTimeout(function () { el.remove(); }, 3200); })(c);
    }
  };

  /* ---------------- modal ---------------- */
  C.modal = function (html) {
    var el = document.querySelector('.modal');
    if (!el) { el = document.createElement('div'); el.className = 'modal'; document.body.appendChild(el); }
    el.innerHTML = '<div class="folha entra">' + html + '</div>';
    el.classList.add('aberto');
    return el;
  };
  C.fecharModal = function () {
    var el = document.querySelector('.modal');
    if (el) { el.classList.remove('aberto'); el.innerHTML = ''; }
  };

  /* ---------------- tutorial ---------------- */
  C.tutorial = function (chave, passos, forcar) {
    var k = 'cs_tutorial_' + chave;
    if (!forcar && C.ler(k, false)) return false;
    var i = 0;
    var el = document.querySelector('.tutorial');
    if (!el) { el = document.createElement('div'); el.className = 'tutorial'; document.body.appendChild(el); }
    function desenhar() {
      var p = passos[i];
      el.innerHTML = '<div class="caixa">' +
        '<span class="etiqueta acao">Tutorial ' + (i + 1) + ' de ' + passos.length + '</span>' +
        '<h3 class="mt">' + C.esc(p.titulo) + '</h3>' +
        '<p>' + p.texto + '</p>' +
        '<div class="pontos">' + passos.map(function (_, k2) {
          return '<i class="' + (k2 === i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="linha mt">' +
        (i > 0 ? '<button class="btn secundario pequeno" data-tut="voltar">Voltar</button>' : '') +
        '<button class="btn" data-tut="prox">' + (i + 1 < passos.length ? 'Próximo' : 'Entendi') + '</button>' +
        '<button class="btn texto pequeno" data-tut="pular">Pular</button>' +
        '</div></div>';
      el.classList.add('aberto');
      el.querySelector('[data-tut="prox"]').onclick = function () {
        C.som('toque');
        if (i + 1 < passos.length) { i++; desenhar(); }
        else { C.gravar(k, true); el.classList.remove('aberto'); }
      };
      var v = el.querySelector('[data-tut="voltar"]');
      if (v) v.onclick = function () { i = Math.max(0, i - 1); desenhar(); };
      el.querySelector('[data-tut="pular"]').onclick = function () {
        C.gravar(k, true); el.classList.remove('aberto');
      };
    }
    desenhar();
    return true;
  };

  /* ---------------- cabeçalho ---------------- */
  C.cabecalho = function (opcoes) {
    opcoes = opcoes || {};
    var alvo = document.querySelector(opcoes.alvo || '#topo');
    if (!alvo) return;
    var g = C.grupo();
    alvo.className = 'topo';
    alvo.innerHTML =
      '<div><div class="marca">CONECTA<span>·</span>DINÂMICAS</div>' +
      '<div class="contexto">' + C.esc(opcoes.contexto || '') + '</div></div>' +
      '<div class="acoes-topo">' +
      (g ? '<span class="etiqueta acao">' + C.esc(g.nome) + ' · ' + g.codigo + '</span>'
         : '<span class="etiqueta erro">grupo não identificado</span>') +
      (opcoes.tutorial ? '<button class="btn secundario pequeno" id="btAjuda">Ajuda</button>' : '') +
      '<button class="btn secundario pequeno" id="btSom">' + (C.somLigado() ? 'Som' : 'Mudo') + '</button>' +
      (g ? '<button class="btn texto pequeno" id="btGrupo">Trocar grupo</button>' : '') +
      (opcoes.voltar ? '<a class="btn texto pequeno" href="' + opcoes.voltar + '">Voltar</a>' : '') +
      '</div>';
    var bs = document.getElementById('btSom');
    if (bs) bs.onclick = function () { bs.textContent = C.alternarSom() ? 'Som' : 'Mudo'; };
    var bg = document.getElementById('btGrupo');
    if (bg) bg.onclick = function () {
      var g2 = C.grupo() || {};
      var nome = prompt('Nome do grupo:', g2.nome || '');
      if (nome === null) return;
      var quem = prompt('Integrantes, separados por vírgula:', (g2.integrantes || []).join(', '));
      C.definirGrupo(nome, (quem || '').split(','));
      location.reload();
    };
    var ba = document.getElementById('btAjuda');
    if (ba) ba.onclick = function () { if (opcoes.passosTutorial) C.tutorial(opcoes.chaveTutorial, opcoes.passosTutorial, true); };
  };

  /* ---------------- identificação do grupo (página inicial) ---------------- */
  C.pedirGrupo = function (alvo, aoConfirmar) {
    var el = document.querySelector(alvo);
    var g = C.grupo() || { nome: '', integrantes: [] };
    el.innerHTML =
      '<div class="campo-duplo">' +
      '<div><label for="gNome">Nome do grupo</label>' +
      '<input id="gNome" placeholder="Ex.: Grupo 3 — Recepção" value="' + C.esc(g.nome) + '"></div>' +
      '<div><label for="gQuem">Integrantes (separe por vírgula)</label>' +
      '<input id="gQuem" placeholder="Ana, Bruno, Carla, Diego" value="' + C.esc((g.integrantes || []).join(', ')) + '"></div>' +
      '</div>' +
      '<div class="linha mt"><button class="btn" id="gSalvar">Salvar identificação</button>' +
      '<span class="apoio" id="gRetorno">' + (C.grupo() ? 'Grupo registrado: ' + C.esc(C.grupo().nome) + ' (' + C.grupo().codigo + ')' : 'Ainda não registrado') + '</span></div>';
    document.getElementById('gSalvar').onclick = function () {
      var nome = document.getElementById('gNome').value;
      var quem = document.getElementById('gQuem').value.split(',');
      if (!String(nome).trim()) { C.aviso('Informe o nome do grupo'); return; }
      var novo = C.definirGrupo(nome, quem);
      document.getElementById('gRetorno').textContent = 'Grupo registrado: ' + novo.nome + ' (' + novo.codigo + ')';
      C.som('registro');
      C.aviso('Identificação salva neste aparelho');
      if (aoConfirmar) aoConfirmar(novo);
    };
  };

  /* ---------------- sessão por blocos ---------------- */
  C.sessao = function (cfg) {
    var chave = K.sessao + cfg.chave;
    var est = C.ler(chave, null);
    if (!est || !est.blocos || est.blocos.length !== cfg.blocos.length) {
      est = { bloco: 0, iniciadoEm: null, tempos: {}, concluidos: [], dados: cfg.dadosIniciais || {} };
      if (cfg.blocoInicial > 1) est.bloco = Math.min(cfg.blocos.length - 1, cfg.blocoInicial - 1);
    }
    var alvo = document.querySelector(cfg.alvo);
    var tempoBloco = 0, intervalo = null;

    function salvar() { C.gravar(chave, est); }
    function ctx() {
      return {
        estado: est, dados: est.dados, salvar: salvar,
        irPara: function (i) { ir(i); },
        proximo: function () { concluir(); },
        blocoAtual: cfg.blocos[est.bloco]
      };
    }
    function trilha() {
      return '<div class="trilha">' + cfg.blocos.map(function (b, i) {
        var cls = i === est.bloco ? 'atual' : (est.concluidos.indexOf(b.id) >= 0 ? 'feito' : '');
        return '<div class="passo ' + cls + '" data-cor="' + (b.cor || '') + '"><b>' + C.esc(b.titulo) + '</b></div>';
      }).join('') + '</div>';
    }
    function ir(i) {
      est.bloco = Math.max(0, Math.min(cfg.blocos.length - 1, i));
      salvar(); desenhar();
    }
    function concluir() {
      var b = cfg.blocos[est.bloco];
      if (b.aoConcluir && b.aoConcluir(ctx()) === false) return;
      if (est.concluidos.indexOf(b.id) < 0) est.concluidos.push(b.id);
      salvar();
      if (est.bloco + 1 >= cfg.blocos.length) { finalizar(); return; }
      est.bloco++; salvar(); desenhar();
    }
    function finalizar() {
      est.finalizadoEm = new Date().toISOString();
      salvar();
      if (cfg.aoFinalizar) cfg.aoFinalizar(ctx());
    }
    function desenhar() {
      var b = cfg.blocos[est.bloco];
      alvo.innerHTML =
        trilha() +
        '<div class="bloco-cabecalho" data-cor="' + (b.cor || '') + '">' +
        '<div>' +
        '<div class="faixa">Bloco ' + (est.bloco + 1) + ' de ' + cfg.blocos.length + (b.etiqueta ? ' · ' + C.esc(b.etiqueta) : '') + '</div>' +
        '<div class="titulo">' + C.esc(b.titulo) + '</div>' +
        (b.descricao ? '<div class="apoio">' + b.descricao + '</div>' : '') +
        '</div>' +
        '<div class="marca-bloco" data-cor="' + (b.cor || '') + '">' + (est.bloco + 1) + '</div>' +
        '</div>' +
        '<div id="conteudoBloco"></div>' +
        '<div class="linha mt2">' +
        (est.bloco > 0 ? '<button class="btn texto pequeno" id="btVoltarBloco">Bloco anterior</button>' : '') +
        '<button class="btn" id="btConcluirBloco">' + (est.bloco + 1 < cfg.blocos.length ? 'Concluir bloco e avançar' : 'Concluir e gerar relatório') + '</button>' +
        '</div>';
      if (document.body) document.body.setAttribute('data-cor', b.cor || 'amarelo');
      var conteudo = document.getElementById('conteudoBloco');
      b.render(conteudo, ctx());
      document.getElementById('btConcluirBloco').onclick = function () { C.som('toque'); concluir(); };
      var vb = document.getElementById('btVoltarBloco');
      if (vb) vb.onclick = function () { ir(est.bloco - 1); };
      salvar();
    }
    if (!est.iniciadoEm) { est.iniciadoEm = new Date().toISOString(); salvar(); }
    desenhar();
    return ctx();
  };

  /* ---------------- relatório final ---------------- */
  function linhasTabela(itens) {
    return itens.map(function (i) {
      return '<tr><td>' + C.esc(i.nome) + '</td><td>' + C.esc(i.resposta || '—') + '</td><td>' +
        (i.certo === true ? '<span class="marca-ok">acerto</span>' :
         i.certo === false ? '<span class="marca-erro">erro</span>' : 'registrado') +
        '</td><td>' + C.num(i.pontos || 0) + '</td></tr>';
    }).join('');
  }
  function htmlRelatorio(d) {
    var g = C.grupo() || {};
    var acertos = d.itens.filter(function (i) { return i.certo === true; }).length;
    var erros = d.itens.filter(function (i) { return i.certo === false; }).length;
    return '<h1>Relatório da dinâmica</h1>' +
      '<p><b>' + C.esc(d.titulo) + '</b></p>' +
      '<p>Grupo: <b>' + C.esc(g.nome || '') + '</b>' + (g.codigo ? ' · ' + g.codigo : '') + '<br>' +
      'Integrantes: ' + C.esc((g.integrantes || []).join(', ') || 'não informados') + '<br>' +
      'Data: ' + C.data() + (d.duracao ? ' · Duração: ' + C.tempo(d.duracao) : '') + '</p>' +
      '<h2>Resumo</h2>' +
      '<table><tbody>' +
      '<tr><td>Pontuação final</td><td><b>' + C.num(d.pontos) + '</b></td></tr>' +
      '<tr><td>Acertos</td><td>' + acertos + '</td></tr>' +
      '<tr><td>Erros</td><td>' + erros + '</td></tr>' +
      (d.indicadores ? d.indicadores.map(function (m) {
        return '<tr><td>' + C.esc(m.nome) + '</td><td>' + m.ok + ' de ' + m.total +
          (m.total ? ' (' + Math.round(100 * m.ok / m.total) + '%)' : '') + '</td></tr>';
      }).join('') : '') +
      '</tbody></table>' +
      (d.itens && d.itens.length ? '<h2>Item por item</h2><table><thead><tr><th>Item</th><th>Decisão do grupo</th><th>Resultado</th><th>Pontos</th></tr></thead><tbody>' +
        linhasTabela(d.itens) + '</tbody></table>' : '') +
      (d.extras || []).map(function (e) {
        return '<h2>' + C.esc(e.titulo) + '</h2><p>' + C.esc(e.texto || '—').replace(/\n/g, '<br>') + '</p>';
      }).join('') +
      (d.selos && d.selos.length ? '<h2>Conquistas</h2><p>' + C.esc(d.selos.join(' · ')) + '</p>' : '') +
      '<h2>Observações do grupo</h2><p>' + C.esc(d.observacoes || '—').replace(/\n/g, '<br>') + '</p>';
  }
  C.relatorio = function (alvo, d) {
    var el = document.querySelector(alvo);
    var acertos = d.itens.filter(function (i) { return i.certo === true; }).length;
    var erros = d.itens.filter(function (i) { return i.certo === false; }).length;
    el.innerHTML =
      '<div class="cartao destaque"><h2>Painel final do grupo</h2>' +
      '<div class="hud">' +
      '<div class="caixa"><small>Pontuação</small><b>' + C.num(d.pontos) + '</b></div>' +
      '<div class="caixa"><small>Acertos</small><b>' + acertos + '</b></div>' +
      '<div class="caixa"><small>Erros</small><b>' + erros + '</b></div>' +
      '<div class="caixa"><small>Itens registrados</small><b>' + d.itens.length + '</b></div>' +
      '</div>' +
      (d.indicadores && d.indicadores.length ? '<div class="grade g2 mt">' + d.indicadores.map(function (m) {
        var pct = m.total ? Math.round(100 * m.ok / m.total) : 0;
        return '<div><div class="espalha"><b>' + C.esc(m.nome) + '</b><span class="apoio">' + m.ok + '/' + m.total + ' · ' + pct + '%</span></div>' +
          '<div class="medidor ' + (pct >= 80 ? 'ok' : (pct >= 50 ? '' : 'erro')) + '"><i style="width:' + pct + '%"></i></div></div>';
      }).join('') + '</div>' : '') +
      (d.selos && d.selos.length ? '<div class="selos mt">' + d.selos.map(function (s) {
        return '<span class="selo conquistado">' + C.esc(s) + '</span>'; }).join('') + '</div>' : '') +
      '<div class="observacao"><label for="obsRel">Observações do grupo antes de exportar</label>' +
      '<textarea id="obsRel" rows="3" placeholder="O que aprendemos, o que faríamos diferente...">' + C.esc(d.observacoes || '') + '</textarea></div>' +
      '<div class="acoes-exportar">' +
      '<button class="btn" id="btPDF">Gerar PDF</button>' +
      '<button class="btn secundario" id="btCSV">Baixar CSV</button>' +
      '<button class="btn secundario" id="btTXT">Baixar TXT</button>' +
      '<button class="btn texto" id="btImprimirFicha">Imprimir ficha do grupo</button>' +
      '</div>' +
      '<p class="apoio mt">O relatório fica neste aparelho. Nenhum dado é enviado para servidor.</p>' +
      '</div>' +
      (d.itens.length ? '<div class="cartao mt"><h2>Item por item</h2><table><thead><tr><th>Item</th><th>Decisão do grupo</th><th>Resultado</th><th>Pontos</th></tr></thead><tbody>' +
        linhasTabela(d.itens) + '</tbody></table></div>' : '');
    function coletar() {
      var o = document.getElementById('obsRel');
      if (o) d.observacoes = o.value;
      return d;
    }
    document.getElementById('btPDF').onclick = function () { C.som('toque'); C.gerarPDF(coletar()); };
    document.getElementById('btImprimirFicha').onclick = function () { C.som('toque'); C.gerarPDF(coletar()); };
    document.getElementById('btCSV').onclick = function () { C.som('toque'); C.baixarCSV(coletar()); };
    document.getElementById('btTXT').onclick = function () { C.som('toque'); C.baixarTXT(coletar()); };
  };

  C.gerarPDF = function (d) {
    var area = document.getElementById('areaImpressao');
    if (!area) { area = document.createElement('div'); area.id = 'areaImpressao'; document.body.appendChild(area); }
    area.innerHTML = htmlRelatorio(d);
    window.print();
  };
  C.baixar = function (nome, conteudo, tipo) {
    var blob = new Blob([conteudo], { type: (tipo || 'text/plain') + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  C.baixarCSV = function (d) {
    var g = C.grupo() || {};
    var linhas = [['grupo', 'codigo', 'dinamica', 'item', 'decisao_do_grupo', 'resultado', 'pontos'].join(';')];
    d.itens.forEach(function (i) {
      linhas.push([g.nome || '', g.codigo || '', d.titulo, i.nome, i.resposta || '', i.certo === true ? 'acerto' : (i.certo === false ? 'erro' : 'registrado'), i.pontos || 0]
        .map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'));
    });
    if (d.indicadores) d.indicadores.forEach(function (m) {
      linhas.push([g.nome || '', g.codigo || '', d.titulo, 'indicador: ' + m.nome, m.ok + '/' + m.total, '', '']
        .map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'));
    });
    linhas.push(['', '', d.titulo, 'PONTUACAO FINAL', String(d.pontos), '', ''].map(function (v) { return '"' + v + '"'; }).join(';'));
    C.baixar((g.codigo || 'grupo') + '-relatorio.csv', linhas.join('\n'), 'text/csv');
  };
  C.baixarTXT = function (d) {
    var g = C.grupo() || {};
    var t = [];
    t.push('RELATÓRIO DA DINÂMICA — ' + d.titulo);
    t.push('Grupo: ' + (g.nome || '') + (g.codigo ? ' (' + g.codigo + ')' : ''));
    t.push('Integrantes: ' + ((g.integrantes || []).join(', ') || 'não informados'));
    t.push('Data: ' + C.data());
    t.push('Pontuação final: ' + C.num(d.pontos));
    t.push('');
    t.push('ITENS');
    d.itens.forEach(function (i) {
      t.push('- ' + i.nome + ' | decisão: ' + (i.resposta || '—') + ' | ' +
        (i.certo === true ? 'acerto' : (i.certo === false ? 'erro' : 'registrado')) + ' | ' + (i.pontos || 0) + ' pontos');
    });
    if (d.indicadores && d.indicadores.length) {
      t.push('');
      t.push('DESEMPENHO');
      d.indicadores.forEach(function (m) { t.push('- ' + m.nome + ': ' + m.ok + '/' + m.total); });
    }
    (d.extras || []).forEach(function (e) { t.push(''); t.push(e.titulo.toUpperCase()); t.push(e.texto || '—'); });
    if (d.selos && d.selos.length) { t.push(''); t.push('CONQUISTAS: ' + d.selos.join(', ')); }
    t.push('');
    t.push('OBSERVAÇÕES DO GRUPO');
    t.push(d.observacoes || '—');
    C.baixar((g.codigo || 'grupo') + '-relatorio.txt', t.join('\n'), 'text/plain');
  };

  /* ---------------- página inicial padrão ---------------- */
  C.paginaInicial = function (cfg) {
    var el = document.querySelector(cfg.alvo);
    var g = C.grupo();
    el.innerHTML =
      '<span class="etiqueta acao">' + C.esc(cfg.etiqueta || '') + '</span>' +
      '<h1>' + C.esc(cfg.titulo) + '</h1>' +
      '<p class="entrada">' + cfg.sobre + '</p>' +
      '<div class="grade g2 mt2">' +
      '<div class="cartao"><h2>Regras da dinâmica</h2><ol>' + cfg.regras.map(function (r) {
        return '<li>' + r + '</li>'; }).join('') + '</ol></div>' +
      '<div class="cartao"><h2>O que será abordado</h2><ul>' + cfg.conteudo.map(function (c) {
        return '<li>' + c + '</li>'; }).join('') + '</ul></div>' +
      '</div>' +
      '<div class="cartao mt2"><h2>Sequência de blocos</h2>' +
      '<table><thead><tr><th>Bloco</th><th>O que acontece</th></tr></thead><tbody>' +
      cfg.blocos.map(function (b) {
        return '<tr><td><b>' + C.esc(b.titulo) + '</b></td><td>' + (b.descricao || '') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="cartao mt2"><h2>Identificação do grupo</h2>' +
      '<p class="apoio">Preencha antes de iniciar: o nome e os integrantes aparecem no relatório final.</p>' +
      '<div id="identificacao" class="mt"></div></div>' +
      '<div class="cartao mt2 centro">' +
      '<h2>Pronto para começar?</h2>' +
      '<p class="apoio">O cronômetro e os blocos só começam depois do clique. ' +
      (cfg.avisoInicio || '') + '</p>' +
      '<div class="linha mt" style="justify-content:center">' +
      '<button class="btn" id="btIniciar">Iniciar dinâmica</button>' +
      '<button class="btn secundario" id="btTutorial">Ver tutorial</button>' +
      '</div>' +
      '<p class="apoio mt" id="retornoInicio"></p></div>';
    C.pedirGrupo('#identificacao');
    document.getElementById('btIniciar').onclick = function () {
      if (!C.grupo()) { C.aviso('Salve a identificação do grupo antes de iniciar'); return; }
      C.som('toque');
      cfg.aoIniciar();
    };
    document.getElementById('btTutorial').onclick = function () { C.tutorial(cfg.chaveTutorial, cfg.passosTutorial, true); };
    if (!g) document.getElementById('retornoInicio').textContent = 'Aguardando a identificação do grupo.';
    if (cfg.passosTutorial && !C.ler('cs_tutorial_' + cfg.chaveTutorial, false)) {
      C.tutorial(cfg.chaveTutorial, cfg.passosTutorial);
    }
  };

  global.Conecta = C;
})(window);
