import { expect } from 'vitest'

import forkAbis from './forkAbis'
import fundAccount from './fundAccount'
import extendContract from './extendContract'
import type { Fork } from './useForkSdk'


const setRateGasLimit = 100_000n

const freezeOsTokenRate = async ({ sdk, provider }: Fork) => {
  const keeperAddress = await sdk.contracts.base.keeper.getAddress()
  const keeperSigner = await provider.getSigner(keeperAddress)

  const mintTokenControllerContract = extendContract(
    sdk.contracts.base.mintTokenController.connect(keeperSigner),
    forkAbis.mintTokenController
  )

  await fundAccount(provider, keeperAddress)

  const setRateTx = await mintTokenControllerContract.setAvgRewardPerSecond(0n, { gasLimit: setRateGasLimit })
  const setRateReceipt = await setRateTx.wait()
  const avgRewardPerSecond = await sdk.contracts.base.mintTokenController.avgRewardPerSecond()

  expect(setRateReceipt?.status, 'the keeper must set the osToken reward rate').toBe(1)
  expect(avgRewardPerSecond, 'the osToken rate must stop growing').toBe(0n)
}


export default freezeOsTokenRate
