import { expect } from 'vitest'

import { estimatedGas } from '../../constants'

import type { FixtureMethod } from '../types'

import { checkSentTransaction } from './helpers'
import type { CheckSendInput } from './helpers'


type Wrapper = FixtureMethod<CheckSend, 'runner'>

type CheckSendValues<Input> = CheckSendInput<Input> & {
  gasLimit?: bigint
}

export type CheckSend = <Input>(values: CheckSendValues<Input>) => Promise<void>

export const createCheckSend: Wrapper = ({ runner }) => async (values) => {
  const { gasLimit = estimatedGas } = values
  const { sent } = await checkSentTransaction({ ...values, runner })

  expect(sent.gasLimit).toBe(gasLimit)
}
