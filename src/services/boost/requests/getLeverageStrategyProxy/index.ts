import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'


const validateSchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
})

export type GetLeverageStrategyProxyInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getLeverageStrategyProxy = (values: GetLeverageStrategyProxyInput) => {
  const { contracts, userAddress, vaultAddress } = values

  parseArgs(validateSchema, values)

  return contracts.special.leverageStrategyV2.getStrategyProxy(vaultAddress, userAddress)
}


export default wrapAbortPromise<GetLeverageStrategyProxyInput, string>(getLeverageStrategyProxy)
