import { apiUrls, validateArgs } from '../../../utils'
import graphql from '../../../graphql'


type GetHarvestParamsInput = {
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
    modifyResult: (data) => data.harvestParams,
  })
}


export default getHarvestParams
