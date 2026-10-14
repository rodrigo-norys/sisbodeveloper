import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { findDefinitions, findLooseNumbers, inspect, inspectStructure, rewrite } from '../tools/contar-documentacao.mjs'
import { ROOT_DIRECTORY } from './support.mjs'

const BACKLOG = 'docs/03-backlog.md'
const MINIMUM_TASKS = 20
const FIX_COMMAND = 'as regiões conta se corrigem com node tools/contar-documentacao.mjs --write; a estrutura, pela regra de .claude/rules/documentacao.md'

const TASK_HEADING = /^### (T-\d+) — (.+?)(?: (✅) CONCLUÍDA em \d{2}-\d{2}-\d{4}| (🔎) AGUARDA VALIDAÇÃO| (❌) CANCELADA em \d{2}-\d{2}-\d{4})?$/
const EPIC_HEADING = /^## Épico (E\d+) — (.+)$/
const INDEX_EPIC = /^\*\*\[Épico (E\d+) — (.+)\]\(#(e\d+)\)\*\*$/
const INDEX_TASK = /^- \[(T-\d+) — (.+)\]\(#(t-\d+)\)(?: (✅|🔎|❌))?$/
const SUMMARY_ROW = /^\| (E\d+) — (.+?) \| (T-\d+) a (T-\d+) \|/

/** Os épicos e as tarefas pelos blocos do documento, que são a fonte do índice e do resumo. */
function readBlocks(lines) {
  const epics = []
  let previous = ''
  for (const line of lines) {
    const epic = EPIC_HEADING.exec(line)
    if (epic) epics.push({ id: epic[1], title: epic[2], anchored: previous === `<a id="${epic[1].toLowerCase()}"></a>`, tasks: [] })
    const task = TASK_HEADING.exec(line)
    if (task && epics.length > 0) {
      const [, id, title, closed, inValidation, cancelled] = task
      epics.at(-1).tasks.push({ id, title, mark: closed ?? inValidation ?? cancelled ?? '', anchored: previous === `<a id="${id.toLowerCase()}"></a>` })
    }
    if (line.trim() !== '') previous = line
  }
  return epics
}

const sectionLines = (lines, heading) => {
  const start = lines.indexOf(heading)
  if (start === -1) return null
  const end = lines.findIndex((line, index) => index > start && /^## /.test(line))
  return lines.slice(start + 1, end === -1 ? undefined : end)
}

function readIndex(lines) {
  const groups = []
  for (const line of lines) {
    const epic = INDEX_EPIC.exec(line)
    if (epic) groups.push({ id: epic[1], title: epic[2], href: epic[3], tasks: [] })
    const task = INDEX_TASK.exec(line)
    if (task && groups.length > 0) groups.at(-1).tasks.push({ id: task[1], title: task[2], href: task[3], mark: task[4] ?? '' })
  }
  return groups
}

const describeTask = (task) => (task ? `"${task.id} — ${task.title}"${task.mark ? ` ${task.mark}` : ''}` : 'nada')

/** O índice e o resumo do `03` contra os blocos das tarefas: a lista, a ordem, o título e a marca (REQ-29). */
export function findBacklogIndexProblems(text) {
  const lines = text.split('\n')
  const epics = readBlocks(lines)
  const index = readIndex(sectionLines(lines, '## Índice') ?? [])
  const summary = (sectionLines(lines, '## Resumo do backlog') ?? []).map((line) => SUMMARY_ROW.exec(line)).filter(Boolean)
  const problems = []
  const report = (message) => problems.push(`${BACKLOG}: ${message} (REQ-29)`)

  for (const epic of epics) {
    if (!epic.anchored) report(`o épico ${epic.id} não tem a âncora <a id="${epic.id.toLowerCase()}"></a> antes do título`)
    for (const task of epic.tasks.filter((task) => !task.anchored)) report(`a tarefa ${task.id} não tem a âncora <a id="${task.id.toLowerCase()}"></a> antes do título`)
  }

  const groupCount = Math.max(epics.length, index.length)
  for (let position = 0; position < groupCount; position += 1) {
    const epic = epics[position]
    const group = index[position]
    if (!epic || !group || epic.id !== group.id || epic.title !== group.title || group.href !== epic.id.toLowerCase()) {
      report(`o grupo ${position + 1} do índice é ${group ? `"${group.id} — ${group.title}" (#${group.href})` : 'nada'}, e o documento tem ${epic ? `"${epic.id} — ${epic.title}"` : 'nada'}`)
      continue
    }
    const taskCount = Math.max(epic.tasks.length, group.tasks.length)
    for (let at = 0; at < taskCount; at += 1) {
      const expected = epic.tasks[at]
      const found = group.tasks[at]
      const matches = expected && found && expected.id === found.id && expected.title === found.title && expected.mark === found.mark && found.href === expected.id.toLowerCase()
      if (!matches) report(`índice de ${epic.id}, linha ${at + 1}: esperado ${describeTask(expected)}, achado ${describeTask(found)}`)
    }
  }

  for (const epic of epics) {
    const row = summary.find((match) => match[1] === epic.id)
    const first = epic.tasks.at(0)?.id
    const last = epic.tasks.at(-1)?.id
    if (!row) report(`o resumo não tem a linha do épico ${epic.id}`)
    else if (row[2] !== epic.title || row[3] !== first || row[4] !== last) {
      report(`o resumo diz "${row[1]} — ${row[2]} | ${row[3]} a ${row[4]}", e o documento tem "${epic.id} — ${epic.title} | ${first} a ${last}"`)
    }
  }
  for (const row of summary.filter((match) => !epics.some((epic) => epic.id === match[1]))) report(`o resumo cita o épico ${row[1]}, que o documento não tem`)

  return { problems, tasks: epics.flatMap((epic) => epic.tasks).length }
}

const describeEngine = ({ divergences, errors }, { problems }) => [
  ...errors.map(({ file, line, message }) => `${file}:${line} ERRO ${message}`),
  ...divergences.map(({ file, line, name, written, actual }) => (written === null ? `${file}:${line} ${name} ${actual}` : `${file}:${line} ${name}: escrito "${written}", real "${actual}"`)),
  ...problems.map(({ file, line, guard, message }) => `${line ? `${file}:${line}` : file} ${guard}: ${message}`),
]

test('REQ-29: as regiões, os espelhos e as tabelas da documentação batem com a fonte', () => {
  const found = describeEngine(inspect(ROOT_DIRECTORY), inspectStructure(ROOT_DIRECTORY))
  assert.deepEqual(found, [], `${found.join('\n')}\n${FIX_COMMAND}`)
})

test('REQ-29: o índice e o resumo do 03 batem com os blocos das tarefas', () => {
  const { problems, tasks } = findBacklogIndexProblems(readFileSync(join(ROOT_DIRECTORY, BACKLOG), 'utf8'))
  assert.ok(tasks >= MINIMUM_TASKS, `piso: ${tasks} tarefas lidas nos blocos, esperado ao menos ${MINIMUM_TASKS} — o título parou de casar?`)
  assert.deepEqual(problems, [])
})

// --- os casos-limite, num repositório descartável com a configuração do projeto -----------

// Os pisos são do repositório do projeto: o descartável tem três documentos e reprovaria por eles.
const FIXTURE_FLOORS = {}

const REQUIREMENTS_FIXTURE = ['# Requisitos', '', '## Requisitos', '', '### REQ-01 — Primeiro', '', '**Prioridade.** obrigatório', ''].join('\n')

const backlogFixture = ({ closedMark = ' ✅ CONCLUÍDA em 14-10-2026', indexLines, concludedCount = 1, validationCount = 1 } = {}) =>
  [
    '# Backlog',
    '',
    '## Resumo do backlog',
    '',
    '| Épico | Tarefas, na ordem | ✅ | 🔎 | Total |',
    '|---|---|---|---|---|',
    `| E1 — Primeiro épico | T-01 a T-02 | <!-- conta:tarefas-concluidas[E1] -->${concludedCount}<!-- /conta --> | <!-- conta:tarefas-em-validacao[E1] -->${validationCount}<!-- /conta --> | <!-- conta:tarefas[E1] -->2<!-- /conta --> |`,
    '',
    '## Índice',
    '',
    '**[Épico E1 — Primeiro épico](#e1)**',
    '',
    ...(indexLines ?? ['- [T-01 — Fazer a primeira](#t-01) ✅', '- [T-02 — Fazer a segunda](#t-02) 🔎']),
    '',
    '<a id="e1"></a>',
    '',
    '## Épico E1 — Primeiro épico',
    '',
    '<a id="t-01"></a>',
    '',
    `### T-01 — Fazer a primeira${closedMark}`,
    '',
    '**Cumpre.** `REQ-01`',
    '',
    '<a id="t-02"></a>',
    '',
    '### T-02 — Fazer a segunda 🔎 AGUARDA VALIDAÇÃO',
    '',
    '**Cumpre.** `REQ-01`',
    '',
  ].join('\n')

const traceabilityFixture = (status) =>
  [
    '# Rastreabilidade',
    '',
    '## 1. Requisito → tarefa → teste',
    '',
    '| Requisito | Tarefa | Teste | Status |',
    '|---|---|---|---|',
    `| \`REQ-01\` | \`T-01\` | teste | ${status} |`,
    '| `REQ-01` | `T-02` | teste | aberto |',
    '',
  ].join('\n')

function withRepository(files, run) {
  const root = mkdtempSync(join(tmpdir(), 'sisbodeveloper-docs-'))
  const git = (...args) => execFileSync('git', ['-c', 'user.name=Teste', '-c', 'user.email=teste@example.com', ...args], { cwd: root, stdio: 'pipe' })
  const write = (path, content) => {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  try {
    for (const [path, content] of Object.entries(files)) write(path, content)
    git('init', '-q', '-b', 'main')
    git('add', '--', ...Object.keys(files))
    git('commit', '-q', '-m', 'base')
    run({ root, write })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

const baseFiles = (overrides = {}) => ({
  'docs/01-requisitos.md': REQUIREMENTS_FIXTURE,
  [BACKLOG]: backlogFixture(),
  'docs/04-rastreabilidade.md': traceabilityFixture('verificado'),
  ...overrides,
})

test('estado de épico com contagem velha reprova, e o --write corrige', () => {
  withRepository(baseFiles({ [BACKLOG]: backlogFixture({ concludedCount: 0, validationCount: 0 }) }), ({ root }) => {
    const stale = inspect(root).divergences.map(({ name, written, actual }) => `${name}: ${written} → ${actual}`)
    assert.deepEqual(stale, ['tarefas-concluidas[E1]: 0 → 1', 'tarefas-em-validacao[E1]: 0 → 1'])
    rewrite(root)
    assert.deepEqual(inspect(root).divergences, [])
  })
})

test('tarefa concluída no 03 só com linha aberto no 04 reprova pelo espelho', () => {
  withRepository(baseFiles({ 'docs/04-rastreabilidade.md': traceabilityFixture('aberto') }), ({ root }) => {
    const mirror = inspectStructure(root, { floors: FIXTURE_FLOORS }).problems.filter((problem) => problem.guard === 'espelho:tarefas')
    assert.equal(mirror.length, 1)
    assert.match(mirror[0].message, /^T-01: .* diz "não concluída"; .* diz "concluída"$|^T-01: .* diz "concluída"; .* diz "não concluída"$/)
  })
})

test('ID citado sem definição aparece no --definicoes', () => {
  withRepository(baseFiles({ 'docs/02-arquitetura.md': '# Arquitetura\n\nA decisão segue a `REQ-09`.\n' }), ({ root }) => {
    const undefinedIds = findDefinitions(root).filter((entry) => entry.definedAt.length === 0).map((entry) => entry.id)
    assert.deepEqual(undefinedIds, ['REQ-09'])
  })
})

test('número de estado novo fora de região, no diff, é aviso do --nuas, e o --check segue verde', () => {
  withRepository(baseFiles(), ({ root, write }) => {
    write('docs/04-rastreabilidade.md', `${traceabilityFixture('verificado')}\nSão 12 requisitos verificados.\n`)
    const loose = findLooseNumbers(root, { base: 'main' }).map(({ file, number, unit }) => `${file} ${number} ${unit}`)
    assert.deepEqual(loose, ['docs/04-rastreabilidade.md 12 requisitos'])
    assert.deepEqual(describeEngine(inspect(root), inspectStructure(root, { floors: FIXTURE_FLOORS })), [])
  })
})

test('a guarda do índice reprova tarefa concluída sem o ✅, fora da ordem, e o resumo com a faixa errada', () => {
  const withoutMark = findBacklogIndexProblems(backlogFixture({ indexLines: ['- [T-01 — Fazer a primeira](#t-01)', '- [T-02 — Fazer a segunda](#t-02) 🔎'] }))
  assert.deepEqual(withoutMark.problems, [`${BACKLOG}: índice de E1, linha 1: esperado "T-01 — Fazer a primeira" ✅, achado "T-01 — Fazer a primeira" (REQ-29)`])

  const outOfOrder = findBacklogIndexProblems(backlogFixture({ indexLines: ['- [T-02 — Fazer a segunda](#t-02) 🔎', '- [T-01 — Fazer a primeira](#t-01) ✅'] }))
  assert.equal(outOfOrder.problems.length, 2)

  const wrongRange = findBacklogIndexProblems(backlogFixture().replace('T-01 a T-02', 'T-01 a T-03'))
  assert.deepEqual(wrongRange.problems, [`${BACKLOG}: o resumo diz "E1 — Primeiro épico | T-01 a T-03", e o documento tem "E1 — Primeiro épico | T-01 a T-02" (REQ-29)`])

  assert.deepEqual(findBacklogIndexProblems(backlogFixture()).problems, [])
})
