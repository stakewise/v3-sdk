import { describe, expect } from 'vitest'
import { Contract, getAddress } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { fork, useForkSdk, parseRewardSplitterCreated } from '../../../../../test/fork'


const vaultAddress = getAddress(fork.vaultAddress)
const input = { userAddress, vaultAddress }
const rewardSplitterViews = [ 'function vault() view returns (address)' ]

describe('createRewardSplitter', () => {
  const { sdk, provider } = useForkSdk()

  it('create', async () => {
    const rewardSplitterFactoryContract = sdk.contracts.base.rewardSplitterFactory
    const factoryAddress = await rewardSplitterFactoryContract.getAddress()

    const [ encoded, gas ] = await Promise.all([
      sdk.rewardSplitter.create.encode(input),
      sdk.rewardSplitter.create.estimateGas(input),
    ])

    const hash = await sdk.rewardSplitter.create(input)

    const [ receipt, sentTx ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
    ])

    const { owner, vault, rewardSplitter } = parseRewardSplitterCreated(receipt, factoryAddress)
    const rewardSplitterContract = new Contract(rewardSplitter, rewardSplitterViews, provider)
    const rewardSplitterVault = await rewardSplitterContract.vault()

    const [ call ] = decodeCalls(rewardSplitterFactoryContract, encoded.data)

    expect(call.name).toBe('createRewardSplitter')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(owner).toBe(userAddress)
    expect(vault).toBe(vaultAddress)
    expect(rewardSplitterVault).toBe(vaultAddress)
  })
})
