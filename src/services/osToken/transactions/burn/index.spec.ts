import { describe, expect } from 'vitest'

import { userAddress, decodeCalls, it, vaultAddress } from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { BurnInput } from './types'


type Input = StakeWise.ExtractInput<BurnInput>

const shares = 10n
const input = { userAddress, vaultAddress, shares }

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
]

describe('burn', () => {

  it.beforeEach(({ runner, vaultContract }) => {
    runner.on(vaultContract, { burnOsToken: [ 1n ] })
  })

  it('encode', async ({ sdk, vaultContract }) => {
    const tx = await sdk.osToken.burn.encode(input)
    const [ call ] = decodeCalls(vaultContract, tx.data)

    expect(tx.to).toBe(vaultAddress)
    expect(call.name).toBe('burnOsToken')
    expect(call.args.toArray()).toEqual([ shares ])
  })

  it('send', async ({ sdk, transaction }) => {
    await transaction.checkSend({ method: sdk.osToken.burn, input })
  })

  it('estimateGas', async ({ sdk, transaction }) => {
    await transaction.checkEstimateGas({ method: sdk.osToken.burn, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.osToken.burn.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
