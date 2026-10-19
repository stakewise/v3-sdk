import { expect } from 'vitest'
import type { Result } from 'ethers'

import type { HarvestParamsQueryPayload } from '../src/graphql/subgraph/vault'

import mockGraphql from './mockGraphql'


export type MockHarvestParamsInput = {
  canHarvest: boolean
  isMetaVault?: boolean
}

export type HarvestInput = Partial<MockHarvestParamsInput>

export const proof = [ `0x${'aa'.repeat(32)}` ]
export const rewardsRoot = `0x${'bb'.repeat(32)}`

export const reward = 100n
export const unlockedMevReward = 5n

const harvestParamsPayload = (canHarvest: boolean, isMetaVault: boolean): HarvestParamsQueryPayload => ({
  harvestParams: {
    proof,
    canHarvest,
    rewardsRoot,
    isMetaVault,
    reward: String(reward),
    unlockedMevReward: String(unlockedMevReward),
  },
})

export const mockHarvestParams = ({ canHarvest, isMetaVault = false }: MockHarvestParamsInput) => (
  mockGraphql<HarvestParamsQueryPayload>({
    name: 'HarvestParams',
    data: harvestParamsPayload(canHarvest, isMetaVault),
  })
)

export const checkHarvestParams = (harvestParams: Result) => {
  expect(harvestParams.rewardsRoot).toBe(rewardsRoot)
  expect(harvestParams.reward).toBe(reward)
  expect(harvestParams.unlockedMevReward).toBe(unlockedMevReward)
  expect(harvestParams.proof.toArray()).toEqual(proof)
}
