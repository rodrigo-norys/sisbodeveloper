# Rastreabilidade — sisbodeveloper

> **Nomenclatura.** Isto é uma *matriz de rastreabilidade*
> (*requirements traceability matrix*), termo corrente em engenharia de
> requisitos. Não a chame de "amarração", "de-para" nem "cobertura" —
> cobertura é outra coisa, e a confusão entre as duas é comum.

## 1. Requisito → tarefa → teste

| Requisito | Tarefa | Teste | Status |
|---|---|---|---|
| `REQ-01` | `T-02` | `tests/pages.test.mjs`::REQ-01: cada página da tabela existe no site gerado; ::REQ-01: cada página declara o idioma do endereço | verificado |
| `REQ-02` | `T-02` | `tests/pages.test.mjs`::REQ-02: a raiz leva a /pt-br/, fora da indexação | verificado |
| `REQ-03` | `T-15` | ⟨…⟩ | aberto |
| `REQ-04` | `T-15` | ⟨…⟩ | aberto |
| `REQ-05` | `T-15` | ⟨…⟩ | aberto |
| `REQ-06` | `T-19`, `T-26` | ⟨…⟩ | aberto |
| `REQ-07` | `T-16` | ⟨…⟩ | aberto |
| `REQ-08` | `T-16`, `T-23` | ⟨…⟩ | aberto |
| `REQ-09` | `T-16`, `T-24` | ⟨…⟩ | aberto |
| `REQ-10` | `T-11`, `T-16` | ⟨…⟩ | aberto |
| `REQ-11` | `T-16`, `T-22` | ⟨…⟩ | aberto |
| `REQ-12` | `T-18` | ⟨…⟩ | aberto |
| `REQ-13` | `T-11`, `T-22`, `T-23` | ⟨…⟩ | aberto |
| `REQ-14` | `T-12`, `T-22`, `T-23`, `T-24`, `T-25` | ⟨…⟩ | aberto |
| `REQ-15` | `T-13`, `T-24` | ⟨…⟩ | aberto |
| `REQ-16` | `T-13` | ⟨…⟩ | aberto |
| `REQ-17` | `T-17` | ⟨…⟩ | aberto |
| `REQ-18` | `T-27` | ⟨…⟩ | aberto |
| `REQ-19` | `T-27` | ⟨…⟩ | aberto |
| `REQ-20` | `T-17`, `T-21` | ⟨…⟩ | aberto |
| `REQ-21` | `T-14` | ⟨…⟩ | aberto |
| `REQ-22` | `T-20` | ⟨…⟩ | aberto |
| `REQ-23` | `T-26` | ⟨…⟩ | aberto |
| `REQ-24` | `T-01` | comparação do site gerado antes e depois, registrada na `T-01`; `tests/lint/naming.test.mjs`::REQ-24: nome de uma letra só em variável ou parâmetro de alcance curto | verificado |
| `REQ-24` | `T-03` | `tests/lint/naming.test.mjs`::REQ-24: nome de uma letra só em variável ou parâmetro de alcance curto | verificado |
| `REQ-25` | `T-06` | `tests/weight.test.mjs`::REQ-25: toda página fica dentro do orçamento de peso; ::REQ-25: nenhuma página traz script próprio | verificado |
| `REQ-25` | `T-29` | ⟨…⟩ | aberto |
| `REQ-26` | `T-05` | `tests/html.test.mjs`::REQ-26: toda página gerada é HTML válido; `tests/links.test.mjs`::REQ-26: todo link interno e toda âncora levam a um destino existente | verificado |
| `REQ-27` | `T-02` | `npm run check:types` (`astro check --minimumFailingSeverity hint`) | verificado |
| `REQ-28` | `T-07` | `.github/scripts/test-verifica-dados-sensiveis.sh` (a regressão); `.github/scripts/verifica-dados-sensiveis.sh` sobre o repositório e o site gerado, no `npm run verify` | verificado |
| `REQ-29` | `T-08` | `tests/documentation.test.mjs`::REQ-29: as regiões, os espelhos e as tabelas da documentação batem com a fonte; ::REQ-29: o índice e o resumo do 03 batem com os blocos das tarefas | verificado |
| `REQ-30` | `T-09` | `tests/contexto-cita-pecas.test.mjs`::REQ-30: cada peça está citada, no formato em que se cita; ::REQ-30: o registro de carga fica fora do git; `tests/regras-citam-guarda.test.mjs`::REQ-30: o cabeçalho de cada regra nomeia uma guarda, e cada caminho nomeado existe | verificado |
| `REQ-31` | `T-04` | as execuções da `/sugerir-commits` e da `/sugerir-prs` registradas na `T-04`, cada caso-limite numa execução da skill | verificado |
| `REQ-31` | `T-10` | `.github/workflows/verify.yml` e `.github/workflows/dependency-review.yml` em todo PR, sob o ruleset da main; as provas no repositório público registradas na `T-10`, no PR descartável e no push direto na main | verificado |
| `REQ-32` | `T-28` | ⟨…⟩ | aberto |
| `REQ-33` | `T-02` | `tests/package.test.mjs`::toda dependência tem versão exata; ::o Node em uso é o do .node-version | verificado |

