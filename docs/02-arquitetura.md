# Arquitetura — sisbodeveloper

## 1. Contexto

Site estático de portfólio, bilíngue, escrito e mantido por uma pessoa só, Rodrigo Norys, por tempo indeterminado. Quem usa é quem avalia perfis técnicos, chegando sobretudo pelo link de uma divulgação no LinkedIn, muitas vezes pelo celular. Todo conteúdo nasce no repositório; o pior estrago possível é publicar algo falso ou provisório diante de quem avalia — nenhum dado de visitante é guardado, e não há risco a bem físico. O volume real é desconhecido até a primeira divulgação, e é por isso que a contagem existe (`REQ-18`).

## 2. Restrições

> Sai da Camada 1 do questionário. **Separada do contexto de propósito:** a §1 é
> narrativa e se lê de uma vez; isto é lista, e cada item precisa ser conferível
> sozinho. Restrição diluída em prosa não é auditável.

Aquilo que o desenho **não escolhe** — recebe pronto e precisa acomodar.

| # | Restrição | De onde vem | Negociável? | Como se confere | Antes do início |
|---|---|---|---|---|---|
| `RS-01` | O domínio é `sisbodeveloper.com.br`, com DNS na Cloudflare, em nome do dono; o registro, a conta da Cloudflare e o repositório no GitHub ficam em nome dele, sem acesso de outra pessoa | registro do domínio; decisão do dono, 13-10-2026 (`Q-09`) | não | os servidores de nome do domínio são da Cloudflare | não: só na publicação (`REQ-23`) |
| `RS-02` | O design e a estrutura do site atual se mantêm: paleta, tipografia, casca, bento, régua e rotas | decisão do dono, 26-09-2026 (`P-08`) | sim, com o dono, por proposta com artefato visual | comparação com o site no commit `84e2d74` | não |
| `RS-03` | Uma pessoa escreve, mantém e publica o site | decisão do dono, 13-10-2026 (`Q-09`) | não | — | não |
| `RS-04` | Os textos, as medidas com fonte, método e n, o currículo e a foto vêm do dono; a execução não os produz | `P-01`, `P-02` | não | cada tarefa de conteúdo cita o insumo recebido | não: a tarefa que depende fica bloqueada até o insumo chegar, e a execução segue pelas outras (`P-09`) |
| `RS-05` | O código do CronosComex é lido só pelo repositório público, e os números dele só vêm do dono | decisão do dono, 26-09-2026 | não | — | não |
| `RS-06` | O contato é pelo LinkedIn | decisão do dono, 13-10-2026 (`Q-02`) | sim, com o dono | — | não |
| `RS-07` | O repositório do site no GitHub é novo, em nome do dono, privado até a `T-10`, que o torna público; ligar o Pages ao repositório e proteger a main são passos na conta dele | decisão do dono, 27-09-2026; recriado privado a pedido dele, 14-10-2026 | não | o remoto do repositório local aponta para `rodrigo-norys/sisbodeveloper` | não |

A última coluna é a que trabalha: ela separa a dor que tem remédio por conversa
da que só tem remédio por código. Restrição marcada "não" e nunca testada
costuma ser hábito com aparência de lei.

**Dependências que não se controlam:**

| Dependência | Quem mantém | No dia em que parar | Troca sem reescrever? |
|---|---|---|---|
| Astro, com MDX e Tailwind | projetos de código aberto, licença MIT | o build segue na última versão; correção de segurança deixa de vir | não: as páginas são reescritas; o conteúdo, de frontmatter neutro, muda intacto (`ADR-0001`) |
| Node.js 22 | OpenJS Foundation | fim do suporte da versão; o build migra de versão | sim |
| Cloudflare Pages e Web Analytics | Cloudflare | o site sai do ar; a saída estática vai para qualquer hospedagem; o histórico da contagem se perde | sim para o site; não para o histórico (`ADR-0002`, `ADR-0003`) |
| As três famílias tipográficas | autores das fontes, licença OFL; arquivos versionados no repositório | nada: os arquivos ficam | sim |
| LinkedIn | LinkedIn | o caminho de contato e a divulgação somem juntos | não: o critério de sucesso depende dele (`RS-06`) |

## 3. Prioridade de qualidade

> Sai da Camada 2 do questionário. **É a decisão que mais molda o desenho**, e a
> que quase nunca é registrada — o que faz toda a §8 parecer arbitrária depois.

