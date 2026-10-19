import { describe, expect } from 'vitest'

import { it, osTokenRatePercent } from '../../../../../test'


const cases = [
  {
    name: 'fraction',
    amount: 1234567890123456789n,
    expected: 1296296284629629628n,
  },
  {
    name: 'zero',
    amount: 0n,
    expected: 0n,
  },
]

describe('getAssetsFromShares', () => {
  it.for(cases)('$name', async ({ amount, expected }, { sdk, runner }) => {
    const mintTokenControllerContract = sdk.contracts.base.mintTokenController

    runner.on(mintTokenControllerContract, {
      convertToAssets: ([ shares ]) => [ shares * osTokenRatePercent / 100n ],
    })

    const assets = await sdk.osToken.getAssetsFromShares({ amount })

    expect(assets).toBe(expected)
  })
})
