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

const encodeCases = [
  {
    name: 'default referrer',
    input: baseInput,
    args: [ userAddress, ZeroAddress ],
  },
  {
    name: 'max assets',
    input: { ...input, assets: MaxUint256 },
    args: [ userAddress, spenderAddress ],
  },
]

const sendCases = [
  { name: 'send', canHarvest: false },
  { name: 'send with harvest', canHarvest: true },
]

const estimateGasCases = [
  { name: 'estimateGas', canHarvest: false },
  { name: 'estimateGas with harvest', canHarvest: true },
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
    const { input: encodeInput, args } = encodeCase

    mockDeposit()

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

  it.for(sendCases)('$name', async ({ canHarvest }, { sdk, transaction, mockDeposit }) => {
    mockDeposit({ canHarvest })

    await transaction.checkSend({ method: sdk.vault.deposit, input })
  })

  it.for(estimateGasCases)('$name', async ({ canHarvest }, { sdk, transaction, mockDeposit }) => {
    mockDeposit({ canHarvest })

    await transaction.checkEstimateGas({ method: sdk.vault.deposit, input })
  })

  it.for(getDepositInvalidCases())('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.vault.deposit.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
