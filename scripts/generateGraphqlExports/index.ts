import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

import removeOldFiles from './removeOldFiles'
import addGraphqlNamespace from './addGraphqlNamespace'
import generateGraphqlQueryFiles from './generateGraphqlQueryFiles'


const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const endpoints = [
  {
    dir: resolve(__dirname, '../../src/graphql/backend'),
    types: resolve(__dirname, '../../src/types/graphql/backend.d.ts'),
    client: 'backend',
  },
  {
    dir: resolve(__dirname, '../../src/graphql/subgraph'),
    types: resolve(__dirname, '../../src/types/graphql/subgraph.d.ts'),
    client: 'subgraph',
  },
]

try {
  endpoints.forEach(({ dir, types, client }) => {
    removeOldFiles(dir)
    addGraphqlNamespace(types, client)
    generateGraphqlQueryFiles(dir, client)
  })
}
catch (error) {
  console.error('Failed to generate graphql exports', error)
}
