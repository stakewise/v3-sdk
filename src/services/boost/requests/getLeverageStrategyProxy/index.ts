import { validateArgs } from '../../../../utils'
import { wrapAbortPromise } from '../../../../modules/gql-module'


export type GetLeverageStrategyProxyInput = {
  contracts: StakeWise.Contracts
  userAddress: string
  vaultAddress: string
}

const getLeverageStrategyProxy = (values: GetLeverageStrategyProxyInput) => {
  const { contracts, userAddress, vaultAddress } = values

  validateArgs.address({ userAddress, vaultAddress })

  return contracts.special.leverageStrategyV2.getStrategyProxy(vaultAddress, userAddress)
}


export default wrapAbortPromise<GetLeverageStrategyProxyInput, string>(getLeverageStrategyProxy)
