const queryImport = [
  'import { graphqlFetch, FetchCodegenInput } from \'../../../modules/gql-module\'',
  'import { StakeWise{ClientName}Graph } from \'../../../types/graphql/{clientName}\''
].join('\n')

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { variables, url, withTime, modifyResult }: FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url,
    query,
    withTime,
    variables,
    modifyResult,
  })
)
`


export {
  queryImport,
  queryTemplate,
}
