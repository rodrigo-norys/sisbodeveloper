import assert from 'node:assert/strict'
import { test } from 'node:test'
import { listRepositoryFiles, readRepositoryFile } from '../support.mjs'
import { findShortNames, isLinted } from './naming.mjs'

const MINIMUM_FILES = 20
const MINIMUM_NAMES = 300

test('REQ-24: nome de uma letra só em variável ou parâmetro de alcance curto', () => {
  const files = listRepositoryFiles().filter(isLinted)
  const problems = []
  let examined = 0
  for (const filePath of files) {
    const result = findShortNames(filePath, readRepositoryFile(filePath))
    problems.push(...result.problems)
    examined += result.examined
  }
  assert.ok(files.length >= MINIMUM_FILES, `piso: ${files.length} arquivos lidos, esperado ao menos ${MINIMUM_FILES}`)
  assert.ok(examined >= MINIMUM_NAMES, `piso: ${examined} nomes examinados, esperado ao menos ${MINIMUM_NAMES} — o caminhador parou de achar declarações?`)
  assert.deepEqual(problems, [])
})

const namesIn = (filePath, source) => findShortNames(filePath, source).problems.map((problem) => problem.split(' — ')[1].match(/"([^"]+)"/)[1])

const loopWithBody = (bodyLines) =>
  ['for (let i = 0; i < 2; i += 1) {', ...Array.from({ length: bodyLines }, () => '  use(i)'), '}'].join('\n')

test('a guarda acusa importação e constante do módulo de uma letra, e laço que passa de 10 linhas, com a linha', () => {
  const source = ["import { z } from 'astro/zod'", 'const t = 1', loopWithBody(9), 'const translate = t'].join('\n')
  assert.deepEqual(findShortNames('src/example.ts', source).problems, [
    'src/example.ts:1 — nome "z" tem 1 caractere; uma letra só vale em variável ou parâmetro que vive até 10 linhas (REQ-24)',
    'src/example.ts:2 — nome "t" tem 1 caractere no nível do módulo; uma letra só vale em variável ou parâmetro que vive até 10 linhas (REQ-24)',
    'src/example.ts:3 — nome "i" tem 1 caractere e vive 11 linhas; uma letra só vale em variável ou parâmetro que vive até 10 linhas (REQ-24)',
  ])
})

test('a guarda deixa passar o índice de laço, a comparação, o callback curto, o catch e o _ que vivem até 10 linhas', () => {
  const source = [
    'export function sortAll(items) {',
    loopWithBody(8),
    '  for (const [k, v] of Object.entries(items)) use(k, v)',
    '  try { use(items) } catch (e) { use(e) }',
    "  const plain = 'a'.replace(/a/g, (_, inner) => inner)",
    '  return items.map((n) => n * 2).sort((a, b) => a - b)',
    '}',
  ].join('\n')
  assert.deepEqual(namesIn('tools/example.mjs', source), [])
})

test('a guarda acusa parâmetro de função longa e callback que passa de 10 linhas', () => {
  const longBody = Array.from({ length: 10 }, () => '  use(v)')
  const source = ['export function compute(v) {', ...longBody, '}', 'export const all = list.map((x) => {', ...longBody, '  return x', '})'].join('\n')
  assert.deepEqual(namesIn('src/example.mjs', source), ['v', 'x'])
})

test('a guarda acusa tipo genérico, propriedade e classe de uma letra no .astro, e não o callback curto do HTML nem o atributo do SVG', () => {
  const source = [
    '---',
    '// comentário com acento não desloca a linha',
    'interface Rgb { r: number; green: number }',
    'function first<C extends string>(value: C) { return value }',
    '---',
    '<ul>{[1, 2].map((x) => <li>{x}</li>)}</ul>',
    '<svg><path d="M0 0" /></svg>',
    '<p class="metric a">ok</p>',
  ].join('\n')
  assert.deepEqual(namesIn('src/example.astro', source), ['r', 'C', 'a'])
})

test('a guarda deixa passar nome de duas letras ou mais e desestruturação com nome longo', () => {
  const source = 'const { data: entry } = load()\nconst [first, second] = pair\nconst id = 1\n'
  assert.deepEqual(namesIn('src/example.mjs', source), [])
})
