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

import type { DepositAndMintInput } from '../types'
import type { HarvestInput } from '../../../../../../test'


type Input = StakeWise.ExtractInput<DepositAndMintInput>

const assets = 10n
const receiveShares = 6n
const baseInput = {
  userAddress,
  vaultAddress,
  assets,
  receiveShares,
}
const input = { ...baseInput, referrerAddress: spenderAddress }
const invalidReceiveSharesMessage = 'The "receiveShares" argument must be of type bigint'

const plainDeposit = { values: {} }
const harvestDeposit = { values: { canHarvest: true } }

const encodeCases = [
  {
    name: 'default referrer',
    values: {},
    input: baseInput,
    args: [ userAddress, receiveShares, ZeroAddress ],
  },
  {
    name: 'max amounts',
    values: {},
    input: { ...input, assets: MaxUint256, receiveShares: MaxUint256 },
    args: [ userAddress, MaxUint256, spenderAddress ],
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

const invalidCases = [
  ...getDepositInvalidCases({ receiveShares }),
  {
    name: 'missing receive shares',
    input: { userAddress, vaultAddress, assets },
    message: invalidReceiveSharesMessage,
  },
  {
    name: 'string receive shares',
    input: { ...baseInput, receiveShares: '6' },
    message: invalidReceiveSharesMessage,
  },
]

const it = baseIt.extend('mockDepositAndMint', ({ sdk, runner, graphql }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values
    const vaultContract = sdk.contracts.helpers.createVault({
      vaultAddress,
      options: { isDepositWithMint: true },
    })

    runner.on(vaultContract, {
      depositAndMintOsToken: [ 0n ],
      updateStateAndDepositAndMintOsToken: [ 0n ],
    })

    graphql.mockHarvestParams({ canHarvest })

    return vaultContract
  }
))

describe('depositAndMint', () => {
  it.for(encodeCases)('$name', async (encodeCase, { sdk, mockDepositAndMint }) => {
    const { values, input: encodeInput, args } = encodeCase

    const vaultContract = mockDepositAndMint(values)

    const encoded = await sdk.vault.depositAndMint.encode(encodeInput)
    const [ call ] = decodeCalls(vaultContract, encoded.data)

    expect(encoded).toMatchObject({ to: vaultAddress, value: encodeInput.assets })
    expect(call.name).toBe('depositAndMintOsToken')
    expect(call.args.toArray()).toEqual(args)
  })

  it('with harvest', async ({ sdk, graphql, mockDepositAndMint }) => {
    const vaultContract = mockDepositAndMint({ canHarvest: true })

    const encoded = await sdk.vault.depositAndMint.encode(input)
    const [ call ] = decodeCalls(vaultContract, encoded.data)
    const [ receiver, osTokenShares, referrer, harvestParams ] = call.args
    const harvestRequest = {
      operationName: 'HarvestParams',
      variables: { address: vaultAddress },
    }

    expect(encoded).toMatchObject({ to: vaultAddress, value: assets })
    expect(call.name).toBe('updateStateAndDepositAndMintOsToken')
    expect([ receiver, osTokenShares, referrer ]).toEqual([ userAddress, receiveShares, spenderAddress ])
    checkHarvestParams(harvestParams)
    expect(graphql.calls).toContainEqual(expect.objectContaining(harvestRequest))
  })

  it.for(sendCases)('$name', async ({ values }, { sdk, transaction, mockDepositAndMint }) => {
    mockDepositAndMint(values)

    await transaction.checkSend({ method: sdk.vault.depositAndMint, input })
  })

  it.for(estimateGasCases)('$name', async ({ values }, { sdk, transaction, mockDepositAndMint }) => {
    mockDepositAndMint(values)

    await transaction.checkEstimateGas({ method: sdk.vault.depositAndMint, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk, mockDepositAndMint }) => {
    mockDepositAndMint()

    const request = sdk.vault.depositAndMint.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
