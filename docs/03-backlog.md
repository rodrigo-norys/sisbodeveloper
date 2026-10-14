# Backlog — sisbodeveloper

> **Nomenclatura.** *Backlog*, *épico*, *tarefa* e *definition of done* são
> termos correntes — use-os. `T-NN` para tarefa; se o projeto trabalhar com
> histórias de usuário, `H-NN` e o formato "como ⟨papel⟩, quero ⟨ação⟩, para
> ⟨benefício⟩". Escolha um dos dois e não misture.

Este backlog usa `T-NN`. Datas em DD-MM-AAAA.

## Como fatiar

Uma tarefa é uma fatia **entregável e verificável**: ao fim dela, alguma coisa
funciona de ponta a ponta e algum teste prova isso. Fatia por camada técnica
("primeiro todo o banco, depois toda a API") não é fatia — nada funciona até a
última.

**Tamanho.** Se a tarefa não cabe numa sessão de trabalho, ela é duas. O sinal
mais confiável de tarefa grande demais é a seção "fora desta fatia" ficar vazia
— quem não consegue nomear o que está deixando de fora ainda não entendeu o
recorte.

**Ordem.** Primeiro o que reduz risco, não o que é fácil. O caminho crítico
passa pelo que você ainda não sabe se funciona — um *walking skeleton* que
atravessa o sistema inteiro de forma mínima vale mais que três telas prontas.

**Casos-limite obrigatórios.** Cada um no formato ⟨valor⟩ → ⟨resultado
esperado⟩. Sem o resultado, não dá para escrever o teste lendo só a tarefa.

**Classe de validação.**

- `automatica` — o teste prova; ninguém precisa abrir nada
- `visual` — só o olho humano confere: layout, cor, foco, texto na tela
- `plataforma` — só confere na máquina ou no ambiente de destino

Aqui, o `E1` monta as camadas de proteção — o portão de qualidade, as guardas, a estrutura do agente e as skills — e só então publica o repositório, com as guardas do GitHub como segunda camada. O conteúdo real (`E4`) depende de insumo do dono (`RS-04`), e o site só vai ao ar (`E5`) quando o build de publicação passa sem texto provisório.

<a id="resumo"></a>

## Resumo do backlog

As tarefas vêm na ordem de execução, que é a ordem deste documento e a ordem dos números.

| Épico | Tarefas, na ordem | ✅ | 🔎 | Total |
|---|---|---|---|---|
| E1 — Proteção antes de publicar | T-01 a T-10 | <!-- conta:tarefas-concluidas[E1] -->10<!-- /conta --> | <!-- conta:tarefas-em-validacao[E1] -->0<!-- /conta --> | <!-- conta:tarefas[E1] -->10<!-- /conta --> |
| E2 — Nada vai ao ar errado | T-11 a T-14 | <!-- conta:tarefas-concluidas[E2] -->0<!-- /conta --> | <!-- conta:tarefas-em-validacao[E2] -->0<!-- /conta --> | <!-- conta:tarefas[E2] -->4<!-- /conta --> |
| E3 — Páginas, compartilhamento e contato | T-15 a T-21 | <!-- conta:tarefas-concluidas[E3] -->0<!-- /conta --> | <!-- conta:tarefas-em-validacao[E3] -->0<!-- /conta --> | <!-- conta:tarefas[E3] -->7<!-- /conta --> |
| E4 — Conteúdo real | T-22 a T-24 | <!-- conta:tarefas-concluidas[E4] -->0<!-- /conta --> | <!-- conta:tarefas-em-validacao[E4] -->0<!-- /conta --> | <!-- conta:tarefas[E4] -->3<!-- /conta --> |
| E5 — No ar | T-25 a T-29 | <!-- conta:tarefas-concluidas[E5] -->0<!-- /conta --> | <!-- conta:tarefas-em-validacao[E5] -->0<!-- /conta --> | <!-- conta:tarefas[E5] -->5<!-- /conta --> |

<a id="indice"></a>

## Índice

O ✅ e o 🔎 de cada linha copiam o título da tarefa, que é a fonte; a cópia é conferida a partir da `T-08`.

