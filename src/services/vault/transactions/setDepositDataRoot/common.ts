import { validate } from './validate'
import type { SetDepositDataRootInput } from './types'


export const commonLogic = (values: SetDepositDataRootInput) => {
  validate(values)

  return values.contracts.base.depositDataRegistry
}
