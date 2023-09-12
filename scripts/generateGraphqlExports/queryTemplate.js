const queryImport = [
  'import { graphqlFetch } from \'modules/gql-module\'',
  'import { constants } from \'helpers\'',
].join('\n')

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url: constants.url.{clientName},
    query,
    variables,
    modifyResult,
  })
)
`


module.exports = {
  queryImport,
  queryTemplate,
}
