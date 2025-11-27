import graphql from '../../../../graphql'
import { apiUrls, validateArgs } from '../../../../helpers'
import modifyLeverageStrategyData from '../../helpers/modifyLeverageStrategyData'


export type GetLeverageStrategyDataInput = StakeWise.CommonParams & {
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
