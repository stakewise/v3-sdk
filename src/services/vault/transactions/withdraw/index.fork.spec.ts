import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { useForkSdk, depositToFork, mockForkHarvestParams } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const v1VaultAddress = '0x475064D69bE1933C3EC0301A7397b0a667993f95'

const depositAssets = parseEther('1')
const withdrawAssets = parseEther('0.5')

const deposit = async (setupFork: Fork) => {
  const { sdk, provider, snapshot } = setupFork
  const vaultAddress = getAddress(snapshot.vaultAddress)

  await depositToFork({ ...setupFork, input: { userAddress, vaultAddress, assets: depositAssets } })

  mockForkHarvestParams(snapshot, false)

  const hash = await sdk.vault.deposit({ userAddress, vaultAddress: v1VaultAddress, assets: depositAssets })
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup deposit must succeed').toBe(1)
}

describe('withdraw', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: deposit })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const v1VaultContract = sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress })
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

  it('redeem', async ({ transaction }) => {
    const input = { userAddress, vaultAddress: v1VaultAddress, assets: withdrawAssets }

    mockForkHarvestParams(snapshot, false)

    const [ sharesBefore, balanceBefore, redeemShares ] = await Promise.all([
      v1VaultContract.getShares(userAddress),
      provider.getBalance(userAddress),
      v1VaultContract.convertToShares(withdrawAssets),
    ])

    const redeemAssets = await v1VaultContract.convertToAssets(redeemShares)

    const [ encoded, gas ] = await Promise.all([
      transaction.checkEncode({
        input,
        method: sdk.vault.withdraw,
        contract: v1VaultContract,
        calls: [ { name: 'redeem', args: [ redeemShares, userAddress ] } ],
      }),
      sdk.vault.withdraw.estimateGas(input),
    ])

    const hash = await sdk.vault.withdraw(input)

    const [ receipt, sentTx, sharesAfter, balanceAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      v1VaultContract.getShares(userAddress),
      provider.getBalance(userAddress),
    ])

    const receivedAssets = balanceAfter - balanceBefore + (receipt?.fee || 0n)

    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(sharesBefore - sharesAfter).toBe(redeemShares)
    expect(receivedAssets).toBe(redeemAssets)
  })
})
