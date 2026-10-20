import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { fork, useForkSdk, depositToFork, mockForkHarvestParams } from '../../../../../test/fork'


const vaultAddress = getAddress(fork.vaultAddress)
const depositInput = { userAddress, vaultAddress, assets: parseEther('1') }
const withdrawInput = { userAddress, vaultAddress, assets: parseEther('0.5') }

describe('withdraw', () => {
  const { sdk, provider } = useForkSdk((setupFork) => depositToFork({ ...setupFork, input: depositInput }))
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  it('enters the exit queue', async () => {
    mockForkHarvestParams(false)

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
