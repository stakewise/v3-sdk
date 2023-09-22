import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'


type GetHarvestParamsInput = {
  vaultAddress: string
  options: StakeWise.Options
}

const getHarvestParams = async (values: GetHarvestParamsInput) => {
  const { options, vaultAddress } = values

  const result = await subgraph.vault.fetchHarvestParamsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
  })

  return result.harvestParams
}


export default getHarvestParams
