import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'

import { vaultFullFragment } from '../fragments'


type VaultQueryVariables = SubgraphGraph.Exact<{
  address: SubgraphGraph.Scalars['ID']['input']
}>
type VaultQueryPayload = { vault: { admin: string, proof: Array<string>, isErc20: boolean, capacity: string, mevEscrow: string, tokenName: string, feePercent: number, keysManager: string, tokenSymbol: string, rewardsRoot: string, proofReward: string, totalShares: string, feeRecipient: string, queuedShares: string, validatorsRoot: string, unclaimedAssets: string, metadataIpfsHash: string, imageUrl: string, isPrivate: boolean, createdAt: string, totalAssets: string, displayName: string, description: string, whitelister: string, avgRewardPerAsset: string, address: string, performance: string }, privateVaultAccounts: Array<{ createdAt: string, address: string }> }


const query = 'query Vault($address: ID!) { vault(id: $address) { ...VaultFull } privateVaultAccounts( where: { vault: $address } ) { createdAt address }}'.concat(vaultFullFragment)


const fetchVaultQuery = <ModifiedData = VaultQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultQueryPayload, VaultQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultQueryPayload, VaultQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultQuery }
export type { VaultQueryPayload, VaultQueryVariables }
