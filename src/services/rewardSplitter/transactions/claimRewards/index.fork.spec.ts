import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  fundAccount,
  extendContract,
  mainnetAccounts,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const { vaultRewardSplitterAddress } = mainnetAccounts

const rewardSplitterHolderAddress = '0xc2cda2413e17009fcf72b1F5C3A591c2A2787371'

const claimAssets = parseEther('0.001')

const harvestAndFundHolder = async ({ sdk, provider, snapshot }: Fork) => {
  const vaultAddress = getAddress(snapshot.vaultAddress)

  await fundAccount(provider, rewardSplitterHolderAddress)

  mockForkHarvestParams(snapshot, true)

  const hash = await sdk.vault.updateState({ userAddress, vaultAddress })
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup harvest must succeed').toBe(1)
}

describe('claimRewards', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: harvestAndFundHolder })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)
  const rewardSplitterContract = sdk.contracts.helpers.createRewardSplitter(vaultRewardSplitterAddress)

  it('claim', async () => {
    mockForkHarvestParams(snapshot, false)

    const [ shares, splitterSharesBefore ] = await Promise.all([
      vaultContract.convertToShares(claimAssets),
      vaultContract.getShares(vaultRewardSplitterAddress),
    ])

    const input = {
      vaultAddress,
      assets: claimAssets,
      userAddress: rewardSplitterHolderAddress,
      rewardSplitterAddress: vaultRewardSplitterAddress,
    }

    await sendForkTransaction({
      input,
      provider,
      contract: rewardSplitterContract,
      method: sdk.rewardSplitter.claimRewards,
      calls: [
        { name: 'syncRewards', args: [] },
        { name: 'enterExitQueue', args: [ shares, rewardSplitterHolderAddress ] },
      ],
    })

    const splitterSharesAfter = await vaultContract.getShares(vaultRewardSplitterAddress)

    expect(splitterSharesBefore - splitterSharesAfter).toBe(shares)
  })
})
