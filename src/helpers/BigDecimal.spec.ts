import { describe, expect } from 'vitest'

import { it } from '../../test'

import BigDecimal from './BigDecimal'


const cases = [
  {
    name: 'round down',
    decimal: new BigDecimal('1.239').decimals(2),
    expected: '1.23',
  },
  {
    name: 'subtract',
    decimal: new BigDecimal(100).minus(25.5).decimals(1),
    expected: '74.5',
  },
  {
    name: 'multiply',
    decimal: new BigDecimal('1.25').multiply(2).decimals(2),
    expected: '2.50',
  },
  {
    name: 'divide',
    decimal: new BigDecimal(100).divide(8).decimals(1),
    expected: '12.5',
  },
  {
    name: 'from bigint',
    decimal: new BigDecimal(1234n).decimals(0),
    expected: '1234',
  },
]

describe('BigDecimal', () => {

  it.for(cases)('$name', ({ decimal, expected }) => {
    const value = decimal.toString()

    expect(value).toBe(expected)
  })

  it('from BigDecimal', () => {
    const source = new BigDecimal('1.5')
    const decimal = new BigDecimal(source)

    source.plus(1)

    const copyValue = decimal.toString()
    const sourceValue = source.toString()

    expect(copyValue).toBe('1.500000000000000000')
    expect(sourceValue).toBe('2.500000000000000000')
  })

  it('toNumber', () => {
    const value = new BigDecimal('1.25').toNumber()

    expect(value).toBe(1.25)
  })

  it('unknown value', () => {
    const decimal = new BigDecimal(1)

    const convertNull = () => decimal.toBigDecimal(null as unknown as string)
    const createNaN = () => new BigDecimal(NaN)

    expect(convertNull).toThrow(new Error('toBigDecimal did not recognize the value: null object'))
    expect(createNaN).toThrow(new Error('toBigDecimal did not recognize the value: NaN number'))
  })
})
