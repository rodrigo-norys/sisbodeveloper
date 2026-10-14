# Constituição — sisbodeveloper

Os princípios abaixo valem sobre a especificação, sobre o plano e sobre
qualquer história futura. Quando um deles conflita com algo que se quer fazer,
**o trabalho para e vira conversa** — nunca contorno silencioso.

## Problema e critério de sucesso

**Problema.** Quem avalia perfis técnicos — em desenvolvimento, em análise de sistemas e, principalmente, em segmentos com foco em inteligência artificial — precisa saber até onde vai o conhecimento de Rodrigo Norys como desenvolvedor e até onde vai o domínio dele com IA.

As fontes habituais (perfil profissional, repositórios de código e currículo) mostram o que foi feito; o resto fica para a entrevista. O que elas não mostram é a vivência de uso: as decisões tomadas no uso do Claude e como o raciocínio chegou a cada resultado.

**Critério de sucesso.**

1. Quem avalia perfis técnicos procura Rodrigo Norys por causa do site: em até 30 dias depois de cada divulgação do site, pelo menos uma pessoa entra em contato citando o site ou algo que está nele.

Isto **não** é critério de aceite. O aceite prova que uma peça faz o que foi
pedido; o critério de sucesso prova que o conjunto resolveu o problema. Todos os
requisitos aceitos e o critério de sucesso falho é a coisa errada construída
corretamente — e cada aceite, isolado, disse que estava tudo bem.

**Muda por emenda**, pelo procedimento do fim deste arquivo. Se o problema
mudou, o projeto é outro — e isso é decisão a tomar, não fato a descobrir.

## Como escrever um princípio

- **Afirmativo e curto.** Uma frase de regra, uma de razão.
- **Precisa proibir algo nomeável.** Se você não consegue citar uma decisão
  plausível que ele impede, é slogan, não princípio.
- **Entre cinco e dez.** Mais que isso não é constituição, é manual — e nada
  que precisa de vinte itens é inviolável de verdade.
- **A razão fica junto.** Princípio sem porquê é revogado na primeira pressa,
  porque ninguém lembra o que ele estava protegendo.

> **Nomenclatura.** Chame de *constituição* e de *princípio* — são os termos
> que o SDD usa. Numere `P-01`, `P-02`. Não invente `PRINC-NN` nem "mandamento".

## Princípios

### P-01 — A medida com procedência vence a afirmação

Todo número que o site publica traz de onde veio: fonte, método e n.

**Por quê:** a tese do site é "com medida atrás de cada decisão"; número sem procedência é afirmação, e o site existe para separar medida de afirmação.

**Proíbe:** publicar número sem procedência, como um valor digitado à mão sem fonte, método e n.

### P-02 — Nada simulado é publicado em silêncio

Dado de exemplo ou de teste não vira conteúdo do site; se um dado hipotético for publicado, ele sai rotulado como hipotético.

**Por quê:** o site existe para separar medida de afirmação; um dado de exemplo apresentado como real desfaz isso.

**Proíbe:** publicar dado de exemplo ou de teste como se fosse medida.

### P-03 — Nada que identifique o visitante é guardado ou enviado a terceiros sem que ele veja e aceite

A contagem de acessos é anônima e agregada; o site só sabe quem é o visitante quando ele se identifica, por exemplo ao escrever pelo contato.

**Por quê:** o site mede o próprio público sem transformar o visitante em alvo de rastreamento.

**Proíbe:** rastreador ou pixel de terceiros, cookie de identificação, guardar o endereço de rede do visitante e identificar pessoa ou empresa a partir dele.

### P-04 — O conteúdo e a navegação funcionam sem JavaScript; o script acrescenta

Todo conteúdo e toda navegação existem no HTML entregue. Uma peça interativa que mostra conteúdo pode existir só com script, desde que a página avise, a quem não roda script, o que não está sendo mostrado. Peça sem conteúdo próprio (brinquedo, efeito ao vivo) simplesmente não aparece sem script.

**Por quê:** o conteúdo precisa chegar a qualquer leitor, inclusive leitor de tela e agente.

**Proíbe:** conteúdo ou navegação que só existam com JavaScript, como um roteador no cliente; peça interativa que some sem aviso quando o script não roda.

