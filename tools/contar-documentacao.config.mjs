/**
 * O que e do projeto em `tools/contar-documentacao.mjs`: o escopo, a regra que as
 * reprovacoes citam, a base dos avisos, os contadores das regioes `conta`, o que marca
 * registro, as familias de ID e os espelhos de estado entre documentos, a lingua em que os
 * numeros sao escritos, e o piso de cada guarda. O nucleo nao sabe nada do projeto; quem adota o mecanismo troca
 * este arquivo e leva o nucleo como esta.
 *
 * Partiu do modelo do kit de documentacao do `metodo-sdd` (commit `a20d2c4`), para a
 * estrutura do esqueleto SDD: `docs/00-constituicao.md` a `docs/04-rastreabilidade.md` e
 * `docs/adr/`. O que este projeto trocou esta no cabecalho da chave: a marca da tarefa no
 * titulo, o contador de tarefas em validacao, a data DD-MM-AAAA e o stack (T-08).
 *
 * Contador novo entra em `counters`, com teste sobre uma fonte de valor concreto. O nome e
 * o que a regiao escreve — `<!-- conta:NOME -->` ou `<!-- conta:NOME[argumento] -->` —, e o
 * contador recebe a fonte e o argumento como texto. Contador que lanca vira erro do
 * `--check`: argumento que nao existe na fonte lanca, e nao devolve zero. Espelho novo entra
 * em `ids.mirrors`, com o piso de cada lado em `floors`.
 *
 * Nao importa nada do nucleo: e o nucleo que importa este arquivo.
 */

// Os documentos de onde os contadores e os espelhos leem. Troque se o projeto os renomear.
const REQUIREMENTS = 'docs/01-requisitos.md'
const BACKLOG = 'docs/03-backlog.md'
const TRACEABILITY = 'docs/04-rastreabilidade.md'

// O que o motor le. Troque se a documentacao viver fora de `docs/`, `.claude/` e dos dois
// arquivos da raiz.
const IN_SCOPE = /^(?:docs\/.+|\.claude\/.+|README|CLAUDE)\.md$/

// A marca de tarefa fechada, cancelada e em validacao. Aqui ela fica no titulo da tarefa —
// `### T-04 — ... ✅ CONCLUÍDA em DD-MM-AAAA` —, e nao numa linha propria: o resumo e o
// indice do `03` copiam o titulo. A ancora no titulo e o que impede o contrato da `T-08`,
// que cita a marca entre crases, de fechar a tarefa.
const TASK_CLOSED = /^### T-\d+\b.*✅ CONCLUÍDA/
const TASK_CANCELLED = /^### T-\d+\b.*❌ CANCELADA/
const TASK_IN_VALIDATION = /^### T-\d+\b.*🔎 AGUARDA VALIDAÇÃO/
// O titulo que abre tarefa e o que abre epico. Troque `T` por `H` se o backlog for de
// historias.
const TASK_HEADING = /^### (T-\d+)/
const EPIC_HEADING = /^## Épico (E\d+)/
const PRIORITIES = ['obrigatório', 'desejável', 'adiável']

const plain = (text) => text.replace(/[`*]/g, '').trim()

/** O `|` final e opcional no GFM. */
const cellsOf = (rest) =>
  rest
    .split('|')
    .map((cell) => cell.trim())
    .filter((cell, index, cells) => index < cells.length - 1 || cell !== '')

// O ID fica na primeira celula; as colunas seguintes contam a partir de zero.
const cellAfterId = (row, index) => cellsOf(row.replace(/^\|[^|]*\|/, ''))[index] ?? ''

/** As linhas da secao cujo titulo casa `heading`, ate o proximo titulo de nivel igual ou acima. */
function section(text, heading) {
  const lines = text.split('\n')
  const start = lines.findIndex((line) => heading.test(line))
  if (start === -1) throw new Error(`secao ausente: ${heading}`)
  const level = /^#+/.exec(lines[start])[0].length
  const end = lines.findIndex(
    (line, index) => index > start && new RegExp(`^#{1,${level}} `).test(line),
  )
  return lines.slice(start + 1, end === -1 ? undefined : end)
}

