import { expect } from 'vitest'

import type StakeWiseSDK from '../../src/StakeWiseSDK'

import fundDepositToken from './fundDepositToken'
import mockForkHarvestParams from './mockForkHarvestParams'
import type { Fork } from './useForkSdk'


type Input = Fork & {
  input: Parameters<StakeWiseSDK['vault']['deposit']>[0]
}

const depositToFork = async (fork: Input) => {
  const { sdk, provider, snapshot, input } = fork
  const { assets, userAddress, vaultAddress } = input
  const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

  expect(canHarvest, 'fixture does not match the fork block').toBe(true)

  await fundDepositToken(fork, { assets, userAddress, spenderAddress: vaultAddress })

  mockForkHarvestParams(snapshot, true)

  const hash = await sdk.vault.deposit(input)
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup deposit must succeed').toBe(1)
}


export default depositToFork
