import mockGraphql from '../mockGraphql'

import type { HarvestParamsQueryPayload } from '../../src/graphql/subgraph/vault'

import fork from './mocks/fork.json'


const mockForkHarvestParams = (canHarvest: boolean) => mockGraphql<HarvestParamsQueryPayload>({
  name: 'HarvestParams',
  data: { harvestParams: { ...fork.harvestParams, canHarvest } },
})


export default mockForkHarvestParams
