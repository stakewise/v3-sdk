import { describe, expect } from 'vitest'

import { it } from '../../../../test'

import validateLeverageStrategyData from './validateLeverageStrategyData'


const validCases = [
  { name: 'no data', values: undefined },
  { name: 'valid data', values: { version: 2, isUpgradeRequired: false } },
]

const invalidCases = [
  {
    name: 'invalid version',
    values: { version: '2', isUpgradeRequired: false },
    expected: 'The "leverageStrategyData.version" argument must be a number',
  },
  {
    name: 'invalid upgrade flag',
    values: { version: 2 },
    expected: 'The "leverageStrategyData.isUpgradeRequired" argument must be a boolean',
  },
]

describe('validateLeverageStrategyData', () => {
  it.for(validCases)('$name', ({ values }) => {
    const validate = () => validateLeverageStrategyData(values)

    expect(validate).not.toThrow()
  })

  it.for(invalidCases)('$name', ({ values, expected }) => {
    const validate = () => validateLeverageStrategyData(values)

    expect(validate).toThrow(expected)
  })
})
