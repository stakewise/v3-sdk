import { graphqlFetch } from '../../../modules/gql-module'

import { vaultFullFragment } from '../fragments'


type VaultQueryVariables = SubgraphGraph.Exact<{
  address: SubgraphGraph.Scalars['ID']
}>
type VaultQueryPayload = { vault: { admin: string, proof: Array<string>, keysManager: string, capacity: string, mevEscrow: string, createdAt: string, feePercent: number, rewardsRoot: string, proofReward: string, totalShares: string, feeRecipient: string, queuedShares: string, validatorsRoot: string, unclaimedAssets: string, metadataIpfsHash: string, score: string, imageUrl: string, isPrivate: boolean, tokenName: string, tokenSymbol: string, totalAssets: string, displayName: string, description: string, whitelister: string, avgRewardPerAsset: string, address: string }, privateVaultAccounts: Array<{ createdAt: string, address: string }> }


const query = 'query Vault($address: ID!) { vault(id: $address) { ...VaultFull } privateVaultAccounts( where: { vault: $address } ) { createdAt address }}'.concat(vaultFullFragment)


const fetchVaultQuery = <ModifiedData = VaultQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultQueryPayload, VaultQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultQueryPayload, VaultQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultQuery }
export type { VaultQueryPayload, VaultQueryVariables }

