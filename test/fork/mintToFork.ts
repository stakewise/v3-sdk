import { expect } from 'vitest'

import type StakeWiseSDK from '../../src/StakeWiseSDK'

import mockForkHarvestParams from './mockForkHarvestParams'
import type { Fork } from './useForkSdk'


type Input = Fork & {
  input: Parameters<StakeWiseSDK['osToken']['mint']>[0]
}

const mintToFork = async ({ sdk, provider, snapshot, input }: Input) => {
  const canHarvest = await sdk.contracts.base.keeper.canHarvest(input.vaultAddress)

  expect(canHarvest, 'the setup deposit must harvest the vault').toBe(false)

  mockForkHarvestParams(snapshot, false)

  const hash = await sdk.osToken.mint(input)
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup mint must succeed').toBe(1)
}


export default mintToFork
