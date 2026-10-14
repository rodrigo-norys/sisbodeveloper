# Documentação viva

Módulo de conceito: o que mantém a documentação verdadeira sobre o estado do projeto. Traz
as definições, as regras, o critério de mecanismo, o fluxo, os papéis e os limites, sem
automação e sem depender de nenhuma — sem ela, as regras valem do mesmo jeito. O módulo
irmão, [engenharia de contexto](engenharia-de-contexto.md), trata do que o agente recebe
como instrução; este, do que os documentos afirmam.

## O termo

**Documentação viva** (*living documentation*) é o termo de Cyrille Martraire, em *Living
Documentation: Continuous Knowledge Sharing by Design* (Addison-Wesley, 2019), para a
documentação que muda no mesmo passo do sistema e é confiável por construção: onde o mesmo
conhecimento tem mais de uma representação, um **mecanismo de reconciliação** confere que
elas concordam, em vez de confiar em quem lembra de atualizar todas.

O conhecimento que este módulo protege é o **estado do projeto** — quais requisitos estão
verificados, que tarefa fechou, que ADR foi substituída. Ele envelhece em silêncio: o
trabalho anda, o texto fica, e nada falha. O mecanismo de reconciliação é uma conferência
automática que roda no portão de qualidade do projeto, e as regras abaixo são o que torna o
texto conferível.

## Definições

| Termo | O que é |
|---|---|
| **Fato de estado** | afirmação sobre o estado atual do projeto, que muda quando o trabalho anda: uma contagem, o estado de um ID, uma lista de itens com estado |
| **Fonte** | o lugar em que o fato de estado é definido e de onde ele se calcula: o bloco da tarefa no backlog, a linha da matriz, o diretório das ADRs |
| **Região `conta`** | trecho de uma linha, entre `<!-- conta:NOME -->` e `<!-- /conta -->`, cujo valor a automação calcula da fonte e reescreve; quem escreve não digita o número. Com `NOME[argumento]`, o argumento recorta o cálculo — as tarefas de um épico só |
| **Região `confere`** | bloco escrito à mão — uma árvore de diretórios anotada, um índice com uma decisão por item —, entre `<!-- confere:NOME -->` e `<!-- /confere -->`, cada marcador sozinho na linha; a automação confere o bloco contra a fonte e aponta a divergência, sem reescrevê-lo |
| **Espelho** | o mesmo ID com estado em documentos diferentes, por desenho — o fechamento da tarefa no backlog e o status dela na matriz —, declarado com o lado-fonte e o lado-cópia; a conferência compara o estado lido em cada lado |
| **Piso** | o mínimo que cada guarda tem de examinar. Abaixo dele, ela reprova: o padrão que parou de casar deixaria a guarda verde por vacuidade |
| **Piso por nome** | o piso que conta só as regiões de um nome, e reprova a `confere` apagada ou posta em bloco cercado |
| **Marcador quebrado** | o marcador de região sem par, com nome inválido, ou no início da linha, onde abre um bloco HTML |
| **Guarda** | conferência automática do resultado, que reprova o portão de qualidade; a reprovação cita a regra quebrada |
| **Aviso** | conferência heurística que aponta sem reprovar — o número de estado solto no diff, por exemplo —, e deixa a decisão a quem edita |
| **Portão de qualidade** | a verificação obrigatória do projeto (*quality gate*): o comando único que roda as guardas, junto com lint, tipos, testes e build, na máquina de quem edita e no CI — a execução limpa que a plataforma do repositório faz em todo PR, e sem cujo verde o PR não entra no tronco. Não confundir com o portão da fase, que fecha um documento do planejamento |
| **Registro** | texto que diz o que era verdade numa data: a ADR, o bloco da tarefa fechada, a resposta datada de uma pergunta em aberto. Não conta como estado, e é o único lugar da data |
| **Definição de um ID** | o título que abre com o ID, ou a linha de tabela cuja primeira célula é o ID. Cada ID tem uma, e é nela que o estado dele muda |
| **Citação** | toda outra ocorrência do ID. A citação aponta para a definição, e o leitor confere o estado lá |

## As regras

