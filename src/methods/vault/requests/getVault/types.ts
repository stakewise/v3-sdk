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

  /**
   * @deprecated use depositDataManager
   */
  keysManager: string
}