/** Cada bloco que abre com `opener` vai ate o proximo titulo de nivel 1 a 3. */
function blocksOf(lines, opener) {
  const found = []
  lines.forEach((line, index) => {
    const id = opener.exec(line)?.[1]
    if (!id) return
    const end = lines.findIndex((next, at) => at > index && /^#{1,3} /.test(next))
    found.push({ id, start: index, body: lines.slice(index, end === -1 ? undefined : end) })
  })
  return found
}

/**
 * Os requisitos de `## Requisitos`, cada um do titulo `### REQ-NN` ao proximo titulo. O
 * descartado segue no documento, marcado `[REMOVIDO]` ou `[SUBSTITUÍDO POR REQ-NN]`, e nao
 * conta como vigente.
 */
function requirements(source) {
  return blocksOf(section(source.read(REQUIREMENTS), /^## Requisitos$/), /^### (REQ-\d+)/).map(
    ({ id, body }) => ({
      id,
      vigente: !body.some((line) => /\[(?:REMOVIDO|SUBSTITUÍDO POR)/.test(line)),
      priority: plain(/^\*\*Prioridade\.\*\*(.*)$/m.exec(body.join('\n'))?.[1] ?? ''),
    }),
  )
}

/** As linhas da §1 da matriz: requisito, tarefas da segunda celula e status da quarta. */
function matrixRows(source) {
  return section(source.read(TRACEABILITY), /^## 1\. /).flatMap((row) => {
    const id = /^\| [`*]{0,2}(REQ-\d+)[`*]{0,2} \|/.exec(row)?.[1]
    if (!id) return []
    const tasks = cellAfterId(row, 0).match(/T-\d+/g) ?? []
    return [{ id, tasks, status: plain(cellAfterId(row, 2)).toLowerCase() }]
  })
}

/** O argumento `[obrigatório]`, `[desejável]` ou `[adiável]` filtra; sem ele, todos. */
function vigentRequirements(source, priority) {
  if (priority !== undefined && !PRIORITIES.includes(priority))
    throw new Error(`prioridade desconhecida: ${priority}`)
  return requirements(source).filter(
    (requirement) =>
      requirement.vigente && (priority === undefined || requirement.priority === priority),
  )
}

/** As tarefas do backlog; com o argumento `[E1]`, so as do epico. A cancelada nao conta. */
function tasks(source, epic) {
  const lines = source.read(BACKLOG).split('\n')
  const epics = new Set()
  const epicOf = new Map()
  let current = null
  for (const line of lines) {
    current = EPIC_HEADING.exec(line)?.[1] ?? current
    if (EPIC_HEADING.test(line)) epics.add(current)
    const task = TASK_HEADING.exec(line)?.[1]
    if (task) epicOf.set(task, current)
  }
  if (epic !== undefined && !epics.has(epic)) throw new Error(`epico ausente do backlog: ${epic}`)
  return blocksOf(lines, TASK_HEADING)
    .filter(({ id }) => epic === undefined || epicOf.get(id) === epic)
    .filter(({ body }) => !body.some((line) => TASK_CANCELLED.test(line)))
    .map(({ id, body }) => ({
      id,
      closed: body.some((line) => TASK_CLOSED.test(line)),
      inValidation: body.some((line) => TASK_IN_VALIDATION.test(line)),
    }))
}

/**
 * Os numeros e listas de estado que o esqueleto ja afirma: a cobertura da §4 do `04`
 * ("Requisitos obrigatorios: n de N verificados", "Requisitos sem tarefa") e o estado de
 * cada epico no `03` ("n de N concluidas"). Acrescente os do projeto.
 */
export const COUNTERS = {
  // `requisitos[obrigatório]`: os vigentes da prioridade; sem argumento, todos (`04`, §4).
  requisitos: (source, priority) => vigentRequirements(source, priority).length,
  // `requisitos-verificados[obrigatório]`: desses, os com a linha da matriz em `verificado`.
  'requisitos-verificados': (source, priority) => {
    const verified = new Set(
      matrixRows(source)
        .filter((row) => row.status === 'verificado')
        .map((row) => row.id),
    )
    return vigentRequirements(source, priority).filter(({ id }) => verified.has(id)).length
  },
  // `requisitos-sem-tarefa`: os vigentes sem linha na matriz, ou com a linha sem tarefa.
  'requisitos-sem-tarefa': (source) => {
    const covered = new Set(
      matrixRows(source)
        .filter((row) => row.tasks.length > 0)
        .map((row) => row.id),
    )
    const orphans = vigentRequirements(source)
      .map(({ id }) => id)
      .filter((id) => !covered.has(id))
    return orphans.length === 0 ? 'nenhum' : orphans.join(', ')
  },
  // `tarefas[E1]`: as do epico, menos a cancelada; sem argumento, todas (Estado do `03`).
  tarefas: (source, epic) => tasks(source, epic).length,
  // `tarefas-concluidas[E1]`: dessas, as com `✅ CONCLUÍDA`.
  'tarefas-concluidas': (source, epic) => tasks(source, epic).filter((task) => task.closed).length,
  // `tarefas-em-validacao[E1]`: as com `🔎 AGUARDA VALIDAÇÃO` (resumo do `03`).
  'tarefas-em-validacao': (source, epic) =>
    tasks(source, epic).filter((task) => task.inValidation).length,
}

/**
 * Registro e o que nunca envelhece, porque diz o que era verdade na data: nem o `--nuas`
 * nem o `--pares` o apontam. Aqui: as ADRs, a linha de fechamento e de cancelamento da
 * tarefa, e no backlog a tarefa fechada ou cancelada inteira e o epico com todas as tarefas
 * fechadas. A linha com data tambem e registro, por `language.dated`. Troque se o projeto
 * guardar registro em outro lugar (um log de decisoes, um diretorio de relatorios).
 */
const RECORD_FILES = /^docs\/adr\//
const RECORD_LINE = new RegExp(`${TASK_CLOSED.source}|${TASK_CANCELLED.source}`)

/**
 * No backlog, a tarefa fechada ou cancelada e registro inteira, e o epico com todas as
 * tarefas fechadas tambem — menos a secao `###` dele que nao e tarefa.
 */
function closedBacklogLines(lines) {
  const closed = new Set()
  const isDone = (line) => TASK_CLOSED.test(line) || TASK_CANCELLED.test(line)
  let task = -1
  let epic = -1
  const closeTask = (end) => {
    if (task >= 0 && lines.slice(task, end).some(isDone))
      for (let i = task; i < end; i++) closed.add(i)
    task = -1
  }
  const closeEpic = (end) => {
    if (epic < 0) return
    const body = lines.slice(epic, end)
    const opened = body.filter((line) => TASK_HEADING.test(line)).length
    const done = body.filter(isDone).length
    if (opened > 0 && done >= opened) {
      let other = false
      for (let i = epic; i < end; i++) {
        if (lines[i].startsWith('### ')) other = !TASK_HEADING.test(lines[i])
        if (!other) closed.add(i)
      }
    }
    epic = -1
  }
  lines.forEach((line, index) => {
    if (/^##/.test(line)) closeTask(index)
    if (/^## /.test(line)) closeEpic(index)
    if (EPIC_HEADING.test(line)) epic = index
    if (TASK_HEADING.test(line)) task = index
  })
  closeTask(lines.length)
  closeEpic(lines.length)
  return closed
}

/**
 * As familias de ID do esqueleto: `P` (principio, `00`), `REQ` e `Q` (requisito e
 * pergunta, `01`), `RS` e `R` (restricao e risco, `02`), `T` e o epico `E` (`03`), e
 * `ADR`. Acrescente a familia que o projeto criar: ID fora do padrao nao e citacao, e o
 * `--pares` e o `--definicoes` nao o veem.
 */
const ID = String.raw`(?:REQ|RS|P|Q|R|T)-\d{2,3}|ADR-\d{4}|E\d{1,2}`
// Definicao em tabela, so das familias que nascem em tabela. A matriz do `04` e a
// verificacao da §11 do `02` tambem abrem linha com `REQ`, `ADR` e `P`, mas citam: a
// definicao deles e o titulo. Troque se o projeto definir outra familia em tabela.
const DEFINITION_ROW = /^\| [`*]{0,2}((?:RS|Q|R)-\d{2,3})[`*]{0,2} \|/
const DEFINITION_HEADING = new RegExp(String.raw`^#{1,4} (?:Épico )?(${ID})\b`)

const TASK_DONE = (status) => /^(?:implementado|verificado)$/.test(status)

/**
 * Espelho de estado: o mesmo ID com estado em dois documentos, por desenho. A guarda do
 * `--check` le os dois lados e reprova o ID cujo estado difere. Cada lado diz o arquivo,
 * a secao, se o ID abre titulo (`headings`) ou vem de linha de tabela (`rows`, da celula
 * `cell`, a primeira sem ela), e como o estado se reconhece ali. `absent` diz o que
 * significa o ID faltar de um lado: um estado, ou `ignore`; sem ele, faltar e defeito.
 * `merge` junta o estado do ID que aparece em mais de uma linha; sem ele, repetir e defeito.
 */
const MIRRORS = [
  {
    // A tarefa fecha no `03` e o status da matriz anda no `04`, na mesma passada. A matriz
    // cita a tarefa na segunda celula, e a mesma tarefa em mais de um requisito: la ela
    // conta como concluida se ALGUMA linha que a cita esta `implementado` ou `verificado`.
    // "Todas" daria alarme falso no requisito parcial, com uma tarefa fechada e outra
    // aberta. Custo, limite declarado: o requisito com todas as tarefas fechadas e a linha
    // ainda `aberto` passa calado quando cada tarefa dele ja anda em outra linha.
    // A tarefa fechada que a matriz nao cita reprova (a linha e da definition of done); a
    // citada que o backlog nao tem nao esta concluida, e o `--definicoes` a aponta.
    name: 'tarefas',
    family: String.raw`T-\d+`,
    source: {
      file: BACKLOG,
      entries: 'headings',
      state: (block) =>
        block.split('\n').some((line) => TASK_CLOSED.test(line)) ? 'concluída' : 'não concluída',
      absent: 'não concluída',
    },
    copy: {
      file: TRACEABILITY,
      section: /^## 1\. /,
      entries: 'rows',
      cell: 1,
      state: (row) =>
        TASK_DONE(plain(cellAfterId(row, 2)).toLowerCase()) ? 'concluída' : 'não concluída',
      merge: (state, other) => (state === 'concluída' ? state : other),
      absent: 'não concluída',
    },
  },
]

/**
 * O minimo que cada guarda tem de examinar: as regioes `conta` do escopo (`regions`), os
 * arquivos em que a tabela solta e procurada (`tables`), as regioes de cada nome
 * (`byName`, chave `conta:NOME` ou `confere:NOME`, e piso 0 pede ao menos uma), e os IDs
 * de cada lado de cada espelho (`mirrors`). O numero examinado tem de passar do piso: o
 * piso pega o padrao que parou de casar e deixaria a guarda verde por vacuidade, e nao a
 * variacao normal.
 *
 * Projeto novo comeca sem regiao, e piso ligado reprovaria o primeiro `--check`: aqui eles
 * ficam desligados (chave ausente). Ligue depois da primeira regiao, ou ao fim da varredura
 * de adocao: ponha um piso alto de proposito (9999) em cada chave, rode
 * `node tools/contar-documentacao.mjs`, leia na reprovacao quanto cada guarda examinou
 * ("examinou N", "leu N ID(s)", "achou N"), e fixe cada piso bem abaixo do numero lido.
 * Religue ao criar espelho ou `confere` novo.
 */
// Ligados na adocao (T-08), bem abaixo do que cada guarda leu entao: 18 regioes `conta`, 15
// arquivos, 5 regioes de cada contador de tarefa (uma por epico), 1 de cada contador de
// requisito, e 29 tarefas em cada lado do espelho.
const FLOORS = {
  regions: 10,
  tables: 8,
  byName: {
    'conta:tarefas': 3,
    'conta:tarefas-concluidas': 3,
    'conta:tarefas-em-validacao': 3,
    'conta:requisitos': 0,
    'conta:requisitos-verificados': 0,
    'conta:requisitos-sem-tarefa': 0,
  },
  mirrors: { tarefas: { source: 15, copy: 15 } },
}

// O numero por extenso que o `--nuas` reconhece. "um" e "uma" ficam de fora: sao artigo.
const NUMBER_WORDS = [
  ...['dois', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'],
  ...['onze', 'doze', 'treze', 'catorze', 'quatorze', 'quinze', 'dezesseis', 'dezessete'],
  ...['dezoito', 'dezenove', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'cem'],
]
// A unidade de "N unidades". Acrescente as do dominio. Nenhuma lista de `language` pode
// ficar vazia: a forma viraria alternativa vazia e casaria demais.
const UNITS = [
  ...['requisitos?', 'tarefas?', 'histórias?', 'épicos?', 'testes?', 'casos(?:-limite)?'],
  ...['critérios?', 'princípios?', 'restrições', 'restrição', 'riscos?', 'perguntas?'],
  ...['ADRs?', 'decisões', 'decisão', 'arquivos?', 'linhas?', 'documentos?', 'módulos?'],
  ...['componentes?', 'serviços?', 'rotas?', 'endpoints?', 'telas?', 'páginas?', 'tabelas?'],
  ...['colunas?', 'campos?', 'passos?', 'fases?', 'regras?', 'itens', 'item', 'dependências?'],
  // O marcador de familia, `REQ-NN` ou `ADR-NNNN`, e a unidade de "os 12 `REQ-NN`".
  '[A-Z]+-N{2,4}',
]
// O adjetivo de estado faz as vezes da unidade: "3 concluídas, 1 aberta". Acrescente os
// estados que a documentacao do projeto usa.
const STATES = [
  ...['Abert[ao]s?', 'Fechad[ao]s?', 'Conclu[ií]d[ao]s?', 'Ativ[ao]s?', 'Pendentes?'],
  ...['Implementad[ao]s?', 'Verificad[ao]s?', 'Cancelad[ao]s?'],
]
// O rotulo antes de dois-pontos: "Abertas: 0", "Total: **12**".
const LABELS = ['Total', ...STATES]
// Quem tem versao exata na prosa: o stack deste projeto.
const VERSIONED = ['Node(?:\\.js)?', 'npm', 'Astro', 'Tailwind(?:CSS)?', 'TypeScript']
const CONNECTIVES = { partOf: 'de|das|dos', article: 'os|as', breakdown: 'Por' }
// A linha com data, ou que diz "medido", e registro da medicao. O projeto escreve a data
// DD-MM-AAAA; as formas do modelo ficam, porque o `docs/metodo/` e copia do metodo.
const DATED =
  /\b\d{2}-\d{2}-\d{4}\b|\b\d{2}\/\d{2}(?:\/\d{4})?\b|\b\d{4}-\d{2}-\d{2}\b|\b[Mm]edid[oa]s?\b/
// O limite de formato antes do numero: "no maximo 3 linhas" e norma, nao estado.
const FORMAT_LIMIT = /(?:no máximo|no mínimo|até|máximo de|mínimo de|cada|por)\s*(?:\*\*)?$/i

export default {
  scope: IN_SCOPE,
  // O caminho da rule que as reprovacoes citam.
  rule: '.claude/rules/documentacao.md',
  // O ramo contra o qual o `--nuas` e o `--pares` comparam sem `--base`. Troque se o tronco
  // do projeto tiver outro nome.
  base: 'main',
  counters: COUNTERS,
  record: {
    files: RECORD_FILES,
    line: RECORD_LINE,
    closedBlocks: { file: BACKLOG, lines: closedBacklogLines },
  },
  ids: {
    pattern: ID,
    definitionRow: DEFINITION_ROW,
    definitionHeading: DEFINITION_HEADING,
    // O item que fecha no backlog e o agrupador dele, para o `--pares`.
    closedStory: { file: BACKLOG, epic: EPIC_HEADING, story: TASK_HEADING, closed: TASK_CLOSED },
    mirrors: MIRRORS,
  },
  language: {
    // O formato do numero que a regiao `conta` escreve (`1.234`). Troque pelo do projeto.
    locale: 'pt-BR',
    // A palavra de "N arquivos", a anotacao da `confere:arvore` no lugar da lista. Troque com
    // a lingua.
    treeFiles: 'arquivos',
    numberWords: NUMBER_WORDS,
    units: UNITS,
    states: STATES,
    labels: LABELS,
    versioned: VERSIONED,
    connectives: CONNECTIVES,
    dated: DATED,
    formatLimit: FORMAT_LIMIT,
  },
  floors: FLOORS,
}
