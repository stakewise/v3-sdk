import { commonLogic } from './common'
import type { UpgradeLeverageStrategyInput } from './types'
import { getGas, handleContractError } from '../../../../helpers'


const upgradeLeverageStrategyGas = async (values: UpgradeLeverageStrategyInput) => {
  const { provider, vaultAddress } = values

  const leverageStrategyContract = commonLogic(values)

  const estimatedGas = await handleContractError(
    leverageStrategyContract.upgradeProxy.estimateGas(vaultAddress),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default upgradeLeverageStrategyGas
