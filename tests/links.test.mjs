import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, sep } from 'node:path'
import { test } from 'node:test'
import { DIST_DIRECTORY } from './support.mjs'
import { SITE_ORIGIN, attributeOf, fileForPath, listPages, pageUrlOf, readPage, walkElements } from './html.mjs'

const MINIMUM_PAGES = 12
const MINIMUM_LINKS = 150
const LINK_ATTRIBUTES = {
  'a': ['href'],
  'area': ['href'],
  'link': ['href'],
  'img': ['src', 'srcset'],
  'source': ['src', 'srcset'],
  'script': ['src'],
}

const urlsIn = (attributeName, value) =>
  attributeName === 'srcset' ? value.split(',').map((candidate) => candidate.trim().split(/\s+/)[0]).filter(Boolean) : [value]

function describePage(document) {
  const urls = []
  const ids = new Set()
  walkElements(document, (element) => {
    const id = attributeOf(element, 'id')
    if (id) ids.add(id)
    if (element.tagName === 'a' && attributeOf(element, 'name')) ids.add(attributeOf(element, 'name'))
    for (const attributeName of LINK_ATTRIBUTES[element.tagName] ?? []) {
      const value = attributeOf(element, attributeName)
      if (value) urls.push(...urlsIn(attributeName, value))
    }
  })
  return { urls, ids }
}

/** Resolve o link contra a página; devolve `null` para o que sai do site — outro domínio, `mailto:`, `tel:`. */
function resolveInternal(pageFile, url) {
  const target = new URL(url, new URL(pageUrlOf(pageFile), SITE_ORIGIN))
  if (target.origin !== SITE_ORIGIN) return null
  return { pathname: target.pathname, fragment: decodeURIComponent(target.hash.slice(1)) }
}

export function findBrokenLinks(distDirectory) {
  const pages = listPages(distDirectory)
  const descriptions = new Map()
  const describe = (pageFile) => {
    if (!descriptions.has(pageFile)) descriptions.set(pageFile, describePage(readPage(distDirectory, pageFile)))
    return descriptions.get(pageFile)
  }

  const problems = []
  let linksChecked = 0
  let anchorsChecked = 0
  for (const pageFile of pages) {
    for (const url of describe(pageFile).urls) {
      const resolved = resolveInternal(pageFile, url)
      if (!resolved) continue
      linksChecked += 1
      const targetFile = fileForPath(distDirectory, resolved.pathname)
      if (!targetFile) {
        problems.push(`${pageUrlOf(pageFile)} → ${url}: destino inexistente no site gerado (REQ-26)`)
        continue
      }
      if (!resolved.fragment) continue
      anchorsChecked += 1
      const targetPage = relative(distDirectory, targetFile).split(sep).join('/')
      if (!targetPage.endsWith('.html') || !describe(targetPage).ids.has(resolved.fragment)) {
        problems.push(`${pageUrlOf(pageFile)} → ${url}: âncora #${resolved.fragment} inexistente no destino (REQ-26)`)
      }
    }
  }
  return { problems, pages: pages.length, linksChecked, anchorsChecked }
}

test('REQ-26: todo link interno e toda âncora levam a um destino existente', () => {
  const { problems, pages, linksChecked, anchorsChecked } = findBrokenLinks(DIST_DIRECTORY)
  assert.ok(pages >= MINIMUM_PAGES, `piso: ${pages} páginas lidas, esperado ao menos ${MINIMUM_PAGES}`)
  assert.ok(linksChecked >= MINIMUM_LINKS, `piso: ${linksChecked} links internos conferidos, esperado ao menos ${MINIMUM_LINKS}`)
  assert.ok(anchorsChecked >= pages - 1, `piso: ${anchorsChecked} âncoras conferidas; o link de pular ao conteúdo deveria dar uma por página`)
  assert.deepEqual(problems, [])
})

test('a guarda acusa página inexistente e âncora sem id, e não confere link externo', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sisbodeveloper-links-'))
  const writePage = (pageFile, body) => {
    mkdirSync(dirname(join(fixture, pageFile)), { recursive: true })
    writeFileSync(join(fixture, pageFile), `<!DOCTYPE html><html lang="pt-br"><head><title>Teste</title></head><body>${body}</body></html>`)
  }
  try {
    writePage('pt-br/index.html', [
      '<a href="#conteudo">pular</a><main id="conteudo"></main>',
      '<a href="/pt-br/sobre/">sobre</a>',
      '<a href="/pt-br/inexistente/">quebrado</a>',
      '<a href="/pt-br/sobre/#nada">âncora quebrada</a>',
      `<a href="${SITE_ORIGIN}/pt-br/sobre/#perfil">canônico</a>`,
      '<a href="https://www.linkedin.com/in/alguem/">externo</a>',
      '<a href="mailto:alguem@example.com">e-mail</a>',
    ].join(''))
    writePage('pt-br/sobre/index.html', '<section id="perfil"></section>')
    assert.deepEqual(findBrokenLinks(fixture).problems, [
      '/pt-br/ → /pt-br/inexistente/: destino inexistente no site gerado (REQ-26)',
      '/pt-br/ → /pt-br/sobre/#nada: âncora #nada inexistente no destino (REQ-26)',
    ])
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
