import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../../test'
import { useForkSdk, depositToFork, mockForkHarvestParams } from '../../../../../../test/fork'


describe('deposit', () => {
  const fork = useForkSdk()
  const { sdk, provider, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const input = { userAddress, vaultAddress, assets: parseEther('1') }

  it('with updateState', async () => {
    const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvest, 'fixture does not match the fork block').toBe(true)

    mockForkHarvestParams(snapshot, true)

    const [ encoded, gas ] = await Promise.all([
      sdk.vault.deposit.encode(input),
      sdk.vault.deposit.estimateGas(input),
    ])

    const hash = await sdk.vault.deposit(input)

    const [ receipt, sentTx ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
    ])

    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(call.name).toBe('updateStateAndDeposit')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(sentTx?.value).toBe(input.assets)
    expect(receipt?.status).toBe(1)
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
