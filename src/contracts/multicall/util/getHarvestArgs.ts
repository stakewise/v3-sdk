import getHarvestParams from '../../../methods/vault/requests/getHarvestParams'
import type { HarvestParamsQueryPayload } from '../../../graphql/subgraph/vault'


type Input<T> = {
  options: StakeWise.Options
  vaultAddress: string
}

const getHarvestArgs = async <T>(props: Input<T>): Promise<HarvestParamsQueryPayload['harvestParams'] | null> => {
  const { options, vaultAddress } = props

  const harvestParams = await getHarvestParams({
    options,
    vaultAddress,
  })

  if (harvestParams?.canHarvest) {
    return harvestParams
  }

  return null
}


export default getHarvestArgs
