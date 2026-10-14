import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { parse } from 'parse5'

export const SITE_ORIGIN = 'https://sisbodeveloper.com.br'

export function listPages(distDirectory) {
  const pages = []
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name)
      if (entry.isDirectory()) visit(entryPath)
      else if (entry.name.endsWith('.html')) pages.push(relative(distDirectory, entryPath).split(sep).join('/'))
    }
  }
  visit(distDirectory)
  return pages.sort()
}

export const parseHtml = (source) => parse(source)

export function walkElements(node, visit) {
  if (node.tagName) visit(node)
  for (const child of node.childNodes ?? []) walkElements(child, visit)
  if (node.content) walkElements(node.content, visit)
}

export const attributeOf = (element, name) => element.attrs?.find((attribute) => attribute.name === name)?.value

export const pageUrlOf = (pageFile) => `/${pageFile.replace(/(^|\/)index\.html$/, '$1')}`

/** O arquivo do site gerado que serve o caminho, ou `null` se nenhum serve. */
export function fileForPath(distDirectory, pathname) {
  const decoded = decodeURIComponent(pathname)
  const candidate = join(distDirectory, decoded)
  if (decoded.endsWith('/')) return existsSync(join(candidate, 'index.html')) ? join(candidate, 'index.html') : null
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  return existsSync(join(candidate, 'index.html')) ? join(candidate, 'index.html') : null
}

export function readPage(distDirectory, pageFile) {
  return parseHtml(readFileSync(join(distDirectory, pageFile), 'utf8'))
}
