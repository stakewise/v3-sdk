import getHarvestParams from '../../../methods/vault/requests/getHarvestParams'
import type { HarvestParamsQueryPayload } from '../../../graphql/subgraph/vault'


type Input<T> = {
  options: StakeWise.Options
  vaultAddress: string
}

type Output = Promise<Omit<HarvestParamsQueryPayload['harvestParams'], 'canHarvest'> | null>

const getHarvestArgs = async <T>(props: Input<T>): Output => {
  const { options, vaultAddress } = props

  const { params, canHarvest } = await getHarvestParams({
    options,
    vaultAddress,
  })

  if (canHarvest) {
    return params
  }

  return null
}


export default getHarvestArgs
