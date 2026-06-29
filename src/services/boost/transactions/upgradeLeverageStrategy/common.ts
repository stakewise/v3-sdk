import { parseArgs } from '../../../../helpers'

import { upgradeLeverageStrategySchema, type UpgradeLeverageStrategyInput } from './types'


export const commonLogic = (values: UpgradeLeverageStrategyInput) => {
  const { contracts } = values

  parseArgs(upgradeLeverageStrategySchema, values)

  return contracts.special.leverageStrategy
}
