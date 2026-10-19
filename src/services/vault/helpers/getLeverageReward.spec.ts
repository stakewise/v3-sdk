import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../test'

import getLeverageReward from './getLeverageReward'


const input = {
  vaultApy: 4,
  borrowApy: 3,
  osTokenMintApy: 0.5,
  mintedAssets: parseEther('9'),
  borrowedAssets: parseEther('9'),
  depositedAssets: parseEther('10'),
}

const emptyPosition = {
  ...input,
  mintedAssets: 0n,
  borrowedAssets: 0n,
  depositedAssets: 0n,
}

const cases = [
  { name: 'leverage reward', values: input, expected: parseEther('0.085') },
  { name: 'negative reward', values: { ...input, borrowApy: 10 }, expected: parseEther('-0.545') },
  { name: 'empty position', values: emptyPosition, expected: 0n },
]

describe('getLeverageReward', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const reward = getLeverageReward(values)

    expect(reward).toBe(expected)
  })
})
