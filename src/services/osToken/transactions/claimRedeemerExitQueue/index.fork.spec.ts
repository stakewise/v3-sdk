import { describe, expect } from 'vitest'
import { parseEther, toQuantity } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  parseEvents,
  extendContract,
  mintForRedeemer,
  sendForkTransaction,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const swapperAddress = '0x3333333333333333333333333333333333333333'

const redeemShares = parseEther('0.1')
const swapperGas = parseEther('1')
const swapGasLimit = 300_000n

describe('claimRedeemerExitQueue', () => {
  let positionTicket = 0n

  const processRedeemerQueue = async (setupFork: Fork) => {
    const { sdk, provider } = setupFork
    const swapperSigner = await provider.getSigner(swapperAddress)
    const redeemerContract = extendContract(sdk.contracts.base.osTokenRedeemer, forkAbis.osTokenRedeemer)

    const swapperRedeemerContract = extendContract(
      sdk.contracts.base.osTokenRedeemer.connect(swapperSigner),
      forkAbis.osTokenRedeemer
    )

    await mintForRedeemer(setupFork, redeemShares)

    const withdrawHash = await sdk.osToken.redeemerWithdraw({ userAddress, shares: redeemShares })
    const withdrawReceipt = await provider.waitForTransaction(withdrawHash)
    const redeemerEvents = await parseEvents(redeemerContract, withdrawReceipt)
    const exitQueueEntered = redeemerEvents.find((event) => event?.name === 'ExitQueueEntered')

    if (!exitQueueEntered) {
      throw new Error('the setup redeemer withdraw must enter the exit queue')
    }

    positionTicket = exitQueueEntered.args.positionTicket

    const queuedShares = await redeemerContract.queuedShares()
    const swapAssets = await sdk.contracts.base.mintTokenController.convertToAssets(queuedShares)

    await provider.send('anvil_setBalance', [ swapperAddress, toQuantity(swapAssets + swapperGas) ])

    const swapOverrides = { value: swapAssets, gasLimit: swapGasLimit }
    const swapTx = await swapperRedeemerContract.swapAssetsToOsTokenShares(swapperAddress, swapOverrides)
    const swapReceipt = await swapTx.wait()

    expect(swapReceipt?.status, 'the setup swap must succeed').toBe(1)

    const processTx = await swapperRedeemerContract.processExitQueue()
    const processReceipt = await processTx.wait()

    expect(processReceipt?.status, 'the setup exit queue processing must succeed').toBe(1)
  }

  const { sdk, provider } = useForkSdk({ setup: processRedeemerQueue })
  const redeemerContract = extendContract(sdk.contracts.base.osTokenRedeemer, forkAbis.osTokenRedeemer)

  it('claim', async () => {
    const exitQueueIndex = await redeemerContract.getExitQueueIndex(positionTicket)

    expect(exitQueueIndex, 'the setup must process the exit queue').toBeGreaterThanOrEqual(0n)

    const position = { positionTicket: String(positionTicket), exitQueueIndex: String(exitQueueIndex) }
    const input = { userAddress, positions: [ position ] }

    const [ balanceBefore, exited ] = await Promise.all([
      provider.getBalance(userAddress),
      redeemerContract.calculateExitedAssets(userAddress, positionTicket, exitQueueIndex),
    ])

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: redeemerContract,
      method: sdk.osToken.claimRedeemerExitQueue,
      calls: [ { name: 'claimExitedAssets', args: [ positionTicket, exitQueueIndex ] } ],
    })

    const balanceAfter = await provider.getBalance(userAddress)
    const claimedAssets = balanceAfter - balanceBefore + (receipt?.fee || 0n)

    expect(exited.exitedAssets).toBeGreaterThan(0n)
    expect(claimedAssets).toBe(exited.exitedAssets)
  })
})
