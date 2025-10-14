import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


export type ModifiedVault = Omit<
  VaultQueryPayload['vault'],
  'apy'
  | 'admin'
  | 'address'
  | 'baseApy'
  | 'version'
  | 'createdAt'
  | 'mevEscrow'
  | 'performance'
  | 'whitelister'
  | 'osTokenConfig'
  | 'blocklistCount'
  | 'whitelistCount'
  | 'allocatorMaxBoostApy'
> & {
  apy: number
  baseApy: number
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
  allocatorMaxBoostApy: number
  osTokenConfig: {
    ltvPercent: string // The percent used to calculate how much user can mint OsToken shares
    liqThresholdPercent: string // The liquidation threshold percent used to calculate health factor for OsToken position
  }
}
