import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  useForkSdk,
  mockForkStake,
  freezeOsTokenRate,
  sendForkTransaction,
  depositAndMintToFork,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const mintShares = parseEther('0.4')
const overMaxAssets = 2n

const depositAndMint = (setupFork: Fork) => depositAndMintToFork(setupFork, mintShares)

describe('getMaxWithdrawAmount', () => {
  const fork = useForkSdk({ setup: depositAndMint })
  const { sdk, provider, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const baseInput = { userAddress, vaultAddress }

  const withdrawMax = async (maxAssets: bigint) => {
    const [ sharesBefore, exitShares ] = await Promise.all([
      vaultContract.getShares(userAddress),
      vaultContract.convertToShares(maxAssets),
    ])

    await sendForkTransaction({
      provider,
      contract: vaultContract,
      method: sdk.vault.withdraw,
      input: { ...baseInput, assets: maxAssets },
      calls: [ { name: 'enterExitQueue', args: [ exitShares, userAddress ] } ],
    })

    const sharesAfter = await vaultContract.getShares(userAddress)

    return { exitShares, exitedShares: sharesBefore - sharesAfter }
  }

  it('without burn', async () => {
    await mockForkStake(fork)

    const maxAssets = await sdk.vault.getMaxWithdrawAmount(baseInput)
    const { exitShares, exitedShares } = await withdrawMax(maxAssets)

    expect(exitedShares).toBe(exitShares)
  })

  it('with burn', async () => {
    await mockForkStake(fork)

    const [ maxAssets, walletShares ] = await Promise.all([
      sdk.vault.getMaxWithdrawAmount({ ...baseInput, withBurn: true }),
      sdk.contracts.tokens.mintToken.balanceOf(userAddress),
    ])

    await sendForkTransaction({
      provider,
      contract: vaultContract,
      method: sdk.osToken.burn,
      input: { ...baseInput, shares: walletShares },
      calls: [ { name: 'burnOsToken', args: [ walletShares ] } ],
    })

    const { exitShares, exitedShares } = await withdrawMax(maxAssets)

    expect(exitedShares).toBe(exitShares)
  })

  it('two wei above max', async () => {
    await freezeOsTokenRate(fork)
    await mockForkStake(fork)

    const maxAssets = await sdk.vault.getMaxWithdrawAmount(baseInput)
    const request = sdk.vault.withdraw.estimateGas({ ...baseInput, assets: maxAssets + overMaxAssets })

    await expect(request).rejects.toMatchObject({ name: 'LowLtv' })

    const { exitShares, exitedShares } = await withdrawMax(maxAssets)

    expect(exitedShares).toBe(exitShares)
  })
})
