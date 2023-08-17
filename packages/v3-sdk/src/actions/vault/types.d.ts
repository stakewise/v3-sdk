import { VaultQueryVariables, VaultQueryPayload } from '../../graphql/subgraph/vault'


type SubgraphVault = VaultQueryPayload['vault']

type Performance = {
  mev: number
  total: number
  insurance: number
  ownCapital: number
  validators: number
  networkShare: number
  geoDiversity: number
  clientDiversity: number
  validationPerformance: number
}

export type Variables = VaultQueryVariables

export type Input = VaultQueryPayload

export type Output = Pick<
  SubgraphVault,
  'apy' | 'isErc20' | 'imageUrl' | 'isPrivate' | 'tokenName' | 'createdAt'
  | 'tokenSymbol' | 'displayName' | 'description' | 'whitelister'
  | 'validatorsRoot' | 'feeRecipient' | 'totalAssets' | 'capacity'
> & {
  totalPerformance: SubgraphVault['performance']['total']
  vaultKeysManager: SubgraphVault['keysManager']
  mevRecipient: SubgraphVault['mevEscrow']
  vaultAddress: SubgraphVault['address']
  vaultAdmin: SubgraphVault['admin']
  performance: Performance
  createdAt: string
  feePercent: string
  isSmoothingPool: boolean
  whitelist: VaultQueryPayload['privateVaultAccounts']
}
