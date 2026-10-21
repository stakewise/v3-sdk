import { describe, expect } from 'vitest'
import { AbiCoder, getAddress, keccak256, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  lockToFork,
  parseEvents,
  extendContract,
  mainnetAccounts,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const { lockerAddress } = mainnetAccounts

const keeperRewardsSlot = 6
const claimDelaySeconds = 57_600
const lockAmount = parseEther('0.1')

const getRewardsSlot = (vaultAddress: string) => keccak256(
  AbiCoder.defaultAbiCoder().encode([ 'address', 'uint256' ], [ vaultAddress, keeperRewardsSlot ])
)

describe('claimQueue', () => {
  let timestamp = ''
  let positionTicket = ''

  const unlockAndHarvest = async (setupFork: Fork) => {
    const { sdk, provider, snapshot } = setupFork
    const vaultAddress = getAddress(snapshot.vaultAddress)
    const rewardsSlot = getRewardsSlot(vaultAddress)
    const vaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)

    const keeperAddress = await sdk.contracts.base.keeper.getAddress()
    const rewards = await provider.getStorage(keeperAddress, rewardsSlot)

    await lockToFork(setupFork, { amount: lockAmount, userAddress: lockerAddress })

    mockForkHarvestParams(snapshot, false)

    const unlockHash = await sdk.boost.unlock({ percent: 100, vaultAddress, userAddress: lockerAddress })
    const unlockReceipt = await provider.waitForTransaction(unlockHash)

    const [ vaultEvents, unlockBlock ] = await Promise.all([
      parseEvents(vaultContract, unlockReceipt),
      unlockReceipt?.getBlock(),
    ])

    const exitQueueEntered = vaultEvents.find((event) => event?.name === 'ExitQueueEntered')

    if (!exitQueueEntered || !unlockBlock) {
      throw new Error('the setup unlock must enter the exit queue in a mined block')
    }

    positionTicket = String(exitQueueEntered.args.positionTicket)
    timestamp = String(unlockBlock.timestamp)

    await provider.send('anvil_setStorageAt', [ keeperAddress, rewardsSlot, rewards ])

    const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvest, 'the restored keeper rewards must allow a new harvest').toBe(true)

    mockForkHarvestParams(snapshot, true)

    const updateStateHash = await sdk.vault.updateState({ userAddress, vaultAddress })
    const updateStateReceipt = await provider.waitForTransaction(updateStateHash)

    expect(updateStateReceipt?.status, 'the setup harvest must succeed').toBe(1)

    await provider.send('evm_increaseTime', [ claimDelaySeconds ])
    await provider.send('evm_mine', [])
  }

  const { sdk, provider, snapshot } = useForkSdk({ setup: unlockAndHarvest })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const leverageStrategyContract = extendContract(sdk.contracts.special.leverageStrategyV2, forkAbis.leverageStrategy)

  it('claim', async () => {
    mockForkHarvestParams(snapshot, false)

    const exitQueueIndex = await vaultContract.getExitQueueIndex(positionTicket)

    expect(exitQueueIndex, 'the setup harvest must process the exit queue').toBeGreaterThanOrEqual(0n)

    const position = { positionTicket, timestamp, exitQueueIndex: String(exitQueueIndex) }

    const input = {
      position,
      vaultAddress,
      userAddress: lockerAddress,
      leverageStrategyVersion: 2,
    }

    const balanceBefore = await sdk.contracts.tokens.mintToken.balanceOf(lockerAddress)

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: leverageStrategyContract,
      method: sdk.boost.claimQueue,
      calls: [
        {
          name: 'claimExitedAssets',
          args: [ vaultAddress, lockerAddress, [ BigInt(positionTicket), BigInt(timestamp), exitQueueIndex ] ],
        },
      ],
    })

    const [ balanceAfter, strategyEvents ] = await Promise.all([
      sdk.contracts.tokens.mintToken.balanceOf(lockerAddress),
      parseEvents(leverageStrategyContract, receipt),
    ])

    const claimed = strategyEvents.find((event) => event?.name === 'ExitedAssetsClaimed')

    expect(claimed?.args.osTokenShares).toBeGreaterThan(0n)
    expect(balanceAfter - balanceBefore).toBe(claimed?.args.osTokenShares)
  })
})