**R1 — Fato de estado vive num lugar só, e os outros apontam.** A cópia que o desenho exige —
o status da matriz, que espelha o fechamento da tarefa no backlog e anda com ele na mesma
passada — só existe como espelho declarado, e o espelho é conferido: o mesmo ID com o estado
lido em cada lado, e o ID que falta de um lado sem significado declarado.
*Evita:* a cópia que diverge em silêncio. O requisito descartado num documento segue
"entregue" no outro; a tarefa fecha no backlog, e a matriz segue dizendo "aberto".

**R2 — Número de estado atual só em região gerada.** Sem região, aponte onde o número vive.
Diga o recorte — os requisitos **obrigatórios** verificados, e não "os requisitos". Versão
também é estado. Número sobre o código não vai para a prosa: aponte o arquivo ou o comando.
Número que nenhuma fonte do repositório calcula leva fonte e data. Quem edita a linha
reconfere o número; se não der em um comando, a frase está mal escrita. *Evita:* o número
escrito à mão, que é o primeiro a envelhecer — `seis ADRs` quando o diretório já tem mais
uma, `os sete passos` quando o portão de qualidade ganhou outro. Número por extenso também é
número.

**R3 — Afirmação de regra cita o ID que a define.** O `REQ-NN`, o `P-NN`, a `ADR-NNNN`.
*Evita:* a frase órfã. Sem o ID não há vínculo, e quando a regra muda nem quem edita nem o
aviso de pares acham a frase que a repetia.

**R4 — Todo ID tem uma definição, e o estado muda nela.** A definição não se apaga: o
requisito descartado fica `[REMOVIDO]` ou `[SUBSTITUÍDO POR REQ-NN]`, a tarefa cancelada fica
`❌ CANCELADA`, a ADR substituída diz por qual. Número não se reaproveita.
*Evita:* a citação que aponta para o nada, porque a definição foi apagada, ou para outra
coisa, porque o número voltou com outro sentido.

**R5 — Lista de itens com estado é gerada, ou vira ponteiro.** O conjunto que se calcula vai
em região: `conta`, quando a automação escreve a lista, ou `confere`, quando a lista é
escrita à mão e a automação a confere contra a fonte. O resto aponta para onde o conjunto é
definido. *Evita:* a lista que esquece o item novo — o índice de ADRs sem a ADR mais
recente, a lista de passos do portão de qualidade sem o passo acrescentado. Nenhuma
conferência vê o que falta numa lista que ela não conhece.

**R6 — Registro se marca pela estrutura, e não conta como estado.** O registro diz o que era
verdade numa data, e a data mora nele, e só nele: o resto diz o que é verdade hoje, sem data.
O registro se reconhece pelo lugar — o arquivo das ADRs, o bloco da tarefa fechada, a resposta
datada da `Q-NN`, a linha datada —, e não por uma marca de isenção. No código, o comentário
diz o porquê local e cita o ID do registro, e não a data.
*Evita:* a data que não salva a frase. O texto que afirma o presente segue errado com a data
ao lado, e a data só diz quando. No comentário, a data é registro sem lugar: diz quando, e
não onde a narrativa está.

**R7 — O documento renderiza.** Linha em branco dentro de tabela a encerra — também dentro
de citação, onde o `>` sozinho é a linha em branco —, e o resto sai como texto corrido. A
região nunca abre a linha: ali o marcador abre um bloco HTML, e o resto da linha deixa de
ser Markdown.
*Evita:* o que o leitor não vê. A tabela partida ao meio passa despercebida, porque Markdown
quebrado não é erro para ninguém.

## O critério: guarda, aviso ou revisão

Três mecanismos cobram as regras, e uma regra pode ter mais de um:

- **Guarda** — só vira guarda a conferência que tem **falso positivo zero por construção**,
  porque compara valor calculado com valor escrito, ID com ID, ou estrutura de Markdown, **e**
  que tem **defeito medido** que ela teria pegado.
- **Aviso** — roda antes do aceite. É heurística sobre a forma da frase ou sobre o que o diff
  tocou: tem falso positivo, e quem edita decide cada item.
- **Revisão** — só a leitura decide. Fica com quem edita, ou com um revisor chamado sob
  demanda.

