const queryImport = [
  'import { graphqlFetch, FetchCodegenInput } from \'modules/gql-module\'',
  'import { {ClientName}Graph } from \'types/graphql/{clientName}\''
].join('\n')

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { variables, url, modifyResult }: FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url,
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
