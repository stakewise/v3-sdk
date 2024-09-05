import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


export type ModifiedVault = Omit<
  VaultQueryPayload['vault'],
  'apy'
  | 'admin'
  | 'address'
  | 'version'
  | 'createdAt'
  | 'mevEscrow'
  | 'keysManager'
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
    ltvPercent: bigint // The percent used to calculate how much user can mint OsToken shares
    thresholdPercent: bigint // The liquidation threshold percent used to calculate health factor for OsToken position
  }

  /**
   * @deprecated use depositDataManager
   */
  keysManager: string

  /**
   * @deprecated use whitelistManager
  */
  whitelister: string
}
