# sisbodeveloper

Portfólio de Rodrigo Norys para quem avalia perfis técnicos: site estático bilíngue (pt-br e en), gerado pelo Astro e hospedado no Cloudflare Pages, sem servidor e sem JavaScript próprio no cliente.

**O plano está em `docs/`. Se você se pegar escolhendo entre alternativas, a
resposta provavelmente já existe em algum documento — procure antes de decidir.**

## Antes de escrever código

Leia, nesta ordem:

1. `docs/00-constituicao.md` — os princípios que nenhuma decisão revoga
2. `docs/01-requisitos.md` — `REQ-NN`, o que o sistema deve fazer
3. `docs/02-arquitetura.md` — como, e o que foi descartado
4. `docs/03-backlog.md` — a tarefa que você vai implementar

## Regras invioláveis

Resumo de `docs/00-constituicao.md`, que vence este resumo; a emenda de um princípio muda os dois na mesma passada.

1. **`P-01`** — Todo número publicado traz fonte, método e n.
2. **`P-02`** — Dado de exemplo ou de teste não vira conteúdo; dado hipotético só sai rotulado.
3. **`P-03`** — Nada que identifique o visitante é guardado ou enviado a terceiros sem que ele veja e aceite: nenhum rastreador, pixel ou cookie de identificação.
4. **`P-04`** — Conteúdo e navegação existem no HTML entregue; o script só acrescenta.
5. **`P-05`** — O que não pode chegar ao visitante reprova o build, e não vira aviso.
6. **`P-06`** — O que o navegador ou o CSS já fazem não ganha dependência.
7. **`P-07`** — Nenhuma informação depende só de cor, de hover ou de movimento.
8. **`P-08`** — Paleta, tipografia, casca, bento, régua e rotas só mudam por decisão do dono.
9. **`P-09`** — A execução segue do início ao fim; o que não está nos documentos e não se decide sozinho vira tarefa bloqueada, e a execução segue pelo resto.

## Nomenclatura

**Use o termo estabelecido sempre que existir um** — `ADR`, `REQ-NN`, EARS,
RFC 2119, design doc, rastreabilidade, não-objetivos. Não cunhe nome próprio
para conceito que a indústria já nomeou: quem lê depois teria de aprender o
vocabulário da casa antes de entender o projeto.

Onde não existir termo estabelecido, cunhe o seu, **defina uma vez** e use em
todo lugar. Identificadores (`REQ-NN`, `ADR-NNNN`, `T-NN`) são estáveis e nunca
reaproveitados. Tarefa é `T-NN`. Data é DD-MM-AAAA — dia, mês, ano —, na conversa e nos documentos.

## Escrita da documentação

- **Número de estado vai em região, ou não vai** (R2): `<!-- conta:NOME -->n<!-- /conta -->`;
  sem região, aponte onde o número vive.
- **Afirmação de regra cita o ID** que a define (R3).
- **Lista de itens com estado é gerada, ou vira ponteiro** para onde o conjunto vive (R5).
- **Definição não se apaga: muda de estado** (R4) — `[REMOVIDO]`, `❌ CANCELADA`, "substituída
  por".
- **Data só no registro** (R6) — bloco da tarefa fechada, ADR, resposta da `Q-NN`. No código, o
  comentário cita o ID, e não a data.

O porquê de cada regra, as definições e os papéis estão em `docs/metodo/documentacao-viva.md`.

## Contexto do agente

- **Este arquivo orienta, e não garante:** o que não pode falhar tem guarda no portão de
  qualidade, e a reprovação cita a regra.
- **Fica aqui o que nenhuma guarda impõe.** O que já existe em
  outro lugar vira ponteiro, e nada sai daqui sem o destino já conter.
- **Registro vai para o histórico, e não para cá:** data, pendência fechada, o que já falhou.

As peças do agente em `.claude/` — as skills em `.claude/skills/`, a regra por caminho em
`.claude/rules/`, os hooks registrados em `.claude/settings.json`:

- `/sugerir-commits` — roda o portão de qualidade e propõe os commits atômicos, com os comandos
  literais, para um aceite do dono; não faz push.
- `/sugerir-prs` — propõe os PRs e, com um aceite, faz o push e abre cada um; para se faltar
  repositório, remoto ou `gh`.
- `documentacao.md` — regra por caminho do contrato da documentação, R1–R7; a guarda que impõe o
  que não pode falhar é `tests/documentation.test.mjs`, sobre o motor de `tools/`.
