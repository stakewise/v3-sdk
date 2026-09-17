import getHarvestParams from '../../../services/vault/requests/getHarvestParams'
import type { HarvestParamsQueryPayload } from '../../../graphql/subgraph/vault'


type Input = StakeWise.CommonParams & {
  vaultAddress: string
}

export type HarvestArgs = Omit<HarvestParamsQueryPayload['harvestParams'], 'canHarvest' | 'isMetaVault'>

type Output = Promise<HarvestArgs | null>

const getHarvestArgs = async (values: Input): Output => {
  const { params, canHarvest, isMetaVault } = await getHarvestParams(values)

  if (canHarvest && !isMetaVault) {
    return params
  }

  return null
}


export default getHarvestArgs
