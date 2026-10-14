import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { gzipSync } from 'node:zlib'
import { DIST_DIRECTORY } from './support.mjs'
import { SITE_ORIGIN, attributeOf, fileForPath, listPages, pageUrlOf, parseHtml, walkElements } from './html.mjs'
import { WEIGHT_BUDGET_BYTES } from './weight-budget.mjs'

const MINIMUM_PAGES = 12
// O dado estruturado da REQ-11 é bloco de dados: o navegador não o executa.
const ALLOWED_SCRIPT_TAG = '<script type="application/ld+json">'
const SCRIPT_TAG = /<script\b[^>]*>/gi
const FONT_URL = /url\(\s*["']?([^"')]+\.woff2)["']?\s*\)/g

const relTokens = (element) => (attributeOf(element, 'rel') ?? '').toLowerCase().split(/\s+/)
const textOf = (element) => (element.childNodes ?? []).map((child) => child.value ?? '').join('')

/** O que a página carrega para mostrar o texto: ela mesma, as folhas de estilo e as fontes que elas declaram. */
function collectResources(document, pageUrl) {
  const stylesheets = new Set()
  const fonts = new Set()
  const inlineStyles = []
  walkElements(document, (element) => {
    const href = attributeOf(element, 'href')
    if (element.tagName === 'style') inlineStyles.push(textOf(element))
    if (element.tagName !== 'link' || !href) return
    if (relTokens(element).includes('stylesheet')) stylesheets.add(new URL(href, pageUrl).href)
    if (relTokens(element).includes('preload') && attributeOf(element, 'as') === 'font') fonts.add(new URL(href, pageUrl).href)
  })
  return { stylesheets, fonts, inlineStyles }
}

const addFontsFrom = (css, baseUrl, fonts) => {
  for (const [, fontUrl] of css.matchAll(FONT_URL)) fonts.add(new URL(fontUrl, baseUrl).href)
}

/** O arquivo do site gerado que serve a URL, ou `null` se ela sai do site ou nenhum arquivo a serve. */
function fileForUrl(distDirectory, url) {
  const target = new URL(url)
  return target.origin === SITE_ORIGIN ? fileForPath(distDirectory, target.pathname) : null
}

export function measurePage(distDirectory, pageFile) {
  const html = readFileSync(join(distDirectory, pageFile))
  const pageUrl = new URL(pageUrlOf(pageFile), SITE_ORIGIN)
  const { stylesheets, fonts, inlineStyles } = collectResources(parseHtml(html.toString('utf8')), pageUrl)
  for (const css of inlineStyles) addFontsFrom(css, pageUrl, fonts)

  const unresolved = []
  let cssBytes = 0
  for (const stylesheetUrl of stylesheets) {
    const file = fileForUrl(distDirectory, stylesheetUrl)
    if (!file) {
      unresolved.push(stylesheetUrl)
      continue
    }
    const css = readFileSync(file)
    cssBytes += gzipSync(css).length
    addFontsFrom(css.toString('utf8'), stylesheetUrl, fonts)
  }

  let fontBytes = 0
  for (const fontUrl of fonts) {
    const file = fileForUrl(distDirectory, fontUrl)
    if (file) fontBytes += statSync(file).size
    else unresolved.push(fontUrl)
  }

  const htmlBytes = gzipSync(html).length
  return { page: pageUrlOf(pageFile), html: htmlBytes, css: cssBytes, fonts: fontBytes, total: htmlBytes + cssBytes + fontBytes, unresolved }
}

export function findOverweightPages(distDirectory, budgetBytes) {
  const weights = listPages(distDirectory).map((pageFile) => measurePage(distDirectory, pageFile))
  const problems = []
  for (const weight of weights) {
    for (const url of weight.unresolved) problems.push(`${weight.page} → ${url}: fora do site gerado, peso não medido (REQ-25)`)
    if (weight.total > budgetBytes) {
      problems.push(
        `${weight.page} pesa ${weight.total} B (HTML ${weight.html}, CSS ${weight.css}, fontes ${weight.fonts}), acima do teto de ${budgetBytes} B (REQ-25); as entradas do teto estão em tests/weight-budget.mjs`,
      )
    }
  }
  return { problems, weights }
}

