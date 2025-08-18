import { UpgradeLeverageStrategyInput } from './types'
import { commonLogic } from './common'


const upgradeLeverageStrategyEncode = async (values: UpgradeLeverageStrategyInput): Promise<StakeWise.TransactionData> => {
  const { vaultAddress } = values

  const leverageStrategyContract = await commonLogic(values)

  return leverageStrategyContract.upgradeProxy.populateTransaction(vaultAddress)
}


export default upgradeLeverageStrategyEncode
