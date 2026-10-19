import { describe, expect } from 'vitest'

import { it } from '../../../../test'

import modifyLeverageStrategyData from './modifyLeverageStrategyData'


const cases = [
  {
    name: 'no position',
    positions: [],
    expected: { version: 2, isUpgradeRequired: false },
  },
  {
    name: 'v1 not exiting',
    positions: [ { version: '1', exitingPercent: '0' } ],
    expected: { version: 1, isUpgradeRequired: true },
  },
  {
    name: 'v1 exiting',
    positions: [ { version: '1', exitingPercent: '500000000000000000' } ],
    expected: { version: 1, isUpgradeRequired: false },
  },
  {
    name: 'v2',
    positions: [ { version: '2', exitingPercent: '0' } ],
    expected: { version: 2, isUpgradeRequired: false },
  },
  {
    name: 'zero version',
    positions: [ { version: '0', exitingPercent: '0' } ],
    expected: { version: 1, isUpgradeRequired: true },
  },
]

describe('modifyLeverageStrategyData', () => {
  it.for(cases)('$name', ({ positions, expected }) => {
    const data = modifyLeverageStrategyData({ leverageStrategyPositions: positions })

    expect(data).toEqual(expected)
  })
})
