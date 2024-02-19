import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


export type ModifiedVault = Omit<
  VaultQueryPayload['vault'],
  'admin' | 'address' | 'mevEscrow' | 'keysManager' | 'weeklyApy' | 'performance' | 'createdAt' | 'blocklistCount' | 'whitelistCount'
> & {
  apy: number
  createdAt: number
  vaultAdmin: string
  performance: number
  vaultAddress: string
  mevRecipient: string
  blocklistCount: number
  whitelistCount: number
  vaultKeysManager: string
  isSmoothingPool: boolean
}
