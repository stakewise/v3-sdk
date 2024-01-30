import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


type ListItem = {
  createdAt: number
  address: string
}

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
  whitelist: ListItem[]
  blocklist: ListItem[]
}
