import { expect } from 'vitest'
import { getAddress } from 'ethers'

import mockGraphql from '../mockGraphql'
import { userAddress } from '../constants'

import type { AllocatorsQueryPayload } from '../../src/graphql/subgraph/allocator'
import type { VaultOsTokenConfigQueryPayload } from '../../src/graphql/subgraph/vault'

import mockForkHarvestParams from './mockForkHarvestParams'
import type { Fork } from './useForkSdk'


const mockForkStake = async ({ sdk, snapshot }: Fork) => {
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  const [ canHarvest, osTokenConfig, stakeShares ] = await Promise.all([
    sdk.contracts.base.keeper.canHarvest(vaultAddress),
    sdk.contracts.base.mintTokenConfig.v2.getConfig(vaultAddress),
    vaultContract.getShares(userAddress),
  ])

  expect(canHarvest, 'the setup deposit must harvest the vault').toBe(false)

  const stakeAssets = await vaultContract.convertToAssets(stakeShares)
  const { ltvPercent, liqThresholdPercent } = osTokenConfig

  mockForkHarvestParams(snapshot, canHarvest)

  mockGraphql<VaultOsTokenConfigQueryPayload>({
    name: 'VaultOsTokenConfig',
    data: {
      vault: {
        osTokenConfig: {
          ltvPercent: String(ltvPercent),
          liqThresholdPercent: String(liqThresholdPercent),
        },
      },
    },
  })

  mockGraphql<AllocatorsQueryPayload>({
    name: 'Allocators',
    data: {
      allocators: [
        {
          apy: '0',
          assets: String(stakeAssets),
          totalEarnedAssets: '0',
          totalStakeEarnedAssets: '0',
          totalBoostEarnedAssets: '0',
        },
      ],
    },
  })
}


export default mockForkStake
