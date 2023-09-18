import { constants } from 'helpers'
import { VaultQueryPayload } from 'graphql/subgraph/vault'

import modifyVault from './modifyVault'


describe('modifyVault', () => {
  const mockVaultQueryPayload: VaultQueryPayload = {
    vault: {
      proof: [],
      isErc20: true,
      feePercent: 200,
      capacity: '1000',
      isPrivate: false,
      proofReward: '10',
      totalShares: '100',
      queuedShares: '50',
      totalAssets: '150',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      performance: 'good',
      unclaimedAssets: '5',
      tokenName: 'mockToken',
      rewardsRoot: 'mockRoot',
      createdAt: '2023-01-01',
      displayName: 'Mock Vault',
      avgRewardPerAsset: '0.01',
      metadataIpfsHash: 'mockHash',
      whitelister: 'mockWhitelister',
      validatorsRoot: 'mockValidators',
      description: 'This is a mock vault',
      admin: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      address: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      mevEscrow: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      keysManager: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      feeRecipient: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
    },
    privateVaultAccounts: [
      { createdAt: '2023-01-01', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
      { createdAt: '2023-01-02', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
    ],
  }

  it('should correctly transform the vault data', () => {
    const expectedModifiedVault = {
      apy: 365,
      proof: [],
      isErc20: true,
      feePercent: 2,
      isPrivate: false,
      capacity: '1000',
      proofReward: '10',
      totalShares: '100',
      queuedShares: '50',
      totalAssets: '150',
      performance: 'good',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      unclaimedAssets: '5',
      tokenName: 'mockToken',
      isSmoothingPool: false,
      createdAt: '2023-01-01',
      rewardsRoot: 'mockRoot',
      displayName: 'Mock Vault',
      metadataIpfsHash: 'mockHash',
      whitelister: 'mockWhitelister',
      validatorsRoot: 'mockValidators',
      description: 'This is a mock vault',
      vaultAdmin: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      vaultAddress: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      feeRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      mevRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      vaultKeysManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      whitelist: [
        {
          createdAt: '2023-01-01',
          address: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
        },
        {
          createdAt: '2023-01-02',
          address: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
        },
      ],
    }

    const result = modifyVault(mockVaultQueryPayload)

    expect(result).toEqual(expectedModifiedVault)
  })

  it('should handle missing mevEscrow correctly', () => {
    const mockDataWithoutMevEscrow: VaultQueryPayload = {
      ...mockVaultQueryPayload,
      vault: {
        ...mockVaultQueryPayload.vault,
        mevEscrow: '',
      },
    }

    const result = modifyVault(mockDataWithoutMevEscrow)

    expect(result.mevRecipient).toEqual(constants.sharedMevEscrow)
  })

  it('should handle empty privateVaultAccounts correctly', () => {
    const mockDataWithoutPrivateAccounts: VaultQueryPayload = {
      ...mockVaultQueryPayload,
      privateVaultAccounts: [],
    }

    const result = modifyVault(mockDataWithoutPrivateAccounts)

    expect(result.whitelist).toEqual([])
  })

  it('should handle feePercent being 0', () => {
    const mockDataWithZeroFee: VaultQueryPayload = {
      ...mockVaultQueryPayload,
      vault: {
        ...mockVaultQueryPayload.vault,
        feePercent: 0,
      },
    }

    const result = modifyVault(mockDataWithZeroFee)

    expect(result.feePercent).toEqual(0)
  })
})
