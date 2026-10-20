import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { useForkSdk, mintMaxToFork, mockForkStake, sendForkTransaction } from '../../../../../test/fork'


const unstakeCases = [
  { name: 'half stake', assets: parseEther('0.5') },
  { name: 'most of stake', assets: parseEther('0.9') },
]

describe('getBurnAmountForUnstake', () => {
  const fork = useForkSdk({ setup: mintMaxToFork })
  const { sdk, provider, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const baseInput = { userAddress, vaultAddress }

  it.for(unstakeCases)('$name', async ({ assets }) => {
    const withdrawInput = { ...baseInput, assets }

    await mockForkStake(fork)

    const burnShares = await sdk.osToken.getBurnAmountForUnstake(withdrawInput)
    const unstakeRequest = sdk.vault.withdraw.estimateGas(withdrawInput)

    await expect(unstakeRequest, 'the unstake must need a burn').rejects.toMatchObject({ name: 'LowLtv' })

    await sendForkTransaction({
      provider,
      contract: vaultContract,
      method: sdk.osToken.burn,
      input: { ...baseInput, shares: burnShares },
      calls: [ { name: 'burnOsToken', args: [ burnShares ] } ],
    })

    const [ sharesBefore, exitShares ] = await Promise.all([
      vaultContract.getShares(userAddress),
      vaultContract.convertToShares(assets),
    ])

    await sendForkTransaction({
      provider,
      input: withdrawInput,
      contract: vaultContract,
      method: sdk.vault.withdraw,
      calls: [ { name: 'enterExitQueue', args: [ exitShares, userAddress ] } ],
    })

    const sharesAfter = await vaultContract.getShares(userAddress)

    expect(sharesBefore - sharesAfter).toBe(exitShares)
  })
})
