import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '..'

import fork from './mocks/fork.json'
import useForkSdk from './useForkSdk'
import type { HarvestParamsQueryPayload } from '../../src/graphql/subgraph/vault'


const vaultAddress = getAddress(fork.vaultAddress)
const input = { userAddress, vaultAddress, assets: parseEther('1') }

describe('deposit', () => {
  const { sdk, provider } = useForkSdk()

  it('with updateState', async ({ graphql }) => {
    const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvest, 'fixture does not match the fork block').toBe(true)

    graphql.mock<HarvestParamsQueryPayload>({ name: 'HarvestParams', data: { harvestParams: fork.harvestParams } })

    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
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

  it('without updateState', async ({ graphql }) => {
    const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvest, 'the vault must be harvested by the previous test').toBe(false)

    const harvestParams = { ...fork.harvestParams, canHarvest: false }

    graphql.mock<HarvestParamsQueryPayload>({ name: 'HarvestParams', data: { harvestParams } })

    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
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
