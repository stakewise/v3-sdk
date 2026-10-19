import { expect } from 'vitest'
import type { Result } from 'ethers'

import { userAddress } from '../../constants'
import decodeTransaction from '../../decodeTransaction'

import type { FixtureMethod } from '../types'

import type { CheckCallStaticInput } from './helpers'


type Wrapper = FixtureMethod<CheckCallStatic, 'runner'>

export type CheckCallStatic = (input: CheckCallStaticInput) => Promise<void>

export const createCheckCallStatic: Wrapper = ({ runner }) => async (input) => {
  const { run, contract, params, values: expectedValues } = input

  const [ results, address ] = await Promise.all([
    run({ params, callStatic: true }),
    contract.getAddress(),
  ])

  const resultValues = results.map((result: Result) => result.toArray())

  expect(resultValues).toEqual(expectedValues)
  expect(runner.calls).toHaveLength(1)

  const [ call ] = runner.calls
  const { name } = decodeTransaction(contract, call.data)

  expect(call.to).toBe(address)
  expect(call.from).toBe(userAddress)
  expect(name).toBe('multicall')
  expect(runner.sent).toHaveLength(0)
  expect(runner.estimated).toHaveLength(0)
}
