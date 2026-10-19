import { expect } from 'vitest'
import type { TransactionDescription } from 'ethers'

import decodeCalls from '../../decodeCalls'
import { checkHarvestParams } from '../../harvestParams'

import type { FixtureMethod } from '../types'

import type { CheckHarvestInput } from './helpers'


type Wrapper = FixtureMethod<CheckHarvest, 'graphql'>

export type CheckHarvest = <Input extends { vaultAddress: string }>(
  values: CheckHarvestInput<Input>
) => Promise<TransactionDescription[]>

export const createCheckHarvest: Wrapper = ({ graphql }) => async (values) => {
  const { method, input, contract, names } = values

  const [ encoded, address ] = await Promise.all([ method.encode(input), contract.getAddress() ])

  const calls = decodeCalls(contract, String(encoded.data))
  const callNames = calls.map(({ name }) => name)
  const harvestParams = calls[0].args.at(-1)
  const harvestRequest = {
    operationName: 'HarvestParams',
    variables: { address: input.vaultAddress.toLowerCase() },
  }

  expect(encoded.to).toBe(address)
  expect(callNames).toEqual(names)
  checkHarvestParams(harvestParams)
  expect(graphql.calls).toContainEqual(expect.objectContaining(harvestRequest))

  return calls
}