**Status.** `aberto` = ninguém começou · `implementado` = código existe ·
`verificado` = teste passa **e** o critério de aceite foi conferido contra o
comportamento real, não só contra o teste. O status espelha o fechamento da tarefa no
`03`: linha em `implementado` ou `verificado` só cita tarefa `✅ CONCLUÍDA` lá, e tarefa
concluída lá tem ao menos uma linha aqui fora de `aberto`.

## 2. As duas patologias que esta matriz detecta

**Requisito órfão** — linha sem tarefa. Alguém pediu e ninguém vai construir.
Toda vez que uma tarefa fecha, olhe se sobrou linha vazia.

**Teste órfão** — teste que não aparece em coluna nenhuma. Ou existe requisito
não escrito (então escreva), ou o teste protege comportamento que ninguém
pediu (então ele impede refatoração de graça).

Vale automatizar a verificação: uma asserção na própria suíte que reprova
quando um `REQ-NN` do documento não aparece nesta matriz custa pouco e não
depende de disciplina.

## 3. Decisão → o que ela afeta

| ADR | Requisitos | Tarefas | Ainda válida? |
|---|---|---|---|
| `ADR-0001` | `REQ-01`, `REQ-10`, `REQ-13`, `REQ-14`, `REQ-15`, `REQ-16`, `REQ-17` | `T-02`, `T-11`, `T-12`, `T-13`, `T-17` | sim |
| `ADR-0002` | `REQ-14`, `REQ-18`, `REQ-23` | `T-25`, `T-26` | sim |
| `ADR-0003` | `REQ-17`, `REQ-18`, `REQ-19` | `T-27` | sim |
| `ADR-0004` | `REQ-29` | `T-08` | sim |

A última coluna se lê contra o **gatilho de reavaliação** que cada ADR declara.
É o que impede decisão antiga de virar permanente por inércia.

## 4. Cobertura

⟨Preencha ao fechar cada épico.⟩

- Requisitos obrigatórios: <!-- conta:requisitos-verificados[obrigatório] -->11<!-- /conta --> de <!-- conta:requisitos[obrigatório] -->33<!-- /conta --> verificados
- Requisitos sem tarefa: <!-- conta:requisitos-sem-tarefa -->nenhum<!-- /conta -->
- Testes sem requisito: ⟨lista, ou "nenhum"⟩
- ADRs com gatilho de reavaliação atingido: ⟨lista, ou "nenhuma"⟩

A última linha é o que faz a coluna "ainda válida?" da §3 ser lida mais de uma
vez. Gatilho que ninguém relê em data marcada é gatilho que não existe.
