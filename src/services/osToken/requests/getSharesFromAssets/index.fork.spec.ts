import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../../test'
import { useForkSdk } from '../../../../../test/fork'


const maxRoundTripLoss = 2n

const amountCases = [
  { name: 'one wei', amount: 1n },
  { name: 'one token', amount: parseEther('1') },
  { name: 'odd amount', amount: 123_456_789_123_456_789n },
]

describe('getSharesFromAssets', () => {
  const { sdk } = useForkSdk()

  it.for(amountCases)('$name', async ({ amount }) => {
    const shares = await sdk.osToken.getSharesFromAssets({ amount })
    const assets = await sdk.osToken.getAssetsFromShares({ amount: shares })

    const [ contractShares, contractAssets ] = await Promise.all([
      sdk.contracts.base.mintTokenController.convertToShares(amount),
      sdk.contracts.base.mintTokenController.convertToAssets(shares),
    ])

    const roundTripLoss = amount - assets

    expect(shares).toBe(contractShares)
    expect(assets).toBe(contractAssets)
    expect(roundTripLoss).toBeGreaterThanOrEqual(0n)
    expect(roundTripLoss).toBeLessThanOrEqual(maxRoundTripLoss)
  })
})
