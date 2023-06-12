import { graphqlFetch } from '../../../modules/gql-module'


type BlacklistedVaultsQueryVariables = BackendGraph.Exact<{ [key: string]: never; }>
type BlacklistedVaultsQueryPayload = { vaults: Array<{ address: string }> }


const query = 'query BlacklistedVaults { vaults(blacklisted: true) { address: id }}'


const fetchBlacklistedVaultsQuery = <ModifiedData = BlacklistedVaultsQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<BlacklistedVaultsQueryPayload, BlacklistedVaultsQueryVariables, ModifiedData>
) => (
  graphqlFetch<BlacklistedVaultsQueryPayload, BlacklistedVaultsQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchBlacklistedVaultsQuery }
export type { BlacklistedVaultsQueryPayload, BlacklistedVaultsQueryVariables }
