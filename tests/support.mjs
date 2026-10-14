import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT_DIRECTORY = join(dirname(fileURLToPath(import.meta.url)), '..')
export const DIST_DIRECTORY = join(ROOT_DIRECTORY, 'dist')

/**
 * O que iria para um commit: o rastreado que ainda existe mais o novo que o
 * .gitignore nao exclui. Ler o git, e nao o disco, faz a maquina e o CI verem
 * o mesmo conjunto.
 */
export function listRepositoryFiles(rootDirectory = ROOT_DIRECTORY) {
  const output = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
    cwd: rootDirectory,
    encoding: 'utf8',
  })
  return [...new Set(output.split('\0'))].filter((filePath) => filePath && existsSync(join(rootDirectory, filePath)))
}

export const readRepositoryFile = (filePath) => readFileSync(join(ROOT_DIRECTORY, filePath), 'utf8')

/** As paginas de secao da tabela da REQ-01; as de projeto e nota saem do conteudo. */
export const SECTION_PAGES = [
  { path: '/pt-br/', locale: 'pt-br' },
  { path: '/en/', locale: 'en' },
  { path: '/pt-br/projetos/', locale: 'pt-br' },
  { path: '/en/projects/', locale: 'en' },
  { path: '/pt-br/notas/', locale: 'pt-br' },
  { path: '/en/notes/', locale: 'en' },
  { path: '/pt-br/sistema/', locale: 'pt-br' },
  { path: '/en/system/', locale: 'en' },
  { path: '/pt-br/sobre/', locale: 'pt-br' },
  { path: '/en/about/', locale: 'en' },
]

const ENTRY_SEGMENTS = {
  projects: { 'pt-br': 'projetos', en: 'projects' },
  notes: { 'pt-br': 'notas', en: 'notes' },
}

export function isDraft(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return Boolean(frontmatter && /^draft:\s*true\s*$/m.test(frontmatter[1]))
}

export function listPublishedEntries(files, readFile) {
  const entries = []
  for (const filePath of files) {
    const match = filePath.match(/^src\/content\/(projects|notes)\/(pt-br|en)\/([^/]+)\.mdx?$/)
    if (!match || isDraft(readFile(filePath))) continue
    const [, collection, locale, slug] = match
    entries.push({ path: `/${locale}/${ENTRY_SEGMENTS[collection][locale]}/${slug}/`, locale })
  }
  return entries
}

export const pageFile = (distDirectory, pagePath) => join(distDirectory, pagePath, 'index.html')

export function findMissingPages(distDirectory, pages) {
  return pages
    .filter((page) => !existsSync(pageFile(distDirectory, page.path)))
    .map((page) => `${page.path} não existe no site gerado (REQ-01)`)
}

export function findLanguageMismatches(distDirectory, pages) {
  const problems = []
  for (const page of pages) {
    const file = pageFile(distDirectory, page.path)
    if (!existsSync(file)) continue
    const declared = readFileSync(file, 'utf8').match(/<html[^>]*\slang="([^"]+)"/)?.[1]
    if (declared !== page.locale) {
      problems.push(`${page.path} declara lang="${declared ?? 'nenhum'}", e o endereço pede "${page.locale}" (REQ-01)`)
    }
  }
  return problems
}

export function findRedirectProblems(html) {
  const requirements = [
    ['o redirecionamento para /pt-br/', /<meta http-equiv="refresh" content="0;url=\/pt-br\/"/],
    ['o robots noindex', /<meta name="robots" content="noindex"/],
    ['o canonical em /pt-br/', /<link rel="canonical" href="https:\/\/sisbodeveloper\.com\.br\/pt-br\/"/],
  ]
  return requirements
    .filter(([, pattern]) => !pattern.test(html))
    .map(([label]) => `a raiz não tem ${label} (REQ-02)`)
}

const EXACT_VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/

export function findLooseVersions(manifest) {
  return ['dependencies', 'devDependencies', 'optionalDependencies'].flatMap((section) =>
    Object.entries(manifest[section] ?? {})
      .filter(([, version]) => !EXACT_VERSION.test(version))
      .map(([name, version]) => `${section}.${name} = "${version}": fixe a versão exata (REQ-33)`),
  )
}
