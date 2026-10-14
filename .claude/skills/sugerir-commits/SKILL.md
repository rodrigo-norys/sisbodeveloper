---
name: sugerir-commits
description: Analisa a árvore de trabalho do sisbodeveloper (git status + diff), roda o portão de qualidade e devolve um plano de commits atômicos — a branch, quando couber, e cada commit com o `git add` de caminhos exatos e a mensagem pronta em Conventional Commits. Apresenta os comandos literais e aguarda um único aceite, que vale como permissão para executar; nunca commita sem ele. Push não entra aqui.
when_to_use: Quando o dono disser "sugere os commits", "monta os commits", "agrupa o que está pendente", "o que preciso commitar", ou invocar /sugerir-commits.
---

# Sugerir commits

Lê o estado do repositório, roda o portão de qualidade, decide em que branch os commits caem,
agrupa as mudanças em commits atômicos e devolve, para cada um, o `git add` e a mensagem.

## Fluxo — um aceite só

1. **Eu sugiro** o plano: a ação de branch, se houver, e cada commit com o `git add` de caminhos
   exatos e a mensagem inteira.
2. **O dono aprova ou rejeita.** A aprovação vale como permissão para executar.
3. **Eu executo** `git switch`, `git add` e `git commit`, na ordem do plano, sem perguntar de novo.

O que satisfaz a regra do `~/.claude/CLAUDE.md` — "você não irá commitar automaticamente" — é o
plano mostrar os comandos literais antes do aceite. Plano vago não autoriza nada, por mais "sim"
que receba.

**Não há segundo portão depois do aceite.** Nesta máquina, `git add` e `git commit` estão
liberados nas permissões globais, e o `.claude/settings.json` do projeto não as restringe; a régua
é o arquivo, e não esta linha: `jq '.permissions' ~/.claude/settings.json .claude/settings.json`.
O que protege é o plano literal antes do aceite, o hook `guard-dados-sensiveis.sh`, o portão de
qualidade antes do plano e, depois da `T-10`, a main protegida.

## Portões inegociáveis

- **Portão de qualidade antes do plano.** Rode `npm run verify` sobre a árvore como ela vai ficar
  depois do último commit. **Vermelho, não há plano**: pare e reporte o que reprovou. Informe no
  plano o resultado e as contagens que o próprio comando devolveu naquela execução — nunca as
  copie de outro documento.
- **Nada sensível no commit** (`REQ-28`): arquivo de ambiente (`.env*`, `.dev.vars`), o registro
  de carga do agente em `.claude/logs/` ou `.claude/local/`, `dist/`, `.astro/`, `node_modules/`,
  caminho absoluto com o nome de usuário do sistema, imagem com metadado de autor ou
  local. Achou, **pare e reporte**; não commite. O histórico do git não esquece, e o repositório
  vai ser público.
- **Nunca `git add .`, `git add -A` nem `--force`.** Só os caminhos exatos de cada commit. O hook
  bloqueia as três formas.
- **Índice sujo.** Antes de agrupar, leia `git status --porcelain` procurando marca na primeira
  coluna: o que já está preparado entra no próximo commit sem ser citado. O caso típico é `git rm`
  ou `git mv` feito durante a tarefa. O plano aponta o que está preparado antes do aceite.
- **Confira o `--stat` de cada commit contra o plano.** Número de arquivos que diverge é sintoma.
- **Falhou no meio, pare e reporte** — não contorne nem siga para o próximo commit.
- **Push não entra aqui.** Quem empurra a branch e abre o PR é a `/sugerir-prs`.

## A mensagem

O formato — `<tipo>(<escopo>): <descrição>`, os tipos válidos, quando o body é obrigatório, o
idioma pt-br e a proibição de `Co-Authored-By` e de assinatura — está em `~/.claude/CLAUDE.md`,
seção "Commits (Conventional Commits)". **Siga de lá**; esta skill não o repete.

O que é deste projeto são os escopos:

| Escopo | Cobre |
|---|---|
| `(frontend)` | `src/pages/`, `src/layouts/`, `src/components/`, `src/lib/`, `src/i18n/`, `src/styles/`, `src/design/`, `src/assets/fonts/`, `public/` |
| `(content)` | `src/content/` e as imagens de conteúdo em `src/assets/` |
| `(tests)` | `tests/` |
| `(config)` | `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.node-version`, `.gitattributes`, `.gitignore`, `src/content.config.ts` |
| `(docs)` | `docs/`, `CLAUDE.md`, `README.md` |
| `(claude)` | `.claude/` — skills, hooks, settings |
| `(ci)` | `.github/` |
| `(repo)` | a estrutura do repositório em si |

