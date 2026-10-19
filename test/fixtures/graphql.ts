import type { GraphqlCall } from '../mockGraphql'
import { mockHarvestParams } from '../harvestParams'
import mockGraphql, { calls, mockGraphqlError } from '../mockGraphql'

import type { Fixture } from './types'


export type GraphqlFixture = {
  calls: GraphqlCall[]
  mock: typeof mockGraphql
  mockError: typeof mockGraphqlError
  mockHarvestParams: typeof mockHarvestParams
}

const graphql: Fixture<'graphql'> = () => ({
  calls,
  mock: mockGraphql,
  mockHarvestParams,
  mockError: mockGraphqlError,
})


export default graphql
