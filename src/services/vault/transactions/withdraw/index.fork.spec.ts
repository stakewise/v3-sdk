import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { useForkSdk, depositToFork, mockForkHarvestParams } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const depositAssets = parseEther('1')
const withdrawAssets = parseEther('0.5')

const deposit = (setupFork: Fork) => {
  const vaultAddress = getAddress(setupFork.snapshot.vaultAddress)

  return depositToFork({ ...setupFork, input: { userAddress, vaultAddress, assets: depositAssets } })
}

describe('withdraw', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: deposit })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const withdrawInput = { userAddress, vaultAddress, assets: withdrawAssets }

  it('enters the exit queue', async () => {
    mockForkHarvestParams(snapshot, false)

    const sharesBefore = await vaultContract.getShares(userAddress)

    const [ encoded, gas ] = await Promise.all([
      sdk.vault.withdraw.encode(withdrawInput),
      sdk.vault.withdraw.estimateGas(withdrawInput),
    ])

    const hash = await sdk.vault.withdraw(withdrawInput)

    const [ receipt, sentTx, sharesAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      vaultContract.getShares(userAddress),
    ])

    const [ call ] = decodeCalls(vaultContract, encoded.data)
    const [ exitShares, receiver ] = call.args

    expect(call.name).toBe('enterExitQueue')
    expect(receiver).toBe(userAddress)
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(sharesBefore - sharesAfter).toBe(exitShares)
  })
})
