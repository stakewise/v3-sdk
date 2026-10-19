import { describe, expect } from 'vitest'

import { userAddress, it as baseIt } from '../../../../../test'

import type { ClaimInput } from './types'


type Input = StakeWise.ExtractInput<ClaimInput>

const firstToken = '0x3333333333333333333333333333333333333333'
const secondToken = '0x6666666666666666666666666666666666666666'
const tokens = [ firstToken, secondToken ]
const cumulativeAmounts = [ '1000000000000000000', '2500000000000000000' ]
const proof = [ `0x${'aa'.repeat(32)}`, `0x${'bb'.repeat(32)}` ]
const input = {
  userAddress,
  proof,
  tokens,
  cumulativeAmounts,
}

const invalidCases = [
  {
    name: 'invalid user address',
    input: { ...input, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'missing proof',
    input: { userAddress, tokens, cumulativeAmounts },
    message: 'The "proof" argument',
  },
  {
    name: 'missing tokens',
    input: { userAddress, proof, cumulativeAmounts },
    message: 'The "tokens" argument',
  },
  {
    name: 'missing cumulative amounts',
    input: { userAddress, proof, tokens },
    message: 'The "cumulativeAmounts" argument',
  },
  {
    name: 'empty proof',
    input: { ...input, proof: [] },
    message: 'The "proof" argument is an empty array',
  },
  {
    name: 'invalid token',
    input: { ...input, tokens: [ firstToken, 5 ] },
    message: 'The "tokens.1" argument must be a string',
  },
]

const it = baseIt.extend('mockClaim', ({ sdk, runner }) => (
  () => {
    const { merkleDistributorV2: merkleDistributorContract } = sdk.contracts.special

    runner.on(merkleDistributorContract, { claim: [] })

    return merkleDistributorContract
  }
))

describe('claim', () => {
  it('encode', async ({ sdk, transaction, mockClaim }) => {
    const contract = mockClaim()

    await transaction.checkEncode({
      input,
      contract,
      method: sdk.distributorRewards.claim,
      calls: [ { name: 'claim', args: [ userAddress, tokens, cumulativeAmounts.map(BigInt), proof ] } ],
    })
  })

  it('send', async ({ sdk, transaction, mockClaim }) => {
    mockClaim()

    await transaction.checkSend({ method: sdk.distributorRewards.claim, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockClaim }) => {
    mockClaim()

    await transaction.checkEstimateGas({ method: sdk.distributorRewards.claim, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.distributorRewards.claim.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
