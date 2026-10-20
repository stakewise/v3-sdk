import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { useForkSdk, mintToFork, depositToFork } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const depositAssets = parseEther('1')
const mintShares = parseEther('0.1')
const burnDelaySeconds = 60
const halfOfMinted = mintShares / 2n

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
  const burnInput = { userAddress, vaultAddress, shares: halfOfMinted }

  it('burn', async () => {
    await provider.send('evm_increaseTime', [ burnDelaySeconds ])
    await provider.send('evm_mine', [])

    const positionBefore = await vaultContract.osTokenPositions(userAddress)

    const [ encoded, gas ] = await Promise.all([
      sdk.osToken.burn.encode(burnInput),
      sdk.osToken.burn.estimateGas(burnInput),
    ])

    const hash = await sdk.osToken.burn(burnInput)

    const [ receipt, sentTx, positionAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      vaultContract.osTokenPositions(userAddress),
    ])

    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(call.name).toBe('burnOsToken')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(positionAfter).toBeLessThan(positionBefore)
  })
})
