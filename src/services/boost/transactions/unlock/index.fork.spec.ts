import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it } from '../../../../../test'
import mockGraphql from '../../../../../test/mockGraphql'
import {
  forkAbis,
  useForkSdk,
  lockToFork,
  parseEvents,
  extendContract,
  mainnetAccounts,
  pickTransaction,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'
import type { LeverageStrategyDataQueryPayload } from '../../../../graphql/subgraph/boost'


const { lockerAddress } = mainnetAccounts

const lockAmount = parseEther('0.1')
const fullPositionPercent = parseEther('1')

const lockOsToken = (setupFork: Fork) => lockToFork(setupFork, { amount: lockAmount, userAddress: lockerAddress })

describe('unlock', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: lockOsToken })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)
  const leverageStrategyContract = extendContract(sdk.contracts.special.leverageStrategyV2, forkAbis.leverageStrategy)

  it('unlock', async () => {
    mockForkHarvestParams(snapshot, false)

    mockGraphql<LeverageStrategyDataQueryPayload>({
      name: 'LeverageStrategyData',
      data: { leverageStrategyPositions: [ { version: '2', exitingPercent: '0' } ] },
    })

    const input = { percent: 100, vaultAddress, userAddress: lockerAddress }
    const proxyAddress = await leverageStrategyContract.getStrategyProxy(vaultAddress, lockerAddress)

    const [ isExitingBefore, proxySharesBefore ] = await Promise.all([
      leverageStrategyContract.isStrategyProxyExiting(proxyAddress),
      vaultContract.getShares(proxyAddress),
    ])

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: leverageStrategyContract,
      method: pickTransaction(sdk.boost.unlock, 'unlockTxData'),
      calls: [ { name: 'enterExitQueue', args: [ vaultAddress, fullPositionPercent ] } ],
    })

    const [ isExiting, vaultEvents ] = await Promise.all([
      leverageStrategyContract.isStrategyProxyExiting(proxyAddress),
      parseEvents(vaultContract, receipt),
    ])

    const exitQueueEntered = vaultEvents.find((event) => event?.name === 'ExitQueueEntered')

    expect(isExitingBefore).toBe(false)
    expect(isExiting).toBe(true)
    expect(exitQueueEntered?.args.owner).toBe(proxyAddress)
    expect(exitQueueEntered?.args.shares).toBe(proxySharesBefore)
  })
})
