# Dinâmica 1 — Caça-Falhas da Recepção (UC1)

Plataforma da atividade do primeiro momento de aula da UC1 — *Recepcionar e atender pessoas* — em
**HTML, CSS e JavaScript puros**. Não usa biblioteca, framework, servidor nem banco de dados: tudo roda no
navegador e nada é enviado para fora do aparelho. Funciona em computador e em celular.

## Arquivos

```
dinamicas/
├── index.html          abertura: o que é a dinâmica, texto para enviar aos alunos e botão de iniciar
├── dinamica-1.html     a dinâmica: página inicial (grupo), 7 blocos e relatório final
├── professor.html      guia do professor, protegido por código
├── LEIA-ME.md          este arquivo
└── assets/
    ├── estilo.css      sistema visual (azul-marinho, amarelo de ação e uma cor por bloco)
    ├── base.js         motor comum: grupo, blocos, tutorial, relatório (PDF/CSV/TXT)
    ├── conteudo1.js    conteúdo da Dinâmica 1 (14 pontos da foto, categorias, medidas, normas)
    ├── cenario.jpg            foto do cenário usada no diagnóstico
    └── cenario-numerado.jpg   a mesma foto com os números fixos, para o material impresso
```

## Rodar localmente

1. Abra a pasta `dinamicas`.
2. Dê duplo clique em `index.html` (funciona direto pelo navegador, com `file://`).

Se preferir servir por HTTP (recomendado para testar no celular na mesma rede):

```bash
cd dinamicas
python3 -m http.server 8080
# abra http://localhost:8080 no computador e http://SEU-IP:8080 no celular
```

## Publicar no GitHub Pages

1. Envie o conteúdo da pasta `dinamicas` para o repositório (na raiz ou em uma pasta, por exemplo `dinamicas/`).
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
3. O site abre em `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/` (ou `.../dinamicas/`).

Todos os caminhos são relativos, então funciona igual em subpasta, em `file://` e no Pages.

## Código do guia do professor

- Código padrão: **PROF2026**
- Para alterar: abra `professor.html` e mude a linha `var SENHA = 'PROF2026';`.

Atenção: em site publicado, o código fica visível no HTML. Se o guia não deve ser acessível aos alunos,
não publique `professor.html` (mantenha o arquivo só no seu computador) ou publique-o em outro repositório.

## Como a atividade funciona

A referência de tempo abaixo é **do professor**: nenhum tempo aparece na tela do aluno.

| Bloco | Tempo | O que acontece |
| --- | --- | --- |
| 1 | 00:00–00:20 | O desafio: a empresa, a foto da recepção e como o grupo decide |
| 2 | 00:20–00:55 | Diagnóstico: 14 pontos numerados na foto real, com categoria, medida e norma |
| 3 | 00:55–01:35 | Priorização: impacto, urgência e quem resolve |
| 4 | 01:35–02:20 | Construção da proposta em quatro frentes |
| 5 | 02:20–03:05 | Proposta de melhorias: problemas, riscos, ações e justificativa |
| 6 | 03:05–03:40 | Reflexão e questões respondidas pelo grupo |
| 7 | 03:40–04:00 | Consolidação por indicador e relatório do grupo |

Na foto, **12 pontos precisam melhorar e 2 estão adequados** — o grupo precisa perceber os dois lados.
As normas aparecem em 5 pontos (NR 17, NR 10, NR 23, NR 26 e NR 11), não em todos, de propósito.

## Decisões de projeto que valem lembrar

- **Sem gabarito na tela do aluno.** Durante a atividade a plataforma não revela se a decisão está certa;
  acertos e erros aparecem no relatório final e no debate. O comentário e a base legal ficam só no guia do professor.
- **Gabarito comentado só no professor.** A aba *Gabarito · Dinâmica 1* traz a foto numerada, a decisão correta de
  cada ponto, a norma aplicável, a priorização de referência, as respostas esperadas das cinco questões e a regra
  de pontuação.
- **Alternativas embaralhadas** nos pontos que exigem norma: a ordem das opções é sorteada e o texto tem tamanho
  parecido, para não haver pista pelo formato.
- **Registro sem servidor.** O grupo guarda o progresso no próprio navegador (`localStorage`), então a mesma pessoa
  pode recarregar a página sem perder o que já foi feito. Grupos em aparelhos diferentes têm relatórios separados.
- **Uma tela por vez.** A trilha do topo mostra os sete blocos; o grupo só avança quando o bloco está respondido.

## Relatório do grupo

No fim, o grupo gera:

- **PDF** — pela impressão do navegador (escolha "Salvar como PDF").
- **CSV** — uma linha por item, para análise em planilha.
- **TXT** — resumo em texto para portfólio.

O relatório traz grupo, integrantes, data, duração, pontuação, acertos, erros, desempenho por indicador,
item por item da foto, a proposta, as melhorias escolhidas e as respostas da reflexão.

## Texto para enviar aos alunos

Está na `index.html`, na seção **"Texto para enviar aos alunos"**, com um botão **Copiar texto** — é só colar no
grupo da turma. O guia do professor tem o mesmo material em versão de condução.