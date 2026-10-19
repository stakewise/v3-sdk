import { expect } from 'vitest'

import { estimatedGasCost } from '../../constants'

import type { FixtureMethod } from '../types'

import { checkRecordedTransaction } from './helpers'
import type { CheckGasInput } from './helpers'


type Wrapper = FixtureMethod<CheckEstimateGas, 'runner'>

export type CheckEstimateGas = <Input>(values: CheckGasInput<Input>) => Promise<void>

export const createCheckEstimateGas: Wrapper = ({ runner }) => async ({ method, input }) => {
  const [ encoded, gas ] = await Promise.all([ method.encode(input), method.estimateGas(input) ])

  expect(gas).toBe(estimatedGasCost)
  expect(runner.sent).toHaveLength(0)
  expect(runner.estimated).toHaveLength(1)

  const [ estimated ] = runner.estimated

  checkRecordedTransaction(estimated, encoded)
}
