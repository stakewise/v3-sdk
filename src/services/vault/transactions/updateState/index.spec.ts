import { describe, expect } from 'vitest'

import {
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
  checkHarvestParams,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { UpdateStateInput } from './types'
import type { HarvestInput } from '../../../../../test'


type Input = StakeWise.ExtractInput<UpdateStateInput>

const input = { userAddress, vaultAddress }

const it = baseIt.extend('mockUpdateState', ({ runner, graphql, vaultContract }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = true } = values

    runner.on(vaultContract, { updateState: [] })

    graphql.mockHarvestParams({ canHarvest })
  }
))

describe('updateState', () => {
  it('encode', async ({ sdk, graphql, vaultContract, mockUpdateState }) => {
    mockUpdateState()

    const encoded = await sdk.vault.updateState.encode(input)
    const [ call ] = decodeCalls(vaultContract, encoded.data!)
    const [ harvestParams ] = call.args
    const harvestRequest = {
      operationName: 'HarvestParams',
      variables: { address: vaultAddress },
    }

    expect(encoded.to).toBe(vaultAddress)
    expect(call.name).toBe('updateState')
    checkHarvestParams(harvestParams)
    expect(graphql.calls).toEqual([ expect.objectContaining(harvestRequest) ])
  })

  it('send', async ({ sdk, transaction, mockUpdateState }) => {
    mockUpdateState()

    await transaction.checkSend({ method: sdk.vault.updateState, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockUpdateState }) => {
    mockUpdateState()

    await transaction.checkEstimateGas({ method: sdk.vault.updateState, input })
  })

  it('no harvest', async ({ sdk, runner, mockUpdateState }) => {
    mockUpdateState({ canHarvest: false })

    const [ encoded, hash, gas ] = await Promise.all([
      sdk.vault.updateState.encode(input),
      sdk.vault.updateState(input),
      sdk.vault.updateState.estimateGas(input),
    ])

    expect(encoded).toEqual({})
    expect(hash).toBe('')
    expect(gas).toBe(0n)
    expect(runner.sent).toHaveLength(0)
    expect(runner.estimated).toHaveLength(0)
  })

  it('invalid vault address', async ({ sdk }) => {
    const { input: invalidInput, message } = baseInputWiringCase

    const request = sdk.vault.updateState.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
