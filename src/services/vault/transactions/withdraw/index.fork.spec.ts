import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { useForkSdk, depositToFork, sendForkTransaction, mockForkHarvestParams } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const v1VaultAddress = '0x475064D69bE1933C3EC0301A7397b0a667993f95'

const depositAssets = parseEther('1')
const withdrawAssets = parseEther('0.5')

const depositToVaults = async (setupFork: Fork) => {
  const { sdk, provider, snapshot } = setupFork
  const vaultAddress = getAddress(snapshot.vaultAddress)

  await depositToFork({ ...setupFork, input: { userAddress, vaultAddress, assets: depositAssets } })

  mockForkHarvestParams(snapshot, false)

  const hash = await sdk.vault.deposit({ userAddress, vaultAddress: v1VaultAddress, assets: depositAssets })
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup deposit must succeed').toBe(1)
}

describe('withdraw', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: depositToVaults })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const v1VaultContract = sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress })
  const withdrawInput = { userAddress, vaultAddress, assets: withdrawAssets }

  it('enters the exit queue', async () => {
    mockForkHarvestParams(snapshot, false)

    const [ sharesBefore, exitShares ] = await Promise.all([
      vaultContract.getShares(userAddress),
      vaultContract.convertToShares(withdrawAssets),
    ])

    await sendForkTransaction({
      provider,
      input: withdrawInput,
      contract: vaultContract,
      method: sdk.vault.withdraw,
      calls: [ { name: 'enterExitQueue', args: [ exitShares, userAddress ] } ],
    })

    const sharesAfter = await vaultContract.getShares(userAddress)

    expect(sharesBefore - sharesAfter).toBe(exitShares)
  })

  it('redeem', async () => {
    const input = { userAddress, vaultAddress: v1VaultAddress, assets: withdrawAssets }

    mockForkHarvestParams(snapshot, false)

    const [ sharesBefore, balanceBefore, redeemShares ] = await Promise.all([
      v1VaultContract.getShares(userAddress),
      provider.getBalance(userAddress),
      v1VaultContract.convertToShares(withdrawAssets),
    ])

    const redeemAssets = await v1VaultContract.convertToAssets(redeemShares)

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: v1VaultContract,
      method: sdk.vault.withdraw,
      calls: [ { name: 'redeem', args: [ redeemShares, userAddress ] } ],
    })

    const [ sharesAfter, balanceAfter ] = await Promise.all([
      v1VaultContract.getShares(userAddress),
      provider.getBalance(userAddress),
    ])

    const receivedAssets = balanceAfter - balanceBefore + (receipt?.fee || 0n)

    expect(sharesBefore - sharesAfter).toBe(redeemShares)
    expect(receivedAssets).toBe(redeemAssets)
  })
})
