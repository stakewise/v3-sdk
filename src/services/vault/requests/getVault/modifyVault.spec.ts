import { describe, expect } from 'vitest'
import { MaxUint256 } from 'ethers'

import { it } from '../../../../../test'
import vaultQuery from '../../../../../test/mocks/vaultQuery'

import modifyVault from './modifyVault'
import { Network, configs } from '../../../../helpers'

import type { ModifiedVault } from './types'
import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


type VaultCase = {
  name: string
  overrides: Partial<VaultQueryPayload['vault']>
  expected: Partial<ModifiedVault>
}

const network = Network.Mainnet

const cases: VaultCase[] = [
  {
    name: 'empty mevEscrow',
    overrides: { mevEscrow: '' },
    expected: { mevRecipient: configs[network].addresses.base.sharedMevEscrow },
  },
  {
    name: 'zero feePercent',
    overrides: { feePercent: 0 },
    expected: { feePercent: 0 },
  },
  {
    name: 'max capacity',
    overrides: { capacity: MaxUint256.toString() },
    expected: { capacity: '∞' },
  },
]

describe('modifyVault', () => {
  it('transform', () => {
    const expectedModifiedVault: ModifiedVault = {
      apy: 2.80,
      baseApy: 0.80,
      isErc20: true,
      feePercent: 2,
      version: 1,
      performance: 10,
      queuedShares: '0',
      isPrivate: false,
      isGenesis: true,
      isMetaVault: false,
      isBlocklist: false,
      canHarvest: false,
      blocklistCount: 0,
      whitelistCount: 0,
      capacity: '0.001',
      tokenSymbol: 'mTKN',
      imageUrl: 'mockUrl',
      lastFeePercent: 0,
      subVaultsCurator: '',
      subVaultsCount: 0,
      lastFeeUpdateTimestamp: '0',
      allocatorMaxBoostApy: 123.2,
      isCollateralized: true,
      tokenName: 'mockToken',
      isSmoothingPool: false,
      createdAt: 1693395816000,
      displayName: 'Mock Vault',
      totalAssets: '0.00000015',
      exitingTickets: '0.00000015',
      isStateUpdateRequired: false,
      exitingAssets: '0.00000015',
      depositDataRoot: 'mockValidators',
      description: 'This is a mock vault',
      osTokenConfig: {
        ltvPercent: '0',
        liqThresholdPercent: '0',
      },
      vaultAdmin: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      vaultAddress: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      feeRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      mevRecipient: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      whitelistManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      blocklistManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      validatorsManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      subVaultsRegistry: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      depositDataManager: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      ejectingSubVault: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      pendingMetaSubVault: '0xeEFFFD4C23D2E8c845870e273861e7d60Df49663',
      lastUpdateStateTimestamp: null,
    }

    const result = modifyVault({ data: vaultQuery, network })

    expect(result).toEqual(expectedModifiedVault)
  })

  it.for(cases)('$name', ({ overrides, expected }) => {
    const data: VaultQueryPayload = {
      ...vaultQuery,
      vault: { ...vaultQuery.vault, ...overrides },
    }

    const result = modifyVault({ data, network })

    expect(result).toMatchObject(expected)
  })
})
