import * as z from 'zod/mini'

import graphql from '../../../../graphql'
import { apiUrls, schema, parseArgs } from '../../../../helpers'
import modifyLeverageStrategyData from '../../helpers/modifyLeverageStrategyData'


const validateSchema = z.object({
  userAddress: schema.ethAddressLower,
  vaultAddress: schema.ethAddressLower,
})

export type GetLeverageStrategyDataInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getLeverageStrategyData = (values: GetLeverageStrategyDataInput) => {
  const { options } = values

  const { userAddress, vaultAddress } = parseArgs(validateSchema, values)

  return graphql.subgraph.boost.fetchLeverageStrategyDataQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      userAddress,
      vaultAddress,
    },
    modifyResult: modifyLeverageStrategyData,
  })
}


export default getLeverageStrategyData
