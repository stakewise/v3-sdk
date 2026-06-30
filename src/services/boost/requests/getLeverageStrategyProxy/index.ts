import { parseArgs, baseInputSchema } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'


export type GetLeverageStrategyProxyInput = StakeWise.BaseInput

const getLeverageStrategyProxy = (values: GetLeverageStrategyProxyInput) => {
  const { contracts, userAddress, vaultAddress } = values

  parseArgs(baseInputSchema, values)

  return contracts.special.leverageStrategyV2.getStrategyProxy(vaultAddress, userAddress)
}


export default wrapAbortPromise<GetLeverageStrategyProxyInput, string>(getLeverageStrategyProxy)
