import { describe, expect, vi } from 'vitest'

import { it as baseIt, vaultAddress, providerRequiredMessage } from '../../test'

import transactionWrapper from './transactionWrapper'


type Handler<Result> = (input: unknown) => Result

type Wrapped = Handler<unknown> & { estimateGas: Handler<Promise<bigint>> }

const encoded = { to: vaultAddress, data: '0x12' }

const providerCases = [
  {
    name: 'send without provider',
    spy: 'method',
    call: (wrapped: Wrapped) => wrapped({ amount: 1n }),
  },
  {
    name: 'estimateGas without provider',
    spy: 'estimateGas',
    call: (wrapped: Wrapped) => wrapped.estimateGas({ amount: 1n }),
  },
] as const

const it = baseIt.extend('wrapperMocks', ({ sdk }) => {
  const encode = vi.fn<Handler<typeof encoded>>(() => encoded)
  const estimateGas = vi.fn<Handler<Promise<bigint>>>(async () => 1n)
  const method = Object.assign(vi.fn<Handler<string>>(() => 'hash'), { encode, estimateGas })

  const params = sdk.vault.params
  const readOnlyParams = { ...params, options: { ...params.options, provider: undefined } }

  return {
    method,
    encode,
    params,
    estimateGas,
    readOnlyParams,
  }
})

describe('transactionWrapper', () => {
  it('with provider', ({ wrapperMocks }) => {
    const { method, params } = wrapperMocks

    const wrapped = transactionWrapper(params, method)

    expect(wrapped).toBe(method)
  })

  it.for(providerCases)('$name', async ({ call, spy }, { wrapperMocks }) => {
    const { method, readOnlyParams } = wrapperMocks

    const wrapped = transactionWrapper(readOnlyParams, method)
    const request = call(wrapped)

    await expect(request).rejects.toThrow(providerRequiredMessage)
    expect(wrapperMocks[spy]).not.toHaveBeenCalled()
  })

  it('encode without provider', ({ wrapperMocks }) => {
    const { method, encode, readOnlyParams } = wrapperMocks

    const wrapped = transactionWrapper(readOnlyParams, method)
    const tx = wrapped.encode({ amount: 1n })

    expect(tx).toEqual(encoded)
    expect(encode).toHaveBeenCalledWith({ amount: 1n })
  })

  it('original untouched', ({ wrapperMocks }) => {
    const { method, estimateGas, readOnlyParams } = wrapperMocks

    transactionWrapper(readOnlyParams, method)

    expect(method.estimateGas).toBe(estimateGas)
  })
})