Vocabulário da **ISO/IEC 25010:2023**, nove características. A edição de 2011
está cancelada: se aparecer `Usability` ou `Portability`, é lista vencida —
hoje são `Interaction capability` e `Flexibility`, e `Safety` é característica
nova.

**As três que este sistema trata como prioritárias:**

| Característica | O que significa **neste** negócio | Medida |
|---|---|---|
| Adequação funcional | Nada vai ao ar errado: medida sem procedência, texto provisório, imagem sem texto alternativo, página faltando | O build de publicação falha em cada caso (`REQ-13`, `REQ-14`, `REQ-16`), e toda página da `REQ-01` existe no build |
| Capacidade de interação | Qualquer leitor chega ao conteúdo: quem avalia no celular, leitor de tela, teclado, agente de IA que não executa script | `REQ-17` e `REQ-20` passam: o mesmo texto com e sem JavaScript, e todo par de contraste no mínimo do seu tipo |
| Eficiência de desempenho | A página abre rápido no celular de quem vem pelo app do LinkedIn | LCP até 2,5 s no teste móvel do Lighthouse (PageSpeed Insights) da página inicial publicada — o limite "bom" das Core Web Vitals, em web.dev; no portão de qualidade, nenhum script próprio nas páginas, e cada página dentro do orçamento de peso (§8) |

**O que se sacrifica** — a metade que não pode faltar:

| Característica | Nível aceito | Por quê | Compromisso |
|---|---|---|---|
| Flexibilidade | O site fica preso ao gerador escolhido | O conteúdo já é neutro; trocar só a apresentação não tem requisito que peça | Trocar de gerador custa reescrever páginas e componentes. A flexibilidade exige a camada de apresentação reescrita |
| Confiabilidade | A disponibilidade do plano gratuito, sem garantia contratual | Uma queda custa uma visita perdida naquela hora, não dado perdido | O site e a contagem caem juntos. A confiabilidade exige um segundo hospedeiro, que não se paga |
| Segurança | O básico: HTTPS, nenhum segredo no repositório, dependências atualizadas, nenhum script de terceiro além do da contagem | Não há login, formulário nem dado guardado do visitante | O script da contagem é código de terceiro na página. A segurança exige confiar na Cloudflare |
| Manutenibilidade | Uma pessoa mantém, com o plano e as guardas do build como documentação; o lint confere só o nome (`REQ-24`) | Uma pessoa só, e a guarda entra quando há defeito que ela pegaria | Estilo de código inconsistente passa pelo portão. A manutenibilidade exige a revisão de quem edita |
| Compatibilidade | Navegadores atuais e o navegador embutido do app do LinkedIn | As cores usam `oklch`, de suporte amplo nos navegadores atuais | Navegador antigo sem `oklch` mostra o site sem as cores. A compatibilidade exige cor de reserva em cada token |

Safety foi descartada por ausência de referente: o site não toca bem físico nem dado de outra pessoa.

Priorizar sem declarar o sacrifício não é priorizar — é escolher favoritas e
deixar as outras num limbo de onde voltam como surpresa, no pior momento.

**Gatilho de revisão:** o site passar a ter formulário, login ou dado guardado do visitante, o que promove Segurança; ou uma segunda pessoa passar a manter o site, o que promove Manutenibilidade.

## 4. Objetivos

- Manter o site atual nos dois idiomas, com as páginas, a casca e os metadados (`REQ-01` a `REQ-11`).
- Trazer a divulgação ao site e o visitante ao contato: prévia de compartilhamento e link de contato (`REQ-06`, `REQ-12`).
- Fazer o build falhar em vez de publicar errado (`REQ-13` a `REQ-16`).
- Entregar tudo no HTML, acessível, sem rastrear o visitante, contando os acessos de forma anônima (`REQ-17` a `REQ-20`).
- Corrigir o que o inventário achou fora do lugar e publicar no domínio (`REQ-21` a `REQ-23`).

## 5. Não-objetivos

> **A seção mais pulada e a mais valiosa.** Ela é o que impede a arquitetura de
> crescer para acomodar um futuro que ninguém pediu.

