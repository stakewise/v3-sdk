import { expect } from 'vitest'
import { getAddress } from 'ethers'

import mockGraphql from '../mockGraphql'

import type { LeverageStrategyDataQueryPayload } from '../../src/graphql/subgraph/boost'

import fundAccount from './fundAccount'
import approveStrategyProxy from './approveStrategyProxy'
import mockForkHarvestParams from './mockForkHarvestParams'
import type { Fork } from './useForkSdk'


type Input = {
  amount: bigint
  userAddress: string
}

const lockToFork = async (fork: Fork, input: Input) => {
  const { sdk, provider, snapshot } = fork
  const { amount, userAddress } = input
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const canHarvest = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

  expect(canHarvest, 'fixture does not match the fork block').toBe(true)

  await fundAccount(provider, userAddress)
  await approveStrategyProxy(fork, input)

  mockForkHarvestParams(snapshot, true)

  mockGraphql<LeverageStrategyDataQueryPayload>({
    name: 'LeverageStrategyData',
    data: { leverageStrategyPositions: [] },
  })

  const hash = await sdk.boost.lock({
    amount,
    userAddress,
    vaultAddress,
    approveParams: { amount },
  })
  const receipt = await provider.waitForTransaction(hash)

  expect(receipt?.status, 'the setup lock must succeed').toBe(1)
}


export default lockToFork
