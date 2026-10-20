import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { fork, useForkSdk, depositToFork } from '../../../../../test/fork'

import type { HarvestParamsQueryPayload } from '../../../../graphql/subgraph/vault'


const vaultAddress = getAddress(fork.vaultAddress)
const depositInput = { userAddress, vaultAddress, assets: parseEther('1') }
const mintInput = { userAddress, vaultAddress, shares: parseEther('0.1') }

describe('mint', () => {
  const { sdk, provider } = useForkSdk()

  it('deposit', async ({ graphql }) => {
    const receipt = await depositToFork({
      sdk,
      graphql,
      provider,
      input: depositInput,
    })

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
})
