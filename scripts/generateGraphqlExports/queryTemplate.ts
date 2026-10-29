const queryImport = [
  'import { graphqlFetch, FetchCodegenInput } from \'../../../modules/gql-module\'',
  'import { StakeWise{ClientName}Graph } from \'../../../types/graphql/{clientName}\''
].join('\n')

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { variables, url, withTime, subgraphError, modifyResult, onSubgraphError }: FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url,
    query,
    withTime,
    variables,
    subgraphError,
    modifyResult,
    onSubgraphError,
  })
)
`


export {
  queryImport,
  queryTemplate,
}
