import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import {
  DIST_DIRECTORY,
  SECTION_PAGES,
  findLanguageMismatches,
  findMissingPages,
  findRedirectProblems,
  isDraft,
  listPublishedEntries,
  listRepositoryFiles,
  readRepositoryFile,
} from './support.mjs'

const entries = listPublishedEntries(listRepositoryFiles(), readRepositoryFile)
const expectedPages = [...SECTION_PAGES, ...entries]

test('o site gerado existe', () => {
  assert.ok(existsSync(join(DIST_DIRECTORY, 'index.html')), 'dist/ não existe: rode npm run build:verify antes dos testes')
})

test('REQ-01: cada página da tabela existe no site gerado', () => {
  assert.ok(entries.length >= 1, 'piso: nenhum projeto ou nota publicado em src/content/ — o padrão de caminho parou de casar?')
  assert.deepEqual(findMissingPages(DIST_DIRECTORY, expectedPages), [])
})

test('REQ-01: cada página declara o idioma do endereço', () => {
  assert.deepEqual(findLanguageMismatches(DIST_DIRECTORY, expectedPages), [])
})

test('REQ-02: a raiz leva a /pt-br/, fora da indexação', () => {
  assert.deepEqual(findRedirectProblems(readFileSync(join(DIST_DIRECTORY, 'index.html'), 'utf8')), [])
})

test('a guarda acusa página ausente e idioma trocado', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sisbodeveloper-dist-'))
  try {
    mkdirSync(join(fixture, 'pt-br'), { recursive: true })
    writeFileSync(join(fixture, 'pt-br', 'index.html'), '<!doctype html><html lang="en"><body></body></html>')
    const pages = [
      { path: '/pt-br/', locale: 'pt-br' },
      { path: '/en/', locale: 'en' },
    ]
    assert.deepEqual(findMissingPages(fixture, pages), ['/en/ não existe no site gerado (REQ-01)'])
    assert.deepEqual(findLanguageMismatches(fixture, pages), [
      '/pt-br/ declara lang="en", e o endereço pede "pt-br" (REQ-01)',
    ])
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})

test('a guarda acusa a raiz sem redirecionamento nem noindex', () => {
  assert.deepEqual(findRedirectProblems('<!doctype html><title>Início</title>'), [
    'a raiz não tem o redirecionamento para /pt-br/ (REQ-02)',
    'a raiz não tem o robots noindex (REQ-02)',
    'a raiz não tem o canonical em /pt-br/ (REQ-02)',
  ])
})

test('rascunho fica fora das páginas esperadas, e só o frontmatter decide', () => {
  const sources = {
    'src/content/projects/pt-br/publicado.mdx': '---\ntitle: A\n---\ncorpo',
    'src/content/notes/en/rascunho.mdx': '---\ntitle: B\ndraft: true\n---\ncorpo',
    'src/content/notes/pt-br/citacao.mdx': '---\ntitle: C\n---\ndraft: true no corpo não conta',
    'src/content/profile/pt-br.mdx': '---\ntitle: D\n---\nperfil não é entrada',
  }
  const readSource = (filePath) => sources[filePath]
  assert.equal(isDraft(sources['src/content/notes/en/rascunho.mdx']), true)
  assert.deepEqual(listPublishedEntries(Object.keys(sources), readSource), [
    { path: '/pt-br/projetos/publicado/', locale: 'pt-br' },
    { path: '/pt-br/notas/citacao/', locale: 'pt-br' },
  ])
})
