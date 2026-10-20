import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { fork, forkAbis, useForkSdk, parseEvents, extendContract } from '../../../../../test/fork'


const vaultAddress = getAddress(fork.vaultAddress)
const input = { userAddress, vaultAddress }

describe('createRewardSplitter', () => {
  const { sdk, provider } = useForkSdk()

  it('create', async () => {
    const factoryContract = extendContract(sdk.contracts.base.rewardSplitterFactory, forkAbis.rewardSplitterFactory)

    const [ encoded, gas ] = await Promise.all([
      sdk.rewardSplitter.create.encode(input),
      sdk.rewardSplitter.create.estimateGas(input),
    ])

    const hash = await sdk.rewardSplitter.create(input)

    const [ receipt, sentTx ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
    ])

    const events = await parseEvents(factoryContract, receipt)

    expect(events).toHaveLength(1)

    const { owner, vault, rewardSplitter } = events[0]!.args
    const rewardSplitterContract = extendContract(
      sdk.contracts.helpers.createRewardSplitter(rewardSplitter),
      forkAbis.rewardSplitter
    )

    const rewardSplitterVault = await rewardSplitterContract.vault()
    const [ call ] = decodeCalls(factoryContract, encoded.data)

    expect(call.name).toBe('createRewardSplitter')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(owner).toBe(userAddress)
    expect(vault).toBe(vaultAddress)
    expect(rewardSplitterVault).toBe(vaultAddress)
  })
})
