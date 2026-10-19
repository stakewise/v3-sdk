import { expect } from 'vitest'
import type { TransactionDescription } from 'ethers'

import decodeCalls from '../../decodeCalls'

import type { FixtureMethod } from '../types'

import { checkNames } from './helpers'
import type { CheckInput } from './helpers'


type Wrapper = FixtureMethod<CheckTransactionData, 'runner'>

export type CheckTransactionData = (input: CheckInput) => Promise<TransactionDescription[]>

export const createCheckTransactionData: Wrapper = ({ runner }) => async (input) => {
  const { run, contract, params, names } = input

  const [ tx, address ] = await Promise.all([
    run({ params, transactionData: true }),
    contract.getAddress(),
  ])

  const calls = decodeCalls(contract, tx.data)

  expect(tx.to).toBe(address)
  expect(runner.sent).toHaveLength(0)
  expect(runner.estimated).toHaveLength(0)
  checkNames(contract, tx.data, names)

  return calls
}
