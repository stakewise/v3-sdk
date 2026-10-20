import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, decodeCalls } from '../../../../../test'
import mockGraphql from '../../../../../test/mockGraphql'
import vaultQuery from '../../../../../test/mocks/vaultQuery'
import {
  forkAbis,
  useForkSdk,
  fundAccount,
  parseEvents,
  extendContract,
  getForkHarvestArgs,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { TransactionResponse } from 'ethers'
import type { Fork } from '../../../../../test/fork'
import type { VaultQueryPayload } from '../../../../graphql/subgraph/vault'


const stakerAddress = '0x5Bf2956120FafeC9B1444A0fbcd6799B24a3D350'

const exitShares = parseEther('1')

const fundStaker = ({ provider }: Fork) => fundAccount(provider, stakerAddress)

describe('multicall', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: fundStaker })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)
  const harvestArgs = getForkHarvestArgs(snapshot)
  const { keeper } = sdk.contracts.base

  const multicallInput = {
    vaultAddress,
    userAddress: stakerAddress,
    params: [ { method: 'enterExitQueue', args: [ exitShares, stakerAddress ] } ],
  }

  it('with updateState', async () => {
    const { params, ...baseInput } = multicallInput

    const canHarvestBefore = await keeper.canHarvest(vaultAddress)

    expect(canHarvestBefore, 'fixture does not match the fork block').toBe(true)

    mockForkHarvestParams(snapshot, true)

    mockGraphql<VaultQueryPayload>({
      name: 'Vault',
      data: {
        vault: {
          ...vaultQuery.vault,
          version: '5',
          address: vaultAddress.toLowerCase(),
        },
      },
    })

    const sharesBefore = await vaultContract.getShares(stakerAddress)

    const [ encoded, gas ] = await Promise.all([
      sdk.vault.multicall<StakeWise.TransactionData>({ ...baseInput, request: { params, transactionData: true } }),
      sdk.vault.multicall<bigint>({ ...baseInput, request: { params, estimateGas: true } }),
    ])

    const response = await sdk.vault.multicall<TransactionResponse>({ ...baseInput, request: { params } })

    const [ receipt, sentTx, canHarvestAfter, sharesAfter ] = await Promise.all([
      provider.waitForTransaction(response.hash),
      provider.getTransaction(response.hash),
      keeper.canHarvest(vaultAddress),
      vaultContract.getShares(stakerAddress),
    ])

    const vaultEvents = await parseEvents(vaultContract, receipt)
    const exitQueueEntered = vaultEvents.find((event) => event?.name === 'ExitQueueEntered')
    const calls = decodeCalls(vaultContract, encoded.data).map(({ name, args }) => ({ name, args: args.toArray() }))

    expect(encoded.to).toBe(vaultAddress)
    expect(calls).toEqual([
      { name: 'updateState', args: [ harvestArgs ] },
      { name: 'enterExitQueue', args: [ exitShares, stakerAddress ] },
    ])
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(canHarvestAfter).toBe(false)
    expect(sharesBefore - sharesAfter).toBe(exitShares)
    expect(exitQueueEntered?.args.shares).toBe(exitShares)
  })
})
