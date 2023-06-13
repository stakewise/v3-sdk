import { graphqlFetch } from '../../../modules/gql-module'

import { vaultShortFragment } from '../fragments'


type VaultsQueryVariables = SubgraphGraph.Exact<{
  skip: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Int']>
  first: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Int']>
  where: SubgraphGraph.InputMaybe<SubgraphGraph.Vault_Filter>
  orderBy: SubgraphGraph.InputMaybe<SubgraphGraph.Vault_OrderBy>
}>
type VaultsQueryPayload = { vaults: Array<{ score: string, imageUrl: string, isPrivate: boolean, tokenName: string, tokenSymbol: string, totalAssets: string, displayName: string, description: string, whitelister: string, avgRewardPerAsset: string, address: string }> }


const query = 'query Vaults( $skip: Int, $first: Int, $where: Vault_filter, $orderBy: Vault_orderBy,) { vaults( skip: $skip, first: $first, where: $where, orderBy: $orderBy orderDirection: desc, ) { ...VaultShort }}'.concat(vaultShortFragment)


const fetchVaultsQuery = <ModifiedData = VaultsQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultsQueryPayload, VaultsQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultsQueryPayload, VaultsQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultsQuery }
export type { VaultsQueryPayload, VaultsQueryVariables }
