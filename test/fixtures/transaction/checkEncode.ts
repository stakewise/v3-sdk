import { expect } from 'vitest'

import decodeCalls from '../../decodeCalls'

import type { FixtureMethod } from '../types'

import type { CheckEncodeInput, EncodedTransaction } from './helpers'


type Wrapper = FixtureMethod<CheckEncode>

export type CheckEncode = <Input>(values: CheckEncodeInput<Input>) => Promise<EncodedTransaction>

export const createCheckEncode: Wrapper = () => async (values) => {
  const { method, input, contract, calls } = values

  const [ encoded, address ] = await Promise.all([ method.encode(input), contract.getAddress() ])

  const decoded = decodeCalls(contract, String(encoded.data))
  const decodedCalls = decoded.map(({ name, args }) => ({ name, args: args.toArray() }))

  expect(encoded.to).toBe(address)
  expect(decodedCalls).toEqual(calls)

  return encoded
}