### P-05 — O build falha em vez de publicar errado

O que não pode chegar ao visitante reprova o build; não vira aviso.

**Por quê:** o build é o único ponto por onde tudo passa antes de chegar ao visitante.

**Proíbe:** rebaixar a aviso o que deveria reprovar, como número sem procedência, imagem sem texto alternativo ou texto provisório.

### P-06 — A plataforma vem antes da biblioteca

O que o navegador ou o CSS já fazem não ganha dependência.

**Por quê:** cada dependência é uma peça a manter e a atualizar, e o site mede o próprio peso.

**Proíbe:** acrescentar biblioteca para o que a plataforma já resolve, como tooltip, ícones ou roteamento.

### P-07 — Nenhuma informação depende só de cor, de hover ou de movimento

Toda informação chega por mais de um canal: texto, forma ou posição, além da cor; foco de teclado, além do hover; estado final, além da animação.

**Por quê:** todo visitante precisa chegar à mesma informação, com qualquer visão, dispositivo ou preferência de movimento.

**Proíbe:** estado indicado só por cor, conteúdo que só aparece no hover e animação sem alternativa para movimento reduzido.

### P-08 — O design e a estrutura definidos neste plano só mudam por decisão do dono

**Por quê:** são a identidade do site (paleta, tipografia, casca, bento, régua e estrutura de rotas), e mudá-los tem de ser escolha, não efeito colateral de uma funcionalidade.

**Proíbe:** o executor alterar por conta própria a paleta, a tipografia, a casca, o bento, a régua ou a estrutura de rotas. Toda sugestão de mudança vai ao dono, dizendo que toca este princípio.

### P-09 — A execução segue do início ao fim, salvo ordem contrária do dono

**Por quê:** o plano fecha todas as variáveis; parar para perguntar o que já está decidido desperdiça o planejamento.

**Proíbe:** pausar para pedir uma escolha que está nos documentos. Quando a escolha não está nos documentos e o executor não consegue decidir sozinho, ele adia: marca a tarefa como bloqueada, registra a pergunta e segue pelas tarefas que não dependem dela. Só para e pergunta ao dono quando nada mais avança sem a resposta.

## Emenda

Um princípio muda **por decisão explícita registrada**, nunca por conveniência
de implementação. O procedimento:

1. A necessidade aparece numa tarefa concreta — não em abstrato.
2. Registra-se uma ADR com a mudança, o que ela passa a permitir, e o que se
   perde.
3. O princípio é reescrito aqui, com a data e a ADR citada.
4. O resumo em `CLAUDE.md` é atualizado na mesma passada, e os `REQ-NN` que se
   apoiavam no princípio antigo são relidos. Emenda que não propaga deixa duas
   versões do inviolável em circulação — e a que o agente lê é a do `CLAUDE.md`.

Princípio removido **fica no arquivo**, riscado, com a ADR que o removeu. O
histórico do que já foi inviolável é informação: ele explica decisões antigas
que de outro modo parecem arbitrárias.

## Perguntas em aberto

| # | Pergunta | Impacto se decidir errado | Quem decide | Resposta | Em |
|---|---|---|---|---|---|
| Q-01 | Quantos acessos, e em que janela contada a partir de cada divulgação do site, fazem o Critério de sucesso ser atingido? | Sem o número, o critério não reprova nada; com o número errado, o projeto é julgado pela régua errada | dono | Perdeu o objeto: o critério de sucesso deixou de contar acessos, que medem o alcance da divulgação e não o site, e passou a contar o contato de quem avalia perfis técnicos, com a janela de 30 dias | 13-10-2026 |

## Portão desta fase

Não avance para `01-requisitos.md` com item aberto.

**Fecha quando:** o problema e o critério de sucesso estão escritos, cada
princípio tem a razão junto e você consegue nomear uma decisão plausível que ele
proíbe — princípio que não proíbe nada é slogan —, e não sobra placeholder
`⟨…⟩` de preenchimento. Isso se confere lendo: uma busca por `⟨` acha também
esta frase, e ela não conta.

Portão conferido e fechado em 13-10-2026.
