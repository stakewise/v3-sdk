import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { forkAbis, useForkSdk, parseEvents, extendContract, sendForkTransaction } from '../../../../../test/fork'


describe('createRewardSplitter', () => {
  const { sdk, provider, snapshot } = useForkSdk()
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const input = { userAddress, vaultAddress }

  it('create', async () => {
    const factoryContract = extendContract(sdk.contracts.base.rewardSplitterFactory, forkAbis.rewardSplitterFactory)

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: factoryContract,
      method: sdk.rewardSplitter.create,
      calls: [ { name: 'createRewardSplitter', args: [ vaultAddress ] } ],
    })

    const events = await parseEvents(factoryContract, receipt)

    expect(events).toHaveLength(1)

    const { owner, vault, rewardSplitter } = events[0]!.args
    const rewardSplitterContract = extendContract(
      sdk.contracts.helpers.createRewardSplitter(rewardSplitter),
      forkAbis.rewardSplitter
    )

    const rewardSplitterVault = await rewardSplitterContract.vault()

    expect(owner).toBe(userAddress)
    expect(vault).toBe(vaultAddress)
    expect(rewardSplitterVault).toBe(vaultAddress)
  })
})