**[Épico E1 — Proteção antes de publicar](#e1)**

- [T-01 — Renomear os identificadores para inglês, sem nome de uma letra](#t-01) ✅
- [T-02 — Montar o portão de qualidade](#t-02) ✅
- [T-03 — Reprovar nome de uma letra no portão](#t-03) ✅
- [T-04 — Adaptar as skills `/sugerir-commits` e `/sugerir-prs`](#t-04) ✅
- [T-05 — Validar o HTML gerado e os links internos](#t-05) ✅
- [T-06 — Medir o peso das páginas e travar o orçamento](#t-06) ✅
- [T-07 — Guardar o repositório contra dado sensível](#t-07) ✅
- [T-08 — Ligar o kit de documentação](#t-08) ✅
- [T-09 — Montar a estrutura de contexto do agente](#t-09) ✅
- [T-10 — Publicar o repositório com as guardas do GitHub](#t-10) ✅

**[Épico E2 — Nada vai ao ar errado](#e2)**

- [T-11 — Exigir fonte, método e n em cada medida](#t-11)
- [T-12 — Guardar todo o conteúdo contra texto provisório](#t-12)
- [T-13 — Provar o rascunho e o texto alternativo](#t-13)
- [T-14 — Corrigir o texto de interface com entidade escapada](#t-14)

**[Épico E3 — Páginas, compartilhamento e contato](#e3)**

- [T-15 — Provar a casca e a troca de idioma](#t-15)
- [T-16 — Provar as páginas de conteúdo](#t-16)
- [T-17 — Provar o conteúdo sem script e o contraste](#t-17)
- [T-18 — Oferecer o contato pelo LinkedIn](#t-18)
- [T-19 — Declarar a imagem de prévia e os metadados de compartilhamento](#t-19)
- [T-20 — Derivar o ícone e a cor da barra dos tokens](#t-20)
- [T-21 — Conferir teclado, foco e movimento reduzido no navegador](#t-21)

**[Épico E4 — Conteúdo real](#e4)**

- [T-22 — Escrever o perfil real](#t-22)
- [T-23 — Escrever o CronosComex real](#t-23)
- [T-24 — Escrever a nota real, ou marcá-la como rascunho](#t-24)

**[Épico E5 — No ar](#e5)**

- [T-25 — Ligar o Cloudflare Pages à main](#t-25)
- [T-26 — Apontar o domínio para o Pages](#t-26)
- [T-27 — Ligar a contagem anônima e conferir que não grava cookie](#t-27)
- [T-28 — Conferir o site no ar toda semana](#t-28)
- [T-29 — Medir o LCP no celular, no site publicado](#t-29)

---

<a id="e1"></a>

## Épico E1 — Proteção antes de publicar

Entrega as camadas que conferem cada mudança — o portão de qualidade, as guardas do repositório, a estrutura do agente e as skills de commit e de PR — e por último publica o repositório com as guardas do GitHub. Vem antes de tudo porque o repositório só é publicado com elas no lugar (`REQ-31`).

<a id="t-01"></a>

### T-01 — Renomear os identificadores para inglês, sem nome de uma letra ✅ CONCLUÍDA em 13-10-2026

**Cumpre.** `REQ-24`

**Contrato.** Entra o código do site com nomes em português e de uma letra. Sai o mesmo código com nomes em inglês, descritivos e curtos; o site gerado não muda, salvo os nomes de classe e de id trocados.

**Casos-limite obrigatórios.**
- `const t = useTranslations(locale)` → `const translate = useTranslations(locale)`
- valor exibido ao visitante usado como chave ("corpo", "medida e código") → fica como está
- endereço em português (`/pt-br/projetos/`) → fica como está (`REQ-01`)

**Classe de validação.** `automatica`

**Fora desta fatia.** A guarda que reprova nome de uma letra no portão: `T-03`. Os comentários, que ficam como estão.

**Definition of done.**
- [x] Critério de aceite da `REQ-24` verificado, à mão: busca por nome de uma letra no código sem resultado
- [x] Teste cobrindo cada caso-limite listado: site gerado comparado arquivo a arquivo com o de antes
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] Build com e sem o escape de texto provisório

**O que ensinou.** Feita por ordem do dono durante o planejamento. Prova em duas fases: sem tocar classe nem id, o site gerado saiu idêntico byte a byte ao de antes; trocando a classe `medida` por `metric` e os ids, só esses nomes diferiram. O build sem escape seguiu falhando pelo texto provisório do perfil, agora com a variável `ALLOW_PLACEHOLDER_TEXT`. Também trocados: o componente `Medida` por `Metrics`, as pastas `src/content/{notas,projetos,sobre}` por `{notes,projects,profile}` e os valores de status por `in-progress`, `delivered` e `archived`. O editor acusa `process` sem tipo em `src/lib/design-system.ts`: faltam os tipos do Node, e isso já existia (`T-02`).

[↑ Índice](#indice)

---

<a id="t-02"></a>

### T-02 — Montar o portão de qualidade ✅ CONCLUÍDA em 13-10-2026

**Cumpre.** `REQ-01`, `REQ-02`, `REQ-27`, `REQ-33`

**Contrato.** Entra o projeto sem portão. Sai `npm run verify`, o comando único que roda, nesta ordem, os testes do hook de dados sensíveis, a conferência de tipos sem erro, aviso nem dica, o lint, o build com o escape de texto provisório e os testes em `node:test`, e reprova no primeiro que falhar. Os primeiros testes provam a `REQ-01` e a `REQ-02`. Saem a dependência sem uso `@astrojs/markdown-satteri` e o `^` das versões; entram o `.node-version`, o teto em `engines` e o `.gitattributes` com fim de linha LF.

**Casos-limite obrigatórios.**
- página da tabela da `REQ-01` ausente do site gerado → o portão reprova, citando o endereço
- página com idioma do documento diferente do idioma do endereço → reprova
- `/` sem levar a `/pt-br/` → reprova
- dica de API obsoleta, como `z.string().url()` → reprova
- versão com `^` no `package.json` → reprova

**Classe de validação.** `automatica`

**Fora desta fatia.** O lint de nome: `T-03`. A validação do HTML: `T-05`. O orçamento de peso: `T-06`. O portão no CI: `T-10`.

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [x] Teste cobrindo cada caso-limite listado
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] `npm run verify` verde

**O que ensinou.** O portão é `npm run verify`, encadeando `test:hooks`, `check:types`, `build:verify` e `test`; a composição vive só em `scripts.verify` do `package.json`. A conferência de tipos entrou primeiro, por ordem do dono: `@astrojs/check`, `typescript` 6 — o 7 ainda não é aceito pelo verificador — e os tipos do Node, com versão exata, e o projeto zerado em erro, aviso e dica, com o site gerado idêntico antes e depois. A dica era `z.string().url()`, obsoleto no zod 4, trocado por `z.url()`. O vermelho do editor no `tsconfig.json` era o `.astro/types.d.ts` apagado numa limpeza de build, regenerado por `astro sync`. Os testes ficam em `tests/`, com `node:test` e um módulo de apoio; as páginas de projeto e de nota esperadas saem do conteúdo, lido pelo git — o rastreado mais o novo que o `.gitignore` não exclui —, e as de seção, da tabela da `REQ-01`. Provado por mutação: a dica de API obsoleta reprovou o `check:types`, e a página `/pt-br/sobre/` tirada do site gerado reprovou o teste da `REQ-01`. O `@astrojs/markdown-satteri` saiu do `package.json` e segue instalado como dependência do Astro. O `npm audit` aponta três vulnerabilidades altas em dependências indiretas do build (`R-05`). Pergunta ao dono, sem bloquear: o teste de versão exata e o do `.node-version` guardam uma decisão do `02` (§8, Versões), e não um requisito; sem requisito de origem, são testes órfãos (`04`, §2). Respondida no mesmo dia: viraram a `REQ-33`, e as mensagens dos testes passaram a citá-la.

[↑ Índice](#indice)

---

<a id="t-03"></a>

### T-03 — Reprovar nome de uma letra no portão ✅ CONCLUÍDA em 13-10-2026

**Cumpre.** `REQ-24`

**Contrato.** Entra o portão da `T-02`. Sai o lint com uma regra só — nome de uma letra só em variável ou parâmetro cujo alcance cabe em 10 linhas, e nunca em importação, tipo, propriedade, classe ou id —, sobre os arquivos `.ts`, `.mjs` e `.astro`, rodando dentro do `npm run verify`.

**Casos-limite obrigatórios.**
- `const t = 1` no nível do módulo → reprova, citando arquivo e linha
- `for (let i = 0; …)` num laço de até 10 linhas → passa; num de 11 ou mais → reprova
- `.map((x) => x)` dentro do template de um `.astro` → passa
- `const translate = …` → passa

**Classe de validação.** `automatica`

**Fora desta fatia.** Nome em português: fica com a revisão (`REQ-24`). Qualquer outra regra de lint (`02-arquitetura.md`, §8).

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [x] Teste cobrindo cada caso-limite listado, provado por mutação
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] `npm run verify` verde

**O que ensinou.** O lint é `npm run lint`, um teste em `node:test` (`tests/lint/`) que roda antes do build no `npm run verify`. Não entrou ESLint: o parser do próprio compilador do Astro, `@astrojs/compiler-rs`, devolve a árvore completa do `.astro` — o script do topo e as expressões do HTML, com posição em unidades UTF-16 —, e o `.ts` e o `.mjs` passam pelo mesmo parser como script do topo; o pacote, que o Astro já instalava, virou dependência de desenvolvimento declarada, com versão exata. A guarda confere declaração de variável, parâmetro, função, classe, tipo, parâmetro de tipo, importação, propriedade, e os valores de `class` e `id`; atributo de SVG como `d` fica de fora. O alcance de cada nome de uma letra se mede pelo bloco que o declara — o laço, a função ou o bloco —, e o nível do módulo sempre reprova. A fronteira de 10 linhas é a do guia de TypeScript do Google ("Descriptive names", google.github.io/styleguide/tsguide.html); o Code Review Comments do Go ("Variable Names", go.dev/wiki/CodeReviewComments) e o *Clean Code*, cap. 2, amarram o tamanho do nome ao alcance pelo mesmo critério, e a `id-length` do ESLint, com padrão de 2, está congelada e desligada na configuração da Airbnb. Docs vivas, lidas em 14-10-2026. Achou o que a busca à mão da `T-01` perdeu, porque não olhou importação nem tipo genérico: o `z` do zod, que passou a `zod`, e o `<C extends …>` de `src/lib/content.ts`, que passou a `Collection`, com o site gerado idêntico. Defeito da `T-02` achado aqui: a guarda de texto provisório do perfil roda também dentro do `astro check`, e só não disparou antes porque o Astro reaproveitou a validação do cache; num clone limpo, como no CI, o portão reprovaria. O `check:types` passou a rodar com o escape, como o build do portão (`02-arquitetura.md`, §8), provado com o cache apagado. Provado por mutação: `export const t = 1` em `src/lib/content.ts` reprovou citando a linha.

[↑ Índice](#indice)

---

<a id="t-04"></a>

### T-04 — Adaptar as skills `/sugerir-commits` e `/sugerir-prs` ✅ CONCLUÍDA em 14-10-2026

**Cumpre.** `REQ-31`

**Contrato.** Entram as duas skills do CronosComex, lidas no repositório público. Saem as duas adaptadas a este projeto: os escopos daqui, a branch `T-NN/<tipo>-<descrição>`, o `npm run verify` antes de apresentar o plano, as guardas de dado sensível daqui, um aceite só com os comandos literais à vista, mensagem em Conventional Commits e sem `Co-Authored-By`. A `/sugerir-commits` para nos commits locais; a `/sugerir-prs` faz o push e abre o PR, conferindo antes o repositório, o remoto e o `gh`, e para dizendo qual falta. Enquanto o repositório remoto estiver vazio, os commits caem na main local, que vira o histórico inicial, e a `/sugerir-prs` faz o primeiro push sem PR, criando a branch padrão. O que só valia lá — planilha, rotas de API, revisor de XML, histórias `H-NN` — sai. O primeiro uso da `/sugerir-commits` commita o trabalho pendente do plano e das tarefas já concluídas, e vale como a validação dela pelo dono.

**Casos-limite obrigatórios.**
- `HEAD` na main, com a main já no remoto → o plano começa pela branch nova
- `HEAD` na main, com o remoto vazio → os commits caem na main local, e o plano diz por quê
- remoto vazio → a `/sugerir-prs` propõe só o push da main, sem PR
- portão vermelho → nenhum plano de commit, e o motivo
- índice já preparado com arquivo fora do plano → o plano o aponta antes do aceite
- sem remoto configurado → a `/sugerir-prs` para e diz qual pré-requisito falta

**Classe de validação.** `visual`

**Fora desta fatia.** Os avisos do kit de documentação antes do plano: `T-08`, que os acrescenta às duas skills. A checagem de dado sensível chega sozinha, porque entra no `npm run verify` na `T-07`. O primeiro uso real da `/sugerir-prs`, que precisa do repositório publicado: `T-10`; até lá a tarefa fica `🔎 AGUARDA VALIDAÇÃO`.

**Entregue até aqui.** As duas skills em `.claude/skills/`, citadas no `CLAUDE.md`, com o `npm run verify` verde. Falta a validação: o dono invoca a `/sugerir-commits` para o trabalho pendente, e a `/sugerir-prs` é validada no primeiro PR, na `T-10`.

**Validação da `/sugerir-commits`, 14-10-2026.** Primeiro uso, invocado pelo dono, com o repositório remoto recriado privado e vazio: o plano saiu na `main` local, com o portão verde antes dele, a varredura de dado sensível limpa e o índice sem nada preparado; o dono aceitou, e os commits do histórico inicial entraram com o `--stat` de cada um batendo com o plano. Cada ponto foi conferido num worktree temporário, e não com `git stash`, que tiraria do disco os hooks ainda não commitados: os três primeiros com o build, porque o portão ainda não existia, e os três últimos com o `npm run verify`, num checkout limpo. Casos-limite ainda não exercidos: o portão vermelho, o índice preparado, e a `main` já no remoto. Em seguida, com o aceite do dono, a `/sugerir-prs` cumpriu o caso do remoto vazio: conferiu repositório, remoto e `gh`, varreu o histórico inteiro atrás de caminho de usuário e de variável de ambiente, e as imagens versionadas atrás de metadado, sem achado, e fez só o `git push -u origin main`, sem PR. Falta a validação dela num PR de verdade.

**Validação na reconstrução do repositório, 14-10-2026.** No repositório novo, ainda sem remoto, a `/sugerir-prs` mediu os pré-requisitos — repositório ok, `git config --get remote.origin.url` vazio, `gh` autenticado — e parou dizendo que falta o remoto, sem plano, push ou PR. Com o índice vazio, a `/sugerir-commits` rodou o portão, que saiu 1: o motor do kit não via o `03` e o `04`, ainda fora do git, e cada piso dele leu zero; a skill parou antes do plano, sem `git add` nem commit. O portão vermelho é também o primeiro critério de aceite da `REQ-31`. Com o índice preparado com o repositório inteiro — o motor do kit só vê a documentação que o git rastreia —, a `/sugerir-commits` rodou o portão, verde, apontou o índice preparado antes do aceite e começou o plano por `git read-tree --empty`, para cada commit levar só os seus caminhos; os commits do histórico inicial entraram com o `--stat` batendo com o plano, cada ponto conferido num worktree temporário, e a `/sugerir-prs`, com o remoto vazio, fez só o `git push -u origin main`. Duas lacunas do repositório sem commit apareceram nesse caminho: o portão só vê a documentação com o índice preparado, e os avisos `--nuas` e `--pares` não têm a `main` de base. Na `T-09`, com o `HEAD` na `main` e a `main` já no remoto, a `/sugerir-commits` decidiu a branch nova `T-09/feat-contexto-agente` e começou o plano por ela, sem commitar na `main`. Com isso, cada caso-limite da lista ficou conferido numa execução da skill, e a tarefa fecha.

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado — o do portão vermelho, na reconstrução
- [x] Cada caso-limite conferido numa execução da skill — ver a validação na reconstrução
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-05"></a>

### T-05 — Validar o HTML gerado e os links internos ✅ CONCLUÍDA em 14-10-2026

**Cumpre.** `REQ-26`

**Contrato.** Entra o site gerado. Sai o html-validate, com os presets `recommended` e `document`, sobre cada página, e um teste com o parse5 que confere todo link interno, todo `src` e toda âncora contra os arquivos do site gerado; o mesmo leitor de HTML fica disponível para os testes das outras tarefas. As fontes da pesquisa que escolheu as ferramentas vão para o bloco desta tarefa ao concluir.

**Casos-limite obrigatórios.**
- tag não fechada numa página → reprova, citando a página
- link para `/pt-br/inexistente/` → reprova, citando a página e o link
- `#ancora` sem o `id` no destino → reprova
- link externo → não conferido aqui (`T-28`)

**Classe de validação.** `automatica`

**Fora desta fatia.** Links externos: `T-28`. Os testes específicos de cada requisito de página: `E3`.

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [x] Teste cobrindo cada caso-limite listado, provado por mutação
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] `npm run verify` verde

**O que ensinou.** Entraram `html-validate` 11.16.2 e `parse5` 8.0.1, com versão exata; o leitor de HTML compartilhado é `tests/html.mjs`, e as guardas são `tests/html.test.mjs` e `tests/links.test.mjs`. Medido antes da guarda: os dois presets acusavam três regras e nenhum defeito de HTML para quem visita — `no-inline-style` (46, todas na página do sistema, largura das barras e cor das amostras calculadas no build), `require-sri` (13, o CSS do próprio domínio) e `doctype-style` (1, o redirecionamento da raiz que o Astro gera). A configuração as estreitou sem desligar a proteção: estilo inline só com `width` e `background-color`, SRI só para recurso de outro domínio, e o estilo do doctype fora; um teste prova que estilo inline com outra propriedade, e script ou CSS de outro domínio sem SRI, seguem reprovando. O SRI não vale para imagem, só para script e CSS. A guarda de links lê `href`, `src` e `srcset`, resolve contra o domínio — canônico e idiomas alternativos incluídos — e confere a âncora pelo `id` ou `name` do destino; o que sai do domínio fica para a `T-28`. A guarda de nomes da `T-03` pegou uma chave `a` no mapa de atributos, que é o nome da tag: as chaves passaram a texto entre aspas. Provado por mutação: tag quebrada em `/en/about/` reprovou com `close-order`; `/pt-br/sobre/` apagada reprovou nos links que a citam, inclusive o canônico; o `id` do conteúdo principal removido em `/pt-br/sistema/` reprovou a âncora do link de pular. Fontes da escolha: html-validate.org, presets (doc viva, lida em 13-10-2026); github.com/inikulin/parse5 (idem); o Lighthouse removeu os orçamentos na 12.0.0, de 22-04-2024, segundo o changelog dele, e por isso o peso por página fica com a `T-06`.

[↑ Índice](#indice)

---

<a id="t-06"></a>

### T-06 — Medir o peso das páginas e travar o orçamento ✅ CONCLUÍDA em 14-10-2026

**Cumpre.** `REQ-25`

**Contrato.** Entra o site gerado. Sai o orçamento de peso de cada página — HTML, CSS e fontes que ela carrega —, medido neste build e registrado no bloco desta tarefa, e um teste no portão que reprova a página acima dele e a página com script próprio.

**Casos-limite obrigatórios.**
- página que passa do orçamento → reprova, citando a página e o peso
- página com `<script>` próprio → reprova (`P-04`)
- página dentro do orçamento → passa

**Classe de validação.** `automatica`

**Fora desta fatia.** O LCP medido no site publicado: `T-29`. O script da contagem, a única exceção prevista: `T-27`.

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [x] Teste cobrindo cada caso-limite listado
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] `npm run verify` verde

**Decisão do dono, 14-10-2026.** O `02` §8 pedia o peso de cada página medido no primeiro build como teto, sem folga e sem regra para página nova. Com texto provisório no conteúdo, a primeira troca por texto definitivo já reprovaria. O dono recusou o teto exato — "limitar com exatidão o orçamento pode prejudicar o desenvolvimento do portfólio" — e aceitou o teto pela meta, pedindo "uma abertura na decisão para que haja facilidade em alterarmos algo nesse sentido, no futuro". O teto sai da meta da `REQ-25`, e não do tamanho de hoje, e as entradas da conta ficam todas em `tests/weight-budget.mjs`: mudar a regra é mudar uma entrada ali, à vista no diff do PR. O `02` §8 foi emendado na mesma passada.

**O que ensinou.** O teto é 190 000 B por página, sobre o que trafega: HTML e CSS comprimidos com gzip — maior que o brotli, que a Cloudflare também serve, e por isso erra para o lado de reprovar —, e fontes como estão, porque o woff2 já vem comprimido. A conta: a meta de 2,5 s, menos 4 idas e voltas de 150 ms para DNS, TCP, TLS e o pedido, dá 1,9 s; no perfil Slow 4G do teste móvel do Lighthouse, 1,6 Mbps, isso são 380 000 B, e o teto fica com a metade — a outra metade fica para renderizar, para a CPU quatro vezes mais lenta e para as imagens. Fonte do perfil: `docs/throttling.md` do Lighthouse (doc viva, lida em 14-10-2026). Medido neste build, 14 páginas: a mais pesada é `/pt-br/sistema/`, com 159 936 B (HTML 4 352, CSS 5 360, fontes 150 224); a mais leve com casca, `/en/notes/`, 157 401 B; a raiz, que só redireciona, 203 B. As fontes são 94% do peso: toda página declara as quatro, em `@font-face` inline, e a medida conta todas, que é o teto do que a página pode carregar. Texto e componente novos cabem nos cerca de 30 KB de folga; uma fonte nova inteira, de 15 a 54 KB pelos arquivos de hoje, chega perto do teto ou passa dele. Referência de mercado, não adotada: Alex Russell, "The Performance Inequality Gap, 2024" (infrequently.org, 31-01-2024), dá 1,3 MiB de HTML, CSS, imagens e fontes para site de marcação em 3 s, numa rede de 7,2 Mbps — folgado demais para o Slow 4G da `REQ-25`. Script: as páginas Sobre trazem `<script type="application/ld+json">`, o dado estruturado da `REQ-11`, que o padrão HTML trata como bloco de dados e o navegador não executa; a guarda, por busca de texto, reprova todo `<script` que não seja exatamente essa tag. Recurso que a página cita e o site gerado não tem também reprova, porque o peso dele não se mede. Provado por mutação: página inflada até 205 224 B reprovou, citando a página, o peso e as três parcelas; `<script src>` injetado reprovou, citando a página e a tag; o CSS apagado reprovou pelo piso de páginas com CSS medido.

[↑ Índice](#indice)

---

<a id="t-07"></a>

### T-07 — Guardar o repositório contra dado sensível ✅ CONCLUÍDA em 14-10-2026

**Cumpre.** `REQ-28`

**Contrato.** Entra o hook que bloqueia o agente, sem guarda para o commit feito por fora. Sai `verifica-dados-sensiveis.sh`, adaptado do CronosComex, sobre o que o git rastreia: arquivo de ambiente, artefato de build versionado, caminho absoluto com nome de usuário em código e configuração, imagem fora de `src/assets/` e `public/`, e metadado de autor, caminho ou GPS dentro de imagem versionada e do site gerado, lido sem dependência. Sai também a regressão dele, no molde do `test-guard.sh`, e os dois entram no `npm run verify`. A guarda do nome de usuário do CronosComex não entra: aqui ele é o perfil público do dono.

**Casos-limite obrigatórios.**
- `.env.local` rastreado → reprova
- `/home/fulano/` em `src/` → reprova
- JPEG com GPS em `src/assets/` → reprova
- `https://github.com/rodrigo-norys` num arquivo → passa
- lista de arquivos vazia → passa

**Classe de validação.** `automatica`

**Fora desta fatia.** O mesmo script no CI: `T-10`. Dado de cliente desenhado numa imagem: revisão (`REQ-28`).

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [x] Teste cobrindo cada caso-limite listado, provado por mutação
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] `npm run verify` verde

**O que ensinou.** Entraram `.github/scripts/verifica-dados-sensiveis.sh` e a regressão dele, `.github/scripts/test-verifica-dados-sensiveis.sh`, adaptados do CronosComex público (main `7c26a3e`, lido em 14-10-2026), na pasta de lá, porque é dela que a `T-10` roda o script no CI. No `npm run verify`, a regressão roda logo depois da do hook, e o verificador, depois do build, porque lê as imagens do site gerado; sem site gerado, ele reprova. Três leituras do contrato. Primeira: a lista é o que iria para um commit, o rastreado mais o novo que o `.gitignore` não exclui, o mesmo conjunto de `tests/support.mjs`; o portão roda antes do `git add` na `/sugerir-commits`, e só o rastreado deixaria passar o `.env.local` recém-criado, caso que a regressão prova num repositório descartável. Segunda: o metadado se acha por busca de bytes, sem dependência — a assinatura do bloco (EXIF, XMP, IPTC, texto e EXIF do PNG, EXIF e XMP do WebP, `<metadata>` do SVG) e o padrão de caminho de usuário dentro do binário, que pega também o comentário do JPEG; reprova qualquer bloco desses, e não só o que traz autor, caminho ou GPS, porque ler a tag exigiria parser, e erra para o lado de reprovar, como o `02` §8 pede para proibição. Terceira: "código e configuração" é tudo menos `docs/` e os `.md` da raiz, onde `/home/fulano/` é o exemplo do próprio plano. O padrão de caminho do Windows de lá, `[A-Za-z]:.Users.`, não pegava a barra dupla de uma string em JavaScript (`"C:\\Users\\…"`); passou a `[A-Za-z]:[\\/]+Users[\\/]`. Medido antes da guarda: a única imagem versionada e a única do site gerado, o `favicon.svg`, não têm bloco de metadado, e o caminho de usuário só aparece no `test-guard.sh`, isento como regressão, e no `01` e no `03`, que citam `/home/fulano/`. Provado por mutação, numa cópia do script: desligar cada verificação — ambiente, build, caminho, local da imagem, assinatura do metadado, o arquivo novo na lista, o `-z` do `git ls-files` e o site gerado ausente — reprovou a regressão, e tirar cada uma das duas isenções também; no repositório real, EXIF acrescentado ao `favicon.svg` do site gerado e `/home/fulano/` num arquivo novo, ainda não rastreado, reprovaram o verificador. Segredo escrito em texto continua com a varredura do GitHub, na `T-10`, e com o gitleaks no primeiro segredo (`02` §8).

[↑ Índice](#indice)

---

<a id="t-08"></a>

### T-08 — Ligar o kit de documentação ✅ CONCLUÍDA em 14-10-2026

**Cumpre.** `REQ-29`

**Contrato.** Entram os documentos do plano, com as regiões preenchidas à mão. Sai o motor do kit de documentação do `metodo-sdd`, copiado como está e com o commit de origem registrado aqui, a configuração do projeto — famílias `P`, `REQ`, `Q`, `RS`, `R`, `T`, `E` e `ADR`, os contadores do `03` e do `04`, inclusive o de tarefas em validação, o espelho das tarefas entre o `03` e o `04`, datas DD-MM-AAAA —, a regra por caminho da documentação, e o `--check` dentro do `npm run verify`, conferindo também o resumo e o índice do `03` contra os blocos das tarefas — a lista, a ordem, o título e a marca ✅ ou 🔎 de cada linha. Os avisos `--nuas` e `--pares` entram nas duas skills da `T-04`, antes do plano de commit e antes do PR. A varredura de adoção sai com zero resíduo de definição e cada número solto classificado à mão, registrada numa ADR com a data e o resíduo.

**Casos-limite obrigatórios.**
- Estado de um épico com contagem velha → `--check` reprova, e `--write` corrige
- tarefa `✅ CONCLUÍDA` no `03` só com linhas `aberto` no `04` → o espelho reprova
- ID citado sem definição → `--definicoes` o aponta
- número de estado novo fora de região, no diff → `--nuas` avisa, sem reprovar
- tarefa concluída sem o ✅ no índice, ou fora da ordem do documento → `--check` reprova

**Classe de validação.** `automatica`

**Fora desta fatia.** As skills em si: `T-04`.

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [x] Teste cobrindo cada caso-limite listado
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] `npm run verify` verde

**O que ensinou.** O motor entrou em `tools/contar-documentacao.mjs` idêntico ao do `metodo-sdd` em `a20d2c4` (`cmp` sai 0), e a configuração, em `tools/contar-documentacao.config.mjs`, partiu do modelo com quatro trocas: a marca da tarefa fica no título, e não numa linha própria — a âncora no título impede o contrato desta tarefa, que cita a marca entre crases, de fechá-la —; o contador `tarefas-em-validacao`, para a coluna 🔎 do resumo; a data DD-MM-AAAA no registro; e o stack no vocabulário de versão. O motor tem nome de uma letra só em alcance curto — laço, comparação do `sort`, callback de uma linha —, e passa no lint da `REQ-24` como está. A regra por caminho é `.claude/rules/documentacao.md`, a do kit com o portão e a guarda do índice. A guarda está em `tests/documentation.test.mjs`: o `inspect` e o `inspectStructure` do motor sobre o repositório, e uma guarda do projeto que confere o índice e o resumo do `03` contra os blocos — a lista, a ordem, o título, a marca, a âncora e a faixa de cada épico. Os casos-limite rodam num repositório git descartável, com a configuração do projeto e piso vazio, porque o piso é do repositório real. A varredura de adoção está na `ADR-0004`: nenhum ID sem definição, e os números soltos eram todos especificação. Os pisos foram lidos com 9999 e fixados bem abaixo. Provado por mutação no repositório real: contagem de épico trocada à mão reprovou com o valor escrito e o real, e o `--write` corrigiu; tarefa fechada no `03` sem a matriz reprovou no espelho, na contagem e no índice; o ✅ tirado de uma linha do índice reprovou; linha em branco na tabela da matriz reprovou como tabela solta. Os avisos `--nuas` e `--pares` entraram nas duas skills antes do aceite. Limite: o motor lê só o que o `git` rastreia, e o documento novo fica fora da conferência até o `git add`.

[↑ Índice](#indice)

---

<a id="t-09"></a>

### T-09 — Montar a estrutura de contexto do agente ✅ CONCLUÍDA em 14-10-2026

**Cumpre.** `REQ-30`

**Contrato.** Entra o `.claude/` fora do git, com dois hooks e a regressão do guard. Sai o `.claude/` versionado, com o registro de carga ignorado; o `registrar-instrucoes.sh` trocado pelo registro de carga do kit de contexto, gravando em `.claude/local/`; o aviso de alinhamento novo; o bloco de hooks do `settings.json` somado ao que existe; as duas guardas de contexto do kit no `npm run verify`, com o piso ajustado; o `guard-dados-sensiveis.sh` protegendo também `tests/` e com a regressão atualizada para `ALLOW_PLACEHOLDER_TEXT`; e cada peça citada no `CLAUDE.md`, em "Contexto do agente".

**Casos-limite obrigatórios.**
- hook novo sem citação no `CLAUDE.md` → a guarda reprova
- regra por caminho sem guarda nomeada → reprova
- `rm -rf tests` pelo agente → o hook bloqueia
- arquivo em `.claude/local/` → fora do git

**Classe de validação.** `automatica`

**Fora desta fatia.** As skills: `T-04`.

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [x] Teste cobrindo cada caso-limite listado
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] `npm run verify` verde

**O que ensinou.** Os dois hooks do kit de contexto do `metodo-sdd` (`a20d2c4`) entraram como estão (`cmp` sai 0): `registrar-carga.sh`, no lugar do `registrar-instrucoes.sh`, grava em `.claude/local/`, que o `.gitignore` exclui; `conferir-alinhamento.sh` avisa, sem bloquear, a peça de `.claude/` que o `CLAUDE.md` não cita, no `PostToolUse` de `Write`, `Edit` e `MultiEdit` e no `ConfigChange` das configurações e das skills. O bloco de hooks do `settings.json` somou os dois ao `PreToolUse` que já havia. As duas guardas de exemplo do kit entraram em `tests/` com o nome de lá, porque o aviso de alinhamento cita uma delas pelo nome, e com duas adaptações: funções exportadas, para os casos-limite rodarem sobre listas inventadas, e a leitura do que iria para um commit — o rastreado que existe mais o novo que o `.gitignore` não exclui, como `tests/support.mjs` —, e não só do rastreado, porque o portão roda antes do `git add`, e só o rastreado deixaria passar o hook novo sem citação e cobraria a do hook apagado. Pisos lidos na adoção: 7 peças em `.claude/` (1 regra, 2 skills, 4 arquivos de hook), piso 5; 1 regra, piso 0. O inventário da adoção não deixou resíduo: as guardas apontaram os dois hooks novos ainda sem citação, que o `CLAUDE.md` passou a citar, e a única regra por caminho já nomeava a guarda. O `guard-dados-sensiveis.sh` passou a proteger `tests/`, e também `tools/` e `.github/`: o comentário do próprio hook pede que diretório versionado criado depois dele seja acrescentado à lista, e os dois nasceram nas `T-07` e `T-08` sem entrar — a regressão ainda dava `rm -rf .github` como permitido. A regressão trocou `PERFIL_RASCUNHO` por `ALLOW_PLACEHOLDER_TEXT`. Provado por mutação: sem `tests`, `tools` e `.github` na lista, numa cópia do hook, quatro casos da regressão reprovaram; um hook falso em `.claude/hooks/`, sem citação, disparou o aviso de alinhamento e reprovou a guarda; o registro de carga gravou a linha em `.claude/local/`, fora do `git status`. Fica no disco a pasta `.claude/logs/` do registro antigo, ignorada por um `.gitignore` próprio; apagá-la é do dono, porque o hook bloqueia `rm -r` em `.claude/`.

[↑ Índice](#indice)

---

<a id="t-10"></a>

### T-10 — Publicar o repositório com as guardas do GitHub ✅ CONCLUÍDA em 14-10-2026

**Cumpre.** `REQ-31`

**Contrato.** Entra o repositório privado no GitHub (`RS-07`), com o histórico já empurrado, e o `E1` anterior concluído. Sai o repositório público — o ruleset, a varredura de segredo com bloqueio no push e o CodeQL padrão são gratuitos em repositório público, e o ruleset não existe para repositório privado no plano gratuito —, e com ele: o workflow que roda `npm run verify` em todo PR e na main, só com permissão de leitura, actions fixadas por SHA, credencial não persistida e a versão do `.node-version`; CodeQL na configuração padrão; revisão de dependências no PR; Dependabot semanal, agrupado e com espera, mais alertas e atualizações de segurança; varredura de segredo com bloqueio no push conferida; ruleset na main com PR obrigatório, `verify` obrigatório com a branch atualizada, sem exceção, e force push e deleção bloqueados. A execução escreve os arquivos; o dono faz os passos da conta com o roteiro que a execução entrega. O primeiro PR sai pela `/sugerir-prs`.

**Casos-limite obrigatórios.**
- PR com o portão vermelho → o merge é recusado
- push direto na main → recusado
- PR que acrescenta dependência com vulnerabilidade conhecida → a revisão de dependências reprova
- expressão de evento dentro de `run:` num workflow → o CodeQL aponta

**Classe de validação.** `plataforma`

**Fora desta fatia.** Ligar o Pages: `T-25`. A conferência semanal do site no ar: `T-28`.

**Definition of done.**
- [x] Critério de aceite de cada `REQ-NN` citado acima, verificado — os três da `REQ-31` que cabem ao GitHub, no repositório público; o da `/sugerir-commits`, na `T-04`
- [x] Cada caso-limite provado no repositório — ver o que a tarefa ensinou
- [x] Linha correspondente em `04-rastreabilidade.md` preenchida
- [x] Validado pelo dono

**Entregue até aqui.** Os dois workflows em `.github/workflows/` — `verify`, que roda `npm run verify`, e `dependency-review` — e o `.github/dependabot.yml`. O portão passou num clone raso, com HEAD destacado, sem identidade do `git` e com o cache do npm vazio, como no CI. Falta a parte da conta, pelo roteiro que a execução entrega: tornar o repositório público, ligar as guardas do GitHub e o ruleset. Depois vem a prova dos casos-limite no repositório público e a validação do dono. Três leituras do contrato. A primeira: o `CLAUDE.md` deixa a tarefa `plataforma` sem commit até a validação, mas esta só se valida no GitHub, e o contrato manda o primeiro PR. A segunda: o único check obrigatório do ruleset é o `verify`, como o contrato enumera, e a revisão de dependências reprova sem bloquear o merge. A terceira: a espera do Dependabot é de uma semana nos dois ecossistemas, e só as versões menores e de correção vão agrupadas, porque versão maior é tarefa própria (`R-03`). As actions estão fixadas na última versão que já tinha cumprido a mesma espera.

**O que ensinou.** A conta, pelo roteiro, em 14-10-2026: o dono tornou o repositório público e ligou os alertas e as atualizações de segurança do Dependabot, a varredura de segredo com bloqueio no push, o CodeQL na configuração padrão, a exigência de SHA nas actions e o ruleset `main` — PR obrigatório sem aprovação exigida, `verify` do GitHub Actions obrigatório em modo estrito, deleção e force push bloqueados, lista de exceção vazia —, tudo conferido pela API, com `current_user_can_bypass` em `never`; a pedido dele, também a remoção da branch no merge. Dois ajustes não pegaram na primeira passada, e só a releitura pela API os mostrou: a exigência de SHA não tinha sido salva, e o CodeQL, ligado com a main ainda sem workflow, detectou só JavaScript e TypeScript e não acrescentou a linguagem de Actions depois, que entrou pela edição da configuração. O PR #3, com os arquivos, passou o `verify` ainda privado, a revisão de dependências reprovou até a publicação, por indisponibilidade, e o merge dele foi o primeiro sob o ruleset. Os casos-limite, num PR descartável, o #4, fechado sem merge, e num push direto: a faixa `^4.17.20` do `lodash` reprovou o `verify` pela `REQ-33`, e o merge foi recusado pela regra da main; o push de um commit vazio na main saiu com `GH013`; o `lodash@4.17.20` reprovou a revisão de dependências, com duas vulnerabilidades altas e duas moderadas. A expressão de evento em `run:` mostrou o limite da suíte padrão do CodeQL: o título do PR num workflow de `pull_request` não deu resultado, porque a regra desse caso, `actions/code-injection/medium`, tem precisão média e fica na suíte estendida; a `actions/code-injection/critical`, da suíte padrão, só aponta job privilegiado, e o CodeQL não considera privilegiado o job de `pull_request` nem o que declara permissão só de leitura. Com a escolha do dono, a prova foi um workflow de `issue_comment` sem bloco de permissões, que nunca roda a partir de uma branch: o CodeQL apontou a injeção crítica e reprovou o check. Nos workflows deste repositório, todos com permissão só de leitura, a ausência de expressão de evento em `run:` (`02` §8) segue com a revisão, e não com o CodeQL. O Dependabot leu a espera e os grupos do arquivo e, na primeira rodada das actions, não abriu PR, porque a versão nova do `setup-node` ainda estava dentro da espera.

[↑ Índice](#indice)

---

<a id="e2"></a>

## Épico E2 — Nada vai ao ar errado

Entrega as guardas que fazem o build de publicação falhar em vez de publicar errado (`P-05`), e corrige o texto de interface. Vem antes das páginas porque muda o esquema do conteúdo que elas leem.

<a id="t-11"></a>

### T-11 — Exigir fonte, método e n em cada medida

**Cumpre.** `REQ-13`, `REQ-10`

**Contrato.** Entra o esquema de medida com rótulo, valor e link. Sai o esquema que exige fonte, método e n em cada medida, e o bloco de medida que os mostra na página ou a um link dela, na forma escolhida pelo dono entre alternativas em artefato. As medidas sem procedência de hoje saem do conteúdo até o dono trazer as reais (`E4`); a amostra tipográfica da página do sistema passa a mostrar números calculados pela própria página.

**Casos-limite obrigatórios.**
- medida sem o n → o build falha, citando o arquivo
- medida com fonte, método e n → publicada, com os três visíveis ou a um link
- número no texto corrido → não reprovado; fica com a revisão (`REQ-13`)
- amostra tipográfica com número digitado → o teste reprova

**Classe de validação.** `visual`

**Fora desta fatia.** As medidas reais: `T-22`, `T-23` e `T-24`.

**Definition of done.**
- [ ] Proposta de forma apresentada em artefato, com 2 ou 3 alternativas, e escolhida pelo dono
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-12"></a>

### T-12 — Guardar todo o conteúdo contra texto provisório

**Cumpre.** `REQ-14`

**Contrato.** Entram as duas guardas de hoje, só sobre o perfil. Sai uma guarda só, sobre os dados e o texto de projetos, notas e perfil, que reprova o build de produção com "RASCUNHO", "DRAFT", "FICTÍCIO" ou "PLACEHOLDER", em maiúsculas, citando o arquivo, salvo com `ALLOW_PLACEHOLDER_TEXT=1`.

**Casos-limite obrigatórios.**
- "RASCUNHO" no texto de uma nota → falha, citando o arquivo
- a mesma nota com `ALLOW_PLACEHOLDER_TEXT=1` → passa
- "draft", minúsculo, numa frase em inglês → passa
- "esqueleto" no texto → passa

**Classe de validação.** `automatica`

**Fora desta fatia.** Escrever o conteúdo real: `E4`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado, provado por mutação
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde

[↑ Índice](#indice)

---

<a id="t-13"></a>

### T-13 — Provar o rascunho e o texto alternativo

**Cumpre.** `REQ-15`, `REQ-16`

**Contrato.** Entra o comportamento que já existe: rascunho fora do build de produção e imagem sem texto alternativo reprovando o build. Sai o teste que o prova, sobre conteúdo de teste fora do conteúdo publicado.

**Casos-limite obrigatórios.**
- nota marcada como rascunho → ausente da listagem, da página inicial e do endereço próprio no build de produção
- a mesma nota → visível no ambiente de desenvolvimento
- capa de projeto sem texto alternativo → o build falha, citando o arquivo

**Classe de validação.** `automatica`

**Fora desta fatia.** Nenhuma mudança de comportamento: se o teste achar defeito, a correção entra nesta tarefa e é registrada aqui.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde

[↑ Índice](#indice)

---

<a id="t-14"></a>

### T-14 — Corrigir o texto de interface com entidade escapada

**Cumpre.** `REQ-21`

**Contrato.** Entra o título da página do sistema em inglês com `&rsquo;` escrito como texto. Sai o apóstrofo como caractere, e um teste que reprova entidade escapada duas vezes no site gerado.

**Casos-limite obrigatórios.**
- `/en/system/` → título e cabeçalho mostram "This site's system", com o apóstrofo
- `&amp;rsquo;` em qualquer página gerada → reprova

**Classe de validação.** `automatica`

**Fora desta fatia.** Revisão do resto dos textos da casca.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde

[↑ Índice](#indice)

---

<a id="e3"></a>

## Épico E3 — Páginas, compartilhamento e contato

Entrega a prova de que as páginas fazem o que o `01` pede, e o que falta para a divulgação trazer o visitante ao contato. As peças visuais vão ao dono em artefato.

<a id="t-15"></a>

### T-15 — Provar a casca e a troca de idioma

**Cumpre.** `REQ-03`, `REQ-04`, `REQ-05`

**Contrato.** Entra o site gerado. Sai o teste que prova a troca de idioma só onde há tradução, o idioma do conteúdo e as partes comuns de toda página.

**Casos-limite obrigatórios.**
- `/pt-br/projetos/cronoscomex/` → link "English" para `/en/projects/cronoscomex/`
- nota só em pt-br → nenhum link de troca
- projeto só em en → reprova
- `/en/notes/` sem nota → "No notes published yet."
- `/pt-br/projetos/cronoscomex/` → item Projetos marcado como atual; página inicial → nenhum

**Classe de validação.** `automatica`

**Fora desta fatia.** O link de contato: `T-18`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde

[↑ Índice](#indice)

---

<a id="t-16"></a>

### T-16 — Provar as páginas de conteúdo

**Cumpre.** `REQ-07`, `REQ-08`, `REQ-09`, `REQ-10`, `REQ-11`

**Contrato.** Entra o site gerado, com conteúdo de teste fora do conteúdo publicado onde o caso pedir volume. Sai o teste que prova o que cada página mostra e em que ordem.

**Casos-limite obrigatórios.**
- 5 projetos em destaque → 4 na página inicial, os mais recentes
- projeto sem endereço no ar → sem o link "No ar"
- projeto com 5 itens de stack → 3 na listagem, 4 na página
- duas notas → a mais recente primeiro
- valor de um token de cor mudado → valor e razão publicados mudam
- período da experiência → derivado das datas

**Classe de validação.** `automatica`

**Fora desta fatia.** O conteúdo real: `E4`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde

[↑ Índice](#indice)

---

<a id="t-17"></a>

### T-17 — Provar o conteúdo sem script e o contraste

**Cumpre.** `REQ-17`, `REQ-20`

**Contrato.** Entra o site gerado. Sai o teste que prova que o conteúdo e a navegação estão no HTML entregue e que todo par de contraste publicado atinge o mínimo do seu tipo.

**Casos-limite obrigatórios.**
- página cujo texto só apareceria por script → reprova
- par de contraste de texto comum abaixo de 4,5:1 → reprova
- par de componente de interface abaixo de 3:1 → reprova

**Classe de validação.** `automatica`

**Fora desta fatia.** Teclado, foco e movimento reduzido no navegador: `T-21`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado, provado por mutação
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde

[↑ Índice](#indice)

---

<a id="t-18"></a>

### T-18 — Oferecer o contato pelo LinkedIn

**Cumpre.** `REQ-12`

**Contrato.** Entra o rodapé com os links do perfil. Sai, em toda página, o link do LinkedIn identificado como o caminho de contato, nos dois idiomas, na forma escolhida pelo dono entre alternativas em artefato; o perfil deixa de publicar e-mail.

**Casos-limite obrigatórios.**
- página da `REQ-01` sem o link de contato → o teste reprova
- endereço de e-mail ou `mailto:` no site gerado → reprova
- perfil sem link do LinkedIn → o build falha

**Classe de validação.** `visual`

**Fora desta fatia.** O endereço real do perfil no LinkedIn: insumo do dono, `T-22`.

**Definition of done.**
- [ ] Proposta de forma apresentada em artefato, com 2 ou 3 alternativas, e escolhida pelo dono
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-19"></a>

### T-19 — Declarar a imagem de prévia e os metadados de compartilhamento

**Cumpre.** `REQ-06`

**Contrato.** Entram os metadados de hoje, sem imagem. Sai uma imagem de prévia para o site, na paleta, no tamanho que o LinkedIn recomenda, escolhida pelo dono entre alternativas em artefato, declarada em toda página com texto alternativo.

**Casos-limite obrigatórios.**
- página sem imagem de prévia declarada → o teste reprova
- imagem sem texto alternativo declarado → reprova
- endereço canônico diferente do domínio mais o caminho → reprova

**Classe de validação.** `visual`

**Fora desta fatia.** O cartão conferido no LinkedIn, com o site no ar: `T-26`.

**Definition of done.**
- [ ] Proposta de imagem apresentada em artefato, com 2 ou 3 alternativas, e escolhida pelo dono
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-20"></a>

### T-20 — Derivar o ícone e a cor da barra dos tokens

**Cumpre.** `REQ-22`

**Contrato.** Entram o ícone em outra paleta e a cor da barra digitada à parte. Sai a cor da barra igual à do token de fundo, e o ícone com cores de tokens da paleta, na forma escolhida pelo dono entre alternativas em artefato, os dois derivados dos tokens no build.

**Casos-limite obrigatórios.**
- valor do token de fundo mudado → a cor da barra muda, sem editar outro lugar
- cor do ícone fora dos tokens → o teste reprova

**Classe de validação.** `visual`

**Fora desta fatia.** Qualquer outra mudança de paleta (`P-08`).

**Definition of done.**
- [ ] Proposta de ícone apresentada em artefato, com 2 ou 3 alternativas, e escolhida pelo dono
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] `npm run verify` verde
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-21"></a>

### T-21 — Conferir teclado, foco e movimento reduzido no navegador

**Cumpre.** `REQ-20`

**Contrato.** Entra o site gerado, servido localmente. Sai a conferência, página a página, de que o teclado alcança todo link na ordem visual com foco visível, e de que nada anima sob preferência de movimento reduzido, com o achado registrado aqui.

**Casos-limite obrigatórios.**
- primeira tecla Tab → o link para pular ao conteúdo
- preferência de movimento reduzido ligada → o título em gradiente não anima
- elemento focável sem foco visível → defeito, corrigido nesta tarefa

**Classe de validação.** `visual`

**Fora desta fatia.** Contraste: `T-17`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Cada caso-limite conferido no navegador
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="e4"></a>

## Épico E4 — Conteúdo real

Entrega o texto e as medidas reais. Cada tarefa entra com o insumo do dono (`RS-04`); sem ele, fica ⏸ e a execução segue pelas outras (`P-09`).

<a id="t-22"></a>

### T-22 — Escrever o perfil real

**Cumpre.** `REQ-11`, `REQ-13`, `REQ-14`

**Contrato.** Entra o insumo do dono: cargo, frase de abertura, elegibilidade, texto, foco, trabalho selecionado, experiência, formação, ferramentas, links, currículo, medidas com fonte, método e n, e a decisão sobre a foto. Sai o perfil em pt-br e en sem texto provisório; a foto, se entrar, servida pelo próprio site.

**Casos-limite obrigatórios.**
- insumo ausente → ⏸, com a pergunta registrada no bloco desta tarefa
- medida do insumo sem o n → volta ao dono, e não é publicada
- foto apontando para o GitHub → o teste da `REQ-19` reprova

**Classe de validação.** `visual`

**Fora desta fatia.** O projeto e a nota: `T-23`, `T-24`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Build sem o escape de texto provisório passando para o perfil
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-23"></a>

### T-23 — Escrever o CronosComex real

**Cumpre.** `REQ-08`, `REQ-13`, `REQ-14`

**Contrato.** Entra o insumo do dono: o texto, a decisão — problema, restrição dominante e o que prova —, as funcionalidades em destaque e as medidas com fonte, método e n (`RS-05`). Sai a página do projeto em pt-br e en sem texto provisório.

**Casos-limite obrigatórios.**
- insumo ausente → ⏸, com a pergunta registrada no bloco desta tarefa
- número do CronosComex sem vir do dono → não entra (`RS-05`)
- medida sem o n → volta ao dono, e não é publicada

**Classe de validação.** `visual`

**Fora desta fatia.** Projeto novo: só quando o dono informar.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Build sem o escape de texto provisório passando para o projeto
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-24"></a>

### T-24 — Escrever a nota real, ou marcá-la como rascunho

**Cumpre.** `REQ-09`, `REQ-14`, `REQ-15`

**Contrato.** Entra a nota com texto provisório e o insumo do dono, se houver. Sai a nota escrita, sem texto provisório e com medidas com procedência, ou marcada como rascunho até o texto chegar.

**Casos-limite obrigatórios.**
- insumo presente → nota publicada, sem texto provisório
- insumo ausente → nota marcada como rascunho, e o build de publicação passa sem ela
- medida sem o n → volta ao dono, e não é publicada

**Classe de validação.** `visual`

**Fora desta fatia.** Nota nova além desta: só quando o dono a trouxer.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Teste cobrindo cada caso-limite listado
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Build sem o escape de texto provisório passando
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="e5"></a>

## Épico E5 — No ar

Entrega o site publicado no Pages e no domínio, a contagem, a conferência semanal e a medida de desempenho no ar. Vem por último porque o build de publicação só passa sem texto provisório.

<a id="t-25"></a>

### T-25 — Ligar o Cloudflare Pages à main

**Cumpre.** `REQ-14`

**Contrato.** Entra o repositório publicado com as guardas (`T-10`). Sai o projeto no Pages ligado à main, com a versão do `.node-version`, o build de publicação sem o escape de texto provisório, a prévia de cada PR e as branches `dependabot/*` fora das prévias. O dono faz os passos da conta com o roteiro que a execução entrega.

**Casos-limite obrigatórios.**
- merge na main com texto provisório no conteúdo → o build do Pages falha, e o site anterior continua no ar
- merge na main sem texto provisório → publicado no endereço `*.pages.dev` do projeto
- PR aberto → prévia num endereço próprio, fora da indexação
- branch `dependabot/*` → sem prévia

**Classe de validação.** `plataforma`

**Fora desta fatia.** O domínio próprio: `T-26`. A contagem: `T-27`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Cada caso-limite provado no Pages
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-26"></a>

### T-26 — Apontar o domínio para o Pages

**Cumpre.** `REQ-23`, `REQ-06`

**Contrato.** Entra o projeto do Pages publicando a main (`T-25`) e o build de publicação verde. Sai `sisbodeveloper.com.br` servindo o site por HTTPS, no lugar da aplicação que o domínio servia, com a ofuscação de e-mail da zona desligada, e o cartão do LinkedIn conferido. O dono faz a troca do registro e o ajuste da zona na conta da Cloudflare, com o roteiro que a execução entrega.

**Casos-limite obrigatórios.**
- `https://sisbodeveloper.com.br/` → `/pt-br/` deste site
- `http://sisbodeveloper.com.br/` → HTTPS
- `www.sisbodeveloper.com.br` → o domínio sem `www`
- link de uma página colado no LinkedIn → cartão com título, descrição e imagem

**Classe de validação.** `plataforma`

**Fora desta fatia.** Desligar o servidor que servia o domínio: é do dono, fora do plano.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Cada caso-limite conferido no domínio
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-27"></a>

### T-27 — Ligar a contagem anônima e conferir que não grava cookie

**Cumpre.** `REQ-18`, `REQ-19`

**Contrato.** Entra o site no domínio (`T-26`). Sai o Web Analytics ligado (`ADR-0003`), com a conferência, no navegador, de que nenhuma resposta do site nem do script grava cookie, e o roteiro de leitura do diagnóstico de uma divulgação.

**Casos-limite obrigatórios.**
- uma visita de teste → aparece no painel, por página, origem e dia
- cookie gravado pelo script ou pela resposta dele → ⏸, e ADR nova troca a contagem (`R-01`)
- script de terceiro além do da contagem no site gerado → o teste reprova

**Classe de validação.** `plataforma`

**Fora desta fatia.** Contar quem não executa JavaScript (`02-arquitetura.md`, §5).

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Cada caso-limite conferido no domínio
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-28"></a>

### T-28 — Conferir o site no ar toda semana

**Cumpre.** `REQ-32`

**Contrato.** Entra o site no domínio, com a contagem ligada (`T-27`). Sai um workflow agendado, fora do portão de merge, que confere os links externos e procura, em cada página publicada, script além do da contagem, e abre aviso ao dono quando acha algum dos dois.

**Casos-limite obrigatórios.**
- link de fonte que passa a responder "não encontrado" → aviso
- script de ofuscação de e-mail na página publicada → aviso
- só o script da contagem → nenhum aviso

**Classe de validação.** `plataforma`

**Fora desta fatia.** Links internos: `T-05`, no portão.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Cada caso-limite provado numa execução do workflow
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

<a id="t-29"></a>

### T-29 — Medir o LCP no celular, no site publicado

**Cumpre.** `REQ-25`

**Contrato.** Entra o site no domínio (`T-26`). Sai o LCP da página inicial no teste móvel do Lighthouse (PageSpeed Insights), registrado no bloco desta tarefa com a data; acima de 2,5 s, a causa é corrigida nesta tarefa.

**Casos-limite obrigatórios.**
- LCP até 2,5 s → registrado, e a tarefa fecha
- LCP acima de 2,5 s → causa achada e corrigida, e nova medida registrada

**Classe de validação.** `plataforma`

**Fora desta fatia.** O orçamento de peso no portão: `T-06`.

**Definition of done.**
- [ ] Critério de aceite de cada `REQ-NN` citado acima, verificado
- [ ] Medida registrada com fonte, método e data
- [ ] Linha correspondente em `04-rastreabilidade.md` preenchida
- [ ] Validado pelo dono

[↑ Índice](#indice)

---

## Ao concluir uma tarefa

Marque-a aqui com `✅ CONCLUÍDA em ⟨data⟩` e registre, **no bloco da própria
tarefa**, o que ela ensinou: número medido, defeito encontrado, decisão tomada.
É esse bloco que se consulta antes de reabrir decisão que pareça em aberto.

Atualize `04-rastreabilidade.md` na mesma passada. Rastreabilidade que se
atualiza "depois" não se atualiza. Na mesma passada, a marca da tarefa no índice e a contagem
do épico no resumo.

**Tarefa cancelada não some.** Ela fica com `❌ CANCELADA em ⟨data⟩` e o motivo,
e o número morre com ela. A matriz cita `T-NN`: número reaproveitado faz uma
linha antiga apontar para outro trabalho, em silêncio.

**Os outros estados**, porque a execução segue do início ao fim (`P-09`):

- `⏳ EM ANDAMENTO` — a tarefa começou; se o contexto acabar no meio, a retomada sabe onde parou.
- `🔎 AGUARDA VALIDAÇÃO` — tarefa `visual` ou `plataforma` terminada, sem commit, esperando o dono olhar; a execução segue pelas outras, e o ✅ só vem depois do olhar dele. O resumo do topo conta ✅ e 🔎 em separado.
- `⏸ BLOQUEADA` — apareceu pergunta que só o dono responde, ou falta insumo dele; a pergunta fica no bloco da tarefa, e a execução segue pelas que não dependem dela. A tarefa que usaria o que a bloqueada produz também fica ⏸.
- `🚫 NÃO EXECUTAR` — falta conta ou acesso que a tarefa exige (`RS-NN` com "Antes do início").

## Portão desta fase

Este é o portão que libera a implementação.

**Fecha quando:** todo requisito aparece em pelo menos uma tarefa da matriz,
nenhuma tarefa existe sem requisito de origem, toda tarefa declara **Cumpre.**,
**Classe de validação.** e **Fora desta fatia.** e tem pelo menos um caso-limite
no formato `valor → resultado esperado`, e não sobra placeholder `⟨…⟩` de
preenchimento no `03` nem no `04`, exceto a coluna Teste da §1 e a §4 do `04`,
que só se preenchem na execução. Isso se confere lendo: uma busca por `⟨` acha
também as linhas de referência que ficam — a nota de nomenclatura, a instrução
de formato dos casos-limite, as marcas de concluída e cancelada e esta frase —,
e elas não contam.

Portão conferido e fechado em 13-10-2026, com a aprovação do dono.
