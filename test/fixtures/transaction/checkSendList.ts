import { expect } from 'vitest'

import { estimatedGas, sendGasLimit } from '../../constants'

import type { FixtureMethod } from '../types'

import { getListTransactions, checkRecordedTransaction } from './helpers'
import type { EncodedList, CheckListInput } from './helpers'


type Wrapper = FixtureMethod<CheckSendList, 'runner'>

export type CheckSendList = <Input, Encoded extends EncodedList>(
  values: CheckListInput<Input, Encoded>
) => Promise<void>

export const createCheckSendList: Wrapper = ({ runner }) => async ({ method, input, order }) => {
  const [ encoded, hash ] = await Promise.all([ method.encode(input), method(input) ])
  const expected = getListTransactions(encoded, order)
  const lastHash = `0x${String(expected.length).padStart(64, '0')}`

  expect(hash).toBe(lastHash)
  expect(runner.sent).toHaveLength(expected.length)

  const sent = [ ...runner.sent ]
  const last = sent.pop()!
  const lastExpected = expected.pop()!

  sent.forEach((transaction, index) => {
    checkRecordedTransaction(transaction, expected[index])
    expect(transaction.gasLimit).toBe(estimatedGas)
  })

  checkRecordedTransaction(last, lastExpected)
  expect(last.gasLimit).toBe(sendGasLimit)
  expect(runner.estimated).toHaveLength(1)

  const [ estimated ] = runner.estimated

  checkRecordedTransaction(estimated, lastExpected)
}
