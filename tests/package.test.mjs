import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { ROOT_DIRECTORY, findLooseVersions } from './support.mjs'

test('toda dependência tem versão exata', () => {
  const manifest = JSON.parse(readFileSync(join(ROOT_DIRECTORY, 'package.json'), 'utf8'))
  assert.deepEqual(findLooseVersions(manifest), [])
})

test('a guarda acusa faixa de versão', () => {
  const manifest = { dependencies: { exact: '1.0.0', caret: '^1.0.0' }, devDependencies: { tilde: '~2.0.0', prerelease: '3.0.0-rc.1' } }
  assert.deepEqual(findLooseVersions(manifest), [
    'dependencies.caret = "^1.0.0": fixe a versão exata (REQ-33)',
    'devDependencies.tilde = "~2.0.0": fixe a versão exata (REQ-33)',
  ])
})

test('o Node em uso é o do .node-version', () => {
  const pinned = readFileSync(join(ROOT_DIRECTORY, '.node-version'), 'utf8').trim()
  assert.equal(process.versions.node, pinned, `.node-version pede ${pinned}; em uso ${process.versions.node} (REQ-33)`)
})