- Servidor próprio, banco de dados ou API — **por quê:** todo conteúdo nasce no repositório, e nada pede escrita do visitante.
- Login, área restrita, comentário — **por quê:** o site não sabe quem é o visitante (`P-03`).
- Editor de conteúdo fora do repositório — **por quê:** uma pessoa escreve, no próprio repositório (`RS-03`).
- Imagem de prévia gerada por página no build — **por quê:** uma imagem estática, feita uma vez, basta ao cartão do LinkedIn, e gerar pede dependência (`P-06`).
- Contar quem não executa JavaScript — **por quê:** a contagem é diagnóstico; a perda é aceita (`ADR-0003`).
- Idioma além de pt-br e en — **por quê:** `REQ-01`.

## 6. Visão geral

O site é gerado estático pelo Astro a partir dos arquivos de conteúdo (`ADR-0001`). O dono edita no repositório; o portão de qualidade roda na máquina dele, pela skill `/sugerir-commits` antes do aceite de cada commit, e de novo no CI de cada PR; só o PR verde entra na main protegida; cada merge na main dispara o build de publicação no Cloudflare Pages, que falha se houver texto provisório (`ADR-0002`). O visitante recebe HTML pronto; o script da Cloudflare conta a visita (`ADR-0003`); o contato sai pelo link do LinkedIn.

```
dono ── edita ──► repositório (GitHub) ── PR ──► CI: portão de qualidade
                        │
                        │ merge na main protegida
                        ▼
              Cloudflare Pages: build de publicação, sem escape
                        │
                        ▼
visitante ◄── HTML estático em sisbodeveloper.com.br
   │                    │
   │                    └── script da contagem ──► Web Analytics ──► dono consulta
   └── link de contato ──► LinkedIn
```

## 7. Componentes

> **Nomenclatura.** Quando a estrutura for um padrão conhecido, **chame-o pelo
> nome** — *ports and adapters* (hexagonal), *repository*, *CQRS*, *event
> sourcing*, *sidecar*, *walking skeleton* — em vez de descrever o mecanismo em
> prosa. O nome do padrão carrega junto a literatura, os casos-limite já
> catalogados e as armadilhas conhecidas; a descrição em prosa não carrega nada
> e ainda obriga o leitor a reconhecer o padrão sozinho.
>
> Para os componentes do seu próprio domínio, use o vocabulário **do domínio**,
> não o da implementação: o nome que a pessoa que opera o sistema usaria.

A estrutura é a de um *static site generator* com *content collections*: o conteúdo, validado por esquema, é separado da apresentação.

| Componente | Responsabilidade | Nunca faz |
|---|---|---|
| Conteúdo | Projetos, notas e perfil, em arquivos com frontmatter neutro e esquema que rejeita entrada inválida | Nunca depende do gerador; nunca aceita medida sem fonte, método e n |
| Páginas e casca | Montam as rotas da `REQ-01` a partir do conteúdo e do texto da casca, nos dois idiomas | Nunca carregam conteúdo por script; nunca guardam texto editorial, que mora no conteúdo |
| Sistema de design | Guarda os tokens de cor e de tipografia num lugar só; a página do sistema, o ícone e a cor da barra derivam deles | Nunca tem segundo lugar com valor de cor |
| Guardas do build | Reprovam o build de publicação: medida sem procedência, texto provisório, imagem sem texto alternativo | Nunca rebaixam a aviso (`P-05`) |
| Testes do portão | Conferem o site gerado: páginas, troca de idioma, contato, entidade escapada, contraste, conteúdo sem script | Nunca conferem o site no ar; isso é da tarefa de publicação |
| Hospedagem e contagem | Servem o site estático e contam as visitas | Nunca gravam cookie de identificação |

A coluna **"nunca faz"** é o que transforma a tabela em contrato verificável.
Onde a linguagem permitir, transforme-a em regra de lint — invariante que só
existe em prosa é invariante que já foi violada.

## 8. Decisões

Cada decisão consequente tem uma ADR em [`adr/`](adr/). Uma decisão é
consequente quando **desfazê-la depois custa mais que uma tarefa**.

| ADR | Decisão | Reversibilidade | Status |
|---|---|---|---|
| [`0001`](adr/0001-manter-astro-com-saida-estatica.md) | O site continua no Astro, com saída estática | parcial | aceita |
| [`0002`](adr/0002-hospedar-no-cloudflare-pages.md) | O site é hospedado no Cloudflare Pages, publicado a partir da main | reversível | aceita |
| [`0003`](adr/0003-contar-acessos-com-cloudflare-web-analytics.md) | Os acessos são contados com o Cloudflare Web Analytics | reversível para frente, irreversível para trás: o histórico não migra | aceita |

