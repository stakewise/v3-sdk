import fs from 'fs'
import path from 'path'

import string from './string'
import mutationTemplate from './mutationTemplate'
import { queryImport, queryTemplate } from './queryTemplate'


// If there is a comment that may have a null value, we force the type of that field to `null | T`
const getNullableTypes = (dirPath: string) => {
  const nullRegExp = /\snull(\s|,)/

  const schema = fs.readFileSync(path.resolve(dirPath, 'schema.graphql'), 'utf8')
  const nullableTypes: Record<string, string[]> = {}

  schema
    .split(/\ntype /)
    .filter((typeContent) => nullRegExp.test(typeContent))
    .forEach((typeContent) => {
      const title = typeContent.split(' ')[0]
      const fields: string[] = []
      const filteredContent = typeContent.split(/\n/).filter((line) => line.replace(/"|\s/g, ''))

      filteredContent.forEach((line, index) => {
        const nullableField = filteredContent[index + 1]?.replace(/\s+|:.+/g, '')

        if (nullRegExp.test(line) && nullableField) {
          fields.push(nullableField)
        }
      })

      nullableTypes[title] = fields
    })

  return nullableTypes
}

const getGraphqlQuery = (tsFilePath: string) => {
  const graphqlPath = tsFilePath.replace(/\.ts$/, '')
  const graphqlQuery = fs.readFileSync(graphqlPath, 'utf8')
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')

  const fragments: string[] = []

  graphqlQuery
    .split('...')
    .forEach((fragment, index) => {
      const isInterface = /^\s?on\s/.test(fragment)

      if (index && !isInterface) {
        const fragmentName = string.decapitalize(fragment.replace(/\s.*/, ''))

        fragments.push(`${fragmentName}Fragment`)
      }
    })

  const query = `const query = '${graphqlQuery}'`

  return {
    query: fragments?.length ? `${query}.concat(${fragments.join(', ')})` : query,
    fragments,
  }
}

const getFragmentContent = (tsFilePath: string) => {
  const { query, fragments } = getGraphqlQuery(tsFilePath)

  const fragmentName = tsFilePath
    .replace(/.+\//, '')
    .replace(/\.graphql\.ts$/, '')

  const fragmentImports = fragments
    .map((fragment) => `import { ${fragment} } from './${fragment.replace(/Fragment/, '')}.graphql'`)
    .join('\n')

  return {
    fileContent: query.replace(/const query/, `const ${fragmentName}Fragment`),
    fragmentImports,
  }
}

const getQueryContent = (client: string, queryName: string, tsFilePath: string) => {
  const { query, fragments } = getGraphqlQuery(tsFilePath)

  const isQuery = /Query/.test(queryName)

  const templateString = isQuery ? queryTemplate : mutationTemplate

  const template = templateString
    .replace(/\{queryName}/g, string.decapitalize(queryName))
    .replace(/\{ClientName}/g, string.capitalize(client))
    .replace(/\{QueryName}/g, queryName)
    .replace(/\{clientName}/g, client)

  const fragmentImports = fragments.length
    ? `import { ${fragments.join(', ')} } from '../fragments'`
    : ''

  return {
    fileContent: [ query, template ].join('\n'),
    fragmentImports,
  }
}

const getFileExports = (queryName: string) => {
  const isQuery = /Query/.test(queryName)
  const isMutation = /Mutation/.test(queryName)
  const isFragment = !isQuery && !isMutation
  const fileName = `${string.decapitalize(queryName)}.graphql`

  if (isFragment) {
    return [
      `export { ${string.decapitalize(queryName)}Fragment }`,
      `export { ${string.decapitalize(queryName)}Fragment } from './${fileName}'`,
    ]
  }

  const fetchTitle = isQuery ? `fetch${queryName}` : `submit${queryName}`
  const payloadTitle = `${queryName}Payload`
  const variablesTitle = `${queryName}Variables`

  const fileExports = [
    `export { ${fetchTitle} }`,
    `export type { ${payloadTitle}, ${variablesTitle} }`,
    '',
  ]

  const indexFileExports = fileExports
    .filter(Boolean)
    .map((fileExport) => `${fileExport} from './${fileName}'`)

  return [ fileExports, indexFileExports ].map((fileExports) => fileExports.join('\n'))
}

const getFileTypes = (client: string, nullableTypes: Record<string, string[]>, tsFilePath: string) => {
  let fileTypes = fs.readFileSync(tsFilePath, 'utf8')
    .replace(/import \* as Types from .*\n\n/, '')
    .replace(/import \{ TypedDocumentNode .*/, '')
    .replace(/;\n+/g, '\n')
    .replace(/Types/g, `StakeWise${string.capitalize(client)}Graph`)
    .replace(/export /g, '')

  const nullableKeys = Object.keys(nullableTypes).filter((key) => {
    return fileTypes.toLowerCase().includes(` ${key.toLowerCase()}`)
  })

  if (nullableKeys.length) {
    const nullableFields = nullableKeys.map((key) => nullableTypes[key]).flat()

    nullableFields.forEach((field) => {
      fileTypes = fileTypes.replace(new RegExp(` ${field}: `, 'g'), ` ${field}: null | `)
    })
  }

  return fileTypes
}

const generateGraphqlQueryFiles = (dirPath: string, client: string) => {
  const nullableTypes = client === 'backend' ? {} : getNullableTypes(dirPath)

  const gqlFolders = fs.readdirSync(dirPath)
    .filter((gqlModelName) => {
      const gqlModelDir = path.resolve(dirPath, gqlModelName)

      return fs.lstatSync(gqlModelDir).isDirectory()
    })

  gqlFolders.forEach((gqlModelName) => {
    const gqlModelDir = path.resolve(dirPath, gqlModelName)

    const gqlFiles = fs.readdirSync(gqlModelDir)
      .filter((fileName) => /\.graphql$/.test(fileName))
      .sort((a, b) => a.length > b.length ? 1 : -1)

    const indexExports: string[] = []
    const isFragments = gqlModelName === 'fragments'

    gqlFiles.forEach((gqlFileName) => {
      const tsFilePath = path.resolve(gqlModelDir, `${gqlFileName}.ts`)

      const queryName = string.capitalize(gqlFileName.replace(/\.graphql$/, ''))
      const [ fileExports, indexFileExports ] = getFileExports(queryName)

      let file = ''

      if (isFragments) {
        const { fileContent, fragmentImports } = getFragmentContent(tsFilePath)

        file = [
          fragmentImports,
          fileContent,
          fileExports,
        ]
          .filter(Boolean)
          .join('\n\n')
      }
      else {
        const isQuery = /Query/.test(queryName)

        const fileTypes = getFileTypes(client, nullableTypes, tsFilePath)
        const { fragmentImports, fileContent } = getQueryContent(client, queryName, tsFilePath)

        const fileImports = isQuery
          ? queryImport
              .replace(/\{ClientName}/g, string.capitalize(client))
              .replace(/\{clientName}/g, client)
          : ''


        const imports = fragmentImports
          ? fileImports.concat(`\n${fragmentImports}\n`)
          : fileImports

        file = [
          imports,
          fileTypes,
          fileContent,
          fileExports,
        ]
          .filter(Boolean)
          .join('\n\n')
      }

      indexExports.push(indexFileExports)

      // Write graphql.ts file
      fs.writeFileSync(tsFilePath, file, 'utf8')
    })

    // Write index file with exports
    const indexFilePath = path.resolve(gqlModelDir, 'index.ts')
    const indexFileString = isFragments
      ? indexExports.join('\n').concat('\n')
      : indexExports.join('\n\n').concat('\n')

    fs.writeFileSync(indexFilePath, indexFileString, 'utf8')
  })

  const rootIndexFileContent = gqlFolders
    .filter((folder) => folder !== 'fragments')
    .map((folder) => `export * as ${folder} from './${folder}'`)
    .sort((a, b) => a.length < b.length ? -1 : 1)
    .join('\n')
    .concat('\n')

  const rootIndexFilePath = path.resolve(dirPath, 'index.ts')

  fs.writeFileSync(rootIndexFilePath, rootIndexFileContent, 'utf8')
}


export default generateGraphqlQueryFiles
