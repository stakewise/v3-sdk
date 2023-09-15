const queryImport = [
  'import { graphqlFetch, FetchCodegenInput } from \'modules/gql-module\'',
  'import { {ClientName}Graph } from \'types/graphql/{clientName}\'',
  'import { constants } from \'helpers\'',
].join('\n')

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { variables, network, modifyResult }: FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url: constants.urls[network].{clientName},
    query,
    variables,
    modifyResult,
  })
)
`


export {
  queryImport,
  queryTemplate,
}
