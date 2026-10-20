import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { useForkSdk, depositToFork, mockForkHarvestParams } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const depositAssets = parseEther('1')
const mintShares = parseEther('0.1')

const deposit = (setupFork: Fork) => {
  const vaultAddress = getAddress(setupFork.snapshot.vaultAddress)

  return depositToFork({ ...setupFork, input: { userAddress, vaultAddress, assets: depositAssets } })
}

describe('mint', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: deposit })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const mintInput = { userAddress, vaultAddress, shares: mintShares }

  it('mint', async () => {
    mockForkHarvestParams(snapshot, false)

    const [ encoded, gas ] = await Promise.all([
      sdk.osToken.mint.encode(mintInput),
      sdk.osToken.mint.estimateGas(mintInput),
    ])

    const hash = await sdk.osToken.mint(mintInput)

    const [ receipt, sentTx, position ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      vaultContract.osTokenPositions(userAddress),
    ])

    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(call.name).toBe('mintOsToken')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(position).toBeGreaterThanOrEqual(mintInput.shares)
  })
})
