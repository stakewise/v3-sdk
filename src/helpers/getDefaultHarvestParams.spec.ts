import { describe, expect } from 'vitest'
import { ZeroHash } from 'ethers'

import { it, proof, reward, rewardsRoot, unlockedMevReward } from '../../test'

import getDefaultHarvestParams from './getDefaultHarvestParams'


type Input = Parameters<typeof getDefaultHarvestParams>[0]

const params = {
  proof,
  rewardsRoot,
  reward: String(reward),
  unlockedMevReward: String(unlockedMevReward),
}

const cases = [
  {
    name: 'given values',
    values: params,
    expected: params,
  },
  {
    name: 'empty values',
    values: {
      proof: undefined,
      reward: '',
      rewardsRoot: '',
      unlockedMevReward: '',
    } as unknown as Input,
    expected: {
      proof: [],
      reward: '0',
      rewardsRoot: ZeroHash,
      unlockedMevReward: '0',
    },
  },
]

describe('getDefaultHarvestParams', () => {

  it.for(cases)('$name', ({ values, expected }) => {
    const result = getDefaultHarvestParams(values)

    expect(result).toEqual(expected)
  })
})
