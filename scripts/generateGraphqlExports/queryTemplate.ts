const queryImport = [
  'import { graphqlFetch, FetchCodegenInput } from \'modules/gql-module\'',
  'import { {ClientName}Graph } from \'types/graphql/{clientName}\'',
  'import configs from \'helpers/configs\'',
].join('\n')

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { variables, network, modifyResult }: FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url: configs[network].api.{clientName},
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
