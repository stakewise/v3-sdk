import { expect } from 'vitest'

import { sendGasLimit } from '../../constants'

import type { FixtureMethod } from '../types'

import { checkSentTransaction, checkRecordedTransaction } from './helpers'
import type { CheckSendInput } from './helpers'


type Wrapper = FixtureMethod<CheckSend, 'runner'>

type CheckSendValues<Input> = CheckSendInput<Input> & {
  gasLimit?: bigint
}

export type CheckSend = <Input>(values: CheckSendValues<Input>) => Promise<void>

export const createCheckSend: Wrapper = ({ runner }) => async (values) => {
  const { gasLimit = sendGasLimit } = values
  const { sent, encoded } = await checkSentTransaction({ ...values, runner })

  expect(sent.gasLimit).toBe(gasLimit)
  expect(runner.estimated).toHaveLength(1)

  const [ estimated ] = runner.estimated

  checkRecordedTransaction(estimated, encoded)
}
