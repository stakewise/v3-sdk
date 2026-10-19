import { describe, expect } from 'vitest'

import { it, proof, reward, vaultAddress, rewardsRoot, unlockedMevReward } from '../../../../test'

import getHarvestArgs from './getHarvestArgs'


const harvestArgs = {
  proof,
  rewardsRoot,
  reward: String(reward),
  unlockedMevReward: String(unlockedMevReward),
}

const cases = [
  {
    name: 'can harvest',
    canHarvest: true,
    isMetaVault: false,
    expected: harvestArgs,
  },
  {
    name: 'cannot harvest',
    canHarvest: false,
    isMetaVault: false,
    expected: null,
  },
  {
    name: 'meta vault',
    canHarvest: true,
    isMetaVault: true,
    expected: null,
  },
]

describe('getHarvestArgs', () => {
  it.for(cases)('$name', async ({ canHarvest, isMetaVault, expected }, { sdk, graphql }) => {
    graphql.mockHarvestParams({ canHarvest, isMetaVault })

    const result = await getHarvestArgs({ ...sdk.vault.params, vaultAddress })

    expect(result).toEqual(expected)
  })
})
