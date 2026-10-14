# Requisitos — sisbodeveloper

## Como escrever: EARS

Todo requisito segue um dos cinco padrões do **EARS** (Easy Approach to
Requirements Syntax, Mavin et al., IEEE RE'09). A palavra-chave inicial define
o padrão, e é ela que torna o requisito verificável sem interpretação.

| Padrão | Forma | Quando usar |
|---|---|---|
| **Ubíquo** | O sistema DEVE ⟨resposta⟩ | Vale sempre, sem gatilho nem condição |
| **Dirigido por evento** | QUANDO ⟨gatilho⟩, o sistema DEVE ⟨resposta⟩ | Algo acontece e o sistema reage |
| **Dirigido por estado** | ENQUANTO ⟨estado⟩, o sistema DEVE ⟨resposta⟩ | Vale durante um estado, e só nele |
| **Recurso opcional** | ONDE ⟨recurso presente⟩, o sistema DEVE ⟨resposta⟩ | Depende de configuração ou variante |
| **Comportamento indesejado** | SE ⟨condição⟩, ENTÃO o sistema DEVE ⟨resposta⟩ | Erro, exceção, entrada inválida |

Os verbos normativos vêm do **RFC 2119**:

- **DEVE** / **NÃO DEVE** — obrigação. Violação é defeito.
- **DEVERIA** — recomendação. Desvio exige justificativa registrada.
- **PODE** — permissão. Ausência não é defeito.

Use **DEVE** por padrão. `DEVERIA` num requisito costuma ser sinal de que a
decisão ainda não foi tomada — nesse caso o lugar dele é "Perguntas em aberto".

EARS é a sintaxe; a régua é a **ISO/IEC/IEEE 29148** (Requirements engineering),
que define o que um requisito precisa ser — *unambiguous*, *singular*,
*verifiable*, *traceable*, entre outros — e é de onde vem o nome da matriz de
`04-rastreabilidade.md`: *requirements traceability matrix*.

## Anti-padrões

Nenhum destes é requisito. Se aparecer, reescreva ou mova.

| Escrito assim | Problema | Vira |
|---|---|---|
| "O sistema deve ser rápido" | Não verificável | "QUANDO o operador solicitar ⟨X⟩, o sistema DEVE responder em até 300 ms no percentil 95" |
| "O sistema deve usar PostgreSQL" | É solução, não requisito | Vai para `02-arquitetura.md`, como ADR |
| "O sistema deve ser fácil de usar" | Não verificável | Requisito de tarefa concreta: passos, erros toleráveis, tempo |
| "O sistema deve tratar erros" | Qual erro, e como | Um requisito SE/ENTÃO por classe de erro |
| "O sistema não deve travar" | Ausência de comportamento não se testa | Requisito positivo de comportamento sob falha |

**O teste final:** se você não consegue escrever o caso de teste lendo só o
requisito, ele não está pronto.

## Glossário

> Só os termos **do domínio** que este projeto cunha, ou usa com sentido
> próprio. Termo da indústria não entra aqui: ele já tem literatura, e repetir a
> definição é dívida de manutenção sem retorno.

A regra de nomenclatura manda cunhar o termo uma vez e usá-lo em todo lugar.
Este é o "uma vez".

| Termo | Significa | Não confundir com |
|---|---|---|
| **texto provisório** | Trecho de página que avisa que não é o conteúdo final, como RASCUNHO, DRAFT, FICTÍCIO ou PLACEHOLDER | rascunho |
| **rascunho** | Projeto ou nota marcado para não ser publicado. É o sentido usual de "draft" em publicação | texto provisório |
| **medida** | Número apresentado como resultado de medição — num bloco de medida, na página do sistema ou numa amostra —, publicado com fonte, método e n (`P-01`) | número sem procedência |
| **número sem procedência** | Número exibido no site sem fonte, método e n | medida; dado hipotético, que o `P-02` permite publicar rotulado |
| **divulgação** | Publicação de Rodrigo Norys fora do site que leva o link dele, como um post no LinkedIn. Abre a janela de 30 dias do critério de sucesso | publicação do site, que é pô-lo no ar |
| **contato** | Mensagem de quem avalia perfis técnicos a Rodrigo Norys, pelo LinkedIn, citando o site ou algo que está nele | visita |
| **nota** | Texto autoral publicado no site, com data de publicação e tópicos | projeto: a página que apresenta um sistema construído |
| **página do sistema** | A página que publica o design do próprio site — tipografia, cor, contraste e peso das fontes —, com os números calculados do próprio site | o sistema construído num projeto |

**Gatilho de escrita:** a palavra entra aqui quando aparece pela segunda vez num
documento ou vira identificador de código. Duas grafias para a mesma coisa —
"usuário" num documento, "operador" no outro — é a primeira divergência a
aparecer e a última a ser vista, porque cada texto isolado continua coerente.

## Requisitos

> Numeração `REQ-NN`, estável. **Requisito nunca é renumerado** — tarefas,
> testes e ADRs o citam. Requisito descartado vira `REQ-NN` marcado
> `[REMOVIDO]`, com o motivo, e o número não é reaproveitado.

### REQ-01 — Páginas e endereços

**Requisito.** O site DEVE publicar cada página abaixo no endereço dela, com barra final:

| Página | pt-br | en |
|---|---|---|
| Inicial | `/pt-br/` | `/en/` |
| Projetos | `/pt-br/projetos/` | `/en/projects/` |
| Projeto | `/pt-br/projetos/<projeto>/` | `/en/projects/<projeto>/` |
| Notas | `/pt-br/notas/` | `/en/notes/` |
| Nota | `/pt-br/notas/<nota>/` | `/en/notes/<nota>/` |
| Sistema | `/pt-br/sistema/` | `/en/system/` |
| Sobre | `/pt-br/sobre/` | `/en/about/` |

**Critério de aceite.**
- Cada endereço da tabela responde com a página, e o idioma declarado no documento é o do endereço.
- `/pt-br/projetos/cronoscomex/` e `/en/projects/cronoscomex/` existem; `/pt-br/notas/contexto-que-nao-custa-token/` existe.

**Origem.** Decisão do dono, 26-09-2026: o design e a estrutura do site se mantêm, e o conteúdo das rotas é reaproveitado (`P-08`).

**Prioridade.** obrigatório

---

### REQ-02 — A raiz leva à versão em português

**Requisito.** QUANDO o visitante abrir `/`, o site DEVE levá-lo a `/pt-br/`.

**Critério de aceite.**
- `/` → `/pt-br/`.
- A página de `/` não é indexável e declara `/pt-br/` como endereço canônico.

**Origem.** Decisão do dono, 26-09-2026 (`P-08`).

**Prioridade.** obrigatório

---

### REQ-03 — Troca de idioma só onde há tradução

**Requisito.** ONDE a página tiver versão no outro idioma, o site DEVE oferecer o link para essa versão, com o nome do idioma escrito nele mesmo ("English", "Português"); SE a página não tiver tradução, ENTÃO o site NÃO DEVE oferecer a troca.

**Critério de aceite.**
- `/pt-br/projetos/cronoscomex/` → link "English" para `/en/projects/cronoscomex/`.
- Nota só em pt-br → nenhum link de troca.
- Nenhum link de troca leva a página inexistente.

**Origem.** Decisão do dono, 26-09-2026 (`P-08`).

**Prioridade.** obrigatório

---

### REQ-04 — Idioma do conteúdo

**Requisito.** Todo projeto e toda nota DEVEM existir em pt-br, e a versão em en PODE existir. ENQUANTO um idioma não tiver nota publicada, a listagem de notas desse idioma DEVE dizer que ainda não há nota publicada.

**Critério de aceite.**
- Nenhum projeto ou nota existe só em en.
- `/en/notes/` sem nota em en → "No notes published yet."

**Origem.** Decisão do dono, 13-10-2026 (`Q-05`).

**Prioridade.** obrigatório

---

### REQ-05 — Partes comuns a toda página

**Requisito.** O site DEVE mostrar em toda página: o link para pular ao conteúdo, como primeiro elemento focável; a marca "Rodrigo Norys", que leva à página inicial do idioma; a navegação principal, com Projetos, Notas, Sistema e Sobre nessa ordem, marcando o item da seção atual; e o rodapé, com a marca, a assinatura e os links do perfil.

**Critério de aceite.**
- Primeira tecla Tab → o link para pular ao conteúdo, que leva ao conteúdo principal.
- Em `/pt-br/projetos/cronoscomex/`, o item Projetos está marcado como atual; na página inicial, nenhum item está.
- Os links do rodapé são os do perfil (`REQ-11`), sem segundo lugar para editá-los.

**Origem.** Decisão do dono, 26-09-2026 (`P-08`).

**Prioridade.** obrigatório

---

### REQ-06 — Metadados e prévia de compartilhamento

**Requisito.** Toda página DEVE declarar título, descrição, endereço canônico em `https://sisbodeveloper.com.br`, o próprio idioma e o da tradução quando houver, e os dados da prévia de compartilhamento: título, descrição, endereço, tipo e imagem, com texto alternativo.

**Critério de aceite.**
- O endereço canônico é o domínio mais o caminho da página.
- Página com tradução declara os dois idiomas; página sem tradução declara só o próprio.
- O link de qualquer página, colado num post do LinkedIn, gera cartão com título, descrição e imagem.
- A imagem segue a paleta do site, e o desenho dela é aprovado pelo dono (`P-08`).

**Origem.** Decisão do dono, 26-09-2026 (`P-08`); a imagem, decisão do dono, 13-10-2026 (`Q-04`).

**Prioridade.** obrigatório

---

### REQ-07 — Página inicial

**Requisito.** A página inicial DEVE apresentar a tese do site, os caminhos para Projetos e para Sobre, até 4 projetos em destaque e até 3 notas recentes, cada grupo com o link para ver todos, em ordem de publicação da mais recente para a mais antiga.

**Critério de aceite.**
- 5 projetos em destaque publicados → 4 na página inicial, os mais recentes.
- Nenhuma nota no idioma → a seção de notas diz que ainda não há nota publicada.

**Origem.** Decisão do dono, 26-09-2026 (`P-08`).

**Prioridade.** obrigatório

---

### REQ-08 — Projetos

**Requisito.** A listagem de projetos DEVE mostrar cada projeto publicado com status, até 3 itens da stack, título com link, descrição, o link do repositório quando houver, a capa quando houver e até 3 medidas. A página do projeto DEVE apresentar status e até 4 itens da stack, título, descrição, os links "No ar" e "Repositório" quando houver, as medidas, a decisão — problema, restrição dominante e o que o projeto prova —, as funcionalidades em destaque e o texto do projeto.

**Critério de aceite.**
- Projeto sem endereço no ar → sem o link "No ar"; o mesmo para o repositório.
- Projeto com 5 itens de stack → 3 na listagem, 4 na página.

**Origem.** Decisão do dono, 26-09-2026 (`P-08`).

**Prioridade.** obrigatório

---

### REQ-09 — Notas

**Requisito.** A listagem de notas DEVE mostrar cada nota publicada com data, título com link, descrição e tópicos, da mais recente para a mais antiga. A página da nota DEVE apresentar título, descrição, a data de publicação, os tópicos, as medidas e o texto.

**Critério de aceite.**
- Duas notas → a de data mais recente vem primeiro.

**Origem.** Decisão do dono, 26-09-2026 (`P-08`).

**Prioridade.** obrigatório

---

### REQ-10 — Página do sistema calculada do próprio site

**Requisito.** A página do sistema DEVE publicar a tipografia — de cada família, o papel, uma amostra, a altura-x, a altura de maiúscula, o peso do arquivo e a licença —, as famílias descartadas e o número que descartou cada uma, os tokens de cor com o valor, os pares de contraste com a razão e o nível, e o orçamento de tipografia. Todo número dela DEVE ser calculado do próprio site no build, exceto a métrica interna da fonte, que traz fonte e data.

**Critério de aceite.**
- Mudar o valor de um token de cor → o valor e a razão de contraste publicados mudam, sem editar a página.
- A amostra tipográfica não exibe número sem procedência.

**Origem.** Decisão do dono, 26-09-2026 (`P-08`); `P-01`.

**Prioridade.** obrigatório

---

### REQ-11 — Página Sobre

**Requisito.** A página Sobre DEVE apresentar cargo, frase de abertura, a faixa de elegibilidade — cidade e país, fuso, sobreposição de horário, modelos de contratação e disponibilidade —, links e currículo, medidas, foco, texto, trabalho selecionado, experiência, formação, ferramentas e a data da última atualização. Ela DEVE declarar os mesmos dados como dado estruturado de perfil, derivado dos campos, e não escrito à parte.

**Critério de aceite.**
- O período de cada experiência é derivado das datas de início e fim, e não escrito por idioma.
- Mudar um link do perfil → muda na página, no dado estruturado e no rodapé (`REQ-05`).

**Origem.** Decisão do dono, 26-09-2026 (`P-08`).

**Prioridade.** obrigatório

---

### REQ-12 — Contato pelo LinkedIn

**Requisito.** O site DEVE oferecer, em toda página, o link para o perfil de Rodrigo Norys no LinkedIn identificado como o caminho de contato, e NÃO DEVE publicar endereço de e-mail nem formulário de contato.

**Critério de aceite.**
- Toda página da `REQ-01` → link para o LinkedIn com rótulo de contato, nos dois idiomas.
- Busca por endereço de e-mail e por formulário no site publicado → nada.

**Origem.** Critério de sucesso da constituição; decisão do dono, 13-10-2026 (`Q-02`).

**Prioridade.** obrigatório

---

### REQ-13 — Medida com procedência, ou o build falha

**Requisito.** Toda medida DEVE trazer fonte, método e n, na página ou a um link dela. SE uma medida não tiver fonte, método e n, ENTÃO o build de produção DEVE falhar, citando o arquivo.

**Critério de aceite.**
- Medida com fonte, método e n → publicada.
- Medida sem o n → build falha com o nome do arquivo.
- O número em texto corrido fica com a revisão do texto antes da publicação: nenhuma guarda o reconhece com segurança.

**Origem.** `P-01`, `P-05`.

**Prioridade.** obrigatório

---

### REQ-14 — Texto provisório faz o build falhar

**Requisito.** SE uma página contiver texto provisório, ENTÃO o build de produção DEVE falhar, citando o arquivo.

**Critério de aceite.**
- "RASCUNHO", "DRAFT", "FICTÍCIO" ou "PLACEHOLDER" nos dados ou no texto de um projeto, nota ou perfil → build falha com o nome do arquivo.
- Sem texto provisório → build passa.

**Origem.** `P-02`, `P-05`.

**Prioridade.** obrigatório

---

### REQ-15 — Rascunho não é publicado

**Requisito.** ENQUANTO um projeto ou uma nota for rascunho, o build de produção NÃO DEVE publicá-lo nem listá-lo; o ambiente de desenvolvimento PODE mostrá-lo.

**Critério de aceite.**
- Nota marcada como rascunho → ausente da listagem, da página inicial e do endereço próprio no build de produção.
- A mesma nota → visível no ambiente de desenvolvimento.

**Origem.** Decisão do dono, 26-09-2026, ao aceitar o termo "rascunho".

**Prioridade.** obrigatório

---

### REQ-16 — Imagem sem texto alternativo faz o build falhar

**Requisito.** SE uma imagem de conteúdo não tiver texto alternativo, ENTÃO o build DEVE falhar, citando o arquivo.

**Critério de aceite.**
- Capa de projeto sem texto alternativo → build falha com o nome do arquivo.

**Origem.** `P-05`, `P-07`.

**Prioridade.** obrigatório

---

### REQ-17 — Conteúdo e navegação sem JavaScript

**Requisito.** Todo conteúdo e toda navegação DEVEM existir no HTML entregue. SE uma peça interativa só mostrar conteúdo com script, ENTÃO a página DEVE avisar, a quem não roda script, o que não está sendo mostrado.

**Critério de aceite.**
- Com JavaScript desligado, toda página da `REQ-01` mostra o mesmo texto e os mesmos links que com ele ligado.

**Origem.** `P-04`.

**Prioridade.** obrigatório

---

### REQ-18 — Contagem de acessos anônima

**Requisito.** O site DEVE contar as visitas de forma anônima e agregada, por página, por origem e por dia, para consulta do dono, e NÃO DEVE guardar nem enviar a terceiros endereço de rede, cookie de identificação ou outro dado que identifique o visitante.

**Critério de aceite.**
- Para a janela de 30 dias de uma divulgação, o dono consulta quantas visitas vieram do LinkedIn e que páginas foram abertas.
- Nenhum registro da contagem guarda endereço de rede, e nenhuma resposta do site grava cookie.

**Origem.** Decisão do dono, 13-10-2026 (`Q-03`); `P-03`.

**Prioridade.** obrigatório

---

### REQ-19 — Nenhum rastreamento de terceiros

**Requisito.** O site NÃO DEVE carregar rastreador, pixel ou script de terceiros, nem gravar cookie de identificação.

**Critério de aceite.**
- Nenhuma página carrega script, imagem ou fonte de domínio de terceiros, exceto o que a contagem anônima da `REQ-18` usar, se a arquitetura a puser fora do domínio.
- Nenhuma resposta grava cookie.

**Origem.** `P-03`.

**Prioridade.** obrigatório

---

### REQ-20 — Acessibilidade

**Requisito.** O site DEVE dar ao texto comum contraste mínimo de 4,5:1 e ao componente de interface e ao texto grande, de 3:1 (WCAG 2.2, nível AA); DEVE mostrar foco visível em todo elemento focável; DEVE parar a animação sob preferência de movimento reduzido; e NÃO DEVE indicar estado só por cor.

**Critério de aceite.**
- Todo par de contraste publicado na página do sistema (`REQ-10`) atinge o mínimo do seu tipo.
- Navegação só por teclado → alcança todo link, na ordem visual, com foco visível.
- Preferência de movimento reduzido → o título não anima.

**Origem.** `P-07`.

**Prioridade.** obrigatório

---

### REQ-21 — Texto de interface sem código à mostra

**Requisito.** O site NÃO DEVE exibir ao visitante entidade HTML, identificador interno ou marcação como texto.

**Critério de aceite.**
- `/en/system/` → título e cabeçalho mostram "This site's system", com o apóstrofo.
- Busca por entidade HTML escapada duas vezes no site publicado → nada.

**Origem.** Defeito encontrado no inventário do site, 25-09-2026.

**Prioridade.** obrigatório

---

### REQ-22 — Ícone e cor da barra na paleta do site

**Requisito.** O ícone do site e a cor da barra do navegador DEVEM usar cores da paleta do site.

**Critério de aceite.**
- A cor da barra do navegador é a do token de fundo da página.
- Toda cor do ícone é a de um token da paleta.

**Origem.** Decisão do dono, 13-10-2026 (`Q-07`).

**Prioridade.** obrigatório

---

### REQ-23 — Publicação em sisbodeveloper.com.br

**Requisito.** O site DEVE ser publicado em `https://sisbodeveloper.com.br`, no lugar da aplicação que o domínio servia.

**Critério de aceite.**
- `https://sisbodeveloper.com.br/` → `/pt-br/` deste site, por HTTPS.

**Origem.** Decisão do dono, 26-09-2026.

**Prioridade.** obrigatório

---

### REQ-24 — Nomes do código em inglês; uma letra só em alcance curto

**Requisito.** O código do site DEVE nomear variável, constante, parâmetro, função, tipo, propriedade, classe e id em inglês, de forma descritiva e curta, e NÃO DEVE usar nome de uma letra, exceto em variável ou parâmetro cujo alcance — o laço, a função ou o bloco que o declara — cabe em 10 linhas.

**Critério de aceite.**
- `for (let i = 0; …)` num laço de até 10 linhas → passa.
- `items.sort((a, b) => a.index - b.index)` → passa.
- `i` num laço de 11 linhas ou mais → o portão de qualidade reprova, citando o arquivo, a linha e quantas linhas ele vive.
- `const t = useTranslations(locale)` no nível do módulo → reprova.
- `import { z } from 'astro/zod'` → reprova: importação, tipo, propriedade, classe e id nunca têm uma letra.
- `const translate = useTranslations(locale)` → passa.
- O nome em português fica com a revisão de quem edita: nenhuma guarda distingue a língua com segurança.

**Origem.** Decisão do dono, 13-10-2026, ao aprovar a renomeação do código. A fronteira pelo alcance segue o critério do mercado — o tamanho do nome acompanha o alcance, com 10 linhas de limite, como no guia de TypeScript do Google —, decisão do dono de 14-10-2026.

**Prioridade.** obrigatório

---

### REQ-25 — Página rápida no celular

**Requisito.** QUANDO a página inicial publicada for aberta num celular, o site DEVE exibir o maior elemento de conteúdo em até 2,5 s, e nenhuma página DEVE passar do orçamento de peso.

**Critério de aceite.**
- Teste móvel do Lighthouse (PageSpeed Insights) na página inicial publicada → LCP até 2,5 s, o limite "bom" das Core Web Vitals, em web.dev.
- Página acima do orçamento de peso → o portão de qualidade reprova, citando a página e o peso.

**Origem.** Prioridade de qualidade aprovada pelo dono, 13-10-2026 (`02-arquitetura.md`, §3).

**Prioridade.** obrigatório

---

### REQ-26 — HTML válido e links internos que resolvem

**Requisito.** O site DEVE entregar HTML válido segundo o padrão WHATWG, e todo link interno e toda âncora DEVEM levar a um destino existente; SE não levarem, ENTÃO o portão de qualidade DEVE reprovar.

**Critério de aceite.**
- Tag não fechada ou atributo inválido numa página → o portão reprova, citando a página.
- Link para página inexistente → reprova, citando a página e o link.
- Âncora `#id` sem o `id` no destino → reprova.

**Origem.** Decisão do dono, 13-10-2026, ao adotar o núcleo de testes da pesquisa.

**Prioridade.** obrigatório

---

### REQ-27 — Código sem diagnóstico

**Requisito.** O código do site NÃO DEVE ter erro, aviso nem dica do verificador de tipos; SE tiver, ENTÃO o portão de qualidade DEVE reprovar, citando o arquivo e a linha.

**Critério de aceite.**
- Global do Node sem tipo, como `process` sem os tipos do Node → reprova.
- API obsoleta, que o editor mostra riscada → reprova.
- Nenhum diagnóstico → passa.

**Origem.** Decisão do dono, 13-10-2026: os arquivos que o editor mostra em vermelho entram como teste e são corrigidos.

**Prioridade.** obrigatório

---

### REQ-28 — Nada sensível no repositório

**Requisito.** O repositório NÃO DEVE versionar segredo, arquivo de ambiente, artefato de build, caminho absoluto com o nome de usuário do sistema, nem imagem com metadado de autor, caminho ou localização; SE versionar, ENTÃO o portão de qualidade DEVE reprovar.

**Critério de aceite.**
- `.env.local` versionado → reprova.
- `/home/fulano/` num arquivo de código ou configuração → reprova.
- JPEG com coordenada de GPS em `src/assets/` → reprova.
- Endereço do perfil público no GitHub → passa.
- Dado de cliente desenhado numa imagem fica com a revisão: nenhuma guarda o reconhece.

**Origem.** Decisão do dono, 13-10-2026: o repositório só é publicado com as guardas no lugar.

**Prioridade.** obrigatório

---

### REQ-29 — Documentação do plano fiel à fonte

**Requisito.** Todo número de estado em região dos documentos do plano DEVE bater com a fonte, e o status de cada tarefa na matriz DEVE espelhar o fechamento dela no backlog; SE divergir, ENTÃO o portão de qualidade DEVE reprovar.

**Critério de aceite.**
- Estado de um épico com contagem velha → reprova, citando o comando que corrige.
- Tarefa `✅ CONCLUÍDA` no `03` só com linhas `aberto` no `04` → reprova.
- ID citado sem definição → o aviso o aponta antes do commit.

**Origem.** Decisão do dono, 13-10-2026, ao adotar o kit de documentação do método.

**Prioridade.** obrigatório

---

### REQ-30 — Estrutura do agente versionada e coerente

**Requisito.** Toda peça do agente em `.claude/` — regra por caminho, skill, hook, subagente — DEVE estar versionada e citada no `CLAUDE.md`, e toda regra por caminho DEVE nomear a guarda que impõe o que ela pede; SE não estiver, ENTÃO o portão de qualidade DEVE reprovar.

**Critério de aceite.**
- Skill nova sem citação no `CLAUDE.md` → reprova.
- Regra por caminho sem guarda nomeada → reprova.
- Registro de carga do agente → fora do git.

**Origem.** Decisão do dono, 13-10-2026, ao adotar o kit de contexto do método.

**Prioridade.** obrigatório

---

### REQ-31 — Mudança conferida antes do commit e no PR

**Requisito.** QUANDO uma mudança for proposta para commit, o portão de qualidade DEVE rodar antes do aceite do dono; e a main DEVE aceitar só PR com o portão verde no CI, sem exceção.

**Critério de aceite.**
- `/sugerir-commits` com o portão vermelho → nenhum plano de commit.
- PR com o portão vermelho → merge recusado.
- Push direto na main → recusado.
- PR que introduz dependência com vulnerabilidade conhecida → reprovado.

**Origem.** Decisão do dono, 13-10-2026: a skill antes do commit é a primeira camada, e as guardas do GitHub, a segunda.

**Prioridade.** obrigatório

---

### REQ-32 — O site no ar conferido toda semana

**Requisito.** O site publicado DEVE ser conferido toda semana; SE uma página trouxer script além do da contagem, ou um link externo estiver quebrado, ENTÃO a conferência DEVE abrir aviso ao dono.

**Critério de aceite.**
- Script injetado pela borda da Cloudflare numa página → aviso.
- Link de fonte quebrado → aviso.

**Origem.** Decisão do dono, 13-10-2026, ao adotar o núcleo de guardas da pesquisa: o que a borda injeta não aparece no site gerado.

**Prioridade.** obrigatório

---

### REQ-33 — Build reproduzível

**Requisito.** O projeto DEVE fixar a versão exata de cada dependência e a mesma versão do Node na máquina, no CI e no Pages; SE uma dependência usar faixa de versão, ou o Node em uso divergir da versão fixada, ENTÃO o portão de qualidade DEVE reprovar.

**Critério de aceite.**
- `"^1.0.0"` numa dependência do `package.json` → reprova, citando a dependência.
- Node em uso diferente do `.node-version` → reprova.
- Versões exatas e o Node fixado em uso → passa.

**Origem.** Decisão do dono, 13-10-2026, ao dar requisito de origem aos testes de versão da `T-02` (`02-arquitetura.md`, §8, Versões).

**Prioridade.** obrigatório

## Quando um requisito muda

> Depois que a arquitetura fechou, requisito não se edita como se ninguém
> tivesse lido o anterior. Tarefas concluídas, testes e ADRs citam este texto.

O critério é o efeito da mudança, não o tamanho dela:

| A mudança… | O que fazer |
|---|---|
| só esclarece o que já estava implícito, e nenhum teste muda | edita no lugar, com `⟨alterado em DD-MM-AAAA: o quê⟩` ao pé do requisito |
| invalida teste, tarefa concluída ou ADR | abre `REQ-NN` **novo**; o antigo vira `[SUBSTITUÍDO POR REQ-NN]` e não é apagado |
| deixa de ser desejada | o antigo vira `[REMOVIDO]`, com o motivo |

Nos três casos, na mesma passada:

- **A matriz anda para trás.** Toda linha de `04-rastreabilidade.md` que citava
  o requisito perde o status `verificado`: o teste continua passando, contra um
  critério que deixou de ser o critério.
- **As ADRs que o citam em "Requisitos afetados" são relidas.** Decisão tomada
  para um requisito que mudou é decisão sem contexto, e sobrevive calada porque
  ninguém tem motivo para reabri-la.

Número não é reaproveitado em caso nenhum. As citações antigas seguem apontando
para o `REQ-NN` antigo, e é bom que sigam: foram escritas contra aquele texto.

## Uma spec, e quando deixa de ser

Este arquivo é a spec do projeto inteiro. **Não há uma spec por feature:** a
numeração `REQ-NN` é global e `04-rastreabilidade.md` cobre tudo, e é isso que
detecta requisito de agora contradizendo requisito de seis meses atrás. Spec
fatiada por feature não detecta — cada fatia só enxerga a si mesma.

**Gatilho de reavaliação:** chega demanda que teria **critério de sucesso
próprio**, diferente do que está em `00-constituicao.md`. Não é o tamanho deste
arquivo, e não é requisito que não cita nenhum outro — no começo do projeto
nenhum cita.

Disparado o gatilho, a decisão é sua e tem três saídas: continua aqui; vira spec
própria, e aí `REQ-NN` ganha prefixo e a matriz passa a ter as duas; ou é outro
projeto. O gatilho manda olhar, não manda fatiar.

## Fora de escopo

> Tão importante quanto a lista acima, e mais esquecida. O que o sistema
> **não** faz, dito explicitamente, é o que impede o escopo de crescer sem
> decisão.

- IA como recurso do site, chatbot incluído — **por quê:** decisão do dono, 29-09-2026; a IA fica como assunto do site, não como recurso dele.
- Funcionalidade lúdica: jogo, brincadeira, easter egg, conquista — **por quê:** o site é portfólio profissional, e o tom é sério; decisão do dono, 27-09-2026.
- Tema claro — **por quê:** dobraria a paleta e a conferência de contraste (`Q-06`).
- E-mail público e formulário de contato — **por quê:** o contato é pelo LinkedIn (`Q-02`).
- Tradução obrigatória para en — **por quê:** o en acompanha quando houver tradução (`Q-05`).
- Projeto além do CronosComex — **por quê:** projeto novo entra quando o dono informar; decisão do dono, 26-09-2026.

## Perguntas em aberto

> **O passo *clarify*.** Percorra a lista acima procurando frase que admita duas
> leituras, e registre aqui antes de projetar. Nunca omita a seção; se não
> houver, escreva "nenhuma".

**Onde a ambiguidade costuma estar.** Varra nesta ordem — é a lista que evita
descobrir a pergunta depois, com código escrito:

1. **Fronteira do escopo** — o que fica de fora, e quem é o usuário.
2. **Domínio e identidade** — o que é uma entidade, o que a identifica, que
   transições de estado ela tem.
3. **Volume e limite** — quantos, quão grande, com que frequência.
4. **Falha e caso degenerado** — vazio, duplicado, fora do domínio, indisponível.
5. **Atributos de qualidade** — tempo, disponibilidade, segurança, privacidade,
   cada um com número.
6. **Integração** — o que está do outro lado, em que formato, e quem manda nele.
7. **Termo com dois sentidos** — a mesma palavra usada para duas coisas.

| # | Pergunta | Impacto se decidir errado | Quem decide | Resposta | Em |
|---|---|---|---|---|---|
| Q-02 | Por qual canal quem avalia perfis técnicos entra em contato? | O critério de sucesso conta contato: canal errado perde o contato, ou o formulário entrega dado do visitante a terceiro (`P-03`) | dono | Só LinkedIn | 13-10-2026 |
| Q-03 | Os acessos são contados, fora do critério de sucesso, como diagnóstico? | Sem contagem, não se distingue "ninguém chegou" de "chegou e não procurou" | dono | Sim, de forma anônima e agregada, com a origem (`REQ-18`) | 13-10-2026 |
| Q-04 | As páginas declaram imagem de prévia de compartilhamento? | Sem ela, o cartão do link no LinkedIn sai sem imagem, na divulgação que abre o critério de sucesso | dono | Sim (`REQ-06`) | 13-10-2026 |
| Q-05 | Todo conteúdo sai nos dois idiomas? | Obrigar o en dobra o trabalho de cada texto; não ter en esconde o conteúdo de quem não lê português | dono | pt-br obrigatório; en quando houver tradução (`REQ-04`) | 13-10-2026 |
| Q-06 | O site tem tema claro? | Tema claro dobra a paleta e a conferência de contraste | dono | Não; só o escuro | 13-10-2026 |
| Q-07 | O ícone do site e a cor da barra do navegador passam à paleta do site? | Fora da paleta, o site mostra duas identidades | dono | Sim (`REQ-22`) | 13-10-2026 |

**Pergunta respondida não é apagada.** Ela fica com a resposta e a data, e o
requisito que ela gerou ou corrigiu é atualizado. Tabela esvaziada perde a única
prova de que a ambiguidade foi vista, e a pergunta volta seis meses depois sem
ninguém lembrar que já tinha sido decidida.

## Portão desta fase

Não avance para `02-arquitetura.md` com item aberto.

**Fecha quando:** todo requisito está em EARS e tem critério de aceite que vira
teste, toda pergunta acima tem resposta e data, e não sobra placeholder `⟨…⟩`
de preenchimento. Isso se confere lendo: uma busca por `⟨` acha também as linhas
de referência que ficam — a tabela EARS, o anti-padrão de exemplo, a tabela
"Quando um requisito muda" e esta frase —, e elas não contam.

Portão conferido e fechado em 13-10-2026, com a aprovação do dono. `REQ-24` e `REQ-25` entraram depois, no mesmo dia, ao fatiar o `03`: a renomeação ordenada pelo dono e a medida de desempenho da §3 do `02` não tinham requisito de origem. `REQ-26` a `REQ-32` entraram no mesmo dia, com as decisões do dono sobre testes, guardas e skills, e `REQ-33` na execução da `T-02`, para os testes de versão.
