import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../../test'
import { useForkSdk } from '../../../../../test/fork'


const maxRoundTripLoss = 1n

const amountCases = [
  { name: 'one wei', amount: 1n },
  { name: 'one token', amount: parseEther('1') },
  { name: 'odd amount', amount: 123_456_789_123_456_789n },
]

describe('getAssetsFromShares', () => {
  const { sdk } = useForkSdk()

  it.for(amountCases)('$name', async ({ amount }) => {
    const assets = await sdk.osToken.getAssetsFromShares({ amount })
    const shares = await sdk.osToken.getSharesFromAssets({ amount: assets })

    const [ contractAssets, contractShares ] = await Promise.all([
      sdk.contracts.base.mintTokenController.convertToAssets(amount),
      sdk.contracts.base.mintTokenController.convertToShares(assets),
    ])

    const roundTripLoss = amount - shares

    expect(assets).toBe(contractAssets)
    expect(shares).toBe(contractShares)
    expect(roundTripLoss).toBeGreaterThanOrEqual(0n)
    expect(roundTripLoss).toBeLessThanOrEqual(maxRoundTripLoss)
  })
})
