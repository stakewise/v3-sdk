import { describe, expect } from 'vitest'

import { it, subgraphUrl, mixedCaseBaseInput, lowercaseBaseVariables } from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { GetLeverageStrategyDataInput } from './index'
import type { LeverageStrategyDataQueryPayload } from '../../../../graphql/subgraph/boost'


type Input = StakeWise.ExtractInput<GetLeverageStrategyDataInput>

const resultCases = [
  {
    name: 'upgrade required',
    data: { leverageStrategyPositions: [ { version: '1', exitingPercent: '0' } ] },
    expected: { version: 1, isUpgradeRequired: true },
  },
  {
    name: 'no position',
    data: { leverageStrategyPositions: [] },
    expected: { version: 2, isUpgradeRequired: false },
  },
]

describe('getLeverageStrategyData', () => {
  it.for(resultCases)('$name', async ({ data, expected }, { sdk, graphql }) => {
    graphql.mock<LeverageStrategyDataQueryPayload>({ name: 'LeverageStrategyData', data })

    const result = await sdk.boost.getLeverageStrategyData(mixedCaseBaseInput)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({
        url: subgraphUrl,
        operationName: 'LeverageStrategyData',
        variables: lowercaseBaseVariables,
      }),
    ])
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = baseInputWiringCase

    const getData = () => sdk.boost.getLeverageStrategyData(input as Input)

    expect(getData).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
