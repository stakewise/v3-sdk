import { describe, expect } from 'vitest'

import {
  userAddress,
  decodeCalls,
  it as baseIt,
  spenderAddress,
  rewardSplitterAddress,
} from '../../../../../test'

import type { SetClaimerInput } from './types'


type Input = StakeWise.ExtractInput<SetClaimerInput>

const input = { userAddress, rewardSplitterAddress, claimerAddress: spenderAddress }

const invalidCases = [
  {
    name: 'invalid user address',
    input: { ...input, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'invalid claimer address',
    input: { ...input, claimerAddress: '0x123' },
    message: 'The "claimerAddress" argument must be a valid address',
  },
  {
    name: 'missing claimer address',
    input: { userAddress, rewardSplitterAddress },
    message: 'The "claimerAddress" argument',
  },
  {
    name: 'invalid reward splitter address',
    input: { ...input, rewardSplitterAddress: '0x123' },
    message: 'The "rewardSplitterAddress" argument must be a valid address',
  },
  {
    name: 'missing reward splitter address',
    input: { userAddress, claimerAddress: spenderAddress },
    message: 'The "rewardSplitterAddress" argument',
  },
]

const it = baseIt.extend('mockSetClaimer', ({ sdk, runner }) => (
  () => {
    const rewardSplitterContract = sdk.contracts.helpers.createRewardSplitter(rewardSplitterAddress)

    runner.on(rewardSplitterContract, { setClaimer: [] })

    return rewardSplitterContract
  }
))

describe('setClaimer', () => {
  it('encode', async ({ sdk, mockSetClaimer }) => {
    const rewardSplitterContract = mockSetClaimer()

    const encoded = await sdk.rewardSplitter.setClaimer.encode(input)
    const [ call ] = decodeCalls(rewardSplitterContract, encoded.data)

    expect(encoded.to).toBe(rewardSplitterAddress)
    expect(call.name).toBe('setClaimer')
    expect(call.args.toArray()).toEqual([ spenderAddress ])
  })

  it('send', async ({ sdk, transaction, mockSetClaimer }) => {
    mockSetClaimer()

    await transaction.checkSend({ method: sdk.rewardSplitter.setClaimer, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockSetClaimer }) => {
    mockSetClaimer()

    await transaction.checkEstimateGas({ method: sdk.rewardSplitter.setClaimer, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.rewardSplitter.setClaimer.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
