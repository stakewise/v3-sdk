import { expect } from 'vitest'

import { sendGasLimit } from '../../constants'

import type { FixtureMethod } from '../types'

import { checkSentTransaction, checkRecordedTransaction } from './helpers'
import type { CheckSendInput } from './helpers'


type Wrapper = FixtureMethod<CheckMulticallSend, 'runner'>

export type CheckMulticallSend = <Input>(values: CheckSendInput<Input>) => Promise<void>

export const createCheckMulticallSend: Wrapper = ({ runner }) => async (values) => {
  const { sent, encoded } = await checkSentTransaction({ ...values, runner })

  expect(sent.gasLimit).toBe(sendGasLimit)
  expect(runner.estimated).toHaveLength(1)

  const [ estimated ] = runner.estimated

  checkRecordedTransaction(estimated, encoded)
}
