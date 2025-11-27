import getHarvestParams from '../../../services/vault/requests/getHarvestParams'
import type { HarvestParamsQueryPayload } from '../../../graphql/subgraph/vault'


type Input = StakeWise.CommonParams & {
  vaultAddress: string
}

type Output = Promise<Omit<HarvestParamsQueryPayload['harvestParams'], 'canHarvest'> | null>

const getHarvestArgs = async (values: Input): Output => {
  const { params, canHarvest } = await getHarvestParams(values)

  if (canHarvest) {
    return params
  }

  return null
}


export default getHarvestArgs
