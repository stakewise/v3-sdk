const queryImport = [
  'import { graphqlFetch, FetchCodegenInput } from \'modules/gql-module\'',
  'import { {ClientName}Graph } from \'types/graphql/{clientName}\'',
  'import { constants } from \'helpers\'',
].join('\n')

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { variables, modifyResult }: FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url: constants.url.{clientName},
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
