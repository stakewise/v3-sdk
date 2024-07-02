import getHarvestParams from '../../../methods/vault/requests/getHarvestParams'
import type { KeeperAbi } from '../../types'
import type { HarvestParamsQueryPayload } from '../../../graphql/subgraph/vault'


type Input<T> = {
  options: StakeWise.Options
  vaultAddress: string
  keeperContract: KeeperAbi
}

const getHarvestArgs = async <T>(props: Input<T>): Promise<HarvestParamsQueryPayload['harvestParams'] | null> => {
  const { options, vaultAddress, keeperContract } = props

  const [ harvestParams, canHarvest ] = await Promise.all([
    getHarvestParams({ options, vaultAddress }),
    keeperContract.canHarvest(vaultAddress),
  ])

  if (canHarvest) {
    return harvestParams
  }

  return null
}


export default getHarvestArgs
