import { VaultQueryPayload } from 'graphql/subgraph/vault'


export type ModifiedVault = Omit<
  VaultQueryPayload['vault'],
  'admin' | 'address' | 'mevEscrow' | 'keysManager' | 'avgRewardPerAsset'
> & {
  apy: number
  vaultAdmin: string
  vaultAddress: string
  vaultKeysManager: string
  mevRecipient: string
  isSmoothingPool: boolean
  whitelist: VaultQueryPayload['privateVaultAccounts']
}
