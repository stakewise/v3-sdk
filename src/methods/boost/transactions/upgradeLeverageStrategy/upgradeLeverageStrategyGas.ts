import { commonLogic } from './common'
import type { UpgradeLeverageStrategyInput } from './types'
import { getGas } from '../../../../utils'


const upgradeLeverageStrategyGas = async (values: UpgradeLeverageStrategyInput) => {
  const { provider, vaultAddress } = values

  const leverageStrategyContract = commonLogic(values)

  const estimatedGas = await leverageStrategyContract.upgradeProxy.estimateGas(vaultAddress)

  return getGas({ estimatedGas, provider })
}


export default upgradeLeverageStrategyGas
