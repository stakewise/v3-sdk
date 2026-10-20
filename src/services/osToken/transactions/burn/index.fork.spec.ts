import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { fork, useForkSdk, mintToFork, depositToFork } from '../../../../../test/fork'


const vaultAddress = getAddress(fork.vaultAddress)
const depositInput = { userAddress, vaultAddress, assets: parseEther('1') }
const mintInput = { userAddress, vaultAddress, shares: parseEther('0.1') }
const burnDelaySeconds = 60
const halfOfMinted = mintInput.shares / 2n
const burnInput = { userAddress, vaultAddress, shares: halfOfMinted }

describe('burn', () => {
  const { sdk, provider } = useForkSdk()

  it('deposit', async ({ graphql }) => {
    const receipt = await depositToFork({
      sdk,
      graphql,
      provider,
      input: depositInput,
    })

    expect(receipt?.status).toBe(1)
  })

  it('mint', async ({ graphql }) => {
    const receipt = await mintToFork({
      sdk,
      graphql,
      provider,
      input: mintInput,
    })

    expect(receipt?.status).toBe(1)
  })

  it('burn', async () => {
    await provider.send('evm_increaseTime', [ burnDelaySeconds ])
    await provider.send('evm_mine', [])

    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
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
