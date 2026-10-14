import assert from 'node:assert/strict'
import { join } from 'node:path'
import { test } from 'node:test'
import { HtmlValidate } from 'html-validate'
import { DIST_DIRECTORY } from './support.mjs'
import { listPages } from './html.mjs'

const MINIMUM_PAGES = 12

const validator = new HtmlValidate({
  root: true,
  extends: ['html-validate:recommended', 'html-validate:document'],
  rules: {
    // A página do sistema desenha barras e amostras com valores calculados no build (REQ-10): largura e cor ali são dado.
    'no-inline-style': ['error', { allowedProperties: ['display', 'width', 'background-color'] }],
    // Todo recurso do site é do próprio domínio (REQ-19); o SRI segue exigido para o recurso de outro domínio.
    'require-sri': ['error', { target: 'crossorigin' }],
    // O redirecionamento da raiz sai do Astro com doctype minúsculo, e o HTML não distingue maiúscula.
    'doctype-style': 'off',
  },
})

const describeMessages = (report) =>
  report.results.flatMap((result) =>
    result.messages.map((message) => `${result.filePath}:${message.line}:${message.column} ${message.ruleId} — ${message.message} (REQ-26)`),
  )

test('REQ-26: toda página gerada é HTML válido', async () => {
  const pages = listPages(DIST_DIRECTORY)
  assert.ok(pages.length >= MINIMUM_PAGES, `piso: ${pages.length} páginas lidas, esperado ao menos ${MINIMUM_PAGES}`)
  const problems = []
  for (const pageFile of pages) {
    problems.push(...describeMessages(await validator.validateFile(join(DIST_DIRECTORY, pageFile))))
  }
  assert.deepEqual(problems, [])
})

const validatePage = (body, head = '') =>
  validator.validateString(`<!DOCTYPE html><html lang="pt-br"><head><title>Teste</title>${head}</head><body>${body}</body></html>`, 'teste.html')

const rulesBroken = (report) => report.results.flatMap((result) => result.messages.map((message) => message.ruleId))

test('a guarda acusa tag não fechada, citando a página', async () => {
  const report = await validatePage('<main><p>texto</div></main>')
  assert.equal(report.valid, false)
  assert.ok(describeMessages(report).every((problem) => problem.startsWith('teste.html:')))
})

test('as exceções são estreitas: estilo inline fora da largura e da cor, e script ou CSS de outro domínio sem SRI, reprovam', async () => {
  assert.deepEqual(rulesBroken(await validatePage('<main><p style="width: 40%; background-color: #000">ok</p></main>')), [])
  assert.deepEqual(rulesBroken(await validatePage('<main><p style="color: red">não</p></main>')), ['no-inline-style'])
  assert.deepEqual(rulesBroken(await validatePage('<main></main><script src="https://cdn.example.com/a.js"></script>')), ['require-sri'])
  assert.deepEqual(rulesBroken(await validatePage('<main></main>', '<link rel="stylesheet" href="https://cdn.example.com/a.css">')), ['require-sri'])
  assert.deepEqual(rulesBroken(await validatePage('<main></main>', '<link rel="preload" href="/f.woff2" as="font" type="font/woff2" crossorigin>')), [])
})
