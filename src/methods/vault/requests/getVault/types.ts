import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


export type ModifiedVault = Omit<
  VaultQueryPayload['vault'],
  'apy'
  | 'admin'
  | 'address'
  | 'version'
  | 'createdAt'
  | 'mevEscrow'
  | 'performance'
  | 'whitelister'
  | 'osTokenConfig'
  | 'blocklistCount'
  | 'whitelistCount'
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
  isSmoothingPool: boolean
  whitelistManager: string
  osTokenConfig: {
    ltvPercent: string // The percent used to calculate how much user can mint OsToken shares
    thresholdPercent: string // The liquidation threshold percent used to calculate health factor for OsToken position
  }
}
