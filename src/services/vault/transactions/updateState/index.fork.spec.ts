import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  useForkSdk,
  getForkHarvestArgs,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../test/fork'


describe('updateState', () => {
  const { sdk, provider, snapshot } = useForkSdk()
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const harvestArgs = getForkHarvestArgs(snapshot)
  const input = { userAddress, vaultAddress }

  it('harvest', async () => {
    const canHarvestBefore = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvestBefore, 'fixture does not match the fork block').toBe(true)

    mockForkHarvestParams(snapshot, true)

    await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.updateState,
      calls: [ { name: 'updateState', args: [ harvestArgs ] } ],
    })

    const canHarvestAfter = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvestAfter).toBe(false)
  })
})