Cada mecanismo tem nome, e a tabela abaixo usa o nome antes dos dois-pontos. As guardas são a
região `conta`, o espelho, a região `confere`, o piso por nome, a tabela solta e o marcador
quebrado. Os avisos são o de número solto — o número de estado fora de região, nas linhas que
o diff acrescentou —, o de pares — os blocos que citam um ID cuja definição o diff mudou — e
o de definições — o ID citado sem definição, ou com mais de uma.

```
uma regra
  │
  ├─ a conferência tem falso positivo zero por construção?
  │     ├─ sim, e há defeito medido que ela pegaria ─────► GUARDA: reprova o portão de qualidade
  │     └─ sim, mas nenhum defeito medido ───────────────► ainda não: espera o defeito
  ├─ não, mas a frase ou o diff tem forma reconhecível ───► AVISO: aponta, sem reprovar
  └─ só a leitura decide ─────────────────────────────────► REVISÃO: de quem edita,
                                                              ou do revisor sob demanda
```

| Regra | Guarda | Aviso | Revisão |
|---|---|---|---|
| R1 | espelho | pares: os blocos que citam um ID cuja definição o diff mudou | — |
| R2 | região `conta` | número solto: nas linhas que o diff acrescentou | — |
| R3 | — | — | revisão: a afirmação de regra sem o ID |
| R4 | — | definições: o ID citado sem definição, e o definido em mais de um lugar fora de espelho | — |
| R5 | região `confere`, piso por nome | — | revisão: a lista que não é região |
| R6 | — | número solto, pares: os dois pulam o registro | — |
| R7 | tabela solta, marcador quebrado | — | — |

O que a guarda e o aviso não alcançam, em qualquer regra, fica com a revisão — a cópia que não
é espelho declarado, o número numa forma que o aviso não reconhece. A coluna Revisão marca a
regra em que ela é o mecanismo: na R3, o aviso de pares só acha a frase que já cita o ID, e
por isso serve à R1, e não cobra a R3.

**Por que guarda, e não instrução.** A regra por caminho que traz as regras pode não carregar,
ou ser ignorada; a guarda falha alto, e a reprovação cita a regra quebrada — quem a lê aprende a
regra no momento em que precisa dela. **Por que o aviso não reprova.** Heurística tem falso
positivo, e aviso que reprova por engano ensina a contorná-lo. **Por que a revisão é sob
demanda.** Um modelo de linguagem é revisor razoável e guarda pouco confiável para
contradição com nuance; e a leitura humana de toda mudança não escala.

**O piso fecha a guarda vazia.** Toda guarda declara quanto examina no mínimo, e abaixo disso
reprova. A guarda que examina zero passa verde, e verde por vacuidade não se distingue de
verde de verdade.

## O fluxo

```
alguém muda a fonte — fecha uma tarefa, descarta um requisito, cria uma ADR
   │
   ▼
antes do aceite do commit: os avisos, sobre o diff
   ├─ número de estado solto, fora de região
   └─ blocos que citam um ID cuja definição o diff mudou
         quem edita decide cada item: região, ponteiro, fonte e data — ou registro, que fica
   │
   ▼
portão de qualidade, na máquina de quem edita: as guardas
   ├─ região diverge da fonte ──────────────────► a automação reescreve o valor
   └─ espelho, lista conferida, tabela solta, ──► quem edita corrige o texto apontado
      marcador quebrado, piso
   │
   ▼
commit, com o aceite de quem aprova
   │
   ▼
PR: os avisos de novo, sobre o PR inteiro
   │
   ▼
CI: o mesmo portão de qualidade, obrigatório ──► sem verde, sem merge
   │
   ▼
merge

à parte, sob demanda: a revisão semântica, a partir da lista de pares
```

O conserto automático é um só: reescrever o valor da região. Espelho, lista e estrutura se
corrigem no texto, por quem edita — a guarda diz o arquivo, a linha e o que diverge.

## Os papéis que precisam existir

Papéis, e não peças: um projeto pode juntar dois papéis numa peça, ou dividir um em várias,
desde que cada um exista. Como ligar cada papel, e como provar que está ligado, é do kit.

