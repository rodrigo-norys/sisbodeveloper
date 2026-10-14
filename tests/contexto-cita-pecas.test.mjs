import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { posix } from 'node:path'
import { describe, it } from 'node:test'
import { ROOT_DIRECTORY, listRepositoryFiles, readRepositoryFile } from './support.mjs'

/**
 * O arquivo de contexto cita toda peça de `.claude/`: a regra por caminho e o hook pelo nome do
 * arquivo, a skill como se invoca — `/nome` —, o subagente pelo nome, sem extensão. Citar é ter
 * o nome no arquivo sem letra, dígito, `_` ou `-` colado antes ou depois: `revisor` não se cita
 * por `revisor-de-documentacao`, nem a skill sem a barra. A peça que o arquivo de contexto não
 * cita é a peça que ninguém sabe que existe, e a reprovação diz qual é e como citá-la (REQ-30).
 *
 * Adaptada do exemplo do kit de contexto do `metodo-sdd` (`a20d2c4`). Lê o que iria para um
 * commit — o rastreado que existe mais o novo que o `.gitignore` não exclui, como
 * `tests/support.mjs` —, e não só o rastreado: o portão roda antes do `git add`, e só o rastreado
 * deixaria passar o hook novo sem citação e cobraria a citação do hook apagado. O aviso de
 * alinhamento, `conferir-alinhamento.sh`, confere o mesmo antes, pelo disco; quem garante é esta
 * guarda, no portão de qualidade.
 *
 * Fica de fora: o que a citação diz — a peça citada com a descrição errada passa, e é da
 * revisão —; e a peça fora das regras, skills, subagentes e hooks — o comando, o `settings.json`,
 * o servidor MCP.
 */

const CONTEXT_FILE = 'CLAUDE.md'
// Lidas na adoção (T-09): 1 regra, 2 skills e 4 arquivos de hook.
const FLOOR = 5
const LOAD_RECORD = '.claude/local/registro-de-carga.log'

const KINDS = [
  [/^\.claude\/rules\/(?:.+\/)?([^/]+\.md)$/, (name) => name],
  [/^\.claude\/skills\/([^/]+)\/SKILL\.md$/, (name) => `/${name}`],
  [/^\.claude\/agents\/(?:.+\/)?([^/]+)\.md$/, (name) => name],
  [/^\.claude\/hooks\/(?:.+\/)?([^/]+)$/, (name) => name],
]

/** As peças de `.claude/` na lista, sem o oculto e sem a cópia de segurança do editor. */
export function listPieces(files) {
  return files.flatMap((path) => {
    const name = posix.basename(path)
    if (name.startsWith('.') || name.endsWith('~')) return []
    for (const [pattern, citation] of KINDS) {
      const found = pattern.exec(path)?.[1]
      if (found) return [{ path, citation: citation(found) }]
    }
    return []
  })
}

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
const cites = (context, citation) => new RegExp(`(?<![A-Za-z0-9_-])${escape(citation)}(?![A-Za-z0-9_-])`).test(context)

export function findUncitedPieces(files, context) {
  return listPieces(files)
    .filter(({ citation }) => !cites(context, citation))
    .map(
      ({ path, citation }) =>
        `${path}: o ${CONTEXT_FILE} não cita ${citation} — toda peça de .claude/ é citada no arquivo de contexto: a skill como /nome, o subagente pelo nome, o hook e a regra pelo nome do arquivo (REQ-30)`,
    )
}

const files = listRepositoryFiles()

describe(`o ${CONTEXT_FILE} cita toda peça de .claude/`, () => {
  it('passa do piso de peças lidas', () => {
    const count = listPieces(files).length
    assert.ok(count > FLOOR, `leu ${count} peça(s) em .claude/; precisa passar de ${FLOOR}`)
  })

  it('REQ-30: cada peça está citada, no formato em que se cita', () => {
    assert.ok(files.includes(CONTEXT_FILE), `${CONTEXT_FILE} fora do repositório, e .claude/ tem peças`)
    assert.deepEqual(findUncitedPieces(files, readRepositoryFile(CONTEXT_FILE)), [])
  })

  it('REQ-30: o registro de carga fica fora do git', () => {
    execFileSync('git', ['check-ignore', '--quiet', '--no-index', LOAD_RECORD], { cwd: ROOT_DIRECTORY })
    assert.ok(!files.some((path) => path.startsWith('.claude/local/')), 'há arquivo de .claude/local/ no repositório')
  })
})

describe('a guarda das citações', () => {
  it('reprova hook novo e skill nova sem citação, e passa a peça citada no formato em que se cita', () => {
    const fixture = [
      CONTEXT_FILE,
      '.claude/hooks/citado.sh',
      '.claude/hooks/novo.sh',
      '.claude/hooks/.gitignore',
      '.claude/skills/citada/SKILL.md',
      '.claude/skills/nova/SKILL.md',
      '.claude/rules/regra.md',
      '.claude/settings.json',
    ]
    const context = 'As peças: citado.sh, /citada e regra.md. A skill nova aparece só como nova, sem a barra, e o hook só como novo.sh-antigo.'
    assert.deepEqual(
      findUncitedPieces(fixture, context).map((problem) => problem.split(':')[0]),
      ['.claude/hooks/novo.sh', '.claude/skills/nova/SKILL.md'],
    )
  })
})
