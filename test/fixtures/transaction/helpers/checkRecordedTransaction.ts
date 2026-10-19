import { expect } from 'vitest'

import { userAddress } from '../../../constants'

import type { EncodedTransaction, RecordedTransaction } from './types'


const checkRecordedTransaction = (recorded: RecordedTransaction, encoded: EncodedTransaction) => {
  expect(recorded.to).toBe(encoded.to)
  expect(recorded.data).toBe(encoded.data)
  expect(recorded.value).toBe(encoded.value)
  expect(recorded.from).toBe(userAddress)
}


export default checkRecordedTransaction
