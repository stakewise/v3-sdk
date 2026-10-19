import { describe, expect } from 'vitest'
import { MaxUint256, ZeroAddress } from 'ethers'

import {
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
  spenderAddress,
  checkHarvestParams,
} from '../../../../../../test'
import { getDepositInvalidCases } from '../../../../../../test/mocks/depositInvalidCases'

import type { DepositInput } from '../types'
import type { HarvestInput } from '../../../../../../test'


type Input = StakeWise.ExtractInput<DepositInput>

const assets = 10n
const baseInput = { userAddress, vaultAddress, assets }
const input = { ...baseInput, referrerAddress: spenderAddress }

const plainDeposit = { values: {} }
const harvestDeposit = { values: { canHarvest: true } }

const encodeCases = [
  {
    name: 'default referrer',
    values: {},
    input: baseInput,
    args: [ userAddress, ZeroAddress ],
  },
  {
    name: 'max assets',
    values: {},
    input: { ...input, assets: MaxUint256 },
    args: [ userAddress, spenderAddress ],
  },
]

const sendCases = [
  { name: 'send', ...plainDeposit },
  { name: 'send with harvest', ...harvestDeposit },
]

const estimateGasCases = [
  { name: 'estimateGas', ...plainDeposit },
  { name: 'estimateGas with harvest', ...harvestDeposit },
]

const it = baseIt.extend('mockDeposit', ({ runner, graphql, vaultContract }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values

    runner.on(vaultContract, {
      deposit: [ 0n ],
      updateStateAndDeposit: [ 0n ],
    })

    graphql.mockHarvestParams({ canHarvest })
  }
))

describe('deposit', () => {
  it.for(encodeCases)('$name', async (encodeCase, { sdk, vaultContract, mockDeposit }) => {
    const { values, input: encodeInput, args } = encodeCase

    mockDeposit(values)

    const encoded = await sdk.vault.deposit.encode(encodeInput)
    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(encoded).toMatchObject({ to: vaultAddress, value: encodeInput.assets })
    expect(call.name).toBe('deposit')
    expect(call.args.toArray()).toEqual(args)
  })

  it('with harvest', async ({ sdk, graphql, vaultContract, mockDeposit }) => {
    mockDeposit({ canHarvest: true })

    const encoded = await sdk.vault.deposit.encode(input)
    const [ call ] = decodeCalls(vaultContract, encoded.data)
    const [ receiver, referrer, harvestParams ] = call.args
    const harvestRequest = {
      operationName: 'HarvestParams',
      variables: { address: vaultAddress },
    }

    expect(encoded).toMatchObject({ to: vaultAddress, value: assets })
    expect(call.name).toBe('updateStateAndDeposit')
    expect([ receiver, referrer ]).toEqual([ userAddress, spenderAddress ])
    checkHarvestParams(harvestParams)
    expect(graphql.calls).toContainEqual(expect.objectContaining(harvestRequest))
  })

  it.for(sendCases)('$name', async ({ values }, { sdk, transaction, mockDeposit }) => {
    mockDeposit(values)

    await transaction.checkSend({ method: sdk.vault.deposit, input })
  })

  it.for(estimateGasCases)('$name', async ({ values }, { sdk, transaction, mockDeposit }) => {
    mockDeposit(values)

    await transaction.checkEstimateGas({ method: sdk.vault.deposit, input })
  })

  it.for(getDepositInvalidCases())('$name', async ({ input: invalidInput, message }, { sdk, mockDeposit }) => {
    mockDeposit()

    const request = sdk.vault.deposit.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
