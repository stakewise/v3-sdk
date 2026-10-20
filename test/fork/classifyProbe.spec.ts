import { makeError } from 'ethers'
import { describe, expect } from 'vitest'

import wrapErrorHandler from '../../src/helpers/wrapErrorHandler'

import { it, accessDenied } from '..'
import classifyProbe from './classifyProbe'


const createRevertError = (data: string | null) => makeError('execution reverted', 'CALL_EXCEPTION', {
  data,
  reason: null,
  revert: null,
  invocation: null,
  action: 'estimateGas',
  transaction: { to: null, data: '0x' },
})

const contractError = await wrapErrorHandler(Promise.reject(createRevertError(accessDenied)), 'gas')
  .catch((error: unknown) => error)

const cases = [
  {
    name: 'value',
    result: { value: 21_000n },
    expected: 'success',
  },
  {
    name: 'contract error',
    result: { error: contractError },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'plain revert data',
    result: { error: createRevertError(accessDenied) },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'no revert data',
    result: { error: createRevertError(null) },
    expected: 'empty revert',
  },
  {
    name: 'unknown selector',
    result: { error: createRevertError('0x12345678') },
    expected: 'empty revert',
  },
]

describe('classifyProbe', () => {
  it.for(cases)('$name', ({ result, expected }) => {
    const classified = classifyProbe(result)

    expect(classified).toEqual(expected)
  })
})
