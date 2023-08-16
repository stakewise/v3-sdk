import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'

import { vaultShortFragment } from '../fragments'


type VaultsQueryVariables = SubgraphGraph.Exact<{
  skip: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Int']['input']>
  first: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Int']['input']>
  where: SubgraphGraph.InputMaybe<SubgraphGraph.Vault_Filter>
  orderBy: SubgraphGraph.InputMaybe<SubgraphGraph.Vault_OrderBy>
}>
type VaultsQueryPayload = { vaults: Array<{ imageUrl: string, mevEscrow: string, isPrivate: boolean, createdAt: string, totalAssets: string, displayName: string, description: string, whitelister: string, avgRewardPerAsset: string, address: string, performance: string }> }


const query = 'query Vaults( $skip: Int, $first: Int, $where: Vault_filter, $orderBy: Vault_orderBy,) { vaults( skip: $skip, first: $first, where: $where, orderBy: $orderBy orderDirection: desc, ) { ...VaultShort }}'.concat(vaultShortFragment)


const fetchVaultsQuery = <ModifiedData = VaultsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultsQueryPayload, VaultsQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultsQueryPayload, VaultsQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultsQuery }
export type { VaultsQueryPayload, VaultsQueryVariables }
