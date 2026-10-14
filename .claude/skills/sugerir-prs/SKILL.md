---
name: sugerir-prs
description: Propõe como fatiar o trabalho não mesclado do sisbodeveloper em um ou mais Pull Requests e escreve título e corpo de cada um em seções markdown. Descrever um PR só é o caso N=1. Apresenta o plano, o corpo e os comandos literais, e aguarda um único aceite, que vale como permissão para o passo para fora — push da branch e `gh pr create`; nunca faz push nem abre PR sem ele.
argument-hint: '[branch-base]'
---

# Sugerir PRs

Decide a estrutura de entrega de uma pilha de commits — quantos PRs, o que vai em cada um, e a
descrição de cada — e, com um aceite, faz o push da branch e abre o PR. Os commits locais são da
`/sugerir-commits`; esta cuida do PR.

**Argumento opcional:** a branch base, `main` por padrão.

> **Esta skill publica.** Push e PR são irreversíveis na prática: o commit empurrado continua
> alcançável no GitHub mesmo depois de um force push. Planejar é livre; executar, não.

## Pré-requisitos — meça, não presuma

Em paralelo, antes de tudo:

```bash
git rev-parse --is-inside-work-tree   # repositório
git config --get remote.origin.url    # remoto
gh auth status                        # gh autenticado
```

Faltando qualquer um, **pare e diga qual**. Configurar remoto e autenticar o `gh` é do dono.

**Remoto vazio** — `git ls-remote origin` não devolve nada: não existe base para PR. O plano
propõe só `git push -u origin main`, que cria a branch padrão com o histórico inicial, com o mesmo
aceite e as mesmas conferências; os PRs começam no trabalho seguinte.

## Fluxo — um aceite só

1. **Eu sugiro** o plano: quantos PRs, o escopo de cada um, a branch, o título, o corpo em markdown
   — escrito num arquivo `.md` no scratchpad da sessão, que o `--body-file` exige — e os comandos
   literais, com o remoto e a base à vista.
2. **O dono aprova ou rejeita** o plano e o texto de cada PR. A aprovação vale como permissão.
3. **Eu executo**, por PR, em ordem de dependência: `git push -u origin <branch>` e
   `gh pr create --base <base> --title … --body-file …`.

**O aceite é a única barreira antes do push.** Nesta máquina, `git push` está liberado nas
permissões globais; `gh pr` pede confirmação, mas esse pedido chega depois do push, com a branch
já pública. Confira na hora: `jq '.permissions' ~/.claude/settings.json .claude/settings.json`.

## Portões inegociáveis

- **Sem aceite explícito, nem push nem PR**, e o plano só autoriza se mostrou os comandos, o
  remoto e a base.
- **Nada sensível no que vai para fora** (`REQ-28`): título, corpo e diff do PR sem arquivo de
  ambiente, registro do agente, caminho absoluto com nome de usuário, dado de cliente do
  CronosComex. Confira sobre `git diff <base>...HEAD`; achou, **pare**.
- **O portão de qualidade de novo**, sobre a branch inteira: `npm run verify`. Vermelho, não há
  PR.
- **Falhou no meio, pare e reporte.**

## Passos

1. **Levante o diff:** `git rev-parse --abbrev-ref HEAD`, `git log --oneline <base>..HEAD`,
   `git diff <base>...HEAD --stat` e `git diff <base>...HEAD`.
2. **Avisos do kit de documentação, sobre o PR inteiro** (`REQ-29`), depois de um `git fetch`:
   `node tools/contar-documentacao.mjs --nuas --base origin/<base>` e
   `node tools/contar-documentacao.mjs --pares --base origin/<base>`. Traga cada item com o
   veredito, como na `/sugerir-commits`; havendo estado atual apontado e não resolvido, **pare**:
   não há PR.
3. **Decida o número de PRs.** Uma tarefa do `docs/03-backlog.md`, um PR, costuma bastar. Separe
   só quando houver preocupações independentes misturadas; na dúvida, menos PRs.
4. **Para cada PR:** a branch (`T-NN/<tipo>-<descrição>`), o escopo, o título no padrão do
   `~/.claude/CLAUDE.md` — os escopos estão na `/sugerir-commits` —, e o corpo:

   ```markdown
   ## Resumo
   - <um marcador por mudança técnica relevante>

   ## Verificação
   - npm run verify → PASSOU, com as contagens que o comando devolveu nesta execução

   ## Risco e notas
   - <só quando houver: mudança de contrato, requisito afetado, pendência>
   ```

   As seções são ilustrativas: resumo sempre; verificação, risco e notas quando houver. Idioma
   pt-br. **Sem `🤖 Generated with Claude Code` nem assinatura equivalente** no corpo — regra do
   `~/.claude/CLAUDE.md`.
5. **Com o aceite**, execute por PR: o push e o `gh pr create --body-file` com caminho absoluto.
   Não mescle: o merge é no GitHub, com o `verify` obrigatório da main protegida.

> Antes de abrir o PR de uma tarefa, ela está fechada no `docs/03-backlog.md` e no
> `docs/04-rastreabilidade.md`, pelo "Ao concluir" do `CLAUDE.md`.
