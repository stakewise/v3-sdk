import { expect } from 'vitest'

import type { MockRunner } from '../../../mockRunner'

import checkRecordedTransaction from './checkRecordedTransaction'
import type { CheckSendInput } from './types'


type SentInput<T> = CheckSendInput<T> & {
  runner: MockRunner
}

const checkSentTransaction = async <T>({ runner, method, input }: SentInput<T>) => {
  const [ encoded, hash ] = await Promise.all([ method.encode(input), method(input) ])

  expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
  expect(runner.sent).toHaveLength(1)

  const [ sent ] = runner.sent

  checkRecordedTransaction(sent, encoded)

  return { sent, encoded }
}


export default checkSentTransaction
