import { wrapAbortPromise } from '../../../modules/gql-module'


type GetLeverageStrategyProxyInput = {
  contracts: StakeWise.Contracts
  userAddress: string
  vaultAddress: string
}

const getLeverageStrategyProxy = (values: GetLeverageStrategyProxyInput) => {
  const { contracts, userAddress, vaultAddress } = values

  return contracts.special.leverageStrategy.getStrategyProxy(vaultAddress, userAddress)
}


export default wrapAbortPromise<GetLeverageStrategyProxyInput, string>(getLeverageStrategyProxy)
