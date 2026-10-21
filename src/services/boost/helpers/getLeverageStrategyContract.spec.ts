import { describe, expect } from 'vitest'

import { it, userAddress, vaultAddress } from '../../../../test'

import getLeverageStrategyContract from './getLeverageStrategyContract'
import type { LeverageStrategyDataQueryPayload } from '../../../graphql/subgraph/boost'


type Case = {
  name: string
  positions?: Array<{ version: string, exitingPercent: string }>
  leverageStrategyData?: { version: number, isUpgradeRequired: boolean }
  expected: {
    contractName: 'leverageStrategy' | 'leverageStrategyV2'
    isUpgradeRequired: boolean
    calls: unknown[]
  }
}

const leverageRequest = {
  operationName: 'LeverageStrategyData',
  variables: {
    userAddress: userAddress.toLowerCase(),
    vaultAddress: vaultAddress.toLowerCase(),
  },
}

const cases: Case[] = [
  {
    name: 'given v1',
    leverageStrategyData: { version: 1, isUpgradeRequired: false },
    expected: {
      contractName: 'leverageStrategy',
      isUpgradeRequired: false,
      calls: [],
    },
  },
  {
    name: 'given upgrade',
    leverageStrategyData: { version: 1, isUpgradeRequired: true },
    expected: {
      contractName: 'leverageStrategyV2',
      isUpgradeRequired: true,
      calls: [],
    },
  },
  {
    name: 'given v2',
    leverageStrategyData: { version: 2, isUpgradeRequired: false },
    expected: {
      contractName: 'leverageStrategyV2',
      isUpgradeRequired: false,
      calls: [],
    },
  },
  {
    name: 'fetched upgrade',
    positions: [ { version: '1', exitingPercent: '0' } ],
    expected: {
      contractName: 'leverageStrategyV2',
      isUpgradeRequired: true,
      calls: [ leverageRequest ],
    },
  },
]

describe('getLeverageStrategyContract', () => {
  it.for(cases)('$name', async ({ positions = [], leverageStrategyData, expected }, { sdk, graphql }) => {
    graphql.mock<LeverageStrategyDataQueryPayload>({
      name: 'LeverageStrategyData',
      data: { leverageStrategyPositions: positions },
    })

    const result = await getLeverageStrategyContract({
      ...sdk.boost.params,
      userAddress,
      vaultAddress,
      leverageStrategyData,
    })

    expect(result.leverageStrategyContract).toBe(sdk.contracts.special[expected.contractName])
    expect(result.isUpgradeRequired).toBe(expected.isUpgradeRequired)
    expect(graphql.calls).toMatchObject(expected.calls)
  })
})
