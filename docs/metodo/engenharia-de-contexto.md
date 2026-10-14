# Engenharia de contexto

Módulo de conceito: como se escolhe o que o agente de código recebe como instrução, e como o
resultado é conferido, carregue a instrução ou não. Traz as definições, a estrutura, os
princípios e os limites, sem automação. O módulo irmão,
[documentação viva](documentacao-viva.md), trata do que os documentos afirmam; este, do que
o agente recebe e do que confere o que ele produz.

## O termo

**Engenharia de contexto** (*context engineering*) é o termo da Anthropic, em "Effective
context engineering for AI agents" (29/09/2025), para o conjunto de estratégias que escolhem
e mantêm a informação que o modelo recebe durante a inferência — as instruções, e tudo o mais
que chega ao contexto além delas. O alvo, na formulação do texto: o menor conjunto possível
de tokens de alto sinal que maximize a chance do resultado desejado.

Um agente de código age sobre o contexto que recebe. Se esse contexto falta ou está velho,
ele erra com confiança. Este módulo junta ao termo a metade que garante: o contexto
**orienta**, o resultado é **conferido** por guarda, carregue a instrução ou não, e o próprio
contexto é **medido**, fora do caminho, para decidir o que muda nele.

## Definições

| Termo | O que é |
|---|---|
| **Arquivo de contexto** | o arquivo de instrução que o agente carrega em toda sessão — neste esqueleto, o `CLAUDE.md` —, o *context file* da pesquisa citada abaixo. Entra sempre, e por isso custa em toda sessão. Não confundir com a regra por caminho, que só entra quando o agente trabalha com arquivo do caminho que ela declara, conforme a versão do Claude Code (`<kit-contexto>/GUIA-DE-CONTEXTO.md`, papel 2) |
| **Regra por caminho** | a instrução que o agente carrega só quando trabalha com arquivo do caminho que ela declara (*path-scoped rule*): ao lê-lo pela ferramenta de leitura, em toda versão do Claude Code, e no mais conforme a versão (`<kit-contexto>/GUIA-DE-CONTEXTO.md`, papel 2). Traz o detalhe de um assunto, e pode não carregar |
| **Guarda** | conferência automática do resultado, que reprova o portão de qualidade; a reprovação cita a regra quebrada |
| **Aviso** | conferência heurística que aponta sem reprovar — o número de estado solto no diff, por exemplo —, e deixa a decisão a quem edita |
| **Portão de qualidade** | a verificação obrigatória do projeto (*quality gate*): o comando único que roda as guardas, junto com lint, tipos, testes e build, na máquina de quem edita e no CI — a execução limpa que a plataforma do repositório faz em todo PR, e sem cujo verde o PR não entra no tronco. Não confundir com o portão da fase, que fecha um documento do planejamento |
| **Conferência antes do aceite** | o passo que roda os avisos e o portão de qualidade antes de quem aprova aceitar o commit |
| **Branch protegida** | o tronco que só aceita o PR que passou no portão de qualidade do CI, sem exceção |
| **Registro de carga** | o log de cada instrução que entrou em contexto: quando, por quê e qual |
| **Piso** | o mínimo que cada guarda tem de examinar. Abaixo dele, ela reprova: o padrão que parou de casar deixaria a guarda verde por vacuidade |
| **Mutação** | quebrar a regra de propósito, para ver a guarda reprovar |

## A estrutura

Duas partes: o **caminho** que toda mudança percorre, e um **ciclo de medição** que fica fora
do caminho e o ajusta.

```
CAMINHO DE CADA MUDANÇA                                    CICLO DE MEDIÇÃO (fora do caminho)

1. arquivo de contexto ....... toda sessão ──────────┐
2. regras por caminho ........ conforme a versão     ├──► o registro de carga grava cada carga
        (o agente trabalha)                          │              ▼
3. guardas ................... conferem o resultado  │     leitura, sob demanda
   ├─ 3a. conferência antes do aceite                               ▼
   └─ 3b. portão de qualidade no PR                        decisão: o que fica no arquivo de
4. branch protegida .......... no merge                    contexto, o que vai para uma regra
                                                           por caminho, o que vira guarda
                                                                    │
                                      ◄─────────────────────────────┘ volta para 1, 2 e 3
```

