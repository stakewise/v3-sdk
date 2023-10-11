import { MaxUint256 } from 'ethers'

import modifyVault from './modifyVault'
import { Network, configs } from '../../../../utils'
import { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


const network = Network.Goerli

describe('modifyVault', () => {
  const mockVaultQueryPayload: VaultQueryPayload = {
    vault: {
      isErc20: true,
      verified: true,
      feePercent: 200,
      isPrivate: false,
      performance: '10',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      tokenName: 'mockToken',
      createdAt: '1693395816',
      displayName: 'Mock Vault',
      avgRewardPerAsset: '0.01',
      totalAssets: '150000000000',
      capacity: '1000000000000000',
      validatorsRoot: 'mockValidators',
      description: 'This is a mock vault',
      admin: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      address: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      mevEscrow: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      whitelister: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      keysManager: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      feeRecipient: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
    },
    privateVaultAccounts: [
      { createdAt: '1693395816', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
      { createdAt: '1693395816', address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' },
    ],
  }

  it('should correctly transform the vault data', () => {
    const expectedModifiedVault = {
      apy: 365,
      isErc20: true,
      feePercent: 2,
      verified: true,
      isPrivate: false,
      capacity: '0.001',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      tokenName: 'mockToken',
      isSmoothingPool: false,
      createdAt: 1693395816000,
      displayName: 'Mock Vault',
      totalAssets: '0.00000015',
      validatorsRoot: 'mockValidators',
      description: 'This is a mock vault',
      vaultAdmin: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      whitelister: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      vaultAddress: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      feeRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      mevRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      vaultKeysManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      performance: {
        total: 10,
      },
      whitelist: [
        {
          createdAt: 1693395816000,
          address: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
        },
        {
          createdAt: 1693395816000,
          address: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
        },
      ],
    }

    const result = modifyVault({
      data: mockVaultQueryPayload,
      network,
    })

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

    const result = modifyVault({
      data: mockDataWithoutMevEscrow,
      network,
    })

    expect(result.mevRecipient).toEqual(configs[network].addresses.base.sharedMevEscrow)
  })

  it('should handle empty privateVaultAccounts correctly', () => {
    const mockDataWithoutPrivateAccounts: VaultQueryPayload = {
      ...mockVaultQueryPayload,
      privateVaultAccounts: [],
    }

    const result = modifyVault({
      data: mockDataWithoutPrivateAccounts,
      network,
    })

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

    const result = modifyVault({
      data: mockDataWithZeroFee,
      network,
    })

    expect(result.feePercent).toEqual(0)
  })

  it('should handle max capacity with ∞ symbol', () => {
    const mockDataWithZeroFee: VaultQueryPayload = {
      ...mockVaultQueryPayload,
      vault: {
        ...mockVaultQueryPayload.vault,
        capacity: MaxUint256.toString(),
      },
    }

    const result = modifyVault({
      data: mockDataWithZeroFee,
      network,
    })

    expect(result.capacity).toEqual('∞')
  })
})
