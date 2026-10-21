import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  extendContract,
  fundVaultAdmin,
  mainnetAccounts,
  sendForkTransaction,
} from '../../../../../test/fork'


const { vaultRewardSplitterAddress } = mainnetAccounts

describe('setClaimer', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: fundVaultAdmin })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  const rewardSplitterContract = extendContract(
    sdk.contracts.helpers.createRewardSplitter(vaultRewardSplitterAddress),
    forkAbis.rewardSplitter
  )

  it('set claimer', async () => {
    const [ adminAddress, claimerBefore ] = await Promise.all([
      vaultContract.admin(),
      rewardSplitterContract.claimer(),
    ])

    expect(claimerBefore, 'the claimer must differ from the new one').not.toBe(userAddress)

    const input = {
      userAddress: adminAddress,
      claimerAddress: userAddress,
      rewardSplitterAddress: vaultRewardSplitterAddress,
    }

    await sendForkTransaction({
      input,
      provider,
      contract: rewardSplitterContract,
      method: sdk.rewardSplitter.setClaimer,
      calls: [ { name: 'setClaimer', args: [ userAddress ] } ],
    })

    const claimerAfter = await rewardSplitterContract.claimer()

    expect(claimerAfter).toBe(userAddress)
  })
})
