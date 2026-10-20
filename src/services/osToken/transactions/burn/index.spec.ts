import { describe, expect } from 'vitest'

import { it, userAddress, vaultAddress, estimatedGas } from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { BurnInput } from './types'


type Input = StakeWise.ExtractInput<BurnInput>

const shares = 10n
const input = { userAddress, vaultAddress, shares }
const burnGasLimit = estimatedGas * 130n / 100n

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

  it('encode', async ({ sdk, transaction, vaultContract }) => {
    await transaction.checkEncode({
      input,
      contract: vaultContract,
      method: sdk.osToken.burn,
      calls: [ { name: 'burnOsToken', args: [ shares ] } ],
    })
  })

  it('send', async ({ sdk, transaction }) => {
    await transaction.checkSend({ input, method: sdk.osToken.burn, gasLimit: burnGasLimit })
  })

  it('estimateGas', async ({ sdk, transaction }) => {
    await transaction.checkEstimateGas({ method: sdk.osToken.burn, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.osToken.burn.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
