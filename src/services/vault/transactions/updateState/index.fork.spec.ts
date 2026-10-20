import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { useForkSdk, getForkHarvestArgs, mockForkHarvestParams } from '../../../../../test/fork'


describe('updateState', () => {
  const { sdk, provider, snapshot } = useForkSdk()
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const { keeper } = sdk.contracts.base
  const input = { userAddress, vaultAddress }

  it('harvest', async ({ transaction }) => {
    const harvestArgs = getForkHarvestArgs(snapshot)

    const canHarvestBefore = await keeper.canHarvest(vaultAddress)

    expect(canHarvestBefore, 'fixture does not match the fork block').toBe(true)

    mockForkHarvestParams(snapshot, true)

    const [ encoded, gas ] = await Promise.all([
      transaction.checkEncode({
        input,
        method: sdk.vault.updateState,
        contract: vaultContract,
        calls: [ { name: 'updateState', args: [ harvestArgs ] } ],
      }),
      sdk.vault.updateState.estimateGas(input),
    ])

    const hash = await sdk.vault.updateState(input)

    const [ receipt, sentTx, canHarvestAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      keeper.canHarvest(vaultAddress),
    ])

    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(canHarvestAfter).toBe(false)
  })
})
