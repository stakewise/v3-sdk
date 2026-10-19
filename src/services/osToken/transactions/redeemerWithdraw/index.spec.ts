import { describe, expect } from 'vitest'

import {
  it,
  userAddress,
  decodeCalls,
  spenderAddress,
} from '../../../../../test'

import type { RedeemerWithdrawInput } from './types'


type Input = StakeWise.ExtractInput<RedeemerWithdrawInput>

const shares = 10n
const input = { userAddress, shares }

const invalidCases = [
  {
    name: 'invalid user address',
    input: { ...input, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'invalid shares',
    input: { ...input, shares: '10' },
    message: 'The "shares" argument must be of type bigint',
  },
  {
    name: 'missing shares',
    input: { userAddress },
    message: 'The "shares" argument',
  },
]

describe('redeemerWithdraw', () => {

  it.beforeEach(({ sdk, runner }) => {
    runner.on(sdk.contracts.base.osTokenRedeemer, { enterExitQueue: [ 1n ] })
  })

  it('encode', async ({ sdk }) => {
    const redeemerContract = sdk.contracts.base.osTokenRedeemer

    const [ tx, address ] = await Promise.all([
      sdk.osToken.redeemerWithdraw.encode({ userAddress: spenderAddress, shares }),
      redeemerContract.getAddress(),
    ])
    const [ call ] = decodeCalls(redeemerContract, tx.data)

    expect(tx.to).toBe(address)
    expect(call.name).toBe('enterExitQueue')
    expect(call.args.toArray()).toEqual([ shares, spenderAddress ])
  })

  it('send', async ({ sdk, transaction }) => {
    await transaction.checkSend({ method: sdk.osToken.redeemerWithdraw, input })
  })

  it('estimateGas', async ({ sdk, transaction }) => {
    await transaction.checkEstimateGas({ method: sdk.osToken.redeemerWithdraw, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.osToken.redeemerWithdraw.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
