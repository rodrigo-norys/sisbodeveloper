import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { listRepositoryFiles, readRepositoryFile } from './support.mjs'

/**
 * Toda regra por caminho nomeia, no cabeçalho, a guarda do que nela não pode falhar, e a guarda
 * existe. O cabeçalho é o que vem antes do primeiro título de nível 2; a guarda, o caminho entre
 * crases na frase que diz "tem guarda:" — o teste, ou a ferramenta que o portão de qualidade
 * roda —, e todo caminho dessa frase tem de estar no repositório. A regra que não nomeia guarda,
 * ou que nomeia uma que saiu, é instrução sem garantia: pode não carregar, e nada confere o
 * resultado (REQ-30).
 *
 * Adaptada do exemplo do kit de contexto do `metodo-sdd` (`a20d2c4`), e pelo mesmo motivo que
 * `contexto-cita-pecas.test.mjs`: lê o que iria para um commit, e não só o rastreado.
 *
 * Fica de fora: se a guarda nomeada impõe o que a regra pede, e se a reprovação dela cita a
 * regra — isso se prova por mutação, ao criar a guarda —; e a regra que é só julgamento, que
 * reprova aqui por desenho, e o projeto decide se ela ganha guarda.
 */

// Lida na adoção (T-09): a regra da documentação.
const FLOOR = 0

/** O cabeçalho: sem o frontmatter, até o primeiro título de nível 2, numa linha só. */
function header(text) {
  const body = text.replace(/\r/g, '').replace(/^---\n[\s\S]*?\n---\n/, '')
  const end = body.search(/^## /m)
  return (end === -1 ? body : body.slice(0, end))
    .split('\n')
    .map((line) => line.replace(/^\s*>\s?/, ''))
    .join(' ')
    .replace(/\*/g, '')
}

/** Os caminhos entre crases da frase que diz "tem guarda:"; `null` se o cabeçalho não a tem. */
function namedGuards(text) {
  const plain = header(text)
  const at = plain.search(/tem guarda:/i)
  if (at === -1) return null
  const sentence = plain.slice(at).split(/\.\s+(?=\p{Lu})/u)[0]
  return [...sentence.matchAll(/`([^`]+)`/g)]
    .flatMap(([, span]) => span.split(/\s+/))
    .filter((token) => !/^-|:\/\/|⟨|⟩/.test(token) && (token.includes('/') || /\.\w+$/.test(token)))
}

export const listRules = (files) => files.filter((path) => /^\.claude\/rules\/(?:.+\/)?[^/]+\.md$/.test(path))

export function findRulesWithoutGuard(files, read) {
  const exists = (path) => (path.endsWith('/') ? files.some((file) => file.startsWith(path)) : files.includes(path))
  return listRules(files).flatMap((rule) => {
    const guards = namedGuards(read(rule))
    if (guards === null) {
      return [
        `${rule}: o cabeçalho não nomeia guarda — escreva "O que nela não pode falhar tem guarda: \`<o caminho>\`", como no modelo de regra por caminho (REQ-30)`,
      ]
    }
    if (guards.length === 0) return [`${rule}: "tem guarda:" sem caminho entre crases (REQ-30)`]
    return guards.filter((guard) => !exists(guard)).map((guard) => `${rule}: nomeia ${guard}, que não está no repositório (REQ-30)`)
  })
}

const files = listRepositoryFiles()

describe('cada regra por caminho nomeia a guarda do que não pode falhar', () => {
  it('passa do piso de regras lidas', () => {
    const count = listRules(files).length
    assert.ok(count > FLOOR, `leu ${count} regra(s) em .claude/rules/; precisa passar de ${FLOOR}`)
  })

  it('REQ-30: o cabeçalho de cada regra nomeia uma guarda, e cada caminho nomeado existe', () => {
    assert.deepEqual(findRulesWithoutGuard(files, readRepositoryFile), [])
  })
})

describe('a guarda das regras', () => {
  it('reprova a regra sem guarda nomeada e a que nomeia guarda ausente, e passa a que nomeia guarda presente', () => {
    const sources = {
      '.claude/rules/sem-guarda.md': '---\npaths:\n  - "src/**"\n---\n\n# Sem guarda\n\n> Esta regra é orientação.\n\n## As regras\n\n1. Faça assim.\n',
      '.claude/rules/guarda-ausente.md': '# Ausente\n\n> O que nela não pode falhar tem guarda: `tests/ausente.test.mjs`. O resto é revisão.\n',
      '.claude/rules/guarda-presente.md': '# Presente\n\n> **O que nela não pode falhar tem guarda:** `node tools/motor.mjs` e `tests/presente.test.mjs`. O resto é revisão.\n',
    }
    const fixture = [...Object.keys(sources), 'tools/motor.mjs', 'tests/presente.test.mjs']
    assert.deepEqual(
      findRulesWithoutGuard(fixture, (path) => sources[path]).map((problem) => problem.split(' (REQ-30)')[0]),
      [
        '.claude/rules/sem-guarda.md: o cabeçalho não nomeia guarda — escreva "O que nela não pode falhar tem guarda: `<o caminho>`", como no modelo de regra por caminho',
        '.claude/rules/guarda-ausente.md: nomeia tests/ausente.test.mjs, que não está no repositório',
      ],
    )
  })
})
