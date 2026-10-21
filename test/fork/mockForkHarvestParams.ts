import mockGraphql from '../mockGraphql'

import type { HarvestParamsQueryPayload } from '../../src/graphql/subgraph/vault'

import type { ForkSnapshot } from './snapshots'


const mockForkHarvestParams = (snapshot: ForkSnapshot, canHarvest: boolean) => mockGraphql<HarvestParamsQueryPayload>({
  name: 'HarvestParams',
  data: { harvestParams: { ...snapshot.harvestParams, canHarvest } },
})


export default mockForkHarvestParams
