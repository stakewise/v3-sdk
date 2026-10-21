import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  useForkSdk,
  depositToFork,
  mainnetAccounts,
  forkNetworkCases,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const { v1VaultAddress } = mainnetAccounts

const depositAssets = parseEther('1')
const withdrawAssets = parseEther('0.5')

const depositToVault = (setupFork: Fork) => {
  const vaultAddress = getAddress(setupFork.snapshot.vaultAddress)

  return depositToFork({ ...setupFork, input: { userAddress, vaultAddress, assets: depositAssets } })
}

const depositToV1Vault = async ({ sdk, provider, snapshot }: Fork) => {
  mockForkHarvestParams(snapshot, false)

  const hash = await sdk.vault.deposit({ userAddress, vaultAddress: v1VaultAddress, assets: depositAssets })
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup deposit must succeed').toBe(1)
}

describe('withdraw', () => {
  describe.for(forkNetworkCases)('$name', ({ network }) => {
    const { sdk, provider, snapshot } = useForkSdk({ network, setup: depositToVault })
    const vaultAddress = getAddress(snapshot.vaultAddress)
    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
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
  })

  describe('mainnet v1 vault', () => {
    const { sdk, provider, snapshot } = useForkSdk({ setup: depositToV1Vault })
    const v1VaultContract = sdk.contracts.helpers.createVault({ vaultAddress: v1VaultAddress })

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
})
