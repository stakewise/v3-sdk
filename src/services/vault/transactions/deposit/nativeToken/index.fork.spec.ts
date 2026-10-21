import { describe, expect } from 'vitest'
import { getAddress, parseEther, ZeroAddress } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../../test'
import {
  useForkSdk,
  depositToFork,
  getForkHarvestArgs,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../../test/fork'


describe('deposit', () => {
  const fork = useForkSdk()
  const { sdk, provider, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const harvestArgs = getForkHarvestArgs(snapshot)
  const input = { userAddress, vaultAddress, assets: parseEther('1') }

  it('with updateState', async () => {
    const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvest, 'fixture does not match the fork block').toBe(true)

    mockForkHarvestParams(snapshot, true)

    const { sentTx } = await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.deposit,
      calls: [ { name: 'updateStateAndDeposit', args: [ userAddress, ZeroAddress, harvestArgs ] } ],
    })

    expect(sentTx?.value).toBe(input.assets)
  })

  it('without updateState', async () => {
    await depositToFork({ ...fork, input })

    mockForkHarvestParams(snapshot, false)

    const [ encoded, hash ] = await Promise.all([
      sdk.vault.deposit.encode(input),
      sdk.vault.deposit(input),
    ])

    const receipt = await provider.waitForTransaction(hash)
    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(call.name).toBe('deposit')
    expect(receipt?.status).toBe(1)
  })
})