export function findOwnScripts(distDirectory) {
  return listPages(distDirectory).flatMap((pageFile) =>
    [...readFileSync(join(distDirectory, pageFile), 'utf8').matchAll(SCRIPT_TAG)]
      .map(([tag]) => tag)
      .filter((tag) => tag !== ALLOWED_SCRIPT_TAG)
      .map((tag) => `${pageUrlOf(pageFile)}: ${tag} é script próprio (REQ-25, P-04); só o dado estruturado passa`),
  )
}

test('REQ-25: toda página fica dentro do orçamento de peso', () => {
  const { problems, weights } = findOverweightPages(DIST_DIRECTORY, WEIGHT_BUDGET_BYTES)
  assert.ok(weights.length >= MINIMUM_PAGES, `piso: ${weights.length} páginas medidas, esperado ao menos ${MINIMUM_PAGES}`)
  for (const part of ['css', 'fonts']) {
    const measured = weights.filter((weight) => weight[part] > 0).length
    assert.ok(measured >= weights.length - 1, `piso: ${measured} de ${weights.length} páginas com ${part} medido; só a raiz, que redireciona, não tem casca`)
  }
  assert.deepEqual(problems, [])
})

test('REQ-25: nenhuma página traz script próprio', () => {
  assert.ok(listPages(DIST_DIRECTORY).length >= MINIMUM_PAGES, `piso: esperado ao menos ${MINIMUM_PAGES} páginas`)
  assert.deepEqual(findOwnScripts(DIST_DIRECTORY), [])
})

test('a guarda acusa página acima do teto e script próprio, e deixa passar a página no teto e o dado estruturado', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sisbodeveloper-weight-'))
  const writeFile = (filePath, content) => {
    mkdirSync(dirname(join(fixture, filePath)), { recursive: true })
    writeFileSync(join(fixture, filePath), content)
  }
  const writePage = (pageFile, head, body = '') =>
    writeFile(pageFile, `<!DOCTYPE html><html lang="pt-br"><head><title>Teste</title>${head}</head><body>${body}</body></html>`)
  try {
    writeFile('_astro/site.css', '@font-face{font-family:Texto;src:url("fonts/texto.woff2")}')
    writeFile('_astro/fonts/texto.woff2', Buffer.alloc(1000))
    writeFile('_astro/fonts/titulo.woff2', Buffer.alloc(4000))
    const shell = '<link rel="stylesheet" href="/_astro/site.css"><link rel="preload" href="/_astro/fonts/texto.woff2" as="font" type="font/woff2" crossorigin>'
    writePage('pt-br/index.html', shell)
    writePage('en/index.html', `${shell}<style>@font-face{font-family:Titulo;src:url("/_astro/fonts/titulo.woff2")}</style>`)
    writePage('pt-br/sobre/index.html', shell, `${ALLOWED_SCRIPT_TAG}{"@type":"Person"}</script>`)
    writePage('en/about/index.html', shell, '<script>alert(1)</script><SCRIPT type="module" src="/a.js"></SCRIPT>')
    writePage('pt-br/notas/index.html', '<link rel="stylesheet" href="/_astro/apagado.css">')

    const budgetBytes = 3000
    const { problems, weights } = findOverweightPages(fixture, budgetBytes)
    const weightOf = (page) => weights.find((weight) => weight.page === page)
    assert.equal(weightOf('/pt-br/').fonts, 1000)
    assert.ok(weightOf('/pt-br/').total <= budgetBytes)
    const english = weightOf('/en/')
    assert.equal(english.fonts, 5000)
    assert.deepEqual(problems, [
      `/en/ pesa ${english.total} B (HTML ${english.html}, CSS ${english.css}, fontes 5000), acima do teto de ${budgetBytes} B (REQ-25); as entradas do teto estão em tests/weight-budget.mjs`,
      `/pt-br/notas/ → ${SITE_ORIGIN}/_astro/apagado.css: fora do site gerado, peso não medido (REQ-25)`,
    ])

    assert.deepEqual(findOwnScripts(fixture), [
      '/en/about/: <script> é script próprio (REQ-25, P-04); só o dado estruturado passa',
      '/en/about/: <SCRIPT type="module" src="/a.js"> é script próprio (REQ-25, P-04); só o dado estruturado passa',
    ])
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
