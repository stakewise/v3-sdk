import { describe, expect } from 'vitest'
import { getAddress, parseEther, ZeroAddress } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { useForkSdk, depositToFork, sendForkTransaction, mockForkHarvestParams } from '../../../../../test/fork'

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

    await sendForkTransaction({
      provider,
      input: mintInput,
      contract: vaultContract,
      method: sdk.osToken.mint,
      calls: [ { name: 'mintOsToken', args: [ userAddress, mintShares, ZeroAddress ] } ],
    })

    const position = await vaultContract.osTokenPositions(userAddress)

    expect(position).toBeGreaterThanOrEqual(mintInput.shares)
  })
})
