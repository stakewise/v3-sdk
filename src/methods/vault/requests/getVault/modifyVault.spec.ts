import { MaxUint256 } from 'ethers'

import modifyVault from './modifyVault'
import { Network, configs } from '../../../../utils'
import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


const network = Network.Holesky

describe('modifyVault', () => {
  const mockVaultQueryPayload: VaultQueryPayload = {
    vault: {
      isErc20: true,
      feePercent: 200,
      isPrivate: false,
      isRestake: true,
      isGenesis: true,
      isBlocklist: false,
      version: '1',
      performance: '10',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      tokenName: 'mockToken',
      createdAt: '1693395816',
      displayName: 'Mock Vault',
      apy: '2.80',
      blocklistCount: '0',
      whitelistCount: '0',
      totalAssets: '150000000000',
      capacity: '1000000000000000',
      depositDataRoot: 'mockValidators',
      description: 'This is a mock vault',
      isCollateralized: true,
      admin: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      address: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      mevEscrow: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      whitelister: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      feeRecipient: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      blocklistManager: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      validatorsManager: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      depositDataManager: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      restakeOperatorsManager: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      restakeWithdrawalsManager: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
      osTokenConfig: {
        ltvPercent: '0',
        liqThresholdPercent: '0',
      },
    },
  }

  it('should correctly transform the vault data', () => {
    const expectedModifiedVault = {
      apy: 2.80,
      isErc20: true,
      feePercent: 2,
      version: 1,
      performance: 10,
      isPrivate: false,
      isRestake: true,
      isGenesis: true,
      isBlocklist: false,
      blocklistCount: 0,
      whitelistCount: 0,
      capacity: '0.001',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      tokenName: 'mockToken',
      isSmoothingPool: false,
      createdAt: 1693395816000,
      displayName: 'Mock Vault',
      totalAssets: '0.00000015',
      depositDataRoot: 'mockValidators',
      description: 'This is a mock vault',
      vaultAdmin: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      vaultAddress: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      feeRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      mevRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      whitelistManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      blocklistManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      validatorsManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      depositDataManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      restakeOperatorsManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      restakeWithdrawalsManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
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
