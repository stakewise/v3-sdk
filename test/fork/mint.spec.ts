import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '..'

import fork from './mocks/fork.json'
import useForkSdk from './useForkSdk'
import depositToFork from './depositToFork'
import type { HarvestParamsQueryPayload } from '../../src/graphql/subgraph/vault'


const vaultAddress = getAddress(fork.vaultAddress)
const depositInput = { userAddress, vaultAddress, assets: parseEther('1') }
const mintInput = { userAddress, vaultAddress, shares: parseEther('0.1') }
const burnDelaySeconds = 60
const halfOfMinted = mintInput.shares / 2n
const burnInput = { userAddress, vaultAddress, shares: halfOfMinted }

describe('mint and burn', () => {
  const { sdk, provider } = useForkSdk()

  it('deposit', async ({ graphql }) => {
    const receipt = await depositToFork({ sdk, provider, graphql, input: depositInput })

    expect(receipt?.status).toBe(1)
  })

  it('mint', async ({ graphql }) => {
    const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvest, 'the vault must be harvested by the previous test').toBe(false)

    const harvestParams = { ...fork.harvestParams, canHarvest: false }

    graphql.mock<HarvestParamsQueryPayload>({ name: 'HarvestParams', data: { harvestParams } })

    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
    const [ encoded, gas ] = await Promise.all([
      sdk.osToken.mint.encode(mintInput),
      sdk.osToken.mint.estimateGas(mintInput),
    ])

    const hash = await sdk.osToken.mint(mintInput)

    const [ receipt, sentTx, position ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      vaultContract.osTokenPositions(userAddress),
    ])

    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(call.name).toBe('mintOsToken')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(position).toBeGreaterThanOrEqual(mintInput.shares)
  })

  it('burn', async () => {
    await provider.send('evm_increaseTime', [ burnDelaySeconds ])
    await provider.send('evm_mine', [])

    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
    const positionBefore = await vaultContract.osTokenPositions(userAddress)

    const [ encoded, gas ] = await Promise.all([
      sdk.osToken.burn.encode(burnInput),
      sdk.osToken.burn.estimateGas(burnInput),
    ])

    const hash = await sdk.osToken.burn(burnInput)

    const [ receipt, sentTx, positionAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      vaultContract.osTokenPositions(userAddress),
    ])

    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(call.name).toBe('burnOsToken')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(positionAfter).toBeLessThan(positionBefore)
  })
})
