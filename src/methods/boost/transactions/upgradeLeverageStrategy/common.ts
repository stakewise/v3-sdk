import type { UpgradeLeverageStrategyInput } from './types'
import { validateArgs } from '../../../../utils'


export const commonLogic = (values: UpgradeLeverageStrategyInput) => {
  const { contracts, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  return contracts.special.leverageStrategy
}
