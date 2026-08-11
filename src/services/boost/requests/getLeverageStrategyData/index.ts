import graphql from '../../../../graphql'
import { apiUrls } from '../../../../helpers'
import modifyLeverageStrategyData from '../../helpers/modifyLeverageStrategyData'

import { validate } from './validate'


export type GetLeverageStrategyDataInput = StakeWise.BaseInput

const getLeverageStrategyData = (values: GetLeverageStrategyDataInput) => {
  const { options } = values

  const { userAddress, vaultAddress } = validate(values)

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
