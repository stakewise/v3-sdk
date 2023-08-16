import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type VaultsCountQueryVariables = SubgraphGraph.Exact<{
  address: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Bytes']['input']>
}>
type VaultsCountQueryPayload = { all: { vaultsTotal: number }, deposits: Array<{ id: string }> }


const query = 'query VaultsCount($address: Bytes) { all: network(id: 0) { vaultsTotal } deposits: vaults(where: { or: [ { allocators_: { address: $address } } { exitRequests_: { owner: $address } } ] }) { id }}'


const fetchVaultsCountQuery = <ModifiedData = VaultsCountQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultsCountQueryPayload, VaultsCountQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultsCountQueryPayload, VaultsCountQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultsCountQuery }
export type { VaultsCountQueryPayload, VaultsCountQueryVariables }
