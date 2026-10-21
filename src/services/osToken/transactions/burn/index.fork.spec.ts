import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { useForkSdk, forkNetworkCases, sendForkTransaction, depositAndMintToFork } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const mintShares = parseEther('0.1')

const depositAndMint = (setupFork: Fork) => depositAndMintToFork(setupFork, mintShares)

describe('burn', () => {
  describe.for(forkNetworkCases)('$name', ({ network }) => {
    const { sdk, provider, snapshot } = useForkSdk({ network, setup: depositAndMint })
    const vaultAddress = getAddress(snapshot.vaultAddress)
    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
    const burnInput = { userAddress, vaultAddress, shares: mintShares }

    it('burn', async () => {
      const positionBefore = await vaultContract.osTokenPositions(userAddress)

      await sendForkTransaction({
        provider,
        input: burnInput,
        contract: vaultContract,
        method: sdk.osToken.burn,
        calls: [ { name: 'burnOsToken', args: [ mintShares ] } ],
      })

      const positionAfter = await vaultContract.osTokenPositions(userAddress)

      expect(positionAfter).toBeLessThan(positionBefore)
    })
  })
})
