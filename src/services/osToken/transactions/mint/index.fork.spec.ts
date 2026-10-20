import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { fork, useForkSdk, depositToFork, mockForkHarvestParams } from '../../../../../test/fork'


const vaultAddress = getAddress(fork.vaultAddress)
const depositInput = { userAddress, vaultAddress, assets: parseEther('1') }
const mintInput = { userAddress, vaultAddress, shares: parseEther('0.1') }

describe('mint', () => {
  const { sdk, provider } = useForkSdk((setupFork) => depositToFork({ ...setupFork, input: depositInput }))
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  it('mint', async () => {
    mockForkHarvestParams(false)

    const [ encoded, gas ] = await Promise.all([
      sdk.osToken.mint.encode(mintInput),
      sdk.osToken.mint.estimateGas(mintInput),
    ])

    const hash = await sdk.osToken.mint(mintInput)

    const [ receipt, sentTx, position ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      vaultContract.osTokenPositions(userAddress),
    ])

    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(call.name).toBe('mintOsToken')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(position).toBeGreaterThanOrEqual(mintInput.shares)
  })
})