| Papel | O que garante | Sem ele |
|---|---|---|
| **Motor e configuração** | o mecanismo genérico calcula as regiões, confere espelhos, listas e estrutura, e produz os avisos; a configuração declara o que é do projeto — escopo, contadores, famílias de ID, espelhos, registro, vocabulário dos avisos, pisos | a região é texto inerte |
| **Guarda no portão de qualidade** | a conferência roda no portão de qualidade, na máquina de quem edita e no CI, e o verde do CI é condição para entrar no tronco | a guarda vira opcional, e o defeito entra pelo commit que não a rodou |
| **Aviso antes do aceite do commit, e no PR** | os avisos rodam sobre o diff antes de quem aprova aceitar, e de novo sobre o PR inteiro | o número solto só aparece depois de commitado, e corrigir pede commit novo |
| **Regra por caminho da documentação** | as regras R1–R7 entram em contexto quando o agente trabalha com documentação, conforme a versão do Claude Code (`<kit-contexto>/GUIA-DE-CONTEXTO.md`, papel 2), pela regra por caminho que as traz — ver [engenharia de contexto](engenharia-de-contexto.md); orientam, e cada reprovação da guarda as cita | o agente escreve número à mão e cópia de estado, e só a guarda o pega |
| **Registro** | um lugar declarado para a data e a narrativa — a ADR, o bloco da tarefa fechada, a resposta datada —, que os avisos sabem pular | a data vai para a prosa e para o comentário, e os avisos não distinguem registro de estado |
| **Revisão semântica sob demanda** | alguém — pessoa, ou agente sem permissão de edição — lê a lista de pares e decide o que só a leitura decide | a referência viva que diz outra coisa passa por todo mecanismo |
| **Guarda de comentário** (opcional) | no código, o ID citado em comentário existe, e a data fora de crase reprova | a data volta para o comentário, e o ID citado pode não existir |

## Os limites

O que este módulo não alcança, dito em voz alta:

- **Fato sem ID e sem número** — "a tela tem filtro por data" envelhece sem que nada o veja.
  É da revisão.
- **A lista que devia ganhar um item e não ganhou** — nenhuma conferência vê o que falta,
  menos a lista que é região.
- **Código → documento** — a conferência lê documentos. A afirmação sobre o código aponta o
  arquivo ou o comando, e não leva número.
- **Dado de fora do repositório** — uma planilha, uma API: leva fonte e data, e a idade da
  medição não gera aviso.
- **A referência viva que diz outra coisa** — existe, resolve, e mente. É semântica, e fica
  para a revisão.
- **O aviso é heurística** — reconhece formas de frase, e deixa de fora, por desenho, as que
  custam mais falso positivo que acerto; a lista dessas formas mora na regra por caminho da
  documentação.
- **O espelho confere o estado que lê** — o que a função de estado de um lado não distingue,
  passa calado.
- **A medição é de um projeto só** — a efetividade foi medida no projeto de origem, sem
  piloto num segundo projeto.

## Adoção

- **Sem automação**, as regras valem do mesmo jeito, e a região é texto inerte. O esqueleto
  já traz as regiões do Estado de cada épico, em [`03-backlog.md`](../03-backlog.md), e da
  cobertura, em [`04-rastreabilidade.md`](../04-rastreabilidade.md), com o marcador de
  preenchimento no lugar do valor.
- **A automação** está no kit do contrato de documentação, em `<kit-documentacao>`: o motor, a
  configuração-modelo desta estrutura, a regra por caminho da documentação e o guia de
  ligação, papel a papel, com um exemplo de projeto.
- **A evidência** — o problema medido, o desenho, o método de efetividade e os resultados —
  está em `<estudos>`.
- **Projeto guardado** é o que tem cada papel acima ligado, cada guarda acima do piso, e a
  varredura de adoção registrada com data e resíduo: todo ID citado com uma definição, cada
  número solto do documento inteiro classificado à mão, a guarda verde.

**Marcadores.**
`<kit-documentacao>` é o repositório do método `metodo-sdd`, pasta `kit-documentacao/`.
`<kit-contexto>` é o repositório do método `metodo-sdd`, pasta `kit-contexto/`.
`<estudos>` é o repositório do método `metodo-sdd`, pasta `estudos/`.
