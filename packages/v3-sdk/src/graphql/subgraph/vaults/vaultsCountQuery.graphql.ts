import { graphqlFetch } from '../../../modules/gql-module'


type VaultsCountQueryVariables = SubgraphGraph.Exact<{
  address: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Bytes']>
}>
type VaultsCountQueryPayload = { all: { vaultsTotal: number }, deposits: Array<{ id: string }>, created: Array<{ id: string }> }


const query = 'query VaultsCount($address: Bytes) { all: network(id: 0) { vaultsTotal } deposits: vaults(where: { or: [ { allocators_: { address: $address } } { exitRequests_: { owner: $address } } ] }) { id } created: vaults(where: { admin: $address }) { id }}'


const fetchVaultsCountQuery = <ModifiedData = VaultsCountQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultsCountQueryPayload, VaultsCountQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultsCountQueryPayload, VaultsCountQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultsCountQuery }
export type { VaultsCountQueryPayload, VaultsCountQueryVariables }
