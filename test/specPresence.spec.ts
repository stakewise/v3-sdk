import { join } from 'node:path'
import { existsSync, readdirSync } from 'node:fs'

import { describe, expect } from 'vitest'

import { it } from '.'


type Exception = {
  path: string
  reason: string
}

const root = join(import.meta.dirname, '..')
const servicesPath = 'src/services'

const exceptions: Exception[] = [
  {
    path: 'src/services/vault/transactions/util',
    reason: 'shared helpers of the transactions, tested through their specs',
  },
]

const folderGroups = [
  { name: 'requests' },
  { name: 'transactions' },
]

const readDirectory = (path: string) => {
  if (!existsSync(join(root, path))) {
    return []
  }

  return readdirSync(join(root, path), { withFileTypes: true })
}

const getDirectories = (path: string) => (
  readDirectory(path)
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => join(path, name))
)

const checkHasSpec = (path: string): boolean => (
  readDirectory(path).some((entry) => (
    entry.isDirectory() ? checkHasSpec(join(path, entry.name)) : entry.name.endsWith('.spec.ts')
  ))
)

const checkIsSourceFile = (name: string) => (
  name.endsWith('.ts') && !name.endsWith('.spec.ts') && !name.endsWith('.d.ts') && name !== 'index.ts'
)

const checkIsException = (path: string) => exceptions.some((exception) => exception.path === path)

const services = getDirectories(servicesPath)
const helperPaths = [ ...services.map((service) => join(service, 'helpers')), join(servicesPath, 'utils') ]

const getFoldersWithoutSpec = (paths: string[]) => (
  paths
    .flatMap(getDirectories)
    .filter((path) => !checkIsException(path) && !checkHasSpec(path))
)

const getFilesWithoutSpec = (paths: string[]) => (
  paths.flatMap((path) => {
    const names = readDirectory(path).map(({ name }) => name)

    return names
      .filter((name) => checkIsSourceFile(name) && !names.includes(name.replace(/\.ts$/, '.spec.ts')))
      .map((name) => join(path, name))
      .filter((filePath) => !checkIsException(filePath))
  })
)

describe('specPresence', () => {
  it.for(folderGroups)('$name', ({ name }) => {
    const paths = services.map((service) => join(service, name))
    const folders = paths.flatMap(getDirectories)
    const foldersWithoutSpec = getFoldersWithoutSpec(paths)

    expect(folders.length).toBeGreaterThan(0)
    expect(foldersWithoutSpec).toEqual([])
  })

  it('helpers', () => {
    const folders = helperPaths.flatMap(getDirectories)
    const files = helperPaths.flatMap(readDirectory).filter(({ name }) => checkIsSourceFile(name))
    const foldersWithoutSpec = getFoldersWithoutSpec(helperPaths)
    const filesWithoutSpec = getFilesWithoutSpec(helperPaths)

    expect(folders.length).toBeGreaterThan(0)
    expect(files.length).toBeGreaterThan(0)
    expect(foldersWithoutSpec).toEqual([])
    expect(filesWithoutSpec).toEqual([])
  })

  it('exceptions', () => {
    const missingPaths = exceptions.filter(({ path }) => !existsSync(join(root, path)))
    const specPaths = exceptions.filter(({ path }) => checkHasSpec(path))

    expect(missingPaths).toEqual([])
    expect(specPaths).toEqual([])
  })
})
