import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { useForkSdk, mintMaxToFork, mockForkStake, forkNetworkCases } from '../../../../../test/fork'


const withdrawCases = [
  { name: 'shares', amount: { shares: parseEther('0.4') } },
  { name: 'assets', amount: { assets: parseEther('1') } },
]

describe('burnAndWithdraw', () => {
  describe.for(forkNetworkCases)('$name', ({ network }) => {
    const forkSdk = useForkSdk({ network, setup: mintMaxToFork })
    const { sdk, provider, snapshot } = forkSdk
    const vaultAddress = getAddress(snapshot.vaultAddress)
    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
    const baseInput = { userAddress, vaultAddress }

    it.for(withdrawCases)('$name', async ({ amount }) => {
      const input = { ...baseInput, ...amount }

      await mockForkStake(forkSdk)

      const latestBlock = await provider.getBlock('latest')
      const [ positionBefore, sharesBefore ] = await Promise.all([
        vaultContract.osTokenPositions(userAddress),
        vaultContract.getShares(userAddress),
      ])

      await provider.send('evm_setNextBlockTimestamp', [ latestBlock?.timestamp ])

      const [ encoded, gas ] = await Promise.all([
        sdk.vault.burnAndWithdraw.encode(input),
        sdk.vault.burnAndWithdraw.estimateGas(input),
      ])

      const hash = await sdk.vault.burnAndWithdraw(input)

      const [ receipt, sentTx, positionAfter, sharesAfter ] = await Promise.all([
        provider.waitForTransaction(hash),
        provider.getTransaction(hash),
        vaultContract.osTokenPositions(userAddress),
        vaultContract.getShares(userAddress),
      ])

      const calls = decodeCalls(vaultContract, encoded.data)
      const callNames = calls.map(({ name }) => name)

      expect(callNames).toEqual([ 'burnOsToken', 'enterExitQueue' ])

      const [ burnCall, exitCall ] = calls
      const [ burnShares ] = burnCall.args
      const [ exitShares, receiver ] = exitCall.args

      expect(receiver).toBe(userAddress)
      expect(gas).toBeGreaterThan(0n)
      expect(sentTx?.data).toBe(encoded.data)
      expect(receipt?.status).toBe(1)
      expect(positionBefore - positionAfter).toBe(burnShares)
      expect(sharesBefore - sharesAfter).toBe(exitShares)
    })
  })
})
