import { describe, expect } from 'vitest'

import { it } from '../../../test'

import getRetryAfterMs from './getRetryAfterMs'


const cases = [
  { name: 'seconds', headers: { 'retry-after': '5' }, expected: 5_000 },
  { name: 'negative', headers: { 'retry-after': '-5' }, expected: 0 },
  { name: 'date', headers: { 'retry-after': 'Wed, 21 Oct 2015 07:28:00 GMT' }, expected: 0 },
  { name: 'no header', headers: {}, expected: 0 },
]

describe('getRetryAfterMs', () => {

  it.for(cases)('$name', ({ headers, expected }) => {
    const result = getRetryAfterMs(headers as Record<string, string>)

    expect(result).toBe(expected)
  })
})
