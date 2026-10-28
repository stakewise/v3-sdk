import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it } from '../../../../../test'
import { Network } from '../../../../helpers/enums'
import {
  forkAbis,
  useForkSdk,
  fundAccount,
  parseEvents,
  getSnapshot,
  extendContract,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const stakerAddress = getAddress(getSnapshot(Network.Mainnet).stakerAddress)

const exitAssets = parseEther('1')
const claimDelaySeconds = 86_400

describe('claimExitQueue', () => {
  let timestamp = ''
  let positionTicket = ''

  const enterExitQueue = async (setupFork: Fork) => {
    const { sdk, provider, snapshot } = setupFork
    const vaultAddress = getAddress(snapshot.vaultAddress)
    const stakeInput = { userAddress: stakerAddress, vaultAddress }
    const vaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)

    await fundAccount(provider, stakerAddress)

    mockForkHarvestParams(snapshot, false)

    const withdrawHash = await sdk.vault.withdraw({ ...stakeInput, assets: exitAssets })
    const withdrawReceipt = await provider.waitForTransaction(withdrawHash)

    expect(withdrawReceipt?.status, 'the setup withdraw must succeed').toBe(1)

    const [ exitEvents, withdrawBlock ] = await Promise.all([
      parseEvents(vaultContract, withdrawReceipt),
      withdrawReceipt?.getBlock(),
    ])

    const exitQueueEntered = exitEvents.find((event) => event?.name === 'ExitQueueEntered')

    if (!exitQueueEntered || !withdrawBlock) {
      throw new Error('the setup withdraw must enter the exit queue in a mined block')
    }

    positionTicket = String(exitQueueEntered.args.positionTicket)
    timestamp = String(withdrawBlock.timestamp)

    mockForkHarvestParams(snapshot, true)

    const updateStateHash = await sdk.vault.updateState(stakeInput)
    const updateStateReceipt = await provider.waitForTransaction(updateStateHash)

    expect(updateStateReceipt?.status, 'the setup harvest must succeed').toBe(1)

    await provider.send('evm_increaseTime', [ claimDelaySeconds ])
    await provider.send('evm_mine', [])
  }

  const { sdk, provider, snapshot } = useForkSdk({ setup: enterExitQueue })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  it('claim', async () => {
    mockForkHarvestParams(snapshot, false)

    const exitQueueIndex = await vaultContract.getExitQueueIndex(positionTicket)

    expect(exitQueueIndex, 'the setup harvest must process the exit queue').toBeGreaterThanOrEqual(0n)

    const position = { positionTicket, timestamp, exitQueueIndex: String(exitQueueIndex) }
    const input = { userAddress: stakerAddress, vaultAddress, positions: [ position ] }

    const [ balanceBefore, exited ] = await Promise.all([
      provider.getBalance(stakerAddress),
      vaultContract.calculateExitedAssets(stakerAddress, positionTicket, timestamp, exitQueueIndex),
    ])

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.claimExitQueue,
      calls: [
        {
          name: 'claimExitedAssets',
          args: [ BigInt(positionTicket), BigInt(timestamp), exitQueueIndex ],
        },
      ],
    })

    const balanceAfter = await provider.getBalance(stakerAddress)
    const claimedAssets = balanceAfter - balanceBefore + (receipt?.fee || 0n)

    expect(exited.leftTickets).toBe(0n)
    expect(exited.exitedAssets).toBeGreaterThan(0n)
    expect(claimedAssets).toBe(exited.exitedAssets)
  })
})