A coluna de **reversibilidade** é o que protege seu tempo, e ela não é o mesmo
que "consequente". Consequente diz se merece ADR; reversibilidade diz **quanto
tempo a decisão merece antes de ser tomada**:

- **Irreversível** — desfazer exige reescrever o que já foi gravado, ou é
  impossível porque alguém de fora já depende. Gaste tempo desproporcional, e
  adie até o último momento em que esperar ainda é de graça.
- **Parcial** — a política se troca, mas o que aconteceu sob a política antiga
  não volta.
- **Reversível** — decida rápido, erre barato, siga. A maior parte das decisões
  que parecem arquiteturais está aqui.

Assimetria que aparece com frequência e merece atenção: cópia de segurança,
registro de autoria e observabilidade são **reversíveis para frente e
irreversíveis para trás** — acrescentá-las amanhã é barato, e não recupera nada
do período em que não existiram.

Decisão que não chega a esse patamar fica aqui mesmo, em uma linha, sem ADR
própria — ADR para tudo esvazia o formato.

Decisões de uma linha:

- **Portão de qualidade:** um comando único roda tipos, build e testes, na máquina de quem edita e no CI de todo PR; a main é protegida e só aceita PR com o portão verde. O comando fica na linha **Portão de qualidade:** do `CLAUDE.md`.
- **Escape de texto provisório:** o portão de qualidade roda com o escape enquanto houver texto provisório no conteúdo; o build de publicação no Pages roda sem ele, e por isso nada vai ao ar com texto provisório (`REQ-14`, `P-05`). O escape vale para todo o conteúdo, e não só para o perfil.
- **Testes:** `node:test` sobre o site gerado e sobre o repositório. Proibição — script, origem de terceiro, texto provisório — se confere por busca de texto, que erra para o lado de reprovar; extração — links, idiomas, metadados — passa pelo parse5, porque a busca de texto deixa passar link quebrado em silêncio (`P-05`). O html-validate valida o HTML gerado, sem rede e sem navegador (`REQ-26`). Fica para depois o axe-core com Playwright, com navegador: entra na troca de paleta ou de tema, ou antes de declarar conformidade WCAG 2.2 AA; até lá, o contraste se calcula dos tokens. Não entram Lighthouse CI, que perdeu os orçamentos de desempenho, nem regressão visual; as fontes vão para o bloco da `T-05`.
- **Tipos:** `astro check`, com o verificador e o TypeScript como dependências de desenvolvimento; reprova com erro, aviso ou dica (`REQ-27`).
- **Versões:** exatas no `package.json`, sem `^`; a versão do Node num `.node-version` só, lido pela máquina, pelo CI e pelo Pages, que por padrão usaria uma versão mais antiga que a exigida pelo html-validate; `.gitattributes` com fim de linha LF.
- **Kits do método:** o kit de documentação confere as regiões e os espelhos do plano no portão de qualidade e avisa antes do commit e no PR (`REQ-29`); o kit de contexto traz o registro de carga, o aviso de alinhamento e as guardas de contexto (`REQ-30`). O motor e os hooks são cópias dos do kit; a configuração e as regras são do projeto.
- **Skills:** `/sugerir-commits` roda o portão e os avisos, mostra o plano com os comandos literais e executa com um aceite do dono; `/sugerir-prs` faz o push e abre o PR, também com um aceite (`REQ-31`). Adaptadas das do CronosComex, lidas no repositório público.
- **GitHub:** `.claude/` versionado, salvo o registro de carga; workflow só em `pull_request` e `push`, com permissão só de leitura, actions fixadas por SHA, credencial não persistida e nenhuma expressão de evento dentro de `run:`; CodeQL na configuração padrão; revisão de dependências no PR; Dependabot semanal, agrupado e com espera; varredura de segredo com bloqueio no push; ruleset na main com PR obrigatório, `verify` obrigatório com a branch atualizada, e nenhuma exceção (`REQ-31`). Fica para depois: gitleaks, no primeiro segredo do projeto.
- **Conferência semanal:** um workflow agendado, fora do portão, confere os links externos e procura script nas páginas publicadas, porque o que a borda da Cloudflare injeta não aparece no site gerado (`REQ-32`).
- **Linter:** só a regra de nome mínimo, porque é a única com defeito medido, na `T-01`: uma letra só em variável ou parâmetro cujo alcance cabe em 10 linhas (`REQ-24`), e nunca em importação, tipo, propriedade, classe ou id; outra regra entra quando houver defeito medido que ela pegaria.
- **Orçamento de peso:** um teto por página, igual para todas, calculado da meta da `REQ-25` no perfil de rede do teste móvel do Lighthouse, sobre HTML e CSS comprimidos e fontes; acima dele, o portão de qualidade reprova. As entradas da conta ficam em `tests/weight-budget.mjs`, e mudar a regra é mudar uma entrada ali; o teto medido e a decisão estão no bloco da `T-06`. Substitui "o peso de cada página, medido no primeiro build do plano", que travava o texto definitivo.
- **Medida:** o esquema do conteúdo exige fonte, método e n em cada medida (`REQ-13`); a forma de mostrá-los é proposta de design, com artefato.
- **Imagem de prévia:** uma imagem estática para o site, no tamanho que o LinkedIn recomenda, aprovada por artefato (`REQ-06`).
- **Ícone e cor da barra:** derivados dos tokens no build (`REQ-22`).
- **Foto:** se entrar, é arquivo servido pelo próprio site, e não pelo GitHub (`REQ-19`).
- **Dependência sem uso:** `@astrojs/markdown-satteri` sai do `package.json`, porque o Astro já a traz.
- **Cloudflare:** a ofuscação de e-mail fica desligada na zona, porque injeta script (`P-04`); as branches `dependabot/*` não geram prévia, para poupar a cota de builds.

