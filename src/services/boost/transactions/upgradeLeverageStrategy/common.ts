import { validate } from './validate'

import type { UpgradeLeverageStrategyInput } from './types'


export const commonLogic = (values: UpgradeLeverageStrategyInput) => {
  const { contracts } = values

  validate(values)

  return contracts.special.leverageStrategy
}
