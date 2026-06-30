import { parseArgs, baseInputSchema } from '../../../../helpers'

import type { UpgradeLeverageStrategyInput } from './types'


export const commonLogic = (values: UpgradeLeverageStrategyInput) => {
  const { contracts } = values

  parseArgs(baseInputSchema, values)

  return contracts.special.leverageStrategy
}
