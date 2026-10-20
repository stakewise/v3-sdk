import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { useForkSdk, mintToFork, depositToFork, sendForkTransaction } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const depositAssets = parseEther('1')
const mintShares = parseEther('0.1')

const depositAndMint = async (setupFork: Fork) => {
  const vaultAddress = getAddress(setupFork.snapshot.vaultAddress)
  const baseInput = { userAddress, vaultAddress }

  await depositToFork({ ...setupFork, input: { ...baseInput, assets: depositAssets } })
  await mintToFork({ ...setupFork, input: { ...baseInput, shares: mintShares } })
}

describe('burn', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: depositAndMint })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const burnInput = { userAddress, vaultAddress, shares: mintShares }

  it('burn', async () => {
    const positionBefore = await vaultContract.osTokenPositions(userAddress)

    await sendForkTransaction({
      provider,
      input: burnInput,
      contract: vaultContract,
      method: sdk.osToken.burn,
      calls: [ { name: 'burnOsToken', args: [ mintShares ] } ],
    })

    const positionAfter = await vaultContract.osTokenPositions(userAddress)

    expect(positionAfter).toBeLessThan(positionBefore)
  })
})
