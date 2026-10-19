import { describe, expect } from 'vitest'

import { it, subgraphUrl, mixedCaseBaseInput, lowercaseBaseVariables } from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { GetQueuePositionInput } from './index'
import type { BoostQueuePositionsQueryPayload } from '../../../../graphql/subgraph/boost'


type Input = StakeWise.ExtractInput<GetQueuePositionInput>

const exitRequest = {
  timestamp: '1791962148',
  totalAssets: '710537462625468563',
  isClaimable: true,
  exitedAssets: '710537462625468563',
  positionTicket: '11079916803777388426829',
  exitQueueIndex: '134',
  withdrawalTimestamp: null as unknown as string,
}

const exitingPosition = {
  version: '2',
  exitingOsTokenShares: '52820714286035182',
  exitingPercent: '1000000000000000000',
  exitingAssets: '54051260140172530',
}

const claimPosition = {
  timestamp: '1791962148',
  positionTicket: '11079916803777388426829',
  exitQueueIndex: '134',
}

const resultCases = [
  {
    name: 'no position',
    positions: [],
    expected: {
      version: 1,
      duration: null,
      position: null,
      exitingShares: 0n,
      exitingAssets: 0n,
      isClaimable: false,
    },
  },
  {
    name: 'legacy version',
    positions: [ { ...exitingPosition, version: '0', exitRequest: null } ],
    expected: {
      version: 1,
      duration: null,
      position: null,
      exitingShares: 52820714286035182n,
      exitingAssets: 54051260140172530n,
      isClaimable: false,
    },
  },
  {
    name: 'waiting',
    positions: [
      {
        ...exitingPosition,
        exitRequest: { ...exitRequest, isClaimable: false, withdrawalTimestamp: '1792500000' },
      },
    ],
    expected: {
      version: 2,
      duration: 1792500000,
      position: claimPosition,
      exitingShares: 52820714286035182n,
      exitingAssets: 54051260140172530n,
      isClaimable: false,
    },
  },
  {
    name: 'claimable',
    positions: [ { ...exitingPosition, exitingAssets: '0', exitRequest } ],
    expected: {
      version: 2,
      duration: null,
      position: claimPosition,
      exitingShares: 52820714286035182n,
      exitingAssets: 0n,
      isClaimable: true,
    },
  },
  {
    name: 'partial exit',
    positions: [ { ...exitingPosition, exitRequest: { ...exitRequest, exitedAssets: '300000000000000000' } } ],
    expected: {
      version: 2,
      duration: null,
      position: claimPosition,
      exitingShares: 52820714286035182n,
      exitingAssets: 54051260140172530n,
      isClaimable: false,
    },
  },
  {
    name: 'no queue index',
    positions: [
      {
        ...exitingPosition,
        exitRequest: { ...exitRequest, exitQueueIndex: null, withdrawalTimestamp: '1792500000' },
      },
    ],
    expected: {
      version: 2,
      duration: 1792500000,
      position: null,
      exitingShares: 52820714286035182n,
      exitingAssets: 54051260140172530n,
      isClaimable: false,
    },
  },
]

describe('getQueuePosition', () => {
  it.for(resultCases)('$name', async ({ positions, expected }, { sdk, graphql }) => {
    graphql.mock<BoostQueuePositionsQueryPayload>({
      name: 'BoostQueuePositions',
      data: { leverageStrategyPositions: positions },
    })

    const result = await sdk.boost.getQueuePosition(mixedCaseBaseInput)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({
        url: subgraphUrl,
        operationName: 'BoostQueuePositions',
        variables: lowercaseBaseVariables,
      }),
    ])
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = baseInputWiringCase

    const getPosition = () => sdk.boost.getQueuePosition(input as Input)

    expect(getPosition).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