- `guard-dados-sensiveis.sh` — hook antes de todo comando do shell: bloqueia `git add` em massa ou
  forçado, arquivo de ambiente no staging, escrita em `.claude/` e `rm -r` em diretório versionado.
- `test-guard.sh` — a regressão do hook acima.
- `registrar-instrucoes.sh` — hook do registro de carga: cada instrução que entra em contexto, em
  `.claude/logs/`, fora do git.

O porquê, a estrutura e os papéis estão em `docs/metodo/engenharia-de-contexto.md`.

## Estrutura

```
docs/             o plano — 00 a 04, adr/ e metodo/; nunca código
src/content/      projetos, notas e perfil, um arquivo por idioma; nunca texto da casca
src/pages/        as rotas, um arquivo fino por idioma; nunca conteúdo editorial
src/components/   as peças das páginas; nunca valor de cor fora dos tokens
src/layouts/      a casca comum a toda página
src/lib/          a consulta ao conteúdo e o cálculo do sistema de design; nunca número digitado
src/i18n/         as rotas traduzidas e o texto da casca nos dois idiomas
src/styles/       global.css, com os tokens em :root; o único lugar dos valores de cor
src/design/       as métricas de fonte medidas, com origem e data
src/assets/       fontes e imagens versionadas; nunca imagem com metadado de autor ou local
public/           os arquivos servidos como estão
tests/            os testes do portão de qualidade, em node:test, sobre o site gerado e o repositório
.claude/          hooks e configuração do agente; o registro de carga fica fora do git
.github/          o verificador de dado sensível e a regressão dele; o CI chega com a T-10
tools/            o motor do kit de documentação, cópia do metodo-sdd, e a configuração do projeto
```

## Stack

| Camada | Versão |
|---|---|
| Gerador: Astro, saída estática, com MDX e Tailwind | `package.json` |
| Build: Node.js | `.node-version`, dentro do `engines` do `package.json` |
| Hospedagem e contagem: Cloudflare Pages e Web Analytics | `ADR-0002`, `ADR-0003` |

Não troque versão sem registrar o motivo. Não acrescente dependência que o
plano não prevê.

## Protocolo de tarefa — obrigatório

**Antes da primeira linha de código de qualquer `T-NN`, escreva na conversa, e siga sem esperar
aceite (`P-09`):**

1. **O contrato**, copiado de `docs/03-backlog.md` — não reescrito.
2. **Os requisitos que a tarefa cumpre**, com o critério de aceite de cada um.
3. **Os casos-limite obrigatórios**, copiados.
4. **Fora desta fatia** — obrigatório. Impede a tarefa de crescer.
5. **Divergências** — nunca omita. Se não houver, escreva "nenhuma". **Se houver, a tarefa vira
   `⏸ BLOQUEADA`**, com a pergunta no bloco dela, e a execução segue pela próxima que não dependa
   dela; só pare quando nada mais avançar sem a resposta. Nunca implemente contornando.

Não é formalidade: é o momento em que um defeito do plano ainda custa uma
conversa em vez de um retrabalho.

**Proposta de design** — inserção ou alteração no visual ou na forma do site — vai ao dono em
artefato visual, com 2 ou 3 alternativas, e espera a escolha dele (`P-08`).

Os estados da tarefa — `⏳`, `🔎`, `⏸`, `🚫` — estão definidos em `docs/03-backlog.md`, "Ao
concluir uma tarefa".

## Ao concluir

- Marque a tarefa em `docs/03-backlog.md`, com o que ela ensinou
- Atualize `docs/04-rastreabilidade.md` na mesma passada
- Rode o portão de qualidade
- Tarefa de classe `visual` ou `plataforma` vira `🔎 AGUARDA VALIDAÇÃO` e fica sem commit até a
  validação do dono, e nada é empurrado para o remoto antes dela
- Commit só com o aceite do dono, sobre um plano com os comandos literais, pela
  `/sugerir-commits`; o PR, pela `/sugerir-prs`

## Comandos

```bash
astro dev --background                    # servidor local; ver "Development"
ALLOW_PLACEHOLDER_TEXT=1 npm run build    # build que tolera texto provisório
npm run build                             # build de publicação: falha com texto provisório
npm run check:types                       # tipos: reprova com erro, aviso ou dica
npm run lint                              # nome de uma letra fora de alcance curto reprova (REQ-24)
npm test                                  # os testes, sobre o site já gerado
node tools/contar-documentacao.mjs --write   # reescreve as regiões conta do plano (REQ-29)
```

**Portão de qualidade:** `npm run verify`

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.
