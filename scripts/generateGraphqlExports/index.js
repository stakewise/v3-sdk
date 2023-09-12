const path = require('path')

const addGraphqlNamespace = require('./addGraphqlNamespace')
const generateGraphqlQueryFiles = require('./generateGraphqlQueryFiles')


const endpoints = [
  {
    dir: path.resolve(__dirname, '../../src/graphql/backend'),
    types: path.resolve(__dirname, '../../src/types/graphql/backend.d.ts'),
    client: 'backend',
  },
  {
    dir: path.resolve(__dirname, '../../src/graphql/subgraph'),
    types: path.resolve(__dirname, '../../src/types/graphql/subgraph.d.ts'),
    client: 'subgraph',
  },
]

try {
  endpoints.forEach(({ dir, types, client }) => {
    addGraphqlNamespace(types, client)
    generateGraphqlQueryFiles(dir, client)
  })
}
catch (error) {
  console.error('Failed to generate graphql exports', error)
}