| # | Papel | Quando age | O que faz | Garante? |
|---|---|---|---|---|
| 1 | **Arquivo de contexto** | no início de toda sessão, e de novo depois de compactar a conversa | a instrução que vale em toda sessão: as regras invioláveis, o protocolo de trabalho, onde fica cada coisa | não — orienta |
| 2 | **Regras por caminho** | quando o agente trabalha com arquivo do caminho delas, conforme a versão do Claude Code (`<kit-contexto>/GUIA-DE-CONTEXTO.md`, papel 2) — e nem sempre | o detalhe de um assunto | não — orienta |
| 3 | **Guardas** | sempre que o portão de qualidade roda | conferem o que a instrução pede, e a reprovação cita a regra quebrada | sim |
| 3a | **Conferência antes do aceite** | antes do aceite do commit | roda os avisos e o portão de qualidade inteiro; o commit só é proposto com ele verde | cedo, mas pode ser pulada |
| 3b | **Portão de qualidade no PR** | em todo PR | roda o mesmo portão de qualidade, no CI; sem o verde e a branch atualizada, nada entra | sim — obrigatório |
| 4 | **Branch protegida** | no merge | só aceita o PR que passou em 3b, sem exceção, nem para o dono | sim |
| ↺ | **Registro de carga** | a cada instrução carregada | grava quando, por quê e qual; a leitura é sob demanda, e decide o que muda em 1, 2 e 3 | não — mede |

**Por que nessa ordem:**

- **O que carrega sempre vem antes do que carrega sob demanda.** O arquivo de contexto entra
  em toda sessão; a regra por caminho, só quando o agente trabalha com arquivo do caminho dela,
  conforme a versão do Claude Code (`<kit-contexto>/GUIA-DE-CONTEXTO.md`, papel 2).
  O que precisa valer em toda sessão fica no arquivo de contexto, e a regra por caminho traz o
  detalhe.
- **A guarda confere o resultado, e não a carga.** Ela vale mesmo quando 1 e 2 falharam. É a
  peça que troca a pergunta "o agente leu?" por "o resultado está certo?".
- **As mesmas guardas rodam duas vezes, por motivos diferentes.** Antes do aceite, para o erro
  aparecer quando corrigir custa uma edição. No PR, porque é a única execução que ninguém
  consegue pular.
- **A medição fica fora do caminho.** Nada no caminho lê o registro de carga. Ele serve à
  decisão de mover uma instrução, ou de transformá-la em guarda.

## Os princípios

1. **Orienta não é garante.** O arquivo de contexto e a regra por caminho dizem ao agente o que
   fazer; a instrução pode não carregar — e o que carrega a regra por caminho muda com a versão
   do Claude Code —, ou ser ignorada. Nada que precise valer depende só dela.
2. **O que não pode falhar tem guarda, e a guarda cita a regra.** A reprovação diz qual regra
   foi quebrada e onde ela mora: quem a lê aprende a regra no momento em que precisa dela,
   tenha a instrução carregado ou não.
3. **A guarda tem piso contra vacuidade.** A guarda que parou de encontrar o que confere passa
   verde. Uma asserção reprova quando o que a guarda examina cai abaixo do piso.
4. **A medição fica fora do caminho.** O registro de carga não bloqueia nada e não é lido por
   nenhuma etapa do caminho: é insumo da decisão, sob demanda.
5. **O registro vai para o histórico, e não para a instrução.** Data, pendência fechada,
   quantas vezes algo falhou: é registro, e mora no controle de versão, na ADR, no bloco da
   tarefa fechada — recuperável por um comando, e fora do contexto de toda sessão.
6. **O arquivo de contexto é enxuto por um crivo, e nada sai sem o destino já conter.** Para
   cada bloco: o conteúdo existe em outro lugar? Alguma guarda o impõe? Sem ele, o erro seria
   visível ou silencioso? Sai o que tem cópia ou guarda; fica o que nenhuma guarda cobre. Nada
   vai para uma regra por caminho só para encolher o arquivo: ela pode não carregar. Antes de
   apagar, o destino já tem o conteúdo.

## Os tipos de guarda de contexto

Papéis, e não arquivos: um projeto pode juntá-los numa suíte só, ou dividi-los.

| Guarda | Confere | Sem ela |
|---|---|---|
| **De estado** | todo número de estado atual em região bate com a fonte — ver [documentação viva](documentacao-viva.md) | o arquivo de contexto afirma estado velho em toda sessão: instrução errada, e não só texto errado |
| **De coerência entre documentos** | os documentos concordam entre si: índice, totais, matriz | duas versões do mesmo fato em circulação, e o agente escolhe uma |
| **De referência** | documento e código concordam: toda referência citada existe, e toda peça do agente — regra por caminho, skill, hook, subagente — está citada no arquivo de contexto | a peça que ninguém sabe que existe, e a referência que aponta para o nada |
| **De texto de interface** | o texto que o usuário final lê não mostra código interno | o identificador interno vaza para a tela, porque a regra por caminho sobre o texto não carregou |
| **De distribuição** | o que vai para quem usa resolve tudo de que depende | o pacote entregue quebra fora da máquina de quem o montou |

## As guardas também precisam de guarda

Guarda verde não prova nada se ela não examina nada. Três defeitos de guarda aparecem na
prática, e nenhum reprova sozinho:

