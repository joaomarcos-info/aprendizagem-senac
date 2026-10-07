(function () {
  "use strict";

  const CHAVE_JOGADORES = "missaoAtendimento.jogadores";
  const CHAVE_ATUAL = "missaoAtendimento.jogadorAtual";
  const CHAVE_PREFS = "missaoAtendimento.preferencias";

  const niveis = [
    { nivel: 1, cargo: "Aprendiz", xp: 0 },
    { nivel: 2, cargo: "Atendente em Treinamento", xp: 300 },
    { nivel: 3, cargo: "Atendente", xp: 700 },
    { nivel: 4, cargo: "Recepcionista", xp: 1200 },
    { nivel: 5, cargo: "Recepcionista Profissional", xp: 1800 },
    { nivel: 6, cargo: "Especialista em Atendimento", xp: 2500 }
  ];

  const xpPorDificuldade = {
    1: 10,
    2: 15,
    3: 20
  };

  const rotulosDificuldade = {
    1: "Fácil",
    2: "Médio",
    3: "Difícil"
  };

  const competenciasBase = {
    comunicacao: { nome: "Comunicação", acertos: 0, total: 0 },
    atendimento: { nome: "Atendimento", acertos: 0, total: 0 },
    organizacao: { nome: "Organização", acertos: 0, total: 0 },
    decisao: { nome: "Tomada de decisão", acertos: 0, total: 0 }
  };

  const banco = {
    encaminhamento: [
      { id: "enc-01", pergunta: "Preciso entregar um currículo.", alternativas: ["Financeiro", "Recursos Humanos", "Comercial", "Diretoria"], correta: 1, explicacao: "Currículos e processos de seleção são normalmente tratados pelo setor de Recursos Humanos.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "enc-02", pergunta: "Quero questionar uma cobrança recebida.", alternativas: ["Financeiro", "Marketing", "Almoxarifado", "Diretoria"], correta: 0, explicacao: "Cobranças, pagamentos e valores devem ser encaminhados ao Financeiro, com registro da demanda.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "enc-03", pergunta: "Gostaria de saber quais serviços a empresa oferece.", alternativas: ["Comercial", "Recursos Humanos", "Compras", "Arquivo"], correta: 0, explicacao: "Informações sobre serviços, condições e propostas são conduzidas pelo Comercial ou Atendimento.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "enc-04", pergunta: "Tenho uma reunião marcada com a diretora às 10h.", alternativas: ["Financeiro", "Recepção e Diretoria", "Compras", "Recursos Humanos"], correta: 1, explicacao: "A recepção confirma o agendamento, registra a chegada e avisa a Diretoria conforme o fluxo interno.", categoria: "organizacao", dificuldade: 2 },
      { id: "enc-05", pergunta: "Quero entregar um atestado médico para a empresa.", alternativas: ["Recursos Humanos", "Comercial", "Diretoria", "Compras"], correta: 0, explicacao: "Documentos de frequência, afastamento e atestados devem ser direcionados ao RH ou pessoal.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "enc-06", pergunta: "Sou fornecedor e preciso falar sobre uma entrega de material.", alternativas: ["Compras", "Recursos Humanos", "Financeiro", "Recepção"], correta: 0, explicacao: "Fornecedores e entregas de materiais costumam ser tratados pelo setor de Compras ou Almoxarifado.", categoria: "encaminhamento", dificuldade: 2 },
      { id: "enc-07", pergunta: "Vim buscar uma segunda via de boleto.", alternativas: ["Financeiro", "Diretoria", "Marketing", "RH"], correta: 0, explicacao: "Boletos, pagamentos e segunda via são assuntos financeiros.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "enc-08", pergunta: "Tenho uma reclamação sobre o atendimento recebido ontem.", alternativas: ["Atendimento", "Compras", "Arquivo", "Manutenção"], correta: 0, explicacao: "Reclamações devem ser acolhidas, registradas e encaminhadas ao Atendimento ou responsável pelo serviço.", categoria: "atendimento", dificuldade: 2 },
      { id: "enc-09", pergunta: "Sou novo funcionário e preciso saber onde assino os documentos admissionais.", alternativas: ["Recursos Humanos", "Comercial", "Financeiro", "Portaria"], correta: 0, explicacao: "Documentos de contratação são responsabilidade do RH ou departamento pessoal.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "enc-10", pergunta: "Quero negociar uma proposta para contratar os serviços da empresa.", alternativas: ["Comercial", "Financeiro", "Compras", "Arquivo"], correta: 0, explicacao: "Propostas comerciais, negociação e contratação de serviços ficam com o Comercial.", categoria: "encaminhamento", dificuldade: 2 },
      { id: "enc-11", pergunta: "Um visitante chegou sem agendamento e quer falar com a gerência.", alternativas: ["Confirmar necessidade e verificar disponibilidade", "Mandar direto para a sala da gerência", "Dizer que não pode entrar", "Pedir para voltar outro dia"], correta: 0, explicacao: "A recepção identifica a pessoa, entende a demanda, registra a chegada e consulta a disponibilidade antes de encaminhar.", categoria: "organizacao", dificuldade: 3 },
      { id: "enc-12", pergunta: "Uma pessoa pede informações sobre uma vaga anunciada pela empresa.", alternativas: ["Recursos Humanos", "Financeiro", "Diretoria", "Compras"], correta: 0, explicacao: "Vagas, seleção e orientações para candidatura são temas do RH.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "enc-13", pergunta: "Um cliente quer alterar dados cadastrais do contrato.", alternativas: ["Atendimento ou Comercial", "Compras", "RH", "Manutenção"], correta: 0, explicacao: "Alterações cadastrais exigem identificação, registro e encaminhamento ao Atendimento ou Comercial conforme o contrato.", categoria: "atendimento", dificuldade: 2 },
      { id: "enc-14", pergunta: "Uma transportadora chegou com nota fiscal e caixas para conferência.", alternativas: ["Compras ou Almoxarifado", "Recursos Humanos", "Diretoria", "Marketing"], correta: 0, explicacao: "Entrega física de materiais deve seguir conferência e registro pelo setor responsável por compras/estoque.", categoria: "organizacao", dificuldade: 2 },
      { id: "enc-15", pergunta: "Uma pessoa quer falar sobre desconto indevido no salário.", alternativas: ["Recursos Humanos ou Departamento Pessoal", "Comercial", "Compras", "Marketing"], correta: 0, explicacao: "Questões de salário e folha envolvem dados pessoais e devem ir para RH ou departamento pessoal, com cuidado de sigilo.", categoria: "sigilo", dificuldade: 3 }
    ],

    certoErrado: [
      { id: "ce-01", pergunta: "Cliente: Gostaria de saber onde fica o RH. Recepcionista: É ali para algum lado. Pergunta para alguém.", alternativas: ["CERTO", "ERRADO"], correta: 1, explicacao: "A resposta é vaga e transfere a responsabilidade ao visitante. O adequado é orientar com clareza e cordialidade.", categoria: "atendimento", dificuldade: 1 },
      { id: "ce-02", pergunta: "Recepcionista: Bom dia. Posso confirmar seu nome e o motivo da visita para avisar o setor responsável?", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "A abordagem identifica a necessidade, mantém cordialidade e organiza o atendimento.", categoria: "atendimento", dificuldade: 1 },
      { id: "ce-03", pergunta: "Ao ouvir uma reclamação, o atendente interrompe várias vezes para se defender.", alternativas: ["CERTO", "ERRADO"], correta: 1, explicacao: "Interromper aumenta o conflito. Escuta ativa ajuda a compreender e encaminhar a demanda.", categoria: "escuta", dificuldade: 2 },
      { id: "ce-04", pergunta: "O recepcionista fala em voz alta os dados pessoais de um visitante na frente de todos.", alternativas: ["CERTO", "ERRADO"], correta: 1, explicacao: "Dados pessoais exigem discrição. A exposição pode gerar constrangimento e quebra de confiança.", categoria: "sigilo", dificuldade: 2 },
      { id: "ce-05", pergunta: "Quando não sabe uma informação, a atendente diz: Vou verificar essa informação para você.", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "É uma resposta profissional, pois evita inventar dados e demonstra proatividade.", categoria: "postura", dificuldade: 1 },
      { id: "ce-06", pergunta: "Um visitante com prioridade legal chega e a recepção reorganiza o atendimento sem ignorar os demais.", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "Atendimento prioritário deve ser acolhido com organização e comunicação respeitosa.", categoria: "organizacao", dificuldade: 2 },
      { id: "ce-07", pergunta: "O atendente usa apelidos com pessoas que não conhece para parecer descontraído.", alternativas: ["CERTO", "ERRADO"], correta: 1, explicacao: "A comunicação profissional deve respeitar limites e evitar familiaridade excessiva.", categoria: "postura", dificuldade: 2 },
      { id: "ce-08", pergunta: "A recepcionista registra o recado com nome, telefone, assunto, data e responsável pelo retorno.", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "O registro completo evita perda de informação e facilita retorno adequado.", categoria: "organizacao", dificuldade: 2 },
      { id: "ce-09", pergunta: "O atendente responde uma mensagem interna sobre um cliente em grupo não autorizado.", alternativas: ["CERTO", "ERRADO"], correta: 1, explicacao: "Informações de clientes devem circular apenas em canais e grupos autorizados.", categoria: "sigilo", dificuldade: 3 },
      { id: "ce-10", pergunta: "Durante uma ligação, o atendente se identifica e informa o nome da empresa.", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "Identificação inicial transmite confiança e profissionalismo.", categoria: "comunicacao", dificuldade: 1 },
      { id: "ce-11", pergunta: "Se o setor responsável estiver ocupado, a recepção combina retorno e registra a solicitação.", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "Quando não há atendimento imediato, registrar e orientar retorno mantém o fluxo organizado.", categoria: "organizacao", dificuldade: 2 },
      { id: "ce-12", pergunta: "O atendente diz ao cliente: Isso não é problema meu.", alternativas: ["CERTO", "ERRADO"], correta: 1, explicacao: "A frase rompe a cordialidade. Mesmo quando não é seu setor, é preciso orientar o encaminhamento.", categoria: "atendimento", dificuldade: 1 },
      { id: "ce-13", pergunta: "A recepção confirma com o visitante se ele compreendeu o encaminhamento.", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "Confirmar entendimento é feedback e reduz ruídos na comunicação.", categoria: "comunicacao", dificuldade: 2 },
      { id: "ce-14", pergunta: "Para agilizar, o atendente permite que qualquer visitante entre sem identificação.", alternativas: ["CERTO", "ERRADO"], correta: 1, explicacao: "Agilidade não substitui segurança, registro e organização do fluxo de pessoas.", categoria: "organizacao", dificuldade: 2 },
      { id: "ce-15", pergunta: "O atendente mantém tom calmo mesmo quando o cliente está irritado.", alternativas: ["CERTO", "ERRADO"], correta: 0, explicacao: "Postura calma ajuda a reduzir tensão e mantém o atendimento profissional.", categoria: "decisao", dificuldade: 2 }
    ],

    respostas: [
      { id: "rs-01", pergunta: "Um cliente está irritado e aumenta o tom de voz. O que você faria?", alternativas: ["Aumentaria o tom para mostrar autoridade.", "Pediria para ele voltar outro dia.", "Ouviria a situação, manteria postura profissional e buscaria compreender a demanda.", "Encerraria o atendimento imediatamente."], correta: 2, explicacao: "Acolher, escutar e manter postura profissional ajuda a entender a necessidade sem ampliar o conflito.", categoria: "decisao", dificuldade: 2 },
      { id: "rs-02", pergunta: "Um visitante chega sem documento de identificação para uma reunião. Qual é a melhor conduta?", alternativas: ["Liberar a entrada para não atrasar.", "Consultar o procedimento interno e avisar o responsável pela reunião.", "Dizer que ele perdeu a reunião.", "Pedir para outro visitante confirmar quem ele é."], correta: 1, explicacao: "A recepção deve seguir normas internas, preservar segurança e comunicar o setor responsável.", categoria: "organizacao", dificuldade: 3 },
      { id: "rs-03", pergunta: "Você não sabe informar o ramal de um setor. Qual resposta é mais adequada?", alternativas: ["Não sei.", "Procure no site.", "Vou verificar o ramal correto para direcionar você.", "Isso muda toda hora."], correta: 2, explicacao: "A melhor resposta reconhece a necessidade e assume uma ação concreta de verificação.", categoria: "postura", dificuldade: 1 },
      { id: "rs-04", pergunta: "Duas pessoas chegam ao mesmo tempo: uma para reunião agendada e outra para entregar currículo. Como agir?", alternativas: ["Atender a pessoa mais simpática primeiro.", "Acolher ambas, confirmar urgência e organizar a ordem conforme agenda e fluxo.", "Mandar uma delas esperar fora.", "Ignorar a entrega de currículo."], correta: 1, explicacao: "Organização envolve acolher, identificar demandas e respeitar agenda sem desconsiderar ninguém.", categoria: "organizacao", dificuldade: 2 },
      { id: "rs-05", pergunta: "Um cliente pede dados pessoais de outro cliente. O que você responde?", alternativas: ["Passo se ele explicar o motivo.", "Forneço apenas telefone.", "Informo que não posso compartilhar dados pessoais e oriento o canal adequado.", "Pergunto para outros colegas se posso falar."], correta: 2, explicacao: "Dados pessoais exigem autorização e regras internas. A resposta deve ser firme e cordial.", categoria: "sigilo", dificuldade: 2 },
      { id: "rs-06", pergunta: "O telefone toca enquanto há uma fila pequena na recepção. Qual decisão é mais equilibrada?", alternativas: ["Nunca atender telefone quando há fila.", "Atender rapidamente com identificação, registrar ou orientar retorno e continuar a fila.", "Deixar tocar até parar.", "Pedir para um visitante atender."], correta: 1, explicacao: "A recepção administra múltiplos canais. O ideal é atender com objetividade e manter a fila informada.", categoria: "organizacao", dificuldade: 3 },
      { id: "rs-07", pergunta: "Uma pessoa com deficiência visual chega à recepção. O que demonstra postura adequada?", alternativas: ["Falar com o acompanhante, caso exista.", "Oferecer ajuda, perguntar como prefere ser orientada e respeitar sua resposta.", "Pegar no braço sem avisar.", "Falar mais alto automaticamente."], correta: 1, explicacao: "Atendimento inclusivo pergunta a preferência da pessoa e respeita autonomia.", categoria: "atendimento", dificuldade: 2 },
      { id: "rs-08", pergunta: "Um colaborador pede para você avisar a todos que uma colega faltou por motivo médico. O que fazer?", alternativas: ["Avisar no grupo geral.", "Divulgar apenas para quem perguntar.", "Evitar expor o motivo e encaminhar a informação necessária ao responsável autorizado.", "Comentar que parece grave."], correta: 2, explicacao: "Informações de saúde são sensíveis. Só devem ser compartilhadas quando necessário e autorizado.", categoria: "sigilo", dificuldade: 3 },
      { id: "rs-09", pergunta: "Um visitante não entendeu o caminho até o setor indicado. Qual é a melhor ação?", alternativas: ["Repetir a mesma frase mais rápido.", "Dizer que está bem sinalizado.", "Explicar novamente com referências claras e confirmar se ficou compreensível.", "Pedir para ele seguir outra pessoa."], correta: 2, explicacao: "Clareza e feedback reduzem ruídos e aumentam a qualidade do atendimento.", categoria: "comunicacao", dificuldade: 2 },
      { id: "rs-10", pergunta: "Um fornecedor chega fora do horário combinado. Como agir?", alternativas: ["Recusar sem ouvir.", "Registrar a chegada, verificar possibilidade com o setor de compras e orientar o fornecedor.", "Mandar descarregar mesmo assim.", "Dizer que a culpa é dele."], correta: 1, explicacao: "A solução profissional combina registro, consulta ao setor e orientação respeitosa.", categoria: "organizacao", dificuldade: 2 },
      { id: "rs-11", pergunta: "Você percebe que passou uma orientação incompleta. Qual atitude é mais profissional?", alternativas: ["Esperar a pessoa reclamar.", "Corrigir a informação assim que possível e pedir desculpas pela falha.", "Fingir que não percebeu.", "Culpar outro setor."], correta: 1, explicacao: "Responsabilidade e correção rápida preservam confiança.", categoria: "postura", dificuldade: 2 },
      { id: "rs-12", pergunta: "Uma pessoa tenta furar a fila alegando pressa, sem prioridade aparente. O que fazer?", alternativas: ["Permitir para evitar conflito.", "Explicar a ordem de atendimento e verificar se há urgência real ou prioridade.", "Responder com ironia.", "Ignorar a pessoa."], correta: 1, explicacao: "A recepção precisa ser justa, acolhedora e organizada.", categoria: "decisao", dificuldade: 2 },
      { id: "rs-13", pergunta: "Um cliente pergunta quando receberá retorno de uma solicitação. O que é melhor?", alternativas: ["Dizer que depende.", "Prometer retorno imediato sem consultar.", "Consultar o prazo possível, registrar a solicitação e informar o canal de retorno.", "Encaminhar sem anotar nada."], correta: 2, explicacao: "Promessas precisam ser realistas. Registro e prazo orientam o cliente e a equipe.", categoria: "organizacao", dificuldade: 3 },
      { id: "rs-14", pergunta: "Um colega pede sua senha para acessar o sistema da recepção rapidamente. Qual é a atitude correta?", alternativas: ["Emprestar se for colega de confiança.", "Digitar a senha e sair de perto.", "Não compartilhar senha e orientar o procedimento correto.", "Anotar a senha em papel."], correta: 2, explicacao: "Senha é individual. Compartilhar compromete segurança e responsabilidade.", categoria: "sigilo", dificuldade: 2 },
      { id: "rs-15", pergunta: "A sala de espera está cheia e há atraso no atendimento. Como a recepção pode agir?", alternativas: ["Evitar contato visual.", "Informar a situação com cordialidade, atualizar previsão quando possível e manter organização.", "Dizer que todos terão que esperar.", "Fechar a porta da recepção."], correta: 1, explicacao: "Comunicação transparente reduz ansiedade e demonstra respeito.", categoria: "atendimento", dificuldade: 3 }
    ],

    comunicacao: [
      { id: "com-01", pergunta: "O gerente envia por WhatsApp: A reunião mudou para 15h. O funcionário lê a mensagem às 16h. Onde ocorreu o problema principal?", alternativas: ["Canal", "Feedback", "Receptor", "Ruído"], correta: 2, explicacao: "A mensagem chegou, mas o receptor só acessou depois do horário útil.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-02", pergunta: "A recepção fala baixo em um ambiente barulhento e o visitante entende o setor errado. Qual elemento aparece como problema?", alternativas: ["Ruído", "Emissor", "Contexto", "Feedback"], correta: 0, explicacao: "O barulho interferiu na compreensão da mensagem, funcionando como ruído.", categoria: "comunicacao", dificuldade: 1 },
      { id: "com-03", pergunta: "Um e-mail informa uma mudança, mas não diz a data. O problema está principalmente na:", alternativas: ["Mensagem", "Canal", "Receptor", "Feedback"], correta: 0, explicacao: "A mensagem está incompleta, pois faltou informação essencial.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-04", pergunta: "O cliente confirma: Entendi, devo procurar o Financeiro no segundo andar. Isso representa:", alternativas: ["Ruído", "Feedback", "Canal", "Contexto"], correta: 1, explicacao: "Quando o receptor confirma o entendimento, há feedback.", categoria: "comunicacao", dificuldade: 1 },
      { id: "com-05", pergunta: "Uma instrução técnica é dada a um visitante que não conhece termos internos da empresa. O que precisa ser ajustado?", alternativas: ["Contexto", "Canal", "Emissor", "Sigilo"], correta: 0, explicacao: "O contexto do receptor exige linguagem simples e adequada.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-06", pergunta: "A empresa usa mural interno para avisar um cliente externo sobre alteração de horário. Qual elemento foi mal escolhido?", alternativas: ["Canal", "Receptor", "Ruído", "Feedback"], correta: 0, explicacao: "O canal escolhido não alcança o público que precisava receber a informação.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-07", pergunta: "A atendente envia a orientação correta, mas para o número errado. O problema envolve:", alternativas: ["Receptor", "Mensagem", "Feedback", "Contexto"], correta: 0, explicacao: "A informação foi enviada ao receptor incorreto.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-08", pergunta: "Um recado fica sem retorno porque ninguém confirmou quem seria responsável por responder. O que faltou?", alternativas: ["Feedback", "Canal", "Ruído visual", "Mensagem curta"], correta: 0, explicacao: "Faltou fechamento do ciclo de comunicação, com confirmação de recebimento e responsabilidade.", categoria: "comunicacao", dificuldade: 3 },
      { id: "com-09", pergunta: "O visitante aponta uma placa, mas a placa está desatualizada. O problema está em:", alternativas: ["Mensagem", "Canal", "Emissor", "Feedback"], correta: 0, explicacao: "A informação contida na placa é a mensagem; se está errada, a mensagem falhou.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-10", pergunta: "Uma ligação cai antes de o atendente confirmar o telefone de retorno. Qual etapa ficou prejudicada?", alternativas: ["Feedback", "Canal", "Contexto", "Emissor"], correta: 0, explicacao: "Sem confirmação, o ciclo de comunicação fica incompleto.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-11", pergunta: "Um aviso é enviado só com siglas internas para novos aprendizes. O maior risco é:", alternativas: ["Ruído de interpretação", "Excesso de feedback", "Canal presencial", "Emissor ausente"], correta: 0, explicacao: "Siglas desconhecidas geram ruído semântico, pois a mensagem pode ser mal interpretada.", categoria: "comunicacao", dificuldade: 3 },
      { id: "com-12", pergunta: "Na frase 'comparecer ao setor responsável', o visitante pergunta: Qual setor? O que faltou?", alternativas: ["Clareza da mensagem", "Canal digital", "Receptor", "Tom de voz"], correta: 0, explicacao: "A mensagem não foi específica o suficiente para orientar a ação.", categoria: "comunicacao", dificuldade: 2 },
      { id: "com-13", pergunta: "A recepcionista percebe dúvida no rosto do visitante e pergunta se ele gostaria que ela repetisse. Isso demonstra:", alternativas: ["Escuta ativa", "Ruído", "Quebra de sigilo", "Canal inadequado"], correta: 0, explicacao: "Observar sinais e verificar compreensão faz parte da escuta ativa.", categoria: "escuta", dificuldade: 1 },
      { id: "com-14", pergunta: "Uma orientação é enviada por áudio longo em ambiente em que o receptor não pode ouvir som. O problema principal é:", alternativas: ["Canal inadequado ao contexto", "Falta de emissor", "Excesso de dados públicos", "Atendimento prioritário"], correta: 0, explicacao: "O canal precisa combinar com o contexto de quem recebe a mensagem.", categoria: "comunicacao", dificuldade: 3 },
      { id: "com-15", pergunta: "A pessoa diz 'ok', mas segue para o setor errado. O que a recepção poderia ter feito?", alternativas: ["Confirmar o entendimento com uma pergunta objetiva", "Falar menos", "Evitar repetir informações", "Usar apenas gestos"], correta: 0, explicacao: "Feedback de compreensão deve ser mais do que um 'ok' quando a orientação é importante.", categoria: "comunicacao", dificuldade: 3 }
    ],

    palavra: [
      { id: "pal-01", pergunta: "Escolha a versão mais profissional para: Não sei.", alternativas: ["Não sei mesmo.", "Vou verificar essa informação para você.", "Pergunte a outra pessoa.", "Não trabalho com isso."], correta: 1, explicacao: "A resposta mostra disposição para buscar informação sem inventar.", categoria: "postura", dificuldade: 1 },
      { id: "pal-02", pergunta: "Escolha a versão mais profissional para: Isso não é comigo.", alternativas: ["Esse assunto é tratado por outro setor. Vou orientar o melhor contato.", "Não posso fazer nada.", "Procure alguém do setor.", "Volte depois."], correta: 0, explicacao: "A frase orienta sem abandonar a pessoa.", categoria: "atendimento", dificuldade: 1 },
      { id: "pal-03", pergunta: "Escolha a versão mais profissional para: Calma aí.", alternativas: ["Aguarde um momento, por gentileza.", "Espere porque estou ocupado.", "Um minuto, tá?", "Pera."], correta: 0, explicacao: "A expressão mantém cordialidade e respeito.", categoria: "comunicacao", dificuldade: 1 },
      { id: "pal-04", pergunta: "Escolha a versão mais profissional para: Você está errado.", alternativas: ["A informação que temos registrada é diferente. Vamos conferir juntos?", "Você entendeu tudo errado.", "Isso não procede.", "Impossível."], correta: 0, explicacao: "A resposta reduz confronto e abre caminho para verificação.", categoria: "decisao", dificuldade: 2 },
      { id: "pal-05", pergunta: "Escolha a versão mais profissional para: Não posso passar isso.", alternativas: ["Essa informação é restrita. Posso orientar o canal autorizado.", "Não posso falar, pronto.", "É segredo.", "Pergunte para quem sabe."], correta: 0, explicacao: "A resposta protege sigilo e oferece orientação.", categoria: "sigilo", dificuldade: 2 },
      { id: "pal-06", pergunta: "Escolha a versão mais profissional para: O sistema caiu.", alternativas: ["Estamos com instabilidade no sistema. Vou registrar sua solicitação e orientar o retorno.", "Não dá para fazer nada.", "O sistema vive caindo.", "Volte outro dia."], correta: 0, explicacao: "A resposta informa o problema sem descuidar do atendimento.", categoria: "atendimento", dificuldade: 2 },
      { id: "pal-07", pergunta: "Escolha a versão mais profissional para: Fala logo.", alternativas: ["Pode me informar sua solicitação, por favor?", "Diga logo o que você quer.", "Vai falando.", "Estou sem tempo."], correta: 0, explicacao: "O tom profissional valoriza respeito mesmo em situações de pressa.", categoria: "comunicacao", dificuldade: 1 },
      { id: "pal-08", pergunta: "Escolha a versão mais profissional para: Não tem ninguém aí.", alternativas: ["No momento a pessoa responsável não está disponível. Posso registrar um recado?", "Ela sumiu.", "Ninguém atende nesse setor.", "Tente depois."], correta: 0, explicacao: "A frase informa a indisponibilidade e oferece encaminhamento.", categoria: "organizacao", dificuldade: 2 },
      { id: "pal-09", pergunta: "Escolha a versão mais profissional para: Você tem que esperar.", alternativas: ["Seu atendimento será realizado em instantes. Obrigado pela compreensão.", "Espere sentado.", "Tem gente na sua frente.", "Não adianta reclamar."], correta: 0, explicacao: "A comunicação respeitosa ajuda a administrar espera.", categoria: "atendimento", dificuldade: 1 },
      { id: "pal-10", pergunta: "Escolha a versão mais profissional para: Não é aqui.", alternativas: ["Esse atendimento ocorre em outro setor. Vou indicar o caminho correto.", "Você veio no lugar errado.", "Pergunte na entrada.", "Não resolvemos isso."], correta: 0, explicacao: "Encaminhar corretamente faz parte do atendimento.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "pal-11", pergunta: "Escolha a versão mais profissional para: Manda mensagem depois.", alternativas: ["Você pode enviar a solicitação pelo canal oficial. Vou informar o contato correto.", "Me chama depois.", "Tenta por WhatsApp.", "Procura no grupo."], correta: 0, explicacao: "Canais oficiais preservam registro e organização.", categoria: "organizacao", dificuldade: 2 },
      { id: "pal-12", pergunta: "Escolha a versão mais profissional para: Não posso prometer nada.", alternativas: ["Vou registrar sua solicitação e informar o prazo ou retorno possível.", "Não sei se alguém vai ver.", "Depende da boa vontade do setor.", "Talvez resolvam."], correta: 0, explicacao: "A resposta evita promessa indevida e indica próximo passo.", categoria: "postura", dificuldade: 2 },
      { id: "pal-13", pergunta: "Escolha a versão mais profissional para: A culpa não é minha.", alternativas: ["Entendo sua situação. Vou verificar como podemos encaminhar a solução.", "Não tenho nada a ver com isso.", "Quem errou foi outro setor.", "Reclame com quem fez."], correta: 0, explicacao: "Acolher não significa assumir culpa; significa conduzir a demanda.", categoria: "decisao", dificuldade: 2 },
      { id: "pal-14", pergunta: "Escolha a versão mais profissional para: Não interrompa.", alternativas: ["Vou concluir a informação e já ouço sua dúvida, tudo bem?", "Pare de falar.", "Agora sou eu.", "Espere sua vez."], correta: 0, explicacao: "A alternativa controla o fluxo sem desrespeitar a pessoa.", categoria: "comunicacao", dificuldade: 3 },
      { id: "pal-15", pergunta: "Escolha a versão mais profissional para: Não posso te ajudar.", alternativas: ["Neste caso, o setor responsável poderá ajudar melhor. Vou orientar o contato.", "Não dá.", "Não é minha função.", "Você terá que se virar."], correta: 0, explicacao: "A resposta reconhece o limite da função, mas mantém compromisso com o encaminhamento.", categoria: "atendimento", dificuldade: 2 }
    ],

    sigilo: [
      { id: "sig-01", pergunta: "Um visitante pergunta: Quanto o gerente ganha? Você pode fornecer essa informação?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Salário é informação pessoal e interna. Não deve ser compartilhado sem autorização.", categoria: "sigilo", dificuldade: 1 },
      { id: "sig-02", pergunta: "Um cliente pede o horário de funcionamento da empresa. Você pode informar?", alternativas: ["SIM", "NÃO"], correta: 0, explicacao: "Horário de funcionamento é informação pública de atendimento.", categoria: "sigilo", dificuldade: 1 },
      { id: "sig-03", pergunta: "Uma pessoa por telefone pede CPF de um colaborador para confirmar cadastro. Você pode informar?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Dados pessoais não devem ser informados por telefone sem procedimento autorizado.", categoria: "sigilo", dificuldade: 2 },
      { id: "sig-04", pergunta: "Um fornecedor pede o e-mail oficial do setor de compras. Você pode informar?", alternativas: ["SIM", "NÃO"], correta: 0, explicacao: "Contato institucional do setor pode ser informado quando faz parte do fluxo da empresa.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "sig-05", pergunta: "Um visitante quer ver a agenda completa da diretora para escolher um horário. Você pode mostrar?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Agenda interna contém informações restritas e deve ser administrada por pessoas autorizadas.", categoria: "sigilo", dificuldade: 2 },
      { id: "sig-06", pergunta: "Um colaborador pede para deixar documento médico aberto sobre o balcão. É adequado?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Documentos pessoais devem ser guardados e encaminhados com discrição.", categoria: "sigilo", dificuldade: 2 },
      { id: "sig-07", pergunta: "Um cliente pergunta quais serviços a empresa oferece. Você pode informar?", alternativas: ["SIM", "NÃO"], correta: 0, explicacao: "Serviços oferecidos são informação comercial, desde que apresentada conforme orientação da empresa.", categoria: "atendimento", dificuldade: 1 },
      { id: "sig-08", pergunta: "Uma pessoa pede para saber se determinado funcionário está de férias por motivo de saúde. Você pode informar o motivo?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Motivos de afastamento são informações pessoais e não devem ser expostos.", categoria: "sigilo", dificuldade: 2 },
      { id: "sig-09", pergunta: "Um cliente quer confirmar se a própria solicitação foi registrada. Após identificar o cliente, você pode orientar?", alternativas: ["SIM", "NÃO"], correta: 0, explicacao: "Com identificação adequada, é possível orientar sobre a própria demanda conforme regras internas.", categoria: "atendimento", dificuldade: 2 },
      { id: "sig-10", pergunta: "Um visitante pede para fotografar uma lista de ramais internos exposta na recepção. Você pode autorizar sem verificar?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Ramais internos podem ser informação operacional restrita. É preciso seguir orientação da empresa.", categoria: "sigilo", dificuldade: 3 },
      { id: "sig-11", pergunta: "Um candidato pergunta o endereço de e-mail para envio de currículo divulgado pela empresa. Você pode informar?", alternativas: ["SIM", "NÃO"], correta: 0, explicacao: "Quando o canal de recrutamento é oficial e divulgado, pode ser orientado.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "sig-12", pergunta: "Alguém pergunta quantas reclamações a empresa recebeu no mês. Você pode responder informalmente?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Indicadores internos devem ser divulgados apenas por pessoas autorizadas.", categoria: "sigilo", dificuldade: 3 },
      { id: "sig-13", pergunta: "Uma pessoa quer saber se um visitante já chegou para reunião pública marcada com ela. Você pode confirmar após identificação?", alternativas: ["SIM", "NÃO"], correta: 0, explicacao: "Se a pessoa é parte da reunião e a identificação foi feita, a informação operacional pode ser confirmada.", categoria: "organizacao", dificuldade: 2 },
      { id: "sig-14", pergunta: "Um cliente pede para você ler em voz alta dados do contrato dele na recepção cheia. É adequado?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Mesmo quando a informação é do cliente, o ambiente exige discrição.", categoria: "sigilo", dificuldade: 2 },
      { id: "sig-15", pergunta: "Um colega não autorizado pede acesso a documentos deixados no balcão. Você pode entregar?", alternativas: ["SIM", "NÃO"], correta: 1, explicacao: "Documentos devem ser entregues apenas a responsáveis autorizados.", categoria: "sigilo", dificuldade: 2 }
    ],

    quizPrimeiroDia: [
      { id: "qpd-01", pergunta: "Qual é o foco da UC1 — Recepcionar e atender pessoas?", alternativas: ["Controlar estoque industrial", "Desenvolver práticas de recepção, comunicação e atendimento", "Elaborar folha de pagamento completa", "Fazer vendas externas"], correta: 1, explicacao: "A UC trabalha competências de recepção, atendimento, comunicação, encaminhamento e postura profissional.", categoria: "atendimento", dificuldade: 1 },
      { id: "qpd-02", pergunta: "Na recepção, identificar a necessidade da pessoa serve principalmente para:", alternativas: ["Reduzir a responsabilidade da empresa", "Encaminhar corretamente e evitar perda de tempo", "Criar barreiras de atendimento", "Substituir todos os setores"], correta: 1, explicacao: "A identificação orienta o fluxo e evita encaminhamentos incorretos.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "qpd-03", pergunta: "Qual atitude combina com cordialidade profissional?", alternativas: ["Cumprimentar, ouvir e orientar com respeito", "Usar intimidade com qualquer visitante", "Responder rápido sem confirmar entendimento", "Prometer qualquer solução"], correta: 0, explicacao: "Cordialidade envolve respeito, escuta e clareza.", categoria: "atendimento", dificuldade: 1 },
      { id: "qpd-04", pergunta: "O que melhor representa proatividade na recepção?", alternativas: ["Esperar o problema crescer", "Antecipar uma orientação necessária dentro do seu papel", "Fazer tarefas sem seguir regras", "Assumir decisões de outro setor"], correta: 1, explicacao: "Proatividade é agir de forma responsável para facilitar o atendimento.", categoria: "postura", dificuldade: 2 },
      { id: "qpd-05", pergunta: "O setor de Recursos Humanos costuma tratar de:", alternativas: ["Seleção, documentos de colaboradores e assuntos de pessoal", "Cobranças de clientes", "Compra de equipamentos", "Negociação de contratos comerciais"], correta: 0, explicacao: "RH lida com pessoas, seleção, documentação e rotinas relacionadas a colaboradores.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "qpd-06", pergunta: "Um assistente administrativo pode apoiar a empresa principalmente com:", alternativas: ["Somente atendimento telefônico", "Organização de documentos, registros, comunicação e rotinas administrativas", "Somente manutenção predial", "Somente negociação jurídica"], correta: 1, explicacao: "A função administrativa envolve organização, registros, comunicação e apoio a processos.", categoria: "organizacao", dificuldade: 1 },
      { id: "qpd-07", pergunta: "Qual é uma boa prática ao receber uma reclamação?", alternativas: ["Escutar, registrar e encaminhar corretamente", "Responder com irritação", "Expor o cliente aos demais", "Ignorar se não for seu setor"], correta: 0, explicacao: "Reclamações precisam de acolhimento, registro e encaminhamento.", categoria: "escuta", dificuldade: 1 },
      { id: "qpd-08", pergunta: "Sigilo na recepção significa:", alternativas: ["Nunca falar com ninguém", "Tratar informações pessoais e internas com discrição e autorização", "Guardar todas as informações apenas na memória", "Falar baixo mesmo com dados públicos"], correta: 1, explicacao: "Sigilo protege dados e informações conforme regras da organização.", categoria: "sigilo", dificuldade: 1 },
      { id: "qpd-09", pergunta: "Em comunicação, feedback é:", alternativas: ["Confirmação ou retorno sobre a mensagem recebida", "Barulho no ambiente", "O aparelho usado para comunicar", "A pessoa que envia a mensagem"], correta: 0, explicacao: "Feedback fecha o ciclo de comunicação e confirma entendimento.", categoria: "comunicacao", dificuldade: 1 },
      { id: "qpd-10", pergunta: "Ruído de comunicação é:", alternativas: ["Qualquer interferência que prejudique a compreensão da mensagem", "A resposta correta ao cliente", "O setor responsável por atendimento", "A sala de espera organizada"], correta: 0, explicacao: "Ruído pode ser barulho, linguagem confusa, canal inadequado ou informação incompleta.", categoria: "comunicacao", dificuldade: 1 },
      { id: "qpd-11", pergunta: "Quando uma pessoa possui atendimento prioritário, a recepção deve:", alternativas: ["Ignorar a fila sem explicar nada", "Acolher, organizar o fluxo e comunicar com respeito", "Pedir que volte em outro horário", "Atender só se ela reclamar"], correta: 1, explicacao: "Prioridade deve ser aplicada com organização e respeito às demais pessoas.", categoria: "organizacao", dificuldade: 2 },
      { id: "qpd-12", pergunta: "Qual alternativa melhor descreve empatia no atendimento?", alternativas: ["Concordar com tudo", "Compreender a situação da pessoa e responder com respeito", "Resolver tudo sozinho", "Evitar contato com reclamações"], correta: 1, explicacao: "Empatia é reconhecer a situação do outro sem perder a postura profissional.", categoria: "atendimento", dificuldade: 1 },
      { id: "qpd-13", pergunta: "Um bom encaminhamento exige:", alternativas: ["Apenas apontar para qualquer corredor", "Entender a demanda, indicar o setor correto e orientar o próximo passo", "Enviar todos para a diretoria", "Evitar registros"], correta: 1, explicacao: "Encaminhar bem depende de identificar, orientar e registrar quando necessário.", categoria: "encaminhamento", dificuldade: 1 },
      { id: "qpd-14", pergunta: "Qual conduta fortalece o trabalho em equipe?", alternativas: ["Registrar informações úteis para o setor responsável", "Guardar recados para si", "Culpar colegas diante do cliente", "Mudar procedimentos sem avisar"], correta: 0, explicacao: "Registros claros ajudam a equipe a dar continuidade ao atendimento.", categoria: "organizacao", dificuldade: 2 },
      { id: "qpd-15", pergunta: "Ao atender telefone profissionalmente, o início mais adequado é:", alternativas: ["Alô?", "Quem fala?", "Conecta Serviços, bom dia. Como posso ajudar?", "Fala rápido."], correta: 2, explicacao: "Identificar a empresa e acolher a demanda transmite profissionalismo.", categoria: "comunicacao", dificuldade: 1 },
      { id: "qpd-16", pergunta: "Ética no atendimento envolve:", alternativas: ["Agir com respeito, responsabilidade, sigilo e justiça", "Fazer favores para conhecidos", "Divulgar bastidores da empresa", "Escolher quem merece atendimento"], correta: 0, explicacao: "Ética orienta decisões responsáveis e respeitosas no ambiente profissional.", categoria: "postura", dificuldade: 2 },
      { id: "qpd-17", pergunta: "Quando não há resposta imediata para o cliente, o melhor caminho é:", alternativas: ["Inventar uma previsão", "Registrar a solicitação e informar como ocorrerá o retorno", "Encerrar o atendimento", "Dizer que ninguém sabe"], correta: 1, explicacao: "Registro e retorno possível mantêm transparência e organização.", categoria: "organizacao", dificuldade: 2 },
      { id: "qpd-18", pergunta: "Qual é uma característica de comunicação assertiva?", alternativas: ["Clareza com respeito", "Agressividade para impor opinião", "Silêncio diante de dúvidas", "Uso de termos confusos"], correta: 0, explicacao: "Assertividade comunica com clareza, respeito e objetividade.", categoria: "comunicacao", dificuldade: 1 },
      { id: "qpd-19", pergunta: "Na Conecta Serviços, o primeiro contato deve representar:", alternativas: ["A pressa da empresa", "A imagem profissional e acolhedora da organização", "A opinião pessoal do atendente", "A autoridade de um único setor"], correta: 1, explicacao: "A recepção influencia a primeira impressão e a experiência do cliente.", categoria: "atendimento", dificuldade: 2 },
      { id: "qpd-20", pergunta: "Qual ação ajuda a evitar perda de informações?", alternativas: ["Registrar recados completos e confirmar dados essenciais", "Confiar apenas na memória", "Pedir que a pessoa repita para outro setor", "Anotar sem nome ou contato"], correta: 0, explicacao: "Registros completos facilitam continuidade, retorno e trabalho em equipe.", categoria: "organizacao", dificuldade: 1 }
    ]
  };

  const cenariosTelefone = [
    {
      id: "tel-info",
      titulo: "Pedido de informação",
      contexto: "Uma pessoa quer saber o horário de atendimento da Conecta Serviços.",
      etapas: [
        {
          fala: "TRIMMMMM... A ligação começou.",
          opcoes: [
            { texto: "Alô?", correta: false, feedback: "Atendimento telefônico profissional começa com identificação da empresa.", pontos: -5 },
            { texto: "Conecta Serviços, bom dia. Ana falando. Como posso ajudar?", correta: true, feedback: "Boa decisão. Você identificou a empresa, cumprimentou e abriu espaço para a demanda.", pontos: 15 },
            { texto: "Quem é?", correta: false, feedback: "A pergunta direta demais pode soar pouco acolhedora.", pontos: -4 },
            { texto: "Fala.", correta: false, feedback: "O tom é informal e inadequado para atendimento profissional.", pontos: -6 }
          ]
        },
        {
          fala: "Pessoa: Gostaria de saber o horário de funcionamento.",
          opcoes: [
            { texto: "Atendemos de segunda a sexta, das 8h às 18h. Posso ajudar em mais alguma informação?", correta: true, feedback: "Resposta clara e com abertura para continuidade.", pontos: 15 },
            { texto: "Está no site.", correta: false, feedback: "A informação poderia ser prestada de forma direta e cordial.", pontos: -3 },
            { texto: "Acho que é horário comercial.", correta: false, feedback: "Informação imprecisa gera ruído.", pontos: -4 },
            { texto: "Não sei informar.", correta: false, feedback: "Se a informação é básica e pública, a recepção deve saber ou verificar.", pontos: -4 }
          ]
        },
        {
          fala: "Pessoa: Obrigada.",
          opcoes: [
            { texto: "Nós que agradecemos. Tenha um bom dia.", correta: true, feedback: "Encerramento cordial fortalece a experiência de atendimento.", pontos: 10, fim: true },
            { texto: "Tá.", correta: false, feedback: "Encerramento muito informal enfraquece a postura profissional.", pontos: -2, fim: true },
            { texto: "Próximo.", correta: false, feedback: "A pessoa ao telefone merece fechamento respeitoso.", pontos: -4, fim: true },
            { texto: "Desligar sem responder.", correta: false, feedback: "Encerrar sem despedida prejudica a percepção de atendimento.", pontos: -5, fim: true }
          ]
        }
      ]
    },
    {
      id: "tel-recado",
      titulo: "Responsável indisponível",
      contexto: "A pessoa quer falar com o setor financeiro, mas a responsável está em atendimento.",
      etapas: [
        {
          fala: "TRIMMMMM... A ligação começou.",
          opcoes: [
            { texto: "Conecta Serviços, boa tarde. Pedro falando. Como posso ajudar?", correta: true, feedback: "Abertura completa e profissional.", pontos: 15 },
            { texto: "Financeiro não atende agora.", correta: false, feedback: "Você ainda não identificou a demanda da pessoa.", pontos: -5 },
            { texto: "Diga.", correta: false, feedback: "A abertura é curta e pouco acolhedora.", pontos: -3 },
            { texto: "Alô, rápido.", correta: false, feedback: "Pressa no tom prejudica a cordialidade.", pontos: -5 }
          ]
        },
        {
          fala: "Pessoa: Preciso falar com a responsável por cobranças.",
          opcoes: [
            { texto: "No momento ela está em atendimento. Posso registrar um recado com seu nome, telefone e assunto?", correta: true, feedback: "Você informa a indisponibilidade e oferece registro de recado.", pontos: 15 },
            { texto: "Liga depois.", correta: false, feedback: "Falta acolhimento e não há registro da necessidade.", pontos: -5 },
            { texto: "Ela nunca está.", correta: false, feedback: "Comentário inadequado expõe a equipe e não ajuda.", pontos: -7 },
            { texto: "Não posso fazer nada.", correta: false, feedback: "A recepção pode registrar e orientar o retorno.", pontos: -5 }
          ]
        },
        {
          fala: "Pessoa: Pode anotar, por favor?",
          opcoes: [
            { texto: "Registrar nome, telefone, empresa, assunto e melhor horário para retorno.", correta: true, feedback: "Recado completo facilita retorno e continuidade do atendimento.", pontos: 15, fim: true },
            { texto: "Anotar apenas o primeiro nome.", correta: false, feedback: "Informação incompleta pode impedir retorno.", pontos: -4, fim: true },
            { texto: "Pedir para mandar mensagem em qualquer número.", correta: false, feedback: "Canais oficiais preservam organização e registro.", pontos: -4, fim: true },
            { texto: "Guardar mentalmente para avisar depois.", correta: false, feedback: "Memória não substitui registro profissional.", pontos: -6, fim: true }
          ]
        }
      ]
    },
    {
      id: "tel-reclamacao",
      titulo: "Reclamação por telefone",
      contexto: "Um cliente liga reclamando de uma cobrança que considera incorreta.",
      etapas: [
        {
          fala: "TRIMMMMM... A ligação começou.",
          opcoes: [
            { texto: "Conecta Serviços, bom dia. Carla falando. Como posso ajudar?", correta: true, feedback: "Abertura adequada para acolher a demanda.", pontos: 15 },
            { texto: "Qual o problema agora?", correta: false, feedback: "A frase antecipa julgamento e pode ampliar o conflito.", pontos: -7 },
            { texto: "Alô?", correta: false, feedback: "Falta identificação profissional.", pontos: -3 },
            { texto: "Setor errado.", correta: false, feedback: "Você ainda não ouviu a solicitação.", pontos: -5 }
          ]
        },
        {
          fala: "Cliente: Recebi uma cobrança que não reconheço.",
          opcoes: [
            { texto: "Entendo. Vou registrar sua solicitação e encaminhar ao Financeiro para análise.", correta: true, feedback: "Acolhe, registra e encaminha ao setor adequado.", pontos: 18 },
            { texto: "Se chegou, deve estar certa.", correta: false, feedback: "A resposta invalida o cliente e não verifica a situação.", pontos: -8 },
            { texto: "Isso não é comigo.", correta: false, feedback: "Mesmo que seja outro setor, a recepção orienta o caminho.", pontos: -5 },
            { texto: "Pague primeiro e reclame depois.", correta: false, feedback: "A fala é inadequada e pode agravar o problema.", pontos: -10 }
          ]
        },
        {
          fala: "Cliente: Preciso de retorno ainda hoje.",
          opcoes: [
            { texto: "Vou informar a urgência no registro e orientar o canal de retorno, sem prometer prazo que não posso garantir.", correta: true, feedback: "Boa decisão. Você registra urgência sem criar promessa indevida.", pontos: 17, fim: true },
            { texto: "Prometo que resolvem em dez minutos.", correta: false, feedback: "Prometer prazo sem confirmação pode gerar nova frustração.", pontos: -6, fim: true },
            { texto: "Não tenho como saber.", correta: false, feedback: "A resposta é verdadeira, mas falta encaminhamento.", pontos: -3, fim: true },
            { texto: "Vou passar seu telefone para qualquer pessoa do setor.", correta: false, feedback: "O retorno precisa de registro organizado e responsável.", pontos: -4, fim: true }
          ]
        }
      ]
    }
  ];

  const plantaoPessoas = [
    { nome: "Maria", perfil: "Gestante", necessidade: "Reunião agendada com a diretoria", prioridade: "Prioridade e agenda", horario: "08h10", situacao: "Aguardando confirmação" },
    { nome: "Carlos", perfil: "Fornecedor", necessidade: "Entrega de mercadoria", prioridade: "Fluxo de compras", horario: "08h11", situacao: "Precisa registrar entrega" },
    { nome: "Ana", perfil: "Cliente", necessidade: "Problema de cobrança", prioridade: "Reclamação", horario: "08h12", situacao: "Irritada, pede orientação" },
    { nome: "João", perfil: "Candidato", necessidade: "Entrega de currículo", prioridade: "Encaminhamento RH", horario: "08h13", situacao: "Sem agendamento" }
  ];

  const acoesPlantao = [
    { id: "acolher", texto: "Cumprimentar a fila, informar que irá organizar o atendimento e identificar prioridades.", pontos: 18, categoria: "atendimento", metricas: { comunicacao: 15, organizacao: 12, atendimento: 18 } },
    { id: "telefone", texto: "Atender o telefone com identificação da empresa, registrar a demanda e retomar a fila.", pontos: 14, categoria: "comunicacao", metricas: { comunicacao: 16, organizacao: 8, atendimento: 10 } },
    { id: "maria", texto: "Confirmar a reunião de Maria, registrar sua chegada e avisar a Diretoria.", pontos: 16, categoria: "organizacao", metricas: { comunicacao: 8, organizacao: 18, atendimento: 14 } },
    { id: "ana", texto: "Ouvir Ana sem interromper, registrar a reclamação e encaminhar ao Financeiro.", pontos: 18, categoria: "escuta", metricas: { comunicacao: 15, organizacao: 12, atendimento: 18 } },
    { id: "carlos", texto: "Conferir dados da entrega de Carlos e acionar Compras ou Almoxarifado.", pontos: 14, categoria: "encaminhamento", metricas: { comunicacao: 8, organizacao: 16, atendimento: 8 } },
    { id: "joao", texto: "Orientar João sobre entrega de currículo pelo RH e indicar o canal correto.", pontos: 12, categoria: "encaminhamento", metricas: { comunicacao: 10, organizacao: 10, atendimento: 10 } },
    { id: "fila-sem-explicar", texto: "Pedir para todos aguardarem sem explicar a ordem de atendimento.", pontos: -8, categoria: "atendimento", metricas: { comunicacao: -8, organizacao: -4, atendimento: -8 } },
    { id: "ignorar-telefone", texto: "Ignorar o telefone até terminar toda a fila.", pontos: -6, categoria: "organizacao", metricas: { comunicacao: -3, organizacao: -8, atendimento: -4 } },
    { id: "cobranca-alta", texto: "Comentar em voz alta o problema de cobrança de Ana para agilizar.", pontos: -12, categoria: "sigilo", metricas: { comunicacao: -8, organizacao: -5, atendimento: -10 } },
    { id: "mandar-direto", texto: "Mandar cada pessoa entrar direto no setor que acha correto.", pontos: -10, categoria: "organizacao", metricas: { comunicacao: -6, organizacao: -12, atendimento: -6 } }
  ];

  const acoesPrimeiroDia = [
    { id: "pd-acolher", texto: "Cumprimentar todos e informar que irá identificar cada necessidade.", criterios: ["acolher", "identificar"], pontos: 14, metricas: { atendimento: 16, organizacao: 8, comunicacao: 14, encaminhamento: 6 } },
    { id: "pd-prioridade", texto: "Verificar prioridades: reunião agendada, reclamação, entrega e telefone.", criterios: ["priorizar", "organizar"], pontos: 13, metricas: { atendimento: 8, organizacao: 18, comunicacao: 8, encaminhamento: 8 } },
    { id: "pd-telefone", texto: "Atender o telefone com saudação profissional e registrar a solicitação.", criterios: ["acolher", "registrar"], pontos: 12, metricas: { atendimento: 10, organizacao: 10, comunicacao: 16, encaminhamento: 6 } },
    { id: "pd-curriculo", texto: "Orientar o candidato a entregar currículo pelo canal do RH.", criterios: ["informar", "encaminhar"], pontos: 10, metricas: { atendimento: 8, organizacao: 8, comunicacao: 10, encaminhamento: 14 } },
    { id: "pd-cobranca", texto: "Ouvir a reclamação, registrar dados essenciais e encaminhar ao Financeiro.", criterios: ["acolher", "registrar", "encaminhar"], pontos: 16, metricas: { atendimento: 18, organizacao: 14, comunicacao: 14, encaminhamento: 16 } },
    { id: "pd-fornecedor", texto: "Conferir a entrega do fornecedor e acionar Compras.", criterios: ["identificar", "encaminhar"], pontos: 11, metricas: { atendimento: 8, organizacao: 15, comunicacao: 8, encaminhamento: 15 } },
    { id: "pd-diretora", texto: "Confirmar a reunião marcada com a diretora, registrar chegada e avisar a agenda.", criterios: ["organizar", "registrar"], pontos: 13, metricas: { atendimento: 10, organizacao: 16, comunicacao: 10, encaminhamento: 12 } },
    { id: "pd-retorno", texto: "Combinar retorno quando o setor responsável não puder atender imediatamente.", criterios: ["informar", "registrar"], pontos: 10, metricas: { atendimento: 10, organizacao: 12, comunicacao: 12, encaminhamento: 8 } },
    { id: "pd-sem-registro", texto: "Encaminhar todos rapidamente sem anotar nomes ou demandas.", criterios: [], pontos: -12, metricas: { atendimento: -7, organizacao: -16, comunicacao: -7, encaminhamento: -10 } },
    { id: "pd-discutir", texto: "Discutir com a cliente da cobrança para defender a empresa.", criterios: [], pontos: -14, metricas: { atendimento: -16, organizacao: -6, comunicacao: -14, encaminhamento: -5 } },
    { id: "pd-direto-diretoria", texto: "Levar todos diretamente à diretoria para ela resolver.", criterios: [], pontos: -10, metricas: { atendimento: -4, organizacao: -12, comunicacao: -4, encaminhamento: -12 } }
  ];

  const conceitos = [
    { titulo: "Escuta ativa", texto: "É ouvir com atenção, observar sinais e confirmar se entendeu a demanda.", exemplo: "Exemplo: repetir o ponto principal antes de encaminhar." },
    { titulo: "Comunicação assertiva", texto: "É falar com clareza e respeito, sem agressividade e sem omitir o essencial.", exemplo: "Exemplo: informar um prazo possível sem prometer o que não depende de você." },
    { titulo: "Experiência do cliente", texto: "É a percepção formada pela pessoa em cada contato com a organização.", exemplo: "Exemplo: uma recepção organizada melhora a confiança no serviço." },
    { titulo: "Jornada do cliente", texto: "É o caminho percorrido pela pessoa antes, durante e depois do atendimento.", exemplo: "Exemplo: chegada, identificação, orientação, retorno e conclusão." },
    { titulo: "Feedback", texto: "É o retorno que confirma se a mensagem foi recebida e compreendida.", exemplo: "Exemplo: pedir que o visitante confirme o setor para onde irá." },
    { titulo: "Ruído de comunicação", texto: "É qualquer interferência que dificulte o entendimento.", exemplo: "Exemplo: falar baixo em local barulhento ou usar siglas desconhecidas." },
    { titulo: "Postura profissional", texto: "É agir com respeito, organização, responsabilidade e discrição.", exemplo: "Exemplo: manter tom calmo em uma reclamação." },
    { titulo: "Comunicação não verbal", texto: "Inclui expressão facial, postura, gestos e atenção visual.", exemplo: "Exemplo: olhar para a pessoa enquanto ela explica a demanda." },
    { titulo: "Sigilo", texto: "É proteger dados pessoais e informações internas conforme autorização.", exemplo: "Exemplo: não falar dados de contrato em voz alta." },
    { titulo: "Empatia", texto: "É reconhecer a situação da pessoa e responder com respeito.", exemplo: "Exemplo: acolher uma reclamação antes de encaminhar." },
    { titulo: "Proatividade", texto: "É tomar iniciativa responsável dentro do seu papel.", exemplo: "Exemplo: verificar uma informação antes que o visitante se perca." },
    { titulo: "Organização", texto: "É registrar, priorizar e manter o fluxo de atendimento claro.", exemplo: "Exemplo: anotar recados com nome, contato, assunto e responsável." }
  ];

  const conquistasDefinidas = [
    { id: "primeiro-dia", nome: "PRIMEIRO DIA", descricao: "Concluiu sua primeira missão.", condicao: (j) => contarMissoes(j) >= 1 },
    { id: "sem-ruidos", nome: "SEM RUÍDOS", descricao: "Acertou 5 questões sobre comunicação.", condicao: (j) => acertosCategoria(j, "comunicacao") >= 5 },
    { id: "posso-ajudar", nome: "POSSO AJUDAR?", descricao: "Concluiu 10 atendimentos ou decisões positivas.", condicao: (j) => j.atendimentosConcluidos >= 10 },
    { id: "ouvidos-atentos", nome: "OUVIDOS ATENTOS", descricao: "Acertou 5 situações de escuta e atendimento.", condicao: (j) => acertosCategoria(j, "escuta") + acertosCategoria(j, "atendimento") >= 5 },
    { id: "rota-certa", nome: "ROTA CERTA", descricao: "Acertou 10 encaminhamentos.", condicao: (j) => acertosCategoria(j, "encaminhamento") >= 10 },
    { id: "profissional", nome: "PROFISSIONAL", descricao: "Alcançou 1000 XP.", condicao: (j) => j.xp >= 1000 },
    { id: "impecavel", nome: "IMPECÁVEL", descricao: "Terminou uma missão sem erros.", condicao: (j) => Boolean(j.missaoPerfeita) },
    { id: "especialista", nome: "ESPECIALISTA", descricao: "Alcançou o nível máximo.", condicao: (j) => j.nivel >= 6 }
  ];

  const missoes = [
    { id: "encaminhamento", numero: "01", titulo: "Para onde eu vou?", descricao: "Encaminhe pessoas ao setor correto da organização.", tipo: "perguntas", dados: banco.encaminhamento, quantidade: 8, dificuldade: "Fácil/Médio" },
    { id: "certo-errado", numero: "02", titulo: "Atendimento certo ou errado?", descricao: "Avalie comportamentos profissionais de recepção.", tipo: "perguntas", dados: banco.certoErrado, quantidade: 8, dificuldade: "Fácil/Médio" },
    { id: "resposta", numero: "03", titulo: "Qual seria sua resposta?", descricao: "Tome decisões em situações de atendimento.", tipo: "perguntas", dados: banco.respostas, quantidade: 8, dificuldade: "Médio/Difícil" },
    { id: "plantao", numero: "04", titulo: "Plantão da recepção", descricao: "Organize fila, telefone, prioridades e registros.", tipo: "plantao", dificuldade: "Difícil" },
    { id: "telefone", numero: "05", titulo: "Telefone tocando", descricao: "Conduza uma ligação profissional do início ao fim.", tipo: "telefone", dificuldade: "Médio" },
    { id: "comunicacao", numero: "06", titulo: "Detetive da comunicação", descricao: "Identifique emissor, receptor, mensagem, canal, ruído e feedback.", tipo: "perguntas", dados: banco.comunicacao, quantidade: 8, dificuldade: "Médio/Difícil" },
    { id: "palavra", numero: "07", titulo: "Palavra profissional", descricao: "Transforme frases informais em linguagem profissional.", tipo: "perguntas", dados: banco.palavra, quantidade: 8, dificuldade: "Fácil/Médio" },
    { id: "sigilo", numero: "08", titulo: "Sigilo ou não?", descricao: "Decida quando uma informação pode ou não ser compartilhada.", tipo: "perguntas", dados: banco.sigilo, quantidade: 8, dificuldade: "Médio" },
    { id: "primeiro-dia", numero: "09", titulo: "Missão especial — Primeiro dia", descricao: "Enfrente a chegada simultânea de demandas às 08h10.", tipo: "especial", dificuldade: "Difícil" },
    { id: "quiz-primeiro-dia", numero: "10", titulo: "Quiz do primeiro dia", descricao: "Responda 10 questões sobre os conteúdos iniciais da UC1.", tipo: "perguntas", dados: banco.quizPrimeiroDia, quantidade: 10, dificuldade: "Fácil/Médio" }
  ];

  const estado = {
    jogadores: [],
    jogador: null,
    preferencias: { som: false },
    missaoAtual: null,
    rodada: null,
    indiceQuestao: 0,
    bloqueado: false,
    audioCtx: null
  };

  const $ = (seletor) => document.querySelector(seletor);
  const $$ = (seletor) => Array.from(document.querySelectorAll(seletor));

  document.addEventListener("DOMContentLoaded", iniciarAplicacao);

  function iniciarAplicacao() {
    carregarProgresso();
    normalizarJogadores();
    vincularEventos();
    renderizarInicial();
    renderizarConceitos();
    renderizarMissoes();
    atualizarTextoSom();
  }

  function vincularEventos() {
    $("#form-inicio").addEventListener("submit", (evento) => {
      evento.preventDefault();
      const nome = $("#nome-jogador").value.trim();
      if (nome) entrarComNome(nome);
    });

    $("#btn-continuar").addEventListener("click", continuarJogador);
    $("#btn-professor-inicial").addEventListener("click", () => abrirProfessorSemJogador());
    $("#btn-sair").addEventListener("click", sairParaInicio);
    $("#btn-resetar").addEventListener("click", reiniciarProgresso);
    $("#btn-exportar").addEventListener("click", exportarCSV);
    $("#btn-zerar-ranking").addEventListener("click", zerarRanking);
    $("#btn-toggle-som").addEventListener("click", alternarSom);
    $("#btn-menu").addEventListener("click", () => $("#main-nav").classList.toggle("open"));
    $("#btn-voltar-missoes").addEventListener("click", () => abrirView("central-missoes"));
    $("#btn-jogar-novamente").addEventListener("click", () => estado.missaoAtual && iniciarMissao(estado.missaoAtual.id));
    $("#btn-proxima-missao").addEventListener("click", iniciarProximaMissao);

    $$(".nav-btn").forEach((botao) => {
      botao.addEventListener("click", () => abrirView(botao.dataset.view));
    });

    $$("[data-view-target]").forEach((botao) => {
      botao.addEventListener("click", () => abrirView(botao.dataset.viewTarget));
    });

    document.addEventListener("keydown", lidarComTeclado);
  }

  function carregarProgresso() {
    estado.jogadores = carregarLista(CHAVE_JOGADORES, []);
    estado.preferencias = Object.assign({ som: false }, carregarLista(CHAVE_PREFS, { som: false }));
  }

  function carregarLista(chave, padrao) {
    try {
      const bruto = localStorage.getItem(chave);
      return bruto ? JSON.parse(bruto) : padrao;
    } catch (erro) {
      return padrao;
    }
  }

  function salvarLista(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  }

  function normalizarJogadores() {
    estado.jogadores = estado.jogadores.map((jogador) => normalizarJogador(jogador));
    salvarLista(CHAVE_JOGADORES, estado.jogadores);
  }

  function normalizarJogador(jogador) {
    const base = criarJogador(jogador.nome || "Jogador");
    const normalizado = Object.assign(base, jogador);
    normalizado.missoesConcluidas = Object.assign({}, base.missoesConcluidas, jogador.missoesConcluidas || {});
    normalizado.conquistas = Array.isArray(jogador.conquistas) ? jogador.conquistas : [];
    normalizado.respostasRealizadas = Object.assign({}, jogador.respostasRealizadas || {});
    normalizado.categorias = Object.assign({}, base.categorias, jogador.categorias || {});
    normalizado.competencias = normalizarCompetencias(jogador.competencias || {});
    normalizado.resultados = Array.isArray(jogador.resultados) ? jogador.resultados : [];
    normalizado.preferencias = Object.assign({ som: false }, jogador.preferencias || {});
    normalizado.nivel = obterNivel(normalizado.xp).nivel;
    normalizado.cargo = obterNivel(normalizado.xp).cargo;
    return normalizado;
  }

  function normalizarCompetencias(competencias) {
    const saida = {};
    Object.keys(competenciasBase).forEach((chave) => {
      saida[chave] = Object.assign({}, competenciasBase[chave], competencias[chave] || {});
    });
    return saida;
  }

  function criarJogador(nome) {
    const agora = new Date().toISOString();
    return {
      id: criarId(),
      nome,
      xp: 0,
      nivel: 1,
      cargo: "Aprendiz",
      pontuacao: 0,
      recorde: 0,
      acertos: 0,
      erros: 0,
      sequencia: 0,
      maiorSequencia: 0,
      atendimentosConcluidos: 0,
      missaoPerfeita: false,
      missoesConcluidas: {},
      conquistas: [],
      respostasRealizadas: {},
      categorias: {},
      competencias: normalizarCompetencias({}),
      resultados: [],
      ultimaSessao: agora,
      criadoEm: agora,
      preferencias: { som: false }
    };
  }

  function criarId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "jogador-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
  }

  function renderizarInicial() {
    const atualId = localStorage.getItem(CHAVE_ATUAL);
    const jogador = estado.jogadores.find((item) => item.id === atualId);
    const btnContinuar = $("#btn-continuar");
    const resumo = $("#resumo-salvo");
    if (jogador) {
      const nivel = obterNivel(jogador.xp);
      btnContinuar.classList.remove("hidden");
      resumo.innerHTML = `Progresso salvo: <strong>${escapar(jogador.nome)}</strong> · Nível ${nivel.nivel} · ${jogador.xp} XP · ${contarMissoes(jogador)} missões concluídas`;
    } else {
      btnContinuar.classList.add("hidden");
      resumo.textContent = "";
    }
  }

  function entrarComNome(nome) {
    const existente = estado.jogadores.find((jogador) => jogador.nome.toLowerCase() === nome.toLowerCase());
    estado.jogador = existente || criarJogador(nome);
    estado.jogador.ultimaSessao = new Date().toISOString();
    estado.jogador.preferencias.som = estado.preferencias.som;
    sincronizarJogador();
    localStorage.setItem(CHAVE_ATUAL, estado.jogador.id);
    abrirShell();
  }

  function continuarJogador() {
    const atualId = localStorage.getItem(CHAVE_ATUAL);
    const jogador = estado.jogadores.find((item) => item.id === atualId);
    if (!jogador) {
      renderizarInicial();
      return;
    }
    estado.jogador = normalizarJogador(jogador);
    estado.preferencias.som = Boolean(estado.jogador.preferencias.som);
    atualizarTextoSom();
    abrirShell();
  }

  function abrirShell() {
    $("#tela-inicial").classList.remove("active");
    $("#app-shell").classList.add("active");
    abrirView("dashboard");
    atualizarTudo();
  }

  function abrirProfessorSemJogador() {
    estado.jogador = null;
    $("#tela-inicial").classList.remove("active");
    $("#app-shell").classList.add("active");
    abrirView("professor");
    atualizarProfessor();
    atualizarRanking();
    $("#topbar-player").textContent = "Modo professor";
  }

  function sairParaInicio() {
    estado.jogador = null;
    estado.missaoAtual = null;
    estado.rodada = null;
    $("#app-shell").classList.remove("active");
    $("#tela-inicial").classList.add("active");
    $("#main-nav").classList.remove("open");
    renderizarInicial();
  }

  function abrirView(viewId) {
    if (!estado.jogador && !["professor", "ranking", "conceitos"].includes(viewId)) {
      sairParaInicio();
      return;
    }
    $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
    $$(".nav-btn").forEach((botao) => botao.classList.toggle("active", botao.dataset.view === viewId));
    $("#main-nav").classList.remove("open");
    if (viewId === "dashboard") atualizarDashboard();
    if (viewId === "central-missoes") renderizarMissoes();
    if (viewId === "perfil") atualizarPerfil();
    if (viewId === "conquistas") renderizarConquistas();
    if (viewId === "ranking") atualizarRanking();
    if (viewId === "professor") atualizarProfessor();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function atualizarTudo() {
    verificarNivel();
    verificarConquistas();
    atualizarDashboard();
    renderizarMissoes();
    atualizarPerfil();
    renderizarConquistas();
    atualizarRanking();
    atualizarProfessor();
  }

  function atualizarDashboard() {
    if (!estado.jogador) return;
    const jogador = estado.jogador;
    const nivel = obterNivel(jogador.xp);
    const proximo = obterProximoNivel(jogador.xp);
    const progresso = calcularProgressoNivel(jogador.xp);
    $("#topbar-player").textContent = `${jogador.nome} · ${nivel.cargo}`;
    $("#dash-nome").textContent = jogador.nome;
    $("#dash-cargo").textContent = nivel.cargo.toUpperCase();
    $("#dash-nivel").textContent = nivel.nivel;
    $("#dash-xp").textContent = proximo ? `${jogador.xp} / ${proximo.xp}` : `${jogador.xp} / MAX`;
    $("#barra-xp").style.width = progresso + "%";
    $("#dash-sequencia").textContent = `${jogador.sequencia} acertos`;
    $("#dash-precisao").textContent = precisaoTexto(jogador);
    $("#dash-missoes").textContent = `${contarMissoes(jogador)}/${missoes.length}`;
    $("#dash-conquistas").textContent = jogador.conquistas.length;
    $("#dash-recorde").textContent = jogador.recorde;
    $("#dash-proxima").textContent = obterProximaMensagem(jogador);
  }

  function obterProximaMensagem(jogador) {
    const proxima = missoes.find((missao) => !jogador.missoesConcluidas[missao.id]);
    if (proxima) return `Próxima etapa sugerida: ${proxima.titulo}.`;
    return "Você concluiu todas as missões. Refaça uma missão para treinar sem ganhar XP repetido.";
  }

  function renderizarMissoes() {
    const grid = $("#grid-missoes");
    grid.innerHTML = missoes.map((missao) => {
      const concluida = estado.jogador && estado.jogador.missoesConcluidas[missao.id];
      const melhor = concluida ? `Melhor precisão: ${concluida.melhorPrecisao || 0}%` : "Ainda não concluída";
      return `
        <article class="mission-card">
          <header>
            <span class="mission-code">${missao.numero}</span>
            <span class="difficulty ${classeDificuldade(missao.dificuldade)}">${missao.dificuldade}</span>
          </header>
          <h3>${escapar(missao.titulo)}</h3>
          <p>${escapar(missao.descricao)}</p>
          <div class="mission-meta">
            <span>${concluida ? "Concluída" : "Disponível"}</span>
            <span>${melhor}</span>
          </div>
          <button type="button" class="btn btn-primary" data-missao="${missao.id}">${concluida ? "JOGAR NOVAMENTE" : "INICIAR MISSÃO"}</button>
        </article>
      `;
    }).join("");

    $$("[data-missao]").forEach((botao) => {
      botao.addEventListener("click", () => iniciarMissao(botao.dataset.missao));
    });
  }

  function classeDificuldade(rotulo) {
    if (rotulo.includes("Difícil")) return "dificil";
    if (rotulo.includes("Médio")) return "medio";
    return "facil";
  }

  function iniciarMissao(id) {
    if (!estado.jogador) return;
    const missao = missoes.find((item) => item.id === id);
    if (!missao) return;
    estado.missaoAtual = missao;
    estado.indiceQuestao = 0;
    estado.bloqueado = false;
    $("#missao-titulo").textContent = missao.titulo;
    $("#missao-subtitulo").textContent = `Missão ${missao.numero}`;
    $("#missao-xp-rodada").textContent = "0";
    abrirView("tela-missao");
    if (missao.tipo === "perguntas") iniciarMissaoPerguntas(missao);
    if (missao.tipo === "plantao") iniciarPlantao();
    if (missao.tipo === "telefone") iniciarTelefone();
    if (missao.tipo === "especial") iniciarPrimeiroDia();
  }

  function iniciarMissaoPerguntas(missao) {
    estado.rodada = {
      tipo: "perguntas",
      perguntas: prepararPerguntasParaRodada(embaralhar(missao.dados).slice(0, missao.quantidade)),
      acertos: 0,
      erros: 0,
      xp: 0,
      pontuacao: 0,
      respondidas: [],
      indicadores: { comunicacao: 0, organizacao: 0, atendimento: 0, decisao: 0 }
    };
    renderizarQuestao();
  }

  function prepararPerguntasParaRodada(perguntas) {
    return perguntas.map((questao, indice) => {
      const alternativas = questao.alternativas.map((texto, indiceOriginal) => ({ texto, indiceOriginal }));
      const correta = alternativas.find((alternativa) => alternativa.indiceOriginal === questao.correta);
      const incorretas = embaralhar(alternativas.filter((alternativa) => alternativa.indiceOriginal !== questao.correta));
      const opcoes = new Array(alternativas.length);
      const posicaoCorreta = (indice + 1) % alternativas.length;
      opcoes[posicaoCorreta] = correta;
      let cursor = 0;
      for (let i = 0; i < opcoes.length; i += 1) {
        if (!opcoes[i]) {
          opcoes[i] = incorretas[cursor];
          cursor += 1;
        }
      }
      return Object.assign({}, questao, { alternativasRodada: opcoes });
    });
  }

  function renderizarQuestao() {
    const rodada = estado.rodada;
    const questao = rodada.perguntas[estado.indiceQuestao];
    const progresso = (estado.indiceQuestao / rodada.perguntas.length) * 100;
    atualizarProgressoMissao(progresso);
    $("#missao-xp-rodada").textContent = rodada.xp;
    estado.bloqueado = false;
    $("#missao-conteudo").innerHTML = `
      <article class="question-card">
        <div class="mission-meta">
          <span>Questão ${estado.indiceQuestao + 1}/${rodada.perguntas.length}</span>
          <span class="difficulty ${classeDificuldade(rotulosDificuldade[questao.dificuldade])}">${rotulosDificuldade[questao.dificuldade]}</span>
        </div>
        <h3>${escapar(questao.pergunta)}</h3>
        <div class="option-grid">
          ${questao.alternativasRodada.map((alternativa, indice) => `
            <button type="button" class="option-btn" data-opcao="${indice}">
              <span>${String.fromCharCode(65 + indice)})</span> ${escapar(alternativa.texto)}
            </button>
          `).join("")}
        </div>
      </article>
      <div id="area-feedback"></div>
    `;
    $$("[data-opcao]").forEach((botao) => {
      botao.addEventListener("click", () => responderQuestao(Number(botao.dataset.opcao)));
    });
  }

  function responderQuestao(indiceEscolhido) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;
    const rodada = estado.rodada;
    const questao = rodada.perguntas[estado.indiceQuestao];
    const alternativaEscolhida = questao.alternativasRodada[indiceEscolhido];
    const correto = alternativaEscolhida.indiceOriginal === questao.correta;
    const fonte = `questao:${questao.id}`;
    const jaRespondida = Boolean(estado.jogador.respostasRealizadas[fonte]);
    let xp = 0;

    if (correto) {
      xp = concederXP(xpPorDificuldade[questao.dificuldade] || 10, fonte, "Resposta correta");
      rodada.acertos += 1;
      rodada.pontuacao += 100 + (questao.dificuldade * 10);
      tocarSom("acerto");
    } else {
      marcarRespostaRealizada(fonte);
      rodada.erros += 1;
      tocarSom("erro");
    }

    if (!jaRespondida) {
      registrarRespostaGlobal(correto, questao.categoria);
    }

    rodada.xp += xp;
    rodada.respondidas.push({ questao, correto });
    atualizarIndicadoresRodada(rodada.indicadores, questao.categoria, correto);
    $("#missao-xp-rodada").textContent = rodada.xp;

    $$("[data-opcao]").forEach((botao) => {
      const opcao = Number(botao.dataset.opcao);
      botao.disabled = true;
      if (questao.alternativasRodada[opcao].indiceOriginal === questao.correta) botao.classList.add("correct");
      if (opcao === indiceEscolhido && !correto) botao.classList.add("wrong");
    });

    const notaXP = jaRespondida
      ? "Esta situação já foi respondida antes; ela treina seu desempenho, mas não gera XP novo."
      : correto
        ? `XP recebido nesta decisão: +${xp}.`
        : "Esta questão foi marcada como respondida para evitar XP infinito em repetição.";

    mostrarFeedback(correto, questao.explicacao, notaXP, () => {
      if (estado.indiceQuestao < rodada.perguntas.length - 1) {
        estado.indiceQuestao += 1;
        renderizarQuestao();
      } else {
        finalizarMissaoPerguntas();
      }
    });
  }

  function mostrarFeedback(correto, explicacao, notaXP, aoContinuar) {
    const area = $("#area-feedback");
    area.innerHTML = `
      <article class="feedback-card ${correto ? "correct" : "wrong"}">
        <h4>${correto ? "Boa decisão." : "Essa escolha poderia gerar um problema porque..."}</h4>
        <p>${escapar(explicacao)}</p>
        <p>${escapar(notaXP)}</p>
        <button type="button" id="btn-proxima-questao" class="btn btn-primary">${botaoProximoTexto()}</button>
      </article>
    `;
    $("#btn-proxima-questao").addEventListener("click", aoContinuar);
  }

  function botaoProximoTexto() {
    if (!estado.rodada || estado.rodada.tipo !== "perguntas") return "CONTINUAR";
    return estado.indiceQuestao < estado.rodada.perguntas.length - 1 ? "PRÓXIMA QUESTÃO" : "VER RESULTADO";
  }

  function finalizarMissaoPerguntas() {
    const rodada = estado.rodada;
    atualizarProgressoMissao(100);
    const total = rodada.acertos + rodada.erros;
    const precisao = total ? Math.round((rodada.acertos / total) * 100) : 0;
    const perfeito = rodada.erros === 0;
    rodada.pontuacao += Math.round(precisao * 4);
    const bonus = concederBonusMissao(estado.missaoAtual.id, perfeito);
    rodada.xp += bonus;
    registrarConclusaoMissao(estado.missaoAtual.id, precisao, rodada.pontuacao, perfeito);
    finalizarMissao({
      missaoId: estado.missaoAtual.id,
      titulo: estado.missaoAtual.titulo,
      pontuacao: rodada.pontuacao,
      xp: rodada.xp,
      acertos: rodada.acertos,
      erros: rodada.erros,
      precisao,
      indicadores: calcularIndicadoresPerguntas(rodada),
      explicacao: criarExplicacaoResultado(precisao)
    });
  }

  function iniciarPlantao() {
    estado.rodada = {
      tipo: "plantao",
      selecionadas: [],
      xp: 0,
      maximo: 6
    };
    renderizarPlantao();
  }

  function renderizarPlantao() {
    const rodada = estado.rodada;
    atualizarProgressoMissao((rodada.selecionadas.length / rodada.maximo) * 100);
    $("#missao-xp-rodada").textContent = rodada.xp;
    const acoesDisponiveis = acoesPlantao.filter((acao) => !rodada.selecionadas.includes(acao.id));
    $("#missao-conteudo").innerHTML = `
      <article class="sim-panel">
        <div class="sim-head">
          <div>
            <h3>Recepção em movimento</h3>
            <p>Há fila presencial e telefone tocando. Escolha até ${rodada.maximo} ações. Mais de uma estratégia pode funcionar, desde que respeite prioridade, registro e acolhimento.</p>
          </div>
          <span class="phone-ring">TRIMMMMM...</span>
        </div>
        <div class="queue-grid">
          ${plantaoPessoas.map((pessoa) => `
            <div class="person-card">
              <strong>${escapar(pessoa.nome)} · ${escapar(pessoa.perfil)}</strong>
              <span>${escapar(pessoa.horario)} · ${escapar(pessoa.necessidade)}</span>
              <span>${escapar(pessoa.prioridade)} · ${escapar(pessoa.situacao)}</span>
            </div>
          `).join("")}
        </div>
      </article>
      <article class="sim-panel">
        <h3>Ações disponíveis</h3>
        <div class="action-grid">
          ${acoesDisponiveis.map((acao) => `
            <button type="button" class="action-btn" data-plantao="${acao.id}">${escapar(acao.texto)}</button>
          `).join("")}
        </div>
      </article>
      <article class="sim-panel">
        <div class="sim-head">
          <div>
            <h3>Ordem escolhida</h3>
            <p>${rodada.selecionadas.length}/${rodada.maximo} decisões registradas.</p>
          </div>
          <button type="button" id="btn-finalizar-plantao" class="btn btn-primary" ${rodada.selecionadas.length < 4 ? "disabled" : ""}>FINALIZAR PLANTÃO</button>
        </div>
        <div class="decision-log">
          ${rodada.selecionadas.length ? rodada.selecionadas.map((id, indice) => {
            const acao = acoesPlantao.find((item) => item.id === id);
            return `<div class="decision-item"><strong>${indice + 1}. ${escapar(acao.texto)}</strong><span>${acao.pontos > 0 ? "Decisão positiva" : "Decisão de risco"}</span></div>`;
          }).join("") : "<p>Nenhuma decisão registrada ainda.</p>"}
        </div>
      </article>
    `;
    $$("[data-plantao]").forEach((botao) => botao.addEventListener("click", () => selecionarAcaoPlantao(botao.dataset.plantao)));
    $("#btn-finalizar-plantao").addEventListener("click", finalizarPlantao);
  }

  function selecionarAcaoPlantao(id) {
    const rodada = estado.rodada;
    if (rodada.selecionadas.includes(id) || rodada.selecionadas.length >= rodada.maximo) return;
    rodada.selecionadas.push(id);
    const acao = acoesPlantao.find((item) => item.id === id);
    if (acao && acao.pontos > 0) {
      const xp = concederXP(8, `acao-plantao:${id}`, "Boa decisão no plantão");
      rodada.xp += xp;
      registrarRespostaGlobal(true, acao.categoria, `acao-plantao:${id}`);
      estado.jogador.atendimentosConcluidos += 1;
      tocarSom("acerto");
    } else if (acao) {
      registrarRespostaGlobal(false, acao.categoria, `acao-plantao:${id}`);
      tocarSom("erro");
    }
    salvarProgresso();
    if (rodada.selecionadas.length >= rodada.maximo) {
      finalizarPlantao();
    } else {
      renderizarPlantao();
    }
  }

  function finalizarPlantao() {
    const rodada = estado.rodada;
    const escolhidas = rodada.selecionadas.map((id) => acoesPlantao.find((acao) => acao.id === id)).filter(Boolean);
    let pontos = escolhidas.reduce((total, acao) => total + acao.pontos, 0);
    if (rodada.selecionadas[0] === "acolher") pontos += 8;
    if (rodada.selecionadas.slice(0, 2).includes("telefone")) pontos += 5;
    pontos = limitar(pontos, 0, 100);
    const acertos = escolhidas.filter((acao) => acao.pontos > 0).length;
    const erros = escolhidas.filter((acao) => acao.pontos < 0).length;
    const perfeito = erros === 0 && pontos >= 85;
    const bonus = concederBonusMissao("plantao", perfeito);
    rodada.xp += bonus;
    const indicadores = somarMetricas(escolhidas, ["comunicacao", "organizacao", "atendimento"]);
    registrarCompetenciasSimulador(indicadores);
    registrarConclusaoMissao("plantao", pontos, pontos * 10, perfeito);
    finalizarMissao({
      missaoId: "plantao",
      titulo: "Plantão da recepção",
      pontuacao: pontos * 10,
      xp: rodada.xp,
      acertos,
      erros,
      precisao: pontos,
      indicadores: {
        "COMUNICAÇÃO": indicadores.comunicacao,
        "ORGANIZAÇÃO": indicadores.organizacao,
        "ATENDIMENTO": indicadores.atendimento
      },
      explicacao: `Tempo simulado: ${8 + rodada.selecionadas.length} minutos. Qualidade do atendimento: ${classificarResultado(pontos)}. Boas estratégias combinam acolhimento, registro, sigilo e encaminhamento correto.`
    });
  }

  function iniciarTelefone() {
    estado.rodada = {
      tipo: "telefone",
      cenario: prepararCenarioTelefone(escolherAleatorio(cenariosTelefone)),
      etapa: -1,
      acertos: 0,
      erros: 0,
      xp: 0,
      pontuacao: 0,
      decisoes: []
    };
    renderizarTelefone();
  }

  function prepararCenarioTelefone(cenario) {
    return {
      id: cenario.id,
      titulo: cenario.titulo,
      contexto: cenario.contexto,
      etapas: cenario.etapas.map((etapa, indice) => {
        const correta = etapa.opcoes.find((opcao) => opcao.correta);
        if (!correta) {
          return Object.assign({}, etapa, { opcoes: embaralhar(etapa.opcoes.slice()) });
        }
        const incorretas = embaralhar(etapa.opcoes.filter((opcao) => !opcao.correta));
        const opcoes = new Array(etapa.opcoes.length);
        const posicaoCorreta = (indice + 1) % etapa.opcoes.length;
        opcoes[posicaoCorreta] = correta;
        let cursor = 0;
        for (let i = 0; i < opcoes.length; i += 1) {
          if (!opcoes[i]) {
            opcoes[i] = incorretas[cursor];
            cursor += 1;
          }
        }
        return Object.assign({}, etapa, { opcoes });
      })
    };
  }

  function renderizarTelefone() {
    const rodada = estado.rodada;
    atualizarProgressoMissao(rodada.etapa < 0 ? 0 : (rodada.etapa / rodada.cenario.etapas.length) * 100);
    $("#missao-xp-rodada").textContent = rodada.xp;
    if (rodada.etapa === -1) {
      $("#missao-conteudo").innerHTML = `
        <article class="phone-panel">
          <div class="sim-head">
            <div>
              <h3>${escapar(rodada.cenario.titulo)}</h3>
              <p>${escapar(rodada.cenario.contexto)}</p>
            </div>
            <span class="phone-ring">TRIMMMMM...</span>
          </div>
          <button type="button" id="btn-atender" class="btn btn-primary">ATENDER</button>
        </article>
      `;
      $("#btn-atender").addEventListener("click", () => {
        rodada.etapa = 0;
        renderizarTelefone();
      });
      return;
    }

    const etapa = rodada.cenario.etapas[rodada.etapa];
    $("#missao-conteudo").innerHTML = `
      <article class="question-card">
        <div class="mission-meta">
          <span>Etapa ${rodada.etapa + 1}/${rodada.cenario.etapas.length}</span>
          <span class="difficulty medio">Telefone</span>
        </div>
        <h3>${escapar(etapa.fala)}</h3>
        <div class="option-grid">
          ${etapa.opcoes.map((opcao, indice) => `
            <button type="button" class="option-btn" data-telefone="${indice}">
              <span>${String.fromCharCode(65 + indice)})</span> ${escapar(opcao.texto)}
            </button>
          `).join("")}
        </div>
      </article>
      <div id="area-feedback"></div>
    `;
    $$("[data-telefone]").forEach((botao) => botao.addEventListener("click", () => responderTelefone(Number(botao.dataset.telefone))));
  }

  function responderTelefone(indice) {
    if (estado.bloqueado) return;
    estado.bloqueado = true;
    const rodada = estado.rodada;
    const etapa = rodada.cenario.etapas[rodada.etapa];
    const opcao = etapa.opcoes[indice];
    const fonte = `telefone:${rodada.cenario.id}:${rodada.etapa}`;
    const jaRespondida = Boolean(estado.jogador.respostasRealizadas[fonte]);
    let xp = 0;
    if (opcao.correta) {
      xp = concederXP(15, fonte, "Decisão telefônica correta");
      rodada.acertos += 1;
      rodada.pontuacao += 120 + Math.max(0, opcao.pontos);
      tocarSom("acerto");
    } else {
      marcarRespostaRealizada(fonte);
      rodada.erros += 1;
      rodada.pontuacao += Math.max(0, 40 + opcao.pontos);
      tocarSom("erro");
    }
    if (!jaRespondida) registrarRespostaGlobal(opcao.correta, "comunicacao");
    rodada.xp += xp;
    rodada.decisoes.push(opcao);
    $("#missao-xp-rodada").textContent = rodada.xp;

    $$("[data-telefone]").forEach((botao) => {
      const opcaoIndice = Number(botao.dataset.telefone);
      botao.disabled = true;
      if (etapa.opcoes[opcaoIndice].correta) botao.classList.add("correct");
      if (opcaoIndice === indice && !opcao.correta) botao.classList.add("wrong");
    });

    const nota = jaRespondida
      ? "Esta etapa já foi praticada antes; não gera XP novo."
      : opcao.correta
        ? `XP recebido nesta etapa: +${xp}.`
        : "A etapa foi registrada para impedir XP infinito em repetição.";

    mostrarFeedback(opcao.correta, opcao.feedback, nota, () => {
      estado.bloqueado = false;
      if (opcao.fim || rodada.etapa >= rodada.cenario.etapas.length - 1) {
        finalizarTelefone();
      } else {
        rodada.etapa += 1;
        renderizarTelefone();
      }
    });
  }

  function finalizarTelefone() {
    const rodada = estado.rodada;
    atualizarProgressoMissao(100);
    const total = rodada.acertos + rodada.erros;
    const precisao = total ? Math.round((rodada.acertos / total) * 100) : 0;
    const perfeito = rodada.erros === 0;
    const bonus = concederBonusMissao("telefone", perfeito);
    rodada.xp += bonus;
    registrarConclusaoMissao("telefone", precisao, rodada.pontuacao, perfeito);
    finalizarMissao({
      missaoId: "telefone",
      titulo: "Telefone tocando",
      pontuacao: rodada.pontuacao,
      xp: rodada.xp,
      acertos: rodada.acertos,
      erros: rodada.erros,
      precisao,
      indicadores: {
        "COMUNICAÇÃO": precisao,
        "ORGANIZAÇÃO": Math.max(0, precisao - (rodada.erros * 8)),
        "ATENDIMENTO": Math.min(100, precisao + (rodada.acertos * 4))
      },
      explicacao: "Um atendimento telefônico profissional identifica a empresa, acolhe a demanda, registra dados e encerra com cordialidade."
    });
  }

  function iniciarPrimeiroDia() {
    estado.rodada = {
      tipo: "especial",
      selecionadas: [],
      xp: 0,
      maximo: 7
    };
    renderizarPrimeiroDia();
  }

  function renderizarPrimeiroDia() {
    const rodada = estado.rodada;
    atualizarProgressoMissao((rodada.selecionadas.length / rodada.maximo) * 100);
    $("#missao-xp-rodada").textContent = rodada.xp;
    const disponiveis = acoesPrimeiroDia.filter((acao) => !rodada.selecionadas.includes(acao.id));
    $("#missao-conteudo").innerHTML = `
      <article class="sim-panel">
        <div class="sim-head">
          <div>
            <h3>São 08h10 na Conecta Serviços</h3>
            <p>Chegam ao mesmo tempo: candidato com currículo, cliente reclamando de cobrança, fornecedor procurando Compras, pessoa com reunião com a diretora e telefone tocando.</p>
          </div>
          <span class="phone-ring">TRIMMMMM...</span>
        </div>
        <p>Escolha até ${rodada.maximo} decisões. A avaliação considera acolher, identificar, organizar, priorizar, informar, registrar e encaminhar.</p>
      </article>
      <article class="sim-panel">
        <h3>Decisões possíveis</h3>
        <div class="action-grid">
          ${disponiveis.map((acao) => `<button type="button" class="action-btn" data-primeiro-dia="${acao.id}">${escapar(acao.texto)}</button>`).join("")}
        </div>
      </article>
      <article class="sim-panel">
        <div class="sim-head">
          <div>
            <h3>Plano de atendimento</h3>
            <p>${rodada.selecionadas.length}/${rodada.maximo} decisões selecionadas.</p>
          </div>
          <button type="button" id="btn-finalizar-primeiro-dia" class="btn btn-primary" ${rodada.selecionadas.length < 5 ? "disabled" : ""}>GERAR RELATÓRIO</button>
        </div>
        <div class="decision-log">
          ${rodada.selecionadas.length ? rodada.selecionadas.map((id, indice) => {
            const acao = acoesPrimeiroDia.find((item) => item.id === id);
            return `<div class="decision-item"><strong>${indice + 1}. ${escapar(acao.texto)}</strong><span>${acao.pontos > 0 ? "Critérios atendidos: " + acao.criterios.join(", ") : "Decisão de risco"}</span></div>`;
          }).join("") : "<p>Nenhuma decisão selecionada ainda.</p>"}
        </div>
      </article>
    `;
    $$("[data-primeiro-dia]").forEach((botao) => botao.addEventListener("click", () => selecionarAcaoPrimeiroDia(botao.dataset.primeiroDia)));
    $("#btn-finalizar-primeiro-dia").addEventListener("click", finalizarPrimeiroDia);
  }

  function selecionarAcaoPrimeiroDia(id) {
    const rodada = estado.rodada;
    if (rodada.selecionadas.includes(id) || rodada.selecionadas.length >= rodada.maximo) return;
    rodada.selecionadas.push(id);
    const acao = acoesPrimeiroDia.find((item) => item.id === id);
    if (acao && acao.pontos > 0) {
      const xp = concederXP(10, `acao-primeiro-dia:${id}`, "Boa decisão no primeiro dia");
      rodada.xp += xp;
      registrarRespostaGlobal(true, "atendimento", `acao-primeiro-dia:${id}`);
      estado.jogador.atendimentosConcluidos += 1;
      tocarSom("acerto");
    } else if (acao) {
      registrarRespostaGlobal(false, "decisao", `acao-primeiro-dia:${id}`);
      tocarSom("erro");
    }
    salvarProgresso();
    if (rodada.selecionadas.length >= rodada.maximo) {
      finalizarPrimeiroDia();
    } else {
      renderizarPrimeiroDia();
    }
  }

  function finalizarPrimeiroDia() {
    const rodada = estado.rodada;
    const escolhidas = rodada.selecionadas.map((id) => acoesPrimeiroDia.find((acao) => acao.id === id)).filter(Boolean);
    let pontos = escolhidas.reduce((total, acao) => total + acao.pontos, 0);
    const criterios = new Set(escolhidas.flatMap((acao) => acao.criterios));
    pontos += criterios.size * 3;
    pontos = limitar(pontos, 0, 100);
    const metricas = somarMetricas(escolhidas, ["atendimento", "organizacao", "comunicacao", "encaminhamento"]);
    registrarCompetenciasSimulador({
      comunicacao: metricas.comunicacao,
      organizacao: Math.round((metricas.organizacao + metricas.encaminhamento) / 2),
      atendimento: metricas.atendimento
    });
    const acertos = escolhidas.filter((acao) => acao.pontos > 0).length;
    const erros = escolhidas.filter((acao) => acao.pontos < 0).length;
    const perfeito = erros === 0 && pontos >= 85;
    const bonus = concederBonusMissao("primeiro-dia", perfeito);
    rodada.xp += bonus;
    registrarConclusaoMissao("primeiro-dia", pontos, pontos * 12, perfeito);
    finalizarMissao({
      missaoId: "primeiro-dia",
      titulo: "Missão especial — Primeiro dia",
      pontuacao: pontos * 12,
      xp: rodada.xp,
      acertos,
      erros,
      precisao: pontos,
      indicadores: {
        "ATENDIMENTO": metricas.atendimento,
        "ORGANIZAÇÃO": metricas.organizacao,
        "COMUNICAÇÃO": metricas.comunicacao,
        "ENCAMINHAMENTO": metricas.encaminhamento
      },
      explicacao: `RESULTADO: ${classificarResultado(pontos)}. A melhor atuação combina acolhimento inicial, identificação das demandas, registro, prioridade e encaminhamento sem expor informações.`
    });
  }

  function concederBonusMissao(missaoId, perfeito) {
    let total = 0;
    total += concederXP(50, `bonus-missao:${missaoId}`, "Missão concluída");
    if (perfeito) total += concederXP(100, `bonus-perfeito:${missaoId}`, "Missão perfeita");
    return total;
  }

  function finalizarMissao(resultado) {
    estado.jogador.pontuacao += resultado.pontuacao;
    estado.jogador.recorde = Math.max(estado.jogador.recorde, resultado.pontuacao);
    estado.jogador.resultados.push(Object.assign({}, resultado, { data: new Date().toISOString() }));
    verificarNivel();
    verificarConquistas();
    salvarProgresso();
    exibirResultado(resultado);
  }

  function exibirResultado(resultado) {
    abrirView("tela-resultados");
    $("#resultado-titulo").textContent = "MISSÃO CONCLUÍDA";
    $("#resultado-resumo").innerHTML = `
      <div><span>Pontuação</span><strong>${resultado.pontuacao}</strong></div>
      <div><span>XP recebido</span><strong>${resultado.xp}</strong></div>
      <div><span>Acertos</span><strong>${resultado.acertos}</strong></div>
      <div><span>Erros</span><strong>${resultado.erros}</strong></div>
      <div><span>Precisão</span><strong>${resultado.precisao}%</strong></div>
      <div><span>Nível atual</span><strong>${estado.jogador.nivel}</strong></div>
    `;
    $("#resultado-indicadores").innerHTML = Object.entries(resultado.indicadores).map(([nome, valor]) => `
      <div class="indicator">
        <label>${escapar(nome)}</label>
        <div class="bar"><span style="width:${limitar(valor, 0, 100)}%"></span></div>
        <strong>${limitar(valor, 0, 100)}%</strong>
      </div>
    `).join("");
    $("#resultado-explicacao").textContent = resultado.explicacao;
    atualizarTudo();
  }

  function registrarConclusaoMissao(missaoId, precisao, pontuacao, perfeito) {
    const atual = estado.jogador.missoesConcluidas[missaoId] || { tentativas: 0, melhorPrecisao: 0, melhorPontuacao: 0, perfeita: false };
    atual.tentativas += 1;
    atual.melhorPrecisao = Math.max(atual.melhorPrecisao, precisao);
    atual.melhorPontuacao = Math.max(atual.melhorPontuacao, pontuacao);
    atual.perfeita = atual.perfeita || perfeito;
    atual.ultimaData = new Date().toISOString();
    estado.jogador.missoesConcluidas[missaoId] = atual;
    if (perfeito) estado.jogador.missaoPerfeita = true;
  }

  function registrarRespostaGlobal(correto, categoria, fonte) {
    if (fonte && estado.jogador.respostasRealizadas[`stat:${fonte}`]) return;
    if (fonte) estado.jogador.respostasRealizadas[`stat:${fonte}`] = true;
    if (correto) {
      estado.jogador.acertos += 1;
      estado.jogador.sequencia += 1;
      estado.jogador.maiorSequencia = Math.max(estado.jogador.maiorSequencia, estado.jogador.sequencia);
      if (estado.jogador.sequencia > 0 && estado.jogador.sequencia % 5 === 0) {
        const xp = concederXP(25, `sequencia:${estado.jogador.sequencia}:${estado.jogador.acertos}`, "Sequência de 5 acertos");
        if (estado.rodada) estado.rodada.xp += xp;
        mostrarToast("Sequência de atendimento", `Você alcançou ${estado.jogador.sequencia} acertos seguidos.`);
      }
    } else {
      estado.jogador.erros += 1;
      estado.jogador.sequencia = 0;
    }
    registrarCategoria(correto, categoria);
  }

  function registrarCategoria(correto, categoria) {
    if (!categoria) return;
    if (!estado.jogador.categorias[categoria]) {
      estado.jogador.categorias[categoria] = { acertos: 0, total: 0 };
    }
    estado.jogador.categorias[categoria].total += 1;
    if (correto) estado.jogador.categorias[categoria].acertos += 1;
    const competencia = categoriaParaCompetencia(categoria);
    if (competencia && estado.jogador.competencias[competencia]) {
      estado.jogador.competencias[competencia].total += 1;
      if (correto) estado.jogador.competencias[competencia].acertos += 1;
    }
  }

  function registrarCompetenciasSimulador(metricas) {
    const pares = {
      comunicacao: metricas.comunicacao || 0,
      organizacao: metricas.organizacao || 0,
      atendimento: metricas.atendimento || 0,
      decisao: metricas.decisao || Math.round(((metricas.atendimento || 0) + (metricas.organizacao || 0)) / 2)
    };
    Object.entries(pares).forEach(([chave, valor]) => {
      const competencia = estado.jogador.competencias[chave];
      if (!competencia) return;
      competencia.total += 100;
      competencia.acertos += limitar(valor, 0, 100);
    });
  }

  function categoriaParaCompetencia(categoria) {
    const mapa = {
      comunicacao: "comunicacao",
      escuta: "comunicacao",
      atendimento: "atendimento",
      postura: "atendimento",
      sigilo: "atendimento",
      organizacao: "organizacao",
      encaminhamento: "organizacao",
      decisao: "decisao",
      conflito: "decisao"
    };
    return mapa[categoria] || "decisao";
  }

  function atualizarIndicadoresRodada(indicadores, categoria, correto) {
    if (!correto) return;
    const competencia = categoriaParaCompetencia(categoria);
    if (competencia && indicadores[competencia] !== undefined) {
      indicadores[competencia] += 12;
    }
  }

  function calcularIndicadoresPerguntas(rodada) {
    const base = {
      "COMUNICAÇÃO": limitar(rodada.indicadores.comunicacao + Math.round((rodada.acertos / rodada.perguntas.length) * 50), 0, 100),
      "ORGANIZAÇÃO": limitar(rodada.indicadores.organizacao + Math.round((rodada.acertos / rodada.perguntas.length) * 45), 0, 100),
      "ATENDIMENTO": limitar(rodada.indicadores.atendimento + Math.round((rodada.acertos / rodada.perguntas.length) * 50), 0, 100)
    };
    if (rodada.indicadores.decisao > 0) {
      base["TOMADA DE DECISÃO"] = limitar(rodada.indicadores.decisao + Math.round((rodada.acertos / rodada.perguntas.length) * 45), 0, 100);
    }
    return base;
  }

  function concederXP(valor, fonte, motivo) {
    if (!estado.jogador || valor <= 0) return 0;
    if (fonte && estado.jogador.respostasRealizadas[fonte]) return 0;
    if (fonte) estado.jogador.respostasRealizadas[fonte] = true;
    estado.jogador.xp += valor;
    const nivelAnterior = estado.jogador.nivel;
    verificarNivel();
    if (motivo) mostrarToast("XP recebido", `+${valor} XP · ${motivo}`);
    if (estado.jogador.nivel > nivelAnterior) tocarSom("nivel");
    return valor;
  }

  function adicionarXP(valor, fonte, motivo) {
    return concederXP(valor, fonte, motivo);
  }

  function marcarRespostaRealizada(fonte) {
    if (fonte) estado.jogador.respostasRealizadas[fonte] = true;
  }

  function verificarNivel() {
    if (!estado.jogador) return;
    const anterior = estado.jogador.nivel;
    const nivel = obterNivel(estado.jogador.xp);
    estado.jogador.nivel = nivel.nivel;
    estado.jogador.cargo = nivel.cargo;
    if (anterior && nivel.nivel > anterior) {
      mostrarLevelFlash(nivel);
    }
  }

  function obterNivel(xp) {
    return niveis.reduce((atual, nivel) => xp >= nivel.xp ? nivel : atual, niveis[0]);
  }

  function obterProximoNivel(xp) {
    return niveis.find((nivel) => nivel.xp > xp) || null;
  }

  function calcularProgressoNivel(xp) {
    const atual = obterNivel(xp);
    const proximo = obterProximoNivel(xp);
    if (!proximo) return 100;
    const faixa = proximo.xp - atual.xp;
    return limitar(Math.round(((xp - atual.xp) / faixa) * 100), 0, 100);
  }

  function verificarConquistas() {
    if (!estado.jogador) return;
    conquistasDefinidas.forEach((conquista) => {
      if (!estado.jogador.conquistas.includes(conquista.id) && conquista.condicao(estado.jogador)) {
        estado.jogador.conquistas.push(conquista.id);
        mostrarToast("Conquista desbloqueada", conquista.nome);
        tocarSom("conquista");
      }
    });
  }

  function renderizarConquistas() {
    const grid = $("#grid-conquistas");
    if (!grid) return;
    const conquistasJogador = estado.jogador ? estado.jogador.conquistas : [];
    grid.innerHTML = conquistasDefinidas.map((conquista) => {
      const desbloqueada = conquistasJogador.includes(conquista.id);
      return `
        <article class="badge-card ${desbloqueada ? "unlocked" : "locked"}">
          <header>
            <span class="badge-state">${desbloqueada ? "Desbloqueada" : "Bloqueada"}</span>
          </header>
          <h3>${escapar(conquista.nome)}</h3>
          <p>${escapar(conquista.descricao)}</p>
        </article>
      `;
    }).join("");
  }

  function atualizarPerfil() {
    if (!estado.jogador) return;
    const jogador = estado.jogador;
    $("#perfil-nome").textContent = jogador.nome;
    $("#perfil-cargo").textContent = jogador.cargo;
    $("#perfil-nivel").textContent = jogador.nivel;
    $("#perfil-xp").textContent = jogador.xp;
    $("#perfil-missoes").textContent = `${contarMissoes(jogador)}/${missoes.length}`;
    $("#perfil-acertos").textContent = jogador.acertos;
    $("#perfil-precisao").textContent = precisaoTexto(jogador);
    $("#perfil-conquistas").textContent = jogador.conquistas.length;
    $("#perfil-barras").innerHTML = Object.entries(jogador.competencias).map(([chave, comp]) => {
      const valor = comp.total ? Math.round((comp.acertos / comp.total) * 100) : 0;
      return `
        <div class="skill-row">
          <header><span>${escapar(comp.nome)}</span><strong>${valor}%</strong></header>
          <div class="skill-track"><span style="width:${limitar(valor, 0, 100)}%"></span></div>
        </div>
      `;
    }).join("");
  }

  function atualizarRanking() {
    const corpo = $("#ranking-corpo");
    const jogadores = obterJogadoresOrdenados();
    corpo.innerHTML = jogadores.length ? jogadores.map((jogador, indice) => `
      <tr>
        <td>${indice + 1}</td>
        <td>${escapar(jogador.nome)}</td>
        <td>${jogador.nivel} · ${escapar(jogador.cargo)}</td>
        <td>${jogador.xp}</td>
        <td>${jogador.recorde}</td>
      </tr>
    `).join("") : `<tr><td colspan="5">Nenhum jogador salvo neste dispositivo.</td></tr>`;
  }

  function atualizarProfessor() {
    const corpo = $("#professor-corpo");
    const jogadores = obterJogadoresOrdenados();
    corpo.innerHTML = jogadores.length ? jogadores.map((jogador) => `
      <tr>
        <td>${escapar(jogador.nome)}</td>
        <td>${jogador.xp}</td>
        <td>${jogador.nivel}</td>
        <td>${jogador.acertos}</td>
        <td>${jogador.erros}</td>
        <td>${precisaoTexto(jogador)}</td>
        <td>${contarMissoes(jogador)}</td>
        <td>${jogador.pontuacao}</td>
        <td>${formatarData(jogador.ultimaSessao)}</td>
      </tr>
    `).join("") : `<tr><td colspan="9">Nenhum resultado salvo neste dispositivo.</td></tr>`;
  }

  function obterJogadoresOrdenados() {
    return estado.jogadores
      .map((jogador) => normalizarJogador(jogador))
      .sort((a, b) => b.xp - a.xp || b.recorde - a.recorde || a.nome.localeCompare(b.nome));
  }

  function renderizarConceitos() {
    $("#grid-conceitos").innerHTML = conceitos.map((conceito) => `
      <article class="concept-card">
        <h3>${escapar(conceito.titulo)}</h3>
        <p>${escapar(conceito.texto)}</p>
        <p class="example">${escapar(conceito.exemplo)}</p>
      </article>
    `).join("");
  }

  function salvarProgresso() {
    if (!estado.jogador) return;
    estado.jogador.ultimaSessao = new Date().toISOString();
    estado.jogador.preferencias.som = estado.preferencias.som;
    sincronizarJogador();
    salvarLista(CHAVE_PREFS, estado.preferencias);
  }

  function sincronizarJogador() {
    if (!estado.jogador) return;
    const indice = estado.jogadores.findIndex((jogador) => jogador.id === estado.jogador.id);
    if (indice >= 0) {
      estado.jogadores[indice] = normalizarJogador(estado.jogador);
      estado.jogador = estado.jogadores[indice];
    } else {
      estado.jogadores.push(normalizarJogador(estado.jogador));
      estado.jogador = estado.jogadores[estado.jogadores.length - 1];
    }
    salvarLista(CHAVE_JOGADORES, estado.jogadores);
    localStorage.setItem(CHAVE_ATUAL, estado.jogador.id);
  }

  function reiniciarProgresso() {
    if (!estado.jogador) return;
    const confirmar = window.confirm("Tem certeza que deseja reiniciar o progresso deste jogador? Esta ação não pode ser desfeita.");
    if (!confirmar) return;
    const nome = estado.jogador.nome;
    const id = estado.jogador.id;
    estado.jogador = criarJogador(nome);
    estado.jogador.id = id;
    estado.jogador.preferencias.som = estado.preferencias.som;
    sincronizarJogador();
    atualizarTudo();
    abrirView("dashboard");
    mostrarToast("Progresso reiniciado", "Os dados deste jogador foram zerados.");
  }

  function zerarRanking() {
    const confirmar = window.confirm("Tem certeza que deseja apagar todos os jogadores e o ranking deste dispositivo?");
    if (!confirmar) return;
    estado.jogadores = [];
    estado.jogador = null;
    localStorage.removeItem(CHAVE_JOGADORES);
    localStorage.removeItem(CHAVE_ATUAL);
    atualizarRanking();
    atualizarProfessor();
    mostrarToast("Ranking zerado", "Todos os jogadores locais foram removidos.");
  }

  function exportarCSV() {
    const cabecalho = ["Nome", "XP", "Nível", "Acertos", "Erros", "Precisão", "Missões concluídas", "Pontuação", "Data"];
    const linhas = estado.jogadores.map((jogador) => [
      jogador.nome,
      jogador.xp,
      jogador.nivel,
      jogador.acertos,
      jogador.erros,
      precisaoTexto(jogador),
      contarMissoes(jogador),
      jogador.pontuacao,
      formatarData(jogador.ultimaSessao)
    ]);
    const csv = [cabecalho, ...linhas].map((linha) => linha.map(valorCSV).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `missao-atendimento-resultados-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function valorCSV(valor) {
    const texto = String(valor ?? "");
    return `"${texto.replace(/"/g, '""')}"`;
  }

  function iniciarProximaMissao() {
    if (!estado.missaoAtual) {
      abrirView("central-missoes");
      return;
    }
    const indice = missoes.findIndex((missao) => missao.id === estado.missaoAtual.id);
    const proxima = missoes[(indice + 1) % missoes.length];
    iniciarMissao(proxima.id);
  }

  function atualizarProgressoMissao(valor) {
    const barra = $("#missao-progresso span");
    if (barra) barra.style.width = limitar(Math.round(valor), 0, 100) + "%";
  }

  function criarExplicacaoResultado(precisao) {
    if (precisao >= 90) return "Excelente desempenho. Você demonstrou domínio das decisões de atendimento e encaminhamento.";
    if (precisao >= 70) return "Bom atendimento. Revise os feedbacks para aumentar clareza, registro e segurança nas decisões.";
    if (precisao >= 50) return "Atendimento em desenvolvimento. Os erros mostram pontos importantes para praticar antes da próxima simulação.";
    return "A missão revelou riscos de comunicação e encaminhamento. Refaça com calma e use os feedbacks como guia de aprendizagem.";
  }

  function classificarResultado(valor) {
    if (valor >= 90) return "ATENDIMENTO EXCELENTE";
    if (valor >= 75) return "BOM ATENDIMENTO";
    if (valor >= 55) return "ATENDIMENTO EM DESENVOLVIMENTO";
    return "ATENDIMENTO COM RISCOS";
  }

  function somarMetricas(acoes, chaves) {
    const soma = {};
    chaves.forEach((chave) => soma[chave] = 0);
    acoes.forEach((acao) => {
      chaves.forEach((chave) => {
        soma[chave] += (acao.metricas && acao.metricas[chave]) || 0;
      });
    });
    chaves.forEach((chave) => soma[chave] = limitar(soma[chave], 0, 100));
    return soma;
  }

  function contarMissoes(jogador) {
    return Object.keys(jogador.missoesConcluidas || {}).length;
  }

  function acertosCategoria(jogador, categoria) {
    return jogador.categorias && jogador.categorias[categoria] ? jogador.categorias[categoria].acertos : 0;
  }

  function precisaoTexto(jogador) {
    const total = (jogador.acertos || 0) + (jogador.erros || 0);
    return total ? `${Math.round((jogador.acertos / total) * 100)}%` : "0%";
  }

  function formatarData(dataISO) {
    if (!dataISO) return "-";
    const data = new Date(dataISO);
    if (Number.isNaN(data.getTime())) return "-";
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, Math.round(valor)));
  }

  function embaralhar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function escolherAleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  function escapar(valor) {
    return String(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function mostrarToast(titulo, mensagem) {
    const area = $("#toast-area");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${escapar(titulo)}</strong><br>${escapar(mensagem)}`;
    area.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3600);
  }

  function mostrarLevelFlash(nivel) {
    const flash = $("#level-flash");
    flash.innerHTML = `<div><span>Novo nível</span><strong>${nivel.nivel}</strong><p>${escapar(nivel.cargo)}</p></div>`;
    flash.classList.remove("hidden");
    window.setTimeout(() => flash.classList.add("hidden"), 1800);
  }

  function alternarSom() {
    estado.preferencias.som = !estado.preferencias.som;
    if (estado.jogador) estado.jogador.preferencias.som = estado.preferencias.som;
    salvarLista(CHAVE_PREFS, estado.preferencias);
    salvarProgresso();
    atualizarTextoSom();
    if (estado.preferencias.som) tocarSom("acerto");
  }

  function atualizarTextoSom() {
    $("#btn-toggle-som").textContent = estado.preferencias.som ? "SOM ON" : "SOM OFF";
  }

  function tocarSom(tipo) {
    if (!estado.preferencias.som) return;
    const AudioContexto = window.AudioContext || window.webkitAudioContext;
    if (!AudioContexto) return;
    if (!estado.audioCtx) estado.audioCtx = new AudioContexto();
    const frequencias = { acerto: 740, erro: 220, conquista: 880, nivel: 1040 };
    const duracao = tipo === "erro" ? 0.12 : 0.16;
    const oscilador = estado.audioCtx.createOscillator();
    const ganho = estado.audioCtx.createGain();
    oscilador.type = "sine";
    oscilador.frequency.value = frequencias[tipo] || 520;
    ganho.gain.setValueAtTime(0.001, estado.audioCtx.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.08, estado.audioCtx.currentTime + 0.02);
    ganho.gain.exponentialRampToValueAtTime(0.001, estado.audioCtx.currentTime + duracao);
    oscilador.connect(ganho);
    ganho.connect(estado.audioCtx.destination);
    oscilador.start();
    oscilador.stop(estado.audioCtx.currentTime + duracao);
  }

  function lidarComTeclado(evento) {
    const viewMissaoAtiva = $("#tela-missao").classList.contains("active");
    if (!viewMissaoAtiva) return;
    if (evento.key === "Escape") {
      abrirView("central-missoes");
      return;
    }
    const numero = Number(evento.key);
    if (!numero || numero < 1 || numero > 4) return;
    const opcoes = $$(".option-btn:not([disabled])");
    if (opcoes[numero - 1]) {
      opcoes[numero - 1].click();
    }
  }
})();
