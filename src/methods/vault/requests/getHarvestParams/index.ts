import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'


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
    modifyResult: (data) => {
      const { canHarvest, ...params } = data.harvestParams || {}

      return {
        canHarvest,
        params: {
          proof: params.proof || [],
          reward: params.reward || 0n,
          rewardsRoot: params.rewardsRoot,
          unlockedMevReward: params.unlockedMevReward || 0n,
        },
      }
    },
  })
}


export default getHarvestParams
