import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../../test'
import { useForkSdk, forkNetworkCases } from '../../../../../test/fork'


const oneShare = parseEther('1')

describe('getOsTokenRate', () => {
  describe.for(forkNetworkCases)('$name', ({ network }) => {
    const { sdk } = useForkSdk({ network })

    it('rate', async () => {
      const rate = await sdk.osToken.getRate()

      const oneShareAssets = await sdk.contracts.base.mintTokenController.convertToAssets(oneShare)
      const rateInWei = parseEther(rate)

      expect(rateInWei).toBe(oneShareAssets)
    })
  })
})