## Procedimento

1. **Levante o estado**, em paralelo, só leitura: `git branch --show-current`,
   `git status --porcelain`, `git diff`, `git diff --cached`, `git remote -v`, e o conteúdo dos
   arquivos novos que o agrupamento precisar entender.
2. **Rode o portão de qualidade** (`npm run verify`). Vermelho, pare aqui.
3. **Decida a branch** — abaixo.
4. **Agrupe em commits atômicos**, uma preocupação por commit, pelo escopo e pela tarefa do
   `docs/03-backlog.md` que a mudança cumpre. Um arquivo tocado por duas preocupações não se
   divide — `git add -p` é interativo e não roda aqui —: escolha o commit onde ele cabe melhor e
   diga por quê no plano.
5. **Ordene por dependência:** o que é base vem antes de quem o usa — a configuração antes do
   código que a exige, o código antes do teste que o confere, o documento do plano junto com a
   tarefa que o fecha. **Cada commit é um ponto verde**: a árvore dele passa no portão, para o
   `git bisect` funcionar. Quando o agrupamento não for óbvio, prove ponto a ponto, depois de cada
   commit: `git stash push -u -q -m resto && npm run verify; git stash pop -q`. O `;` antes do
   `pop` é de propósito: o portão reprovando não pode deixar a pilha guardada.
6. **Devolva cada commit** com o `git add` de caminhos exatos e a mensagem.
7. **Avisos do kit de documentação, antes de apresentar o plano** (`REQ-29`):

   ```bash
   node tools/contar-documentacao.mjs --nuas    # número de estado fora de região, nas linhas acrescentadas
   node tools/contar-documentacao.mjs --pares   # blocos que citam um ID cuja definição mudou
   ```

   Os dois leem o diff contra a `main`, inclusive o que não foi commitado, e não reprovam. Traga
   cada item no plano com o veredito — ainda diz a verdade? Estado atual vai para região `conta`
   ou vira ponteiro; medição leva fonte e data; especificação e registro ficam. Havendo estado
   atual apontado e não resolvido, **pare** antes do plano. A regra é `.claude/rules/documentacao.md`.

## Decisão de branch

- **Sem remoto, ou com o remoto vazio** — repositório recém-criado, sem nenhuma branch
  (`git ls-remote origin` não devolve nada) —, os commits caem na `main` local, que vira o
  histórico inicial; o plano diz isso. O primeiro push, que cria a branch padrão, é da
  `/sugerir-prs`.
- **Com a `main` no remoto, nunca commite direto nela.** Branch de tarefa: `T-NN/<tipo>-<descrição-curta>`,
  rastreável até o `docs/03-backlog.md` — por exemplo, `T-05/feat-validacao-html`. Trabalho fora de
  tarefa: `<tipo>/<escopo>-<descrição>`, como `chore/claude-hooks`.
- **Reaproveite a branch atual** se ela já for de trabalho e a preocupação bater; diga
  "permanece na branch atual (`<nome>`)".
- **Não mescle na `main` por conta própria.** Com remoto, o merge local mata o PR. A sequência
  termina fora daqui: branch → commits (esta skill para aqui) → `/sugerir-prs` → merge no GitHub.

## Formato de saída

A ação de branch primeiro, se houver, depois os commits na ordem, em blocos de shell copiáveis:

```bash
# branch — só se a atual não servir
git switch -c T-05/feat-validacao-html

# 1 — o teste que confere o HTML gerado
git add tests/html.test.mjs tests/support.mjs
git commit -m "feat(tests): valida o HTML gerado e os links internos"
```

Mensagem com body: vários `-m`, ou um here-doc, com a lista do body em `-`.

## Pré-requisito

Sem repositório git (`fatal: not a git repository`), pare e diga: `git init` é decisão do dono.

Depois de apresentar o plano, **pare e aguarde o aceite**. Com ele, execute na ordem — sem segunda
pergunta, sem `git add` amplo, sem push.
