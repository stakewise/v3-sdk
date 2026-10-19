import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import {
  userAddress,
  it as baseIt,
  vaultAddress,
  checksumAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { MintInput } from './types'
import type { HarvestInput } from '../../../../../test'


type Input = StakeWise.ExtractInput<MintInput>

const shares = 10n
const input = { userAddress, vaultAddress, shares }

const encodeCases = [
  {
    name: 'encode',
    values: {},
    referrer: ZeroAddress,
  },
  {
    name: 'referrer',
    values: { referrerAddress: checksumAddress },
    referrer: checksumAddress,
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid shares',
    input: { ...input, shares: '10' },
    message: 'The "shares" argument must be of type bigint',
  },
  {
    name: 'missing shares',
    input: { userAddress, vaultAddress },
    message: 'The "shares" argument',
  },
  {
    name: 'invalid referrer address',
    input: { ...input, referrerAddress: '0x123' },
    message: 'The "referrerAddress" argument must be a valid address',
  },
]

const it = baseIt.extend('mockMint', ({ runner, graphql, vaultContract }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values

    runner.on(vaultContract, { mintOsToken: [ 1n ] })

    graphql.mockHarvestParams({ canHarvest })
  }
))

describe('mint', () => {
  it.for(encodeCases)('$name', async ({ values, referrer }, { sdk, transaction, vaultContract, mockMint }) => {
    mockMint()

    await transaction.checkEncode({
      contract: vaultContract,
      method: sdk.osToken.mint,
      input: { ...input, ...values },
      calls: [ { name: 'mintOsToken', args: [ userAddress, shares, referrer ] } ],
    })
  })

  it('send', async ({ sdk, transaction, mockMint }) => {
    mockMint()

    await transaction.checkMulticallSend({ method: sdk.osToken.mint, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockMint }) => {
    mockMint()

    await transaction.checkEstimateGas({ method: sdk.osToken.mint, input })
  })

  it('with harvest', async ({ sdk, transaction, vaultContract, mockMint }) => {
    mockMint({ canHarvest: true })

    await transaction.checkHarvest({
      input,
      contract: vaultContract,
      method: sdk.osToken.mint,
      names: [ 'updateState', 'mintOsToken' ],
    })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.osToken.mint.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
