import { expect } from 'vitest'

import { createCheckEncode } from '../fixtures/transaction/checkEncode'

import type { JsonRpcProvider } from 'ethers'
import type { CheckGasInput, CheckSendInput, CheckEncodeInput } from '../fixtures/transaction/helpers'


type Input<T> = CheckGasInput<T> & CheckSendInput<T> & CheckEncodeInput<T> & {
  provider: JsonRpcProvider
}

const checkEncode = createCheckEncode()

const sendForkTransaction = async <T>(values: Input<T>) => {
  const { provider, method, input } = values

  const [ encoded, gas ] = await Promise.all([
    checkEncode(values),
    method.estimateGas(input),
  ])

  const hash = await method(input)

  const [ receipt, sentTx ] = await Promise.all([
    provider.waitForTransaction(hash),
    provider.getTransaction(hash),
  ])

  expect(gas).toBeGreaterThan(0n)
  expect(sentTx?.data).toBe(encoded.data)
  expect(receipt?.status).toBe(1)

  return { receipt, sentTx }
}


export default sendForkTransaction
