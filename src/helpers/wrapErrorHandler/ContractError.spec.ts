import { describe, expect } from 'vitest'

import { it, userAddress, vaultAddress, encodeContractError } from '../../../test'

import ContractError from './ContractError'


type OriginalError = ConstructorParameters<typeof ContractError>[0]

const data = encodeContractError('AccessDenied')

const transaction = {
  to: vaultAddress,
  from: userAddress,
  data: '0x1234',
}

const createError = (values: Record<string, unknown>) => (
  Object.assign(new Error('execution reverted'), values) as unknown as OriginalError
)

const transactionDetails = JSON.stringify({ solidityError: 'AccessDenied', ...transaction }, null, '\t')

const cases = [
  {
    name: 'data',
    values: { data },
    message: '[prefix]:',
  },
  {
    name: 'error.data',
    values: { error: { data } },
    message: '[prefix]:',
  },
  {
    name: 'info.error.data',
    values: { info: { error: { data } } },
    message: '[prefix]:',
  },
  {
    name: 'transaction details',
    values: { data, transaction },
    prefix: 'transaction call failed',
    message: `[transaction call failed]: ${transactionDetails}`,
  },
  {
    name: 'unknown error',
    values: { data: '0xdeadbeef', transaction },
    errorName: 'Error',
    message: 'execution reverted',
  },
  {
    name: 'malformed data',
    values: { data: '0x1', transaction },
    errorName: 'Error',
    message: 'execution reverted',
  },
  {
    name: 'no data',
    values: {},
    errorName: 'Error',
    message: 'execution reverted',
  },
]

describe('ContractError', () => {

  it.for(cases)('$name', ({ values, prefix = 'prefix', errorName = 'AccessDenied', message }) => {
    const error = new ContractError(createError(values), prefix)

    expect(error.name).toBe(errorName)
    expect(error.message).toBe(message)
  })

  it('default prefix', () => {
    const error = new ContractError(createError({ data }))

    expect(error.name).toBe('AccessDenied')
    expect(error.message).toBe('[operation failed]:')
  })

  it('stack and cause', () => {
    const cause = new Error('rpc failed')
    const original = createError({ data, cause })

    const error = new ContractError(original, 'prefix')

    expect(error.stack).toBe(original.stack)
    expect(error.cause).toBe(cause)
  })

  it('ethers error fields', () => {
    const original = createError({
      data,
      code: 'CALL_EXCEPTION',
      reason: 'require(false)',
      shortMessage: 'execution reverted',
    })

    const error = new ContractError(original, 'prefix')

    expect(error.code).toBe('CALL_EXCEPTION')
    expect(error.reason).toBe('require(false)')
    expect(error.shortMessage).toBe('execution reverted')
  })

  it('wallet rejection code', () => {
    const error = new ContractError(createError({ code: 'ACTION_REJECTED' }), 'prefix')

    expect(error.code).toBe('ACTION_REJECTED')
  })

  it('error without name', () => {
    const original = { stack: 'stack' } as unknown as OriginalError

    const error = new ContractError(original, 'prefix')

    expect(error.name).toBe('')
    expect(error.message).toBe('')
    expect(error.stack).toBe('stack')
  })
})
