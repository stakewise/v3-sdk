import { describe, expect } from 'vitest'

import { it, osTokenRatePercent } from '../../../../../test'


const cases = [
  {
    name: 'fraction',
    amount: 1234567890123456789n,
    expected: 1175778942974720751n,
  },
  {
    name: 'zero',
    amount: 0n,
    expected: 0n,
  },
]

describe('getSharesFromAssets', () => {
  it.for(cases)('$name', async ({ amount, expected }, { sdk, runner }) => {
    const mintTokenControllerContract = sdk.contracts.base.mintTokenController

    runner.on(mintTokenControllerContract, {
      convertToShares: ([ assets ]) => [ assets * 100n / osTokenRatePercent ],
    })

    const shares = await sdk.osToken.getSharesFromAssets({ amount })

    expect(shares).toBe(expected)
  })
})
