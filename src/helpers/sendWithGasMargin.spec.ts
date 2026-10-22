import { describe, expect, vi } from 'vitest'

import { it, estimatedGas, sendGasLimit, encodeContractError } from '../../test'

import sendWithGasMargin from './sendWithGasMargin'
import ContractError from './wrapErrorHandler/ContractError'


const hash = '0x1234'
const receiver = '0x1111111111111111111111111111111111111111'

type MethodInput = {
  inputs?: string[]
  estimateGas?: () => Promise<bigint>
  send?: () => Promise<{ hash: string }>
}

const createMethod = (values: MethodInput = {}) => {
  const {
    inputs = [ 'receiver' ],
    estimateGas = async () => estimatedGas,
    send = async () => ({ hash }),
  } = values

  return Object.assign(vi.fn(send), {
    estimateGas: vi.fn(estimateGas),
    getFragment: vi.fn(() => ({ inputs })),
  }) as any
}

describe('sendWithGasMargin', () => {

  it('default margin', async () => {
    const method = createMethod()

    const result = await sendWithGasMargin(method, [ receiver ])

    expect(result.hash).toBe(hash)
    expect(method.estimateGas).toHaveBeenCalledWith(receiver)
    expect(method).toHaveBeenCalledWith(receiver, { gasLimit: sendGasLimit })
  })

  it('custom margin', async () => {
    const method = createMethod()

    await sendWithGasMargin(method, [ receiver ], 30n)

    expect(method).toHaveBeenCalledWith(receiver, { gasLimit: estimatedGas * 130n / 100n })
  })

  it('keep overrides', async () => {
    const method = createMethod()
    const overrides = { value: 5n }

    await sendWithGasMargin(method, [ receiver, overrides ])

    expect(method.estimateGas).toHaveBeenCalledWith(receiver, overrides)
    expect(method).toHaveBeenCalledWith(receiver, { value: 5n, gasLimit: sendGasLimit })
  })

  it('object input is not overrides', async () => {
    const method = createMethod()
    const harvestArgs = { proof: [], reward: 1n }

    await sendWithGasMargin(method, [ harvestArgs ])

    expect(method).toHaveBeenCalledWith(harvestArgs, { gasLimit: sendGasLimit })
  })

  it('estimate revert', async () => {
    const data = encodeContractError('AccessDenied')
    const method = createMethod({ estimateGas: () => Promise.reject(Object.assign(new Error('reverted'), { data })) })

    const request = sendWithGasMargin(method, [ receiver ])

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message: '[estimate gas failed]:' })
    expect(method).not.toHaveBeenCalled()
  })

  it('wallet rejection', async () => {
    const error = Object.assign(new Error('user rejected action'), { code: 'ACTION_REJECTED' })
    const method = createMethod({ send: () => Promise.reject(error) })

    const request = sendWithGasMargin(method, [ receiver ])

    await expect(request).rejects.toBeInstanceOf(ContractError)
    await expect(request).rejects.toMatchObject({ code: 'ACTION_REJECTED' })
  })
})
