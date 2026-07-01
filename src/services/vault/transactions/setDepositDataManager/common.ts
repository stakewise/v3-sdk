import { validate } from './validate'
import type { SetDepositDataManagerInput } from './types'


export const commonLogic = (values: SetDepositDataManagerInput) => {
  validate(values)

  return values.contracts.base.depositDataRegistry
}
