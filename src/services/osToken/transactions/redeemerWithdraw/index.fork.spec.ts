import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { forkAbis, useForkSdk, extendContract, mintForRedeemer, sendForkTransaction } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const redeemShares = parseEther('0.1')

const mintRedeemShares = (setupFork: Fork) => mintForRedeemer(setupFork, redeemShares)

describe('redeemerWithdraw', () => {
  const { sdk, provider } = useForkSdk({ setup: mintRedeemShares })
  const redeemerContract = extendContract(sdk.contracts.base.osTokenRedeemer, forkAbis.osTokenRedeemer)
  const input = { userAddress, shares: redeemShares }

  it('enter exit queue', async () => {
    const queuedBefore = await redeemerContract.queuedShares()

    await sendForkTransaction({
      input,
      provider,
      contract: redeemerContract,
      method: sdk.osToken.redeemerWithdraw,
      calls: [ { name: 'enterExitQueue', args: [ redeemShares, userAddress ] } ],
    })

    const queuedAfter = await redeemerContract.queuedShares()
    const queuedShares = queuedAfter - queuedBefore

    expect(queuedShares).toBe(redeemShares)
  })
})
