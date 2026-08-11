import { wrapAbortPromise } from '../../../../modules/gql-module'

import { validate } from './validate'


export type GetLeverageStrategyProxyInput = StakeWise.BaseInput

const getLeverageStrategyProxy = (values: GetLeverageStrategyProxyInput) => {
  const { contracts } = values

  const { userAddress, vaultAddress } = validate(values)

  return contracts.special.leverageStrategyV2.getStrategyProxy(vaultAddress, userAddress)
}


export default wrapAbortPromise<GetLeverageStrategyProxyInput, string>(getLeverageStrategyProxy)
