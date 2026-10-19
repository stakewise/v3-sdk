import { commonLogic } from './common'
import type { UpgradeLeverageStrategyInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const upgradeLeverageStrategyGas = async (values: UpgradeLeverageStrategyInput) => {
  const { provider, userAddress, vaultAddress } = values

  const leverageStrategyContract = commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    leverageStrategyContract.upgradeProxy.estimateGas(vaultAddress, { from: userAddress }),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default upgradeLeverageStrategyGas
