import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import modifyHarvestParams from './modifyHarvestParams'


export type GetHarvestParamsInput = {
  vaultAddress: string
  options: StakeWise.Options
}

const getHarvestParams = (values: GetHarvestParamsInput) => {
  const { options, vaultAddress } = values

  validateArgs.address({ vaultAddress })

  return graphql.subgraph.vault.fetchHarvestParamsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    modifyResult: modifyHarvestParams,
  })
}


export default getHarvestParams
