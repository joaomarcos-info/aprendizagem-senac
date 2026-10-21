/* ============================================================
   DINÂMICA 1 — Caça-Falhas da Recepção e proposta de melhoria
   Conteúdo da atividade. O que é comentário, medida correta ou
   base legal só aparece na página do professor.
   ============================================================ */
(function (global) {
  var D = {};

  D.titulo = 'Dinâmica 1 — Caça-Falhas da Recepção e proposta de melhoria';
  D.empresa = 'Conecta Serviços';

  /* a foto real do cenário: os números são posicionados por cima dela */
  D.cenario = {
    imagem: 'assets/cenario.jpg',
    titulo: 'A recepção da Conecta Serviços, como o cliente vê',
    descricao: 'Balcão à esquerda, espera no meio, parede de avisos e entrada à direita. ' +
      'É nesta imagem que o grupo procura o que está adequado e o que precisa melhorar.',
    onde: 'Fotografia de uma recepção de pequeno porte: balcão, espera, avisos na parede, circulação e entrada.'
  };

  /* nove categorias de diagnóstico (duas não aparecem nesta cena) */
  D.categorias = [
    { id:'estrutura',      nome:'Estrutura e orientação' },
    { id:'comunicacao',    nome:'Comunicação' },
    { id:'atendimento',    nome:'Atendimento' },
    { id:'acessibilidade', nome:'Acessibilidade' },
    { id:'conflitos',      nome:'Conflitos' },
    { id:'seguranca',      nome:'Segurança' },
    { id:'ergonomia',      nome:'Ergonomia' },
    { id:'direitos',       nome:'Direitos do consumidor' },
    { id:'recursos',       nome:'Uso de recursos' }
  ];

  /* medida necessária em cada ponto */
  D.medidas = ['Sinalizar', 'Registrar', 'Encaminhar', 'Ajustar ou consertar', 'Orientar a equipe'];

  /* priorização — etiquetas simples, sem matriz */
  D.impacto = ['Alto', 'Médio', 'Baixo'];
  D.urgencia = ['Agora', 'Pode esperar'];
  D.responsavel = ['A recepção resolve', 'Depende de outro setor'];

  /* explicação curta de cada conceito, usada na priorização */
  D.explica = {
    impacto: 'Impacto é o tamanho do estrago se nada for feito: atinge a saúde, o direito do cliente ou a segurança? ' +
      'Alto quando pode machucar alguém ou gerar reclamação formal; médio quando desgasta o atendimento; baixo quando é incômodo pequeno.',
    urgencia: 'Urgência é quando precisa ser resolvido: "Agora" para o que já está causando risco ou reclamação; ' +
      '"Pode esperar" para o que entra no próximo ajuste combinado.',
    responsavel: 'Responsável é quem consegue resolver: "A recepção resolve" quando depende de organização, sinalização, registro ou orientação da própria equipe; ' +
      '"Depende de outro setor" quando exige compra, obra, manutenção ou decisão da direção.',
    fluxo: 'Fluxo de atendimento é o caminho do cliente dentro da empresa: onde ele entra, onde espera, quem fala com ele, ' +
      'como é encaminhado e o que ele ouve antes de ir embora.'
  };

  /* os pontos da foto
     x/y: posição do número na imagem, em porcentagem
     adequado: o ponto não tem problema (serve para o grupo não marcar tudo)
     categoria/medida: resposta correta quando há problema
     nr: pergunta de norma (aparece em alguns pontos, não em todos)
     comentario/base: uso exclusivo do professor */
  D.itens = [
    { id:'i1', n:1, x:13, y:62, nome:'Balcão de atendimento', onde:'A frente de madeira do balcão, do lado esquerdo da foto.', adequado:false,
      categoria:'acessibilidade', medida:'Ajustar ou consertar',
      comentario:'O balcão é alto em toda a sua extensão e não tem trecho rebaixado. Cadeirante, pessoa de baixa estatura, ' +
        'idoso e criança não são atendidos com conforto e não alcançam o balcão para assinar ou receber documento.',
      base:'Lei 13.146/2015 (Lei Brasileira de Inclusão) e Lei 10.048/2000; NR 24 quanto ao conforto no atendimento.' },

    { id:'i2', n:2, x:23, y:26, nome:'Monitor do computador', onde:'Sobre o balcão, ao lado do telefone: aparelho antigo, baixo e inclinado.', adequado:false,
      categoria:'ergonomia', medida:'Ajustar ou consertar',
      comentario:'A tela está baixa e inclinada em relação a quem atende: o atendente curva pescoço e coluna durante todo o turno, ' +
        'o que gera dor e afastamento.',
      base:'NR 17 — itens sobre mobiliário, tela e posto de trabalho.',
      nr:{ opcoes:[
        { texto:'NR 17 — ergonomia e adaptação do posto de trabalho', correta:true },
        { texto:'NR 24 — conforto e condições sanitárias', correta:false },
        { texto:'NR 26 — sinalização e identificação de produtos', correta:false },
        { texto:'NR 12 — máquinas e equipamentos de trabalho', correta:false } ] } },

    { id:'i3', n:3, x:30, y:43, nome:'Cabos e extensão sobre o balcão', onde:'Emaranhado de fios e um filtro de linha cheio de plugues sobre o balcão, atrás do monitor.', adequado:false,
      categoria:'seguranca', medida:'Ajustar ou consertar',
      comentario:'Fiação exposta, tomada sobrecarregada e emaranhado em cima da superfície de trabalho: risco de choque, ' +
        'curto-circuito e de queda de equipamento sobre quem atende.',
      base:'NR 10 — instalações e serviços em eletricidade; NR 8 quanto à organização do ambiente.' },

    { id:'i4', n:4, x:45, y:84, nome:'Cabos cruzando o piso', onde:'No piso, entre o balcão e a entrada, na área por onde as pessoas caminham.', adequado:false,
      categoria:'seguranca', medida:'Ajustar ou consertar',
      comentario:'Os cabos atravessam a passagem: qualquer pessoa pode tropeçar e cair, e o próprio cabo pode ser danificado ' +
        'e provocar choque.',
      base:'NR 8 (circulação) e NR 10 (instalações elétricas).',
      nr:{ opcoes:[
        { texto:'NR 10 — instalações e serviços em eletricidade', correta:true },
        { texto:'NR 12 — máquinas e equipamentos', correta:false },
        { texto:'NR 6 — equipamento de proteção individual', correta:false },
        { texto:'NR 7 — saúde ocupacional', correta:false } ] } },

    { id:'i5', n:5, x:42, y:35, nome:'Fila de espera', onde:'Duas pessoas de costas, esperando atrás do balcão, em área sem nenhuma marcação.', adequado:false,
      categoria:'estrutura', medida:'Sinalizar',
      comentario:'Não há faixa, piso demarcado nem placa indicando onde esperar e qual é a fila prioritária: o cliente não sabe ' +
        'a quem compete passar primeiro.',
      base:'Lei 10.048/2000 (atendimento prioritário) e Código de Defesa do Consumidor quanto à informação clara.' },

    { id:'i6', n:6, x:52, y:54, nome:'Mesa dobrável na passagem', onde:'Atrás das pessoas na fila, mesa encostada na parede do corredor.', adequado:false,
      categoria:'estrutura', medida:'Encaminhar',
      comentario:'A mesa fica guardada dentro da área de circulação: estreita o caminho e pode cair sobre quem passa.',
      base:'NR 11 quanto à armazenagem de materiais e NR 8 quanto às vias de circulação.' },

    { id:'i7', n:7, x:58, y:62, nome:'Extintor de incêndio', onde:'Fixado na parede, ao lado e atrás da pilha de caixas de papelão.', adequado:false,
      categoria:'seguranca', medida:'Ajustar ou consertar',
      comentario:'O extintor está atrás das caixas e fora do alcance imediato: em princípio de incêndio, o tempo perdido para ' +
        'alcançá-lo é o que transforma um foco pequeno em incêndio.',
      base:'NR 23 — acesso livre e desobstruído aos equipamentos de combate a incêndio.',
      nr:{ opcoes:[
        { texto:'NR 23 — proteção contra incêndios', correta:true },
        { texto:'NR 11 — movimentação e armazenagem de materiais', correta:false },
        { texto:'NR 8 — edificações', correta:false },
        { texto:'NR 6 — equipamento de proteção individual', correta:false } ] } },

    { id:'i8', n:8, x:76, y:71, nome:'Lixeira', onde:'Lixeira de plástico no canto, com saco, junto dos papéis e das caixas.', adequado:false,
      categoria:'recursos', medida:'Sinalizar',
      comentario:'Existe só uma lixeira comum: papel, plástico e restos de lanche vão para o mesmo lugar e todo o material ' +
        'reciclável se perde no descarte.',
      base:'Lei 12.305/2010 — prevenção, redução na fonte e coleta seletiva dos resíduos sólidos.' },

    { id:'i9', n:9, x:66, y:18, nome:'Aviso na parede', onde:'Papel amarelado colado com fita na parede, com o texto apagado.', adequado:false,
      categoria:'comunicacao', medida:'Ajustar ou consertar',
      comentario:'O aviso está velho, ilegível e desatualizado: quem lê não entende o que a empresa quer comunicar, e o cliente ' +
        'fica sem a informação.',
      base:'NR 26 (sinalização e informação) e Código de Defesa do Consumidor, art. 6º, III.',
      nr:{ opcoes:[
        { texto:'NR 26 — sinalização de segurança e identificação', correta:true },
        { texto:'NR 24 — condições sanitárias e de conforto', correta:false },
        { texto:'NR 17 — ergonomia', correta:false },
        { texto:'NR 5 — comissão interna de prevenção', correta:false } ] } },

    { id:'i10', n:10, x:76, y:19, nome:'Lista de serviços impressa', onde:'Folha impressa colada na parede com a relação de serviços, em letras pequenas.', adequado:false,
      categoria:'direitos', medida:'Ajustar ou consertar',
      comentario:'O cliente não consegue ler a distância e a lista não informa prazo nem valor: a informação sobre o serviço ' +
        'chega incompleta antes de ele decidir.',
      base:'Código de Defesa do Consumidor, art. 6º, III — informação adequada e clara.' },

    { id:'i11', n:11, x:88, y:22, nome:'Interfone na parede', onde:'Aparelho branco fixado na parede, à direita, sem nenhuma indicação.', adequado:false,
      categoria:'acessibilidade', medida:'Sinalizar',
      comentario:'Ninguém sabe para que serve o interfone nem como usá-lo: quem precisa de ajuda, ou não pode permanecer em pé, ' +
        'não consegue chamar o atendente.',
      base:'Lei 13.146/2015 (Lei Brasileira de Inclusão) e NR 24 quanto ao apoio ao usuário.' },

    { id:'i12', n:12, x:88, y:62, nome:'Caixas e cadeira empilhada', onde:'Pilha de caixas com uma cadeira de plástico apoiada, junto à porta de vidro.', adequado:false,
      categoria:'acessibilidade', medida:'Encaminhar',
      comentario:'O material ocupa justamente a entrada: a rota de quem usa cadeira de rodas, carrinho de bebê ou muleta ' +
        'não passa por ali.',
      base:'Lei 13.146/2015 (Lei Brasileira de Inclusão) e NR 11 quanto à armazenagem.' },

    { id:'i13', n:13, x:8, y:38, nome:'Telefone do balcão', onde:'Telefone com fio sobre o balcão, ao lado do computador.', adequado:true,
      categoriaSugerida:'atendimento',
      comentario:'Está adequado: o telefone fica no próprio posto de atendimento, disponível para o cliente e para o contato ' +
        'com outros setores.',
      base:'Boas práticas de atendimento — mais de um canal no mesmo posto.' },

    { id:'i14', n:14, x:38, y:24, nome:'Janela e luz natural', onde:'Janela ao fundo, atrás do balcão, com luz natural entrando.', adequado:true,
      categoriaSugerida:'ergonomia',
      comentario:'Está adequado: a luz natural reduz o esforço visual da equipe. Vale conferir se há ofuscamento na tela e se ' +
        'as lâmpadas de teto estão todas funcionando.',
      base:'NR 17 — iluminação adequada no posto de trabalho.' }
  ];

  /* os quatro campos da proposta, com o que deve ser escrito em cada um */
  D.propostaCampos = [
    { id:'fluxo', cor:'verde', titulo:'Fluxo de atendimento: recepção, fila, triagem e encaminhamento',
      oQueEscrever:[
        'Como o cliente é recebido ao entrar: quem fala com ele, o que essa pessoa diz e em quanto tempo.',
        'Como a fila funciona: onde cada um espera, como a prioridade é identificada e quem passa primeiro.',
        'Como é feita a triagem: que perguntas o atendente faz para descobrir o que o cliente precisa.',
        'Como o cliente é encaminhado ao setor certo e o que ele ouve antes de sair (setor, responsável, prazo).'
      ],
      exemplo:'Ao entrar, o cliente é cumprimentado e vê duas filas demarcadas no piso: prioritária e geral. O atendente pergunta ' +
        'nome, assunto e se já é cliente. Registra o pedido no caderno e informa: "Vai para o financeiro, com a Ana, retorno até as 14h".',
      baseImagem:'Itens 5 (espera sem marcação), 1 (balcão) e 11 (como chamar o atendente).' },

    { id:'comunicacao', cor:'ciano', titulo:'Comunicação com o cliente: cartazes, telefone e canais digitais',
      oQueEscrever:[
        'Que informação o cliente precisa saber antes de perguntar: horário, serviços, prazos, valores e formas de contato.',
        'O que muda nos avisos para que sejam legíveis: tamanho da letra, altura na parede e data de validade.',
        'Como o telefone e o chat são atendidos: quem responde, em quanto tempo e o que é dito na abertura.',
        'Como o cliente é avisado se o prazo mudar.'
      ],
      exemplo:'Um cartaz único, em letra grande, na altura dos olhos, com horário, serviços, prazo de resposta e telefone. ' +
        'Ao telefone: "Conecta Serviços, bom dia, meu nome é Bruno, como posso ajudar?" — e o nome do cliente é registrado antes de encerrar.',
      baseImagem:'Itens 9 e 10 (aviso ilegível e lista de serviços em letra miúda).' },

    { id:'acesso', cor:'laranja', titulo:'Acessibilidade e segurança de quem atende e de quem é atendido',
      oQueEscrever:[
        'O que garante que todas as pessoas sejam atendidas: balcão acessível, rota livre, prioridade respeitada e forma de chamar o atendente.',
        'O que muda para quem trabalha: cadeira, altura da tela, iluminação e pausas.',
        'Como o ambiente fica seguro: cabos, piso, extintor, caixas e equipamentos.',
        'Quem verifica cada item e com que frequência.'
      ],
      exemplo:'Trecho rebaixado no balcão, rota de entrada livre de caixas, campainha sinalizada para atendimento prioritário, ' +
        'cabos presos em canaleta e conferência mensal do extintor e da validade.',
      baseImagem:'Itens 1, 2, 3, 4, 6, 7, 11 e 12.' },

    { id:'consumo', cor:'roxo', titulo:'Consumo consciente e resíduos na recepção',
      oQueEscrever:[
        'O que é usado no dia a dia e pode ser reduzido: cópias, impressões, papel, água, energia e material de escritório.',
        'Como o resíduo é separado: quais coletores existem, o que vai em cada um e quem esvazia.',
        'O que a recepção pode fazer pelo cliente: receber documento digital, evitar cópia desnecessária e orientar o descarte.',
        'Como medir se funcionou: número de cópias, quantidade de resíduo e consumo de energia.'
      ],
      exemplo:'Dois coletores identificados (reciclável e rejeito) com coleta combinada, documentos recebidos por e-mail em vez de ' +
        'cópia e luzes apagadas na área de espera quando não há movimento.',
      baseImagem:'Itens 8 (lixeira única) e 14 (luz natural).' }
  ];

  /* riscos para marcar na proposta de melhorias */
  D.riscos = [
    { id:'rk1', texto:'Queda de cliente ou de colaborador por causa dos cabos soltos no piso.' },
    { id:'rk2', texto:'Choque elétrico ou curto-circuito por tomada sobrecarregada e fiação exposta.' },
    { id:'rk3', texto:'Incêndio que cresce porque o extintor está atrás das caixas.' },
    { id:'rk4', texto:'Pessoa com deficiência impedida de entrar e de ser atendida (rota bloqueada e balcão alto).' },
    { id:'rk5', texto:'Reclamação formal por informação incompleta nos avisos e na lista de serviços.' },
    { id:'rk6', texto:'Notificação da fiscalização do trabalho (NR 23, NR 24, NR 26 e NR 11).' },
    { id:'rk7', texto:'Dor nas costas, no pescoço e no punho de quem atende, por mobiliário e tela inadequados.' },
    { id:'rk8', texto:'Perda de cliente e de reputação pela desorganização da espera.' }
  ];

  /* ações possíveis, por área, para marcar na proposta de melhorias */
  D.acoes = [
    { area:'Atendimento ao cliente', itens:[
      { id:'a1', texto:'Demarcar a fila e a faixa de atendimento prioritário.' },
      { id:'a2', texto:'Combinar a frase de acolhimento e de encaminhamento.' },
      { id:'a3', texto:'Criar um registro simples: nome, assunto, setor e prazo.' },
      { id:'a4', texto:'Informar ao cliente o prazo combinado e quem procurar.' } ] },
    { area:'Ambiente e segurança', itens:[
      { id:'a5', texto:'Prender os cabos em canaleta e trocar a tomada sobrecarregada.' },
      { id:'a6', texto:'Desobstruir o extintor e conferir a validade todo mês.' },
      { id:'a7', texto:'Retirar caixas, mesa e cadeiras das passagens.' },
      { id:'a8', texto:'Conferir iluminação, piso e estado dos equipamentos.' } ] },
    { area:'Acessibilidade', itens:[
      { id:'a9', texto:'Instalar trecho rebaixado no balcão e manter a rota livre.' },
      { id:'a10', texto:'Sinalizar a campainha e o interfone com instrução de uso.' },
      { id:'a11', texto:'Organizar assento para quem não pode permanecer em pé.' },
      { id:'a12', texto:'Treinar a equipe sobre a ordem do atendimento prioritário.' } ] },
    { area:'Ergonomia e saúde', itens:[
      { id:'a13', texto:'Ajustar cadeira, apoio de pés e altura da tela.' },
      { id:'a14', texto:'Substituir o monitor antigo e reposicionar teclado e documentos.' },
      { id:'a15', texto:'Combinar pausas na digitação contínua.' },
      { id:'a16', texto:'Registrar queixas de dor e encaminhar para avaliação.' } ] },
    { area:'Sustentabilidade', itens:[
      { id:'a17', texto:'Implantar dois coletores identificados com destino combinado.' },
      { id:'a18', texto:'Trocar cópias desnecessárias por arquivos digitais.' },
      { id:'a19', texto:'Apagar luzes e desligar equipamentos na área de espera.' },
      { id:'a20', texto:'Usar a luz natural e conferir o ofuscamento na tela.' } ] }
  ];

  /* reflexão final: perguntas para o grupo responder, sem apresentação */
  D.reflexoes = [
    { id:'r1', pergunta:'O que na foto mais poderia causar um acidente hoje, e por quê?',
      apoio:'Aponte o item, quem corre risco e o que acontece primeiro.' },
    { id:'r2', pergunta:'Como vocês perceberam quem tem atendimento prioritário nessa recepção?',
      apoio:'Se a resposta for "não dava para perceber", explique o que estava faltando.' },
    { id:'r3', pergunta:'Qual direito do consumidor é afetado quando o aviso está ilegível ou a lista de serviços não informa prazo e valor?',
      apoio:'Lembre do direito de receber informação clara antes de decidir.' },
    { id:'r4', pergunta:'O que a recepção resolve sozinha e o que depende de outro setor? Dê um exemplo de cada.',
      apoio:'Use o que vocês responderam na priorização.' },
    { id:'r5', pergunta:'Se a empresa autorizasse uma única melhoria, qual seria e como vocês saberiam que funcionou?',
      apoio:'Escreva a melhoria e um número que mostraria o resultado.' }
  ];

  /* indicadores usados na consolidação e no relatório */
  D.indicadores = [
    { id:'acolhimento', nome:'Atendimento e acolhimento',      categorias:['estrutura','atendimento','conflitos'] },
    { id:'informacao',  nome:'Comunicação e informação',        categorias:['comunicacao','direitos'] },
    { id:'acesso',      nome:'Acessibilidade e segurança',      categorias:['acessibilidade','seguranca','ergonomia'] },
    { id:'consciencia', nome:'Uso consciente e responsabilidade', categorias:['recursos'] }
  ];

  /* papéis sorteados no fim da Dinâmica 1 para a Dinâmica 2 */
  D.papeis2 = ['Atendente de balcão', 'Atendente de telefone', 'Atendente de chat', 'Observador', 'Supervisor'];

  global.DINAMICA1 = D;
})(window);