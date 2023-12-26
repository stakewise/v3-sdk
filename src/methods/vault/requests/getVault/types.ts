import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


export type ModifiedVault = Omit<
  VaultQueryPayload['vault'],
  'admin' | 'address' | 'mevEscrow' | 'keysManager' | 'weeklyApy' | 'performance' | 'createdAt'
> & {
  apy: number
  createdAt: number
  vaultAdmin: string
  performance: number
  vaultAddress: string
  mevRecipient: string
  vaultKeysManager: string
  isSmoothingPool: boolean
  whitelist: Array<{
    createdAt: number
    address: string
  }>
}
