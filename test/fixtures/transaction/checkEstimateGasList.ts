import { expect } from 'vitest'

import { userAddress, estimatedGasCost } from '../../constants'

import type { FixtureMethod } from '../types'

import { getListTransactions } from './helpers'
import type { EncodedList, CheckListInput } from './helpers'


type Wrapper = FixtureMethod<CheckEstimateGasList, 'runner'>

export type CheckEstimateGasList = <Input, Encoded extends EncodedList>(
  values: CheckListInput<Input, Encoded>
) => Promise<void>

export const createCheckEstimateGasList: Wrapper = ({ runner }) => async ({ method, input, order }) => {
  const [ encoded, gas ] = await Promise.all([ method.encode(input), method.estimateGas(input) ])
  const expected = getListTransactions(encoded, order)

  expect(gas).toBe(estimatedGasCost * BigInt(expected.length))
  expect(runner.sent).toHaveLength(0)
  expect(runner.estimated).toHaveLength(expected.length)

  expected.forEach(({ to, data, value }) => {
    const recorded = expect.objectContaining({
      to,
      data,
      value,
      from: userAddress,
    })

    expect(runner.estimated).toContainEqual(recorded)
  })
}