- **o padrão que parou de casar** — a forma da frase mudou, e a guarda confere zero linhas;
- **o padrão estreito** — reconhece só parte da família, e o identificador com um dígito a
  mais passa sem conferência;
- **a fonte errada** — a guarda lê o disco, e não o que o controle de versão rastreia, e passa
  numa máquina enquanto reprova no CI.

Os remédios:

- **Piso** — cada guarda declara quanto examina no mínimo, e uma asserção reprova
  abaixo disso.
- **Mutação** — a guarda nova entra provada: quebra-se a regra de propósito, e ela tem de
  reprovar; desfaz-se a quebra, e ela tem de passar.
- **A guarda lê o que o CI lê** — o que o controle de versão rastreia, e não o disco.

A mutação feita uma vez, à mão, não roda sozinha a cada mudança da guarda: é limite, e não
garantia.

## Os limites

O que esta estrutura não garante:

- **Que a instrução carregue.** A regra por caminho carrega quando o agente lê ou escreve
  arquivo do caminho dela, conforme a versão do Claude Code — o que conta como leitura e escrita
  mudou de versão para versão, e a tabela, com a fonte, está em
  `<kit-contexto>/GUIA-DE-CONTEXTO.md`, papel 2 —; o agente pode tocar o assunto por outro
  caminho, e a instrução carregada pode ser ignorada. Por isso nada que precise valer depende só
  dela.
- **Que o registro de carga mostre tudo.** Ele grava o que carregou, nunca o que deveria ter
  carregado e não carregou; essa falta só aparece nas transcrições das sessões.
- **Que o ciclo de medição rode sozinho.** Nada agenda a releitura do registro de carga: ela
  é sob demanda.
- **Que a conferência antes do aceite seja usada.** O commit direto a pula; quem segura é o
  portão de qualidade no PR.
- **Que a prosa diga a verdade.** A guarda alcança o que é computável. A referência que existe
  e diz outra coisa é semântica, e fica para a revisão.
- **Que encolher o arquivo de contexto aumente a obediência.** O ganho medido é de custo e de
  manutenção — ver a pesquisa abaixo.

## O que a pesquisa diz

| Achado | Fonte | O que o método tira disso |
|---|---|---|
| Arquivo de contexto do repositório não melhora, em geral, a taxa de sucesso do agente, e aumenta o custo de inferência em mais de 20%; o escrito por pessoa melhora pouco, e o gerado por LLM piora | Gloaguen et al., ETH Zurich, 2026 — [arXiv 2602.11988](https://arxiv.org/abs/2602.11988) | o arquivo de contexto é escrito à mão, e só com o mínimo |
| Tamanho do arquivo, posição da regra, arquitetura dos arquivos e contradição em arquivo vizinho não mudaram a obediência de forma detectável; a duração da sessão mudou | McMillan, 2026 — [arXiv 2605.10039](https://arxiv.org/abs/2605.10039), sobre 1.650 sessões | encolher o arquivo de contexto é por custo e manutenção; o que garante a regra é a guarda, e não o texto |
| O hook dá "controle determinístico": a ação acontece sempre, em vez de depender de o modelo escolher executá-la | [documentação de hooks do Claude Code](https://code.claude.com/docs/en/hooks-guide) | o que não pode falhar é conferido por mecanismo obrigatório, e não pedido em texto |

## Adoção

Neste esqueleto, o arquivo de contexto é o `CLAUDE.md`, que traz as regras curtas e aponta para
os módulos de conceito. As regras por caminho são as do agente — a da documentação, do kit
em `<kit-documentacao>`, é uma delas —, e as guardas rodam no portão de qualidade, a linha
**Portão de qualidade:** do `CLAUDE.md`. O portão de qualidade no PR e a branch protegida são
configuração da plataforma do repositório; o registro de carga, um hook do
agente.

- **Como montar cada papel**, e como provar que está ligado, está no kit de contexto, em
  `<kit-contexto>`: o modelo de regra por caminho, os hooks do registro de carga e do aviso de
  alinhamento, as guardas de exemplo e o guia, papel a papel — com o portão de qualidade no PR,
  a branch protegida e o padrão da guarda que falha fechado, para o hook que bloqueia.
- **A evidência** — os casos reais desta estrutura, com a falha, a prova e o limite de cada um —
  está em `<estudos>/engenharia-de-contexto.md`.

Os papéis podem se juntar — um projeto pequeno roda os avisos e o portão de qualidade no
mesmo passo —, desde que cada um exista.

**Marcadores.**
`<kit-documentacao>` é o repositório do método `metodo-sdd`, pasta `kit-documentacao/`.
`<kit-contexto>` é o repositório do método `metodo-sdd`, pasta `kit-contexto/`.
`<estudos>` é o repositório do método `metodo-sdd`, pasta `estudos/`.