## 9. Fluxos principais

### Publicar uma mudança

1. O dono edita conteúdo ou código e roda o portão de qualidade.
2. Abre o PR; o CI roda o mesmo portão.
3. Com o portão verde, o PR entra na main protegida.
4. O Pages roda o build de publicação, sem o escape, e publica.

**Falha em cada passo:** no 1 e no 2, a reprovação cita a guarda ou o teste, e nada entra; no 3, a main recusa PR sem o verde; no 4, o build falha com texto provisório ou medida sem procedência, e o site anterior continua no ar.

### Visita vinda de uma divulgação

1. O post no LinkedIn mostra o cartão com título, descrição e imagem da página.
2. O visitante abre a página; recebe HTML pronto.
3. O script conta a visita, se o navegador o executar.
4. O visitante lê e, se quiser, segue o link de contato para o LinkedIn.

**Falha em cada passo:** no 1, sem a imagem, o cartão sai pobre, e a `REQ-06` tem teste para isso; no 2, com a Cloudflare fora, não há site; no 3, script bloqueado é visita não contada, aceita; no 4, sem o link, o critério de sucesso não tem por onde acontecer, e a `REQ-12` tem teste.

### Ler o diagnóstico de uma divulgação

1. O dono abre o Web Analytics na janela de 30 dias da divulgação.
2. Filtra a origem LinkedIn, e lê visitas e páginas abertas.

**Falha em cada passo:** depois de 7 dias o número é amostrado, e depois de seis meses some (`ADR-0003`); o diagnóstico é aproximado, e a leitura deve ser feita dentro da janela.

## 10. Riscos

| # | Risco | Probabilidade | Impacto | Mitigação | Gatilho de reavaliação |
|---|---|---|---|---|---|
| R-01 | O script do Web Analytics grava cookie, contra o `P-03` e a `REQ-18` | baixa: a Cloudflare diz que não coleta dado pessoal; uma análise de 2020 relatou cookie, e a documentação atual não fala de cookie | o `P-03` fica tensionado | a tarefa da contagem confere no navegador; achado o cookie, ADR nova troca a contagem | cookie achado na conferência |
| R-02 | O conteúdo real não chega, e o site não vai ao ar | média | o critério de sucesso não começa a contar | o build de publicação falha com texto provisório; as tarefas de conteúdo ficam bloqueadas e visíveis no `03` (`RS-04`) | o código pronto com tarefa de conteúdo bloqueada |
| R-03 | Versão maior do Astro quebra o build | média | trabalho de migração | versão fixada no lockfile; atualização é tarefa própria | nova versão maior do Astro |
| R-04 | A contagem amostrada leva a uma conclusão errada sobre a divulgação | baixa | a decisão sobre a próxima divulgação parte de número impreciso | ler dentro de 7 dias; tratar o número como diagnóstico, nunca como critério | uma decisão que dependa de número exato |
| R-05 | Vulnerabilidade conhecida numa dependência indireta do build | alta: o `npm audit` já aponta casos | o risco fica na máquina que gera o site, não no visitante, porque o site é estático | Dependabot e revisão de dependências no PR (§8); atualização do Astro como tarefa própria | alerta novo de severidade alta ou crítica |
| R-06 | A borda da Cloudflare injeta script que o site gerado não tem | média: a ofuscação de e-mail vem ligada por padrão | o `P-04` e a `REQ-19` quebram no ar, com o portão verde | ofuscação desligada; conferência semanal do site no ar (`REQ-32`) | aviso da conferência semanal |

