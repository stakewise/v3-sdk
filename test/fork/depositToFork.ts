import { expect } from 'vitest'

import type StakeWiseSDK from '../../src/StakeWiseSDK'

import mockForkHarvestParams from './mockForkHarvestParams'
import type { Fork } from './useForkSdk'


type Input = Fork & {
  input: Parameters<StakeWiseSDK['vault']['deposit']>[0]
}

const depositToFork = async ({ sdk, provider, snapshot, input }: Input) => {
  const canHarvest = await sdk.contracts.base.keeper.canHarvest(input.vaultAddress)

  expect(canHarvest, 'fixture does not match the fork block').toBe(true)

  mockForkHarvestParams(snapshot, true)

  const hash = await sdk.vault.deposit(input)
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup deposit must succeed').toBe(1)
}


export default depositToFork
