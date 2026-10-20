import { describe, expect } from 'vitest'
import { getAddress, parseEther, ZeroAddress } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  useForkSdk,
  depositToFork,
  mockForkStake,
  freezeOsTokenRate,
  sendForkTransaction,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const depositAssets = parseEther('1')
const overMaxShares = 2n

const deposit = (setupFork: Fork) => {
  const vaultAddress = getAddress(setupFork.snapshot.vaultAddress)

  return depositToFork({ ...setupFork, input: { userAddress, vaultAddress, assets: depositAssets } })
}

describe('getMaxMintAmount', () => {
  const fork = useForkSdk({ setup: deposit })
  const { sdk, provider, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const baseInput = { userAddress, vaultAddress }

  it('max mint', async () => {
    await mockForkStake(fork)

    const maxShares = await sdk.osToken.getMaxMintAmount(baseInput)

    await sendForkTransaction({
      provider,
      contract: vaultContract,
      method: sdk.osToken.mint,
      input: { ...baseInput, shares: maxShares },
      calls: [ { name: 'mintOsToken', args: [ userAddress, maxShares, ZeroAddress ] } ],
    })

    const position = await vaultContract.osTokenPositions(userAddress)

    expect(position).toBe(maxShares)
  })

  it('two wei above max', async () => {
    await freezeOsTokenRate(fork)
    await mockForkStake(fork)

    const maxShares = await sdk.osToken.getMaxMintAmount(baseInput)
    const request = sdk.osToken.mint.estimateGas({ ...baseInput, shares: maxShares + overMaxShares })

    await expect(request).rejects.toMatchObject({ name: 'LowLtv' })

    await sendForkTransaction({
      provider,
      contract: vaultContract,
      method: sdk.osToken.mint,
      input: { ...baseInput, shares: maxShares },
      calls: [ { name: 'mintOsToken', args: [ userAddress, maxShares, ZeroAddress ] } ],
    })
  })
})
