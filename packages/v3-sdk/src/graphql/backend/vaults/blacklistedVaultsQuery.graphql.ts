import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type BlacklistedVaultsQueryVariables = BackendGraph.Exact<{ [key: string]: never; }>
type BlacklistedVaultsQueryPayload = { vaults: Array<{ address: string }> }


const query = 'query BlacklistedVaults { vaults(blacklisted: true) { address: id }}'


const fetchBlacklistedVaultsQuery = <ModifiedData = BlacklistedVaultsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<BlacklistedVaultsQueryPayload, BlacklistedVaultsQueryVariables, ModifiedData>
) => (
  graphqlFetch<BlacklistedVaultsQueryPayload, BlacklistedVaultsQueryVariables, ModifiedData>({
    url: constants.url.backend,
    query,
    variables,
    modifyResult,
  })
)


export { fetchBlacklistedVaultsQuery }
export type { BlacklistedVaultsQueryPayload, BlacklistedVaultsQueryVariables }
