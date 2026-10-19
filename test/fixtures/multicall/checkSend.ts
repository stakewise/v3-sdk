import { expect } from 'vitest'

import { userAddress, sendGasLimit } from '../../constants'

import type { FixtureMethod } from '../types'

import { checkNames } from './helpers'
import type { CheckInput } from './helpers'


type Wrapper = FixtureMethod<CheckSend, 'runner'>

export type CheckSend = (input: CheckInput) => Promise<void>

export const createCheckSend: Wrapper = ({ runner }) => async (input) => {
  const { run, contract, params, names } = input

  const [ tx, address ] = await Promise.all([ run({ params }), contract.getAddress() ])

  expect(runner.sent).toHaveLength(1)
  expect(runner.estimated).toHaveLength(1)

  const [ sent ] = runner.sent
  const [ estimated ] = runner.estimated

  expect(tx.hash).toMatch(/^0x[0-9a-f]{64}$/)
  expect(sent.to).toBe(address)
  expect(sent.from).toBe(userAddress)
  expect(sent.gasLimit).toBe(sendGasLimit)
  expect(estimated.data).toBe(sent.data)
  checkNames(contract, sent.data, names)
}
