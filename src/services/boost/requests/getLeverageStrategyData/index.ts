import graphql from '../../../../graphql'
import { apiUrls, parseArgs, baseInputSchema } from '../../../../helpers'
import modifyLeverageStrategyData from '../../helpers/modifyLeverageStrategyData'


export type GetLeverageStrategyDataInput = StakeWise.BaseInput

const getLeverageStrategyData = (values: GetLeverageStrategyDataInput) => {
  const { options, userAddress, vaultAddress } = values

  parseArgs(baseInputSchema, values)

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
