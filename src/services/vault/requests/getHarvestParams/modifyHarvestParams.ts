import { HarvestParamsQueryPayload } from '../../../../graphql/subgraph/vault'
import { getDefaultHarvestParams } from '../../../../helpers'


const modifyHarvestParams = (data: HarvestParamsQueryPayload) => {
  const { canHarvest, isMetaVault, ...params } = data.harvestParams || {} as HarvestParamsQueryPayload['harvestParams']

  return {
    canHarvest,
    isMetaVault,
    params: getDefaultHarvestParams(params),
  }
}


export default modifyHarvestParams
