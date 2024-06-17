import type { CodegenConfig } from '@graphql-codegen/cli'

import { Network } from './src/utils/enums'
import configs from './src/utils/configs'


// For every network we have same gql shema, so we can use just Mainnet here
const urls = configs[Network.Mainnet].api

// https://the-guild.dev/graphql/codegen/plugins/typescript/typescript
const typesConfig = {
  maybeValue: 'T',
  defaultScalarType: 'string', // sets BigDecimal to string instead of any
  noExport: true, // replaced with namespace
  enumsAsTypes: true,
  skipTypename: true,
  avoidOptionals: true, // uses a: Maybe instead of a?: Maybe
  dedupeFragments: true,
}

// https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-urql
const requestsConfig = {
  maybeValue: 'T',
  defaultScalarType: 'string',
  operationResultSuffix: 'Payload', // gives suffix to payload type
  noExport: false, // disables export by default
  noGraphQLTag: true,
  skipTypename: true,
  avoidOptionals: true, // uses a: Maybe instead of a?: Maybe
  dedupeFragments: false, // removes fragment duplication
  arrayInputCoercion: false, // strict array types
}

type Source = keyof typeof urls

const getSchemaOutput = (source: Source): CodegenConfig['generates'][string] => {
  return {
    schema: urls[source],
    plugins: [ 'schema-ast' ],
  }
}

const getTypesOutput = (source: Source): CodegenConfig['generates'][string] => {
  return {
    schema: urls[source],
    config: typesConfig,
    plugins: [ 'typescript' ],
  }
}

const getRequestsOutput = (source: Source): CodegenConfig['generates'][string] => {
  return {
    schema: urls[source],
    config: requestsConfig,
    plugins: [
      'typescript-operations',
    ],
    preset: 'near-operation-file',
    documents: [ `./src/graphql/${source}/**/*.graphql` ],
    presetConfig: {
      baseTypesPath: `types/graphql/${source}.d.ts`,
      extension: '.graphql.ts',
    },
  }
}

const generateConfig = (): CodegenConfig => {
  const generates: CodegenConfig['generates'] = {}

  Object.keys(urls).forEach((source) => {
    const outputs = {
      schema: {
        path: `src/graphql/${source}/schema.graphql`,
        config: getSchemaOutput(source as Source),
      },
      types: {
        path: `src/types/graphql/${source}.d.ts`,
        config: getTypesOutput(source as Source),
      },
      hooks: {
        path: `src/graphql/${source}`,
        config: getRequestsOutput(source as Source),
      },
    }

    Object.keys(outputs).forEach((outputType) => {
      const { path, config } = outputs[outputType as keyof typeof outputs]

      generates[path] = config
    })
  })

  return {
    generates,
  }
}

const result = generateConfig()


export default result
