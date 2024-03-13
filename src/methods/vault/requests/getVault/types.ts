import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


export type ModifiedVault = Omit<
  VaultQueryPayload['vault'],
  'admin' | 'address' | 'mevEscrow' | 'keysManager' | 'apy' | 'performance' | 'createdAt' | 'blocklistCount' | 'whitelistCount' | 'version'
> & {
  apy: number
  version: number
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
