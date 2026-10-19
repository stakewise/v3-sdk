import { expect } from 'vitest'

import { userAddress, estimatedGas } from '../../constants'

import type { FixtureMethod } from '../types'

import { checkNames } from './helpers'
import type { CheckInput } from './helpers'


type Wrapper = FixtureMethod<CheckEstimateGas, 'runner'>

export type CheckEstimateGas = (input: CheckInput) => Promise<void>

export const createCheckEstimateGas: Wrapper = ({ runner }) => async (input) => {
  const { run, contract, params, names } = input

  const [ gas, address ] = await Promise.all([
    run({ params, estimateGas: true }),
    contract.getAddress(),
  ])

  expect(runner.estimated).toHaveLength(1)
  expect(runner.sent).toHaveLength(0)

  const [ estimated ] = runner.estimated

  expect(gas).toBe(estimatedGas)
  expect(estimated.to).toBe(address)
  expect(estimated.from).toBe(userAddress)
  checkNames(contract, estimated.data, names)
}
