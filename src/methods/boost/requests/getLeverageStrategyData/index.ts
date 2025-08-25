import graphql from 'graphql'
import { apiUrls, validateArgs } from '../../../../utils'

import modifyLeverageStrategyData from '../../util/modifyLeverageStrategyData'


type GetLeverageStrategyDataInput = {
  options: StakeWise.Options
  userAddress: string
  vaultAddress: string
}

const getLeverageStrategyData = (values: GetLeverageStrategyDataInput) => {
  const { options, userAddress, vaultAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  return graphql.subgraph.boost.fetchLeverageStrategyDataQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      userAddress: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: modifyLeverageStrategyData,
  })
}


export default getLeverageStrategyData
