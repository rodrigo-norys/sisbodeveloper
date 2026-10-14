# ADR-0004 — A documentação do plano é conferida pelo kit de documentação do método

- **Status:** aceita
- **Data:** 14-10-2026
- **Substitui:** nenhuma
- **Requisitos afetados:** `REQ-29`

## Contexto

O plano repete estado entre documentos: o resumo do `03` conta as tarefas de cada épico, o índice copia o título e a marca de cada tarefa, a matriz do `04` repete o fechamento de cada tarefa, e a cobertura do `04` conta os requisitos. Até aqui, cada número e cada cópia eram mantidos à mão, e nada falhava quando um deles envelhecia. O `metodo-sdd` traz um kit que prende o número à fonte e confere a cópia; a adoção dele num projeto existente pede uma varredura única, com o resíduo registrado.

## Decisão

Nós vamos conferir a documentação do plano com o motor do kit de documentação do `metodo-sdd`, copiado como está do commit `a20d2c4` para `tools/contar-documentacao.mjs`, com a configuração do projeto em `tools/contar-documentacao.config.mjs`, a regra por caminho em `.claude/rules/documentacao.md` e a guarda em `tests/documentation.test.mjs`, dentro do `npm run verify`.

A varredura de adoção, em 14-10-2026:

- `--definicoes`: 103 IDs citados, 0 sem definição e 0 definidos em mais de um lugar fora de espelho.
- `--nuas --tudo`: 11 números soltos, todos classificados à mão como especificação, e nenhum como estado atual — os critérios de aceite da `REQ-07`, da `REQ-08` e da `REQ-24`, os casos-limite da `T-16`, que os confere, e três frases de exemplo do texto de método (`00`, `01` e `03`). Nenhum virou região.
- `--check`: as 15 regiões do resumo do `03`, mantidas à mão, já batiam com a fonte; as 3 da cobertura do `04`, ainda com o marcador do esqueleto, foram preenchidas pelo `--write`.

## Alternativas rejeitadas

### Manter a documentação à mão, conferida por leitura

**Por que foi considerada:** zero dependência e nenhuma peça a manter.
**Por que foi rejeitada:** o dono decidiu, em 13-10-2026, adotar o kit (`REQ-29`); e no projeto de origem do kit 6 de 41 números de estado estavam velhos sem que nada falhasse.

### Um verificador próprio do projeto

**Por que foi considerada:** conferiria só o que este plano tem, com o formato dele.
**Por que foi rejeitada:** refaria o que o kit já entrega com efetividade medida — as guardas do `--check` pegaram 100% das mutações no projeto de origem, sem alarme nos controles — e afastaria o projeto do método, que atualiza o motor por cópia.

## Consequências

**Passa a ser possível:** o portão de qualidade reprova a contagem velha, a tarefa fechada no `03` sem a linha andar no `04`, a tabela solta, e o índice ou o resumo do `03` fora dos blocos das tarefas; as skills de commit e de PR apontam o número solto e o bloco que cita uma definição mudada antes do aceite.

**Passa a ser difícil ou impossível:** escrever número de estado em prosa sem que o aviso o aponte. O motor lê só o que o `git` rastreia: documento novo, antes do `git add`, fica fora da conferência até o commit.

**O que precisa mudar junto:** atualizar o motor é copiá-lo de novo do `metodo-sdd` e registrar o commit; contador novo entra na configuração com teste; os pisos se religam ao criar espelho ou região nova.

## Gatilho de reavaliação

Uma versão nova do motor no `metodo-sdd`, ou um falso positivo do `--check` que o projeto não consiga corrigir no documento.
