import { parse } from '@astrojs/compiler-rs'

const MINIMUM_LENGTH = 2
const MAXIMUM_SHORT_SCOPE_LINES = 10
const SCRIPT_PREFIX = '---\n'
const LINTED_EXTENSIONS = /\.(ts|mjs|astro)$/
const CLASS_ATTRIBUTES = new Set(['class', 'className', 'id'])

export const isLinted = (filePath) => LINTED_EXTENSIONS.test(filePath) && !filePath.endsWith('.d.ts')

/**
 * O `.ts` e o `.mjs` entram como script do topo de um `.astro`: o mesmo parser
 * le os tres, e um caminhador so percorre a arvore. As posicoes vem em
 * unidades UTF-16, as mesmas do texto lido pelo Node.
 */
function parseSource(filePath, source) {
  const isAstro = filePath.endsWith('.astro')
  const text = isAstro ? source : `${SCRIPT_PREFIX}${source}\n---\n`
  const { ast, diagnostics } = parse(text, {})
  return { ast, offset: isAstro ? 0 : SCRIPT_PREFIX.length, diagnostics }
}

function collectPattern(pattern, push) {
  if (!pattern) return
  switch (pattern.type) {
    case 'Identifier':
      push(pattern)
      break
    case 'ObjectPattern':
      for (const property of pattern.properties) collectPattern(property.type === 'RestElement' ? property : property.value, push)
      break
    case 'ArrayPattern':
      for (const element of pattern.elements) collectPattern(element, push)
      break
    case 'RestElement':
      collectPattern(pattern.argument, push)
      break
    case 'AssignmentPattern':
      collectPattern(pattern.left, push)
      break
    case 'TSParameterProperty':
      collectPattern(pattern.parameter, push)
      break
  }
}

const isPlainKey = (node) => node.key?.type === 'Identifier' && !node.computed

const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])
const LOOP_TYPES = new Set(['ForStatement', 'ForInStatement', 'ForOfStatement'])
const BLOCK_TYPES = new Set(['BlockStatement', 'StaticBlock', 'SwitchCase', 'Program'])

/**
 * O alcance da variavel e o bloco que a declara: o laco, para a do `for`; a
 * funcao, para o `var`; o bloco mais proximo, para o `let` e o `const`. O
 * `Program` e o nivel do modulo, onde uma letra nunca vale (REQ-24).
 */
function scopeOfDeclarator(ancestors) {
  const declaration = ancestors.at(-1)
  const parent = ancestors.at(-2)
  if (LOOP_TYPES.has(parent?.type)) return parent
  const isEnclosing = declaration?.kind === 'var'
    ? (node) => FUNCTION_TYPES.has(node.type) || node.type === 'Program'
    : (node) => BLOCK_TYPES.has(node.type) || FUNCTION_TYPES.has(node.type)
  return ancestors.findLast(isEnclosing)
}

function collectDeclarations(node, push, pushClassToken, ancestors = []) {
  if (Array.isArray(node)) {
    for (const child of node) collectDeclarations(child, push, pushClassToken, ancestors)
    return
  }
  if (!node || typeof node !== 'object') return

  switch (node.type) {
    case 'VariableDeclarator':
      collectPattern(node.id, (identifier) => push(identifier, scopeOfDeclarator(ancestors)))
      break
    case 'FunctionDeclaration':
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      if (node.id) push(node.id)
      for (const parameter of node.params ?? []) collectPattern(parameter, (identifier) => push(identifier, node))
      break
    case 'ClassDeclaration':
    case 'ClassExpression':
    case 'TSInterfaceDeclaration':
    case 'TSTypeAliasDeclaration':
    case 'TSEnumDeclaration':
    case 'TSEnumMember':
      if (node.id?.type === 'Identifier') push(node.id)
      break
    case 'ImportSpecifier':
    case 'ImportDefaultSpecifier':
    case 'ImportNamespaceSpecifier':
      push(node.local)
      break
    case 'CatchClause':
      collectPattern(node.param, (identifier) => push(identifier, node))
      break
    case 'TSTypeParameter':
      push(node.name)
      break
    case 'Property':
    case 'PropertyDefinition':
    case 'MethodDefinition':
    case 'TSPropertySignature':
    case 'TSMethodSignature':
      if (isPlainKey(node)) push(node.key)
      break
    case 'JSXAttribute':
      if (CLASS_ATTRIBUTES.has(node.name?.name) && node.value?.type === 'Literal' && typeof node.value.value === 'string') {
        pushClassToken(node.value)
      }
      break
  }

  const inner = node.type ? [...ancestors, node] : ancestors
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'start' && key !== 'end' && value && typeof value === 'object') collectDeclarations(value, push, pushClassToken, inner)
  }
}

const lineOf = (source, index) => source.slice(0, Math.max(index, 0)).split('\n').length

/** Devolve os nomes curtos do arquivo e quantos nomes foram examinados, para o piso. */
export function findShortNames(filePath, source) {
  const { ast, offset, diagnostics } = parseSource(filePath, source)
  const problems = []
  const seen = new Set()
  let examined = 0

  const report = (name, start, kind, where) => {
    const key = `${start}:${name}`
    if (seen.has(key)) return
    seen.add(key)
    problems.push(
      `${filePath}:${lineOf(source, start - offset)} — ${kind} "${name}" tem ${name.length} caractere${where}; uma letra só vale em variável ou parâmetro que vive até ${MAXIMUM_SHORT_SCOPE_LINES} linhas (REQ-24)`,
    )
  }

  const linesOf = (node) => lineOf(source, node.end - offset) - lineOf(source, node.start - offset) + 1

  /** Sem `scope`, o nome nao e variavel nem parametro: importacao, tipo, propriedade, funcao. */
  const push = (identifier, scope) => {
    if (!identifier?.name) return
    examined += 1
    if (identifier.name.length >= MINIMUM_LENGTH) return
    if (!scope) return report(identifier.name, identifier.start, 'nome', '')
    if (scope.type === 'Program') return report(identifier.name, identifier.start, 'nome', ' no nível do módulo')
    const lines = linesOf(scope)
    if (lines > MAXIMUM_SHORT_SCOPE_LINES) report(identifier.name, identifier.start, 'nome', ` e vive ${lines} linhas`)
  }

  const pushClassToken = (literal) => {
    for (const token of literal.value.split(/\s+/).filter(Boolean)) {
      examined += 1
      if (token.length < MINIMUM_LENGTH) report(token, literal.start, 'classe ou id', '')
    }
  }

  const errors = (diagnostics ?? []).filter((diagnostic) => diagnostic.severity === 'error' || diagnostic.severity === 'Error')
  if (errors.length > 0) {
    problems.push(`${filePath} — não foi possível ler o arquivo para conferir os nomes: ${errors[0].text ?? errors[0].message ?? 'erro de leitura'} (REQ-24)`)
    return { problems, examined }
  }

  collectDeclarations(ast, push, pushClassToken)
  return { problems, examined }
}
