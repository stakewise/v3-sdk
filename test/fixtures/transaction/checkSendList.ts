import { expect } from 'vitest'

import { sendGasLimit } from '../../constants'

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

  expect(runner.estimated).toHaveLength(expected.length)

  runner.sent.forEach((transaction, index) => {
    checkRecordedTransaction(transaction, expected[index])
    checkRecordedTransaction(runner.estimated[index], expected[index])
    expect(transaction.gasLimit).toBe(sendGasLimit)
  })
}
