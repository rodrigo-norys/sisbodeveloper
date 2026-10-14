---
paths:
  - "docs/**/*.md"
  - "*.md"
  - ".claude/**/*.md"
---

# O contrato da documentação

> **Esta regra por caminho é orientação, e pode não carregar.** Ela entra em contexto quando o
> agente lê ou escreve um arquivo do `paths:`, conforme a versão do Claude Code — o que conta
> como leitura e escrita mudou de versão para versão, como diz
> `docs/metodo/engenharia-de-contexto.md` —, e nem assim a carga é garantida.
> **O que nela não pode falhar tem guarda:** região, espelho de estado, tabela solta, marcador
> quebrado e o piso de cada um reprovam em `node tools/contar-documentacao.mjs`, e o resumo e o
> índice do `03` reprovam contra os blocos das tarefas; o portão de qualidade (`npm run verify`)
> roda os dois por `tests/documentation.test.mjs`. O número fora de região, o bloco que cita um
> ID cuja definição mudou e o ID sem definição são apontados pelo `--nuas`, pelo `--pares` e pelo
> `--definicoes`, sem reprovar; as skills `/sugerir-commits` e `/sugerir-prs` rodam os dois
> primeiros antes do aceite. O resto é revisão.

## As regras

O mecanismo diz quem cobra: **guarda** reprova o portão de qualidade, **aviso** aponta sem
reprovar, e **revisão** é de quem edita. O nome entre parênteses é o do mecanismo, o mesmo
que o módulo de documentação viva usa (`docs/metodo/documentacao-viva.md`). O que é do
projeto — contadores, espelhos, registro, famílias de ID, vocabulário, pisos — está em
`tools/contar-documentacao.config.mjs`.

**R1 — Fato de estado vive num lugar só, e os outros apontam.** A cópia de estado só
existe como espelho declarado em `ids.mirrors`, e o espelho é conferido: o mesmo ID, com
o estado lido em cada lado. *Guarda (espelho):* o espelho reprova o ID cujo estado difere
entre os lados, e o que falta de um lado sem significado declarado. *Aviso (pares):* o `--pares`
lista os blocos que citam o ID cuja definição o diff mudou.

**R2 — Número de estado atual só em região gerada.** A região é
`<!-- conta:NOME -->N<!-- /conta -->`, nunca no início da linha, e o `--write` a preenche;
contador novo entra em `counters`, com teste. Diga o recorte e onde o conjunto vive — os
requisitos **obrigatórios** verificados, e não "os requisitos". Versão também é estado.
Número sobre código não se escreve em prosa: aponte o arquivo ou o comando. Número que
nenhuma fonte do repositório calcula leva fonte e data: "N registros (medido em
DD-MM-AAAA, na fonte X)". Quem edita a linha reconfere o número; se não der em um comando,
a frase está mal escrita. *Guarda (região `conta`):* a região. *Aviso (número solto):* o `--nuas` aponta número com unidade
fora de região nas linhas que o diff acrescentou, menos a que só o `--write` tocou.

**O que o `--nuas` reconhece:** o número em algarismo ou por extenso, com negrito em volta
de qualquer parte, em `N linhas` — no máximo uma palavra no meio, e a unidade pode vir
entre crases, como `REQ-NN` —, `N concluídas`, com o estado colado ao número, `N das M
tarefas`, que aponta os dois, `Abertas: N` e `Total: N`, `Por prioridade: **alta N** ·
**baixa N**`, `os **N**` com a unidade na frase anterior, `N` no fim da linha com a unidade
no começo da seguinte, e a versão exata depois do nome, `Node X.Y.Z`. O vocabulário —
unidades, estados, rótulos, nomes com versão — está em `language`, na configuração.

**Fica de fora, por limite declarado.** A faixa de ID (`X-NN` a `X-MM`), o percentual, a
versão só maior (`Node N`), a célula de tabela com a unidade no cabeçalho ou com o rótulo
na primeira célula (`| Total | N |`) e o número em negrito sem artigo custam mais falso
positivo que acerto; o valor composto (`N · N · N`) e a lista de nomes não são número com
unidade; a versão sem o nome do pacote (`da X.Y.Z`) é, sem ele, qualquer número; o número
cuja unidade ficou elidida, longe da linha, não tem unidade para casar; e a linha com data
é o registro da medição. O que fica de fora é da revisão.

**R3 — Afirmação de regra cita o ID que a define.** Sem o ID não há vínculo, e o `--pares`
não acha a frase quando a definição muda. *Revisão.*

**R4 — Todo ID tem uma definição, e o estado muda nela.** Definição é o título que abre com
o ID, ou a linha de tabela que abre com ele, nas famílias que a configuração declara em
`ids.definitionRow`; o resto é citação. Ela não se apaga, e o estado muda na própria linha
que define: o requisito descartado leva `[REMOVIDO]` ou `[SUBSTITUÍDO POR REQ-NN]` no
título, a tarefa cancelada fica com `❌ CANCELADA`, a ADR substituída diz por qual. Número
não se reaproveita. *Aviso (definições):* o `--definicoes` lista o ID citado sem definição, e o definido
em mais de um lugar fora de espelho.

**R5 — Lista de itens com estado é gerada, ou vira ponteiro.** A lista escrita à mão é a
que esquece o item novo, e guarda nenhuma vê o que falta. Conjunto computável vai em região
`conta` (o contador devolve a lista) ou `confere` (a ferramenta confere a lista escrita à
mão contra o `git`); o resto aponta para onde o conjunto é definido. O índice e o resumo do
`03` são lista escrita à mão, conferida contra os blocos das tarefas. *Guarda (região `confere`, piso por nome):* a região
`confere`, e é erro a que não examina nenhum arquivo — sem diretório no argumento, ou com um
que não tem arquivo no `git` —, e o piso por nome, em `floors.byName`, que reprova a
`confere` apagada ou posta em bloco cercado. *Guarda (índice do `03`):* a lista, a ordem, o
título e a marca de cada linha. *Revisão:* o resto.

**R6 — Registro se marca pela estrutura, e não conta como estado.** Registro diz o que era
verdade na data, e a data mora nele — a ADR, o bloco da tarefa fechada, a linha datada. Não
há marcação de isenção: o que é registro está em `record`, na configuração, e a linha com
data ou "medido" é registro por `language.dated`. *Aviso (número solto, pares):* o `--nuas` e o `--pares` não o
apontam.

**R7 — O documento renderiza.** Linha em branco dentro de tabela a encerra — também dentro
de citação, onde o `>` sozinho é a linha em branco —, e o resto sai como texto; `conta` no
início da linha abre bloco HTML. *Guarda (tabela solta, marcador quebrado):* a tabela solta e o marcador quebrado.

## Comentário em código

O porquê local fica no comentário, ao lado do código que ele explica. A data e a narrativa
— quando caiu, quem decidiu, o que se tentou antes — moram no registro. O comentário cita
o ID do registro (`ADR-NNNN`, `T-NN`), e não a data: o ID leva ao registro, e a data só diz
quando.

## O que o contrato não alcança

O fato sem ID e sem número, que fica com a revisão; a lista que devia ganhar um item e não
ganhou; o documento contra o código e a tela; o dado de fora do repositório; e o documento
novo ainda fora do `git`, que o motor não lê até o `git add`.
