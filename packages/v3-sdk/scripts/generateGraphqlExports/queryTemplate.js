const queryImport = 'import { graphqlFetch } from \'../../../modules/gql-module\'\n'

const queryTemplate = `

const fetch{QueryName} = <ModifiedData = {QueryName}Payload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<{QueryName}Payload, {QueryName}Variables, ModifiedData>
) => (
  graphqlFetch<{QueryName}Payload, {QueryName}Variables, ModifiedData>({
    url,
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