A última coluna é o que faz a tabela sobreviver: risco sem gatilho de
reavaliação é lido uma vez e nunca mais.

## 11. Verificação contra a constituição

> Preencha **depois** das seções acima, relendo `00-constituicao.md` princípio a
> princípio. É aqui que o desenho encontra o que ele não pode revogar.

| Princípio | O desenho respeita? | Onde isso é visível |
|---|---|---|
| `P-01` | sim | o esquema exige fonte, método e n (§8, Medida); a página do sistema calcula os números no build |
| `P-02` | sim | o escape de texto provisório vale só no portão; o build de publicação roda sem ele (§8) |
| `P-03` | sim, com conferência pendente | sem cookie, sem endereço guardado, nenhum terceiro além da Cloudflare, que já recebe a requisição como hospedagem (`ADR-0003`); o cookie do script é conferido na tarefa (`R-01`) |
| `P-04` | sim | HTML estático, sem roteador no cliente (`ADR-0001`); o único script é o da contagem, que não mostra conteúdo |
| `P-05` | sim | guardas no esquema reprovam o build de publicação (§7, Guardas do build) |
| `P-06` | sim | testes sem dependência; imagem de prévia sem gerador; sem biblioteca de ícone (§8) |
| `P-07` | sim | os pares de contraste da página do sistema são testados no portão (§7, Testes do portão) |
| `P-08` | sim | `RS-02`: o design atual fica, e mudança vai ao dono com artefato |
| `P-09` | sim | `RS-04`: a tarefa sem insumo fica bloqueada, e a execução segue pelas outras |

Princípio **tensionado** tem três saídas, e só três:

1. **O desenho muda.** É a saída padrão, e a barata.
2. **O princípio é emendado**, pelo procedimento de `00-constituicao.md`: ADR,
   o que passa a ser permitido, o que se perde.
3. **O requisito que forçou a tensão é reaberto**, porque pediu algo que este
   projeto decidiu não fazer.

Não há quarta saída. Desenho que segue com princípio tensionado e sem ADR
transforma o inviolável em preferência: a constituição continua dizendo a coisa
certa enquanto o código faz outra, e ninguém percebe.

## 12. Perguntas em aberto

> Nunca omita. Se não houver, escreva "nenhuma".

| # | Pergunta | Impacto se decidir errado | Quem decide | Resposta | Em |
|---|---|---|---|---|---|
| Q-08 | Onde o site roda? | Define o custo, quem mantém o servidor e como os acessos são contados | dono | Cloudflare Pages, com a contagem pelo Web Analytics (`ADR-0002`, `ADR-0003`) | 13-10-2026 |
| Q-09 | O domínio, a conta da Cloudflare e o repositório ficam em nome do dono, sem acesso de outra pessoa? | Conta em nome de outro é projeto que pode sumir sem aviso | dono | Sim (`RS-01`) | 13-10-2026 |

## Portão desta fase

Não avance para `03-backlog.md` com item aberto.

**Fecha quando:** existe a seção de não-objetivos, cada decisão consequente tem
ADR com pelo menos uma alternativa rejeitada e o motivo, a §3 declara o que se
sacrifica e não só o que se prioriza, a verificação da §11 não
deixou princípio tensionado sem saída registrada, e não sobra placeholder
`⟨…⟩` de preenchimento no `02` nem nas ADRs. Isso se confere lendo: o
arquivo-modelo `adr/0000-template.md` não conta, porque é modelo, não ADR, e uma
busca por `⟨` acha também esta frase.

Portão conferido e fechado em 13-10-2026, com a aprovação do dono.
