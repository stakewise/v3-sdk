import { parseArgs } from '../../../../helpers'

import { setDepositDataManagerSchema, type SetDepositDataManagerInput } from './types'


export const commonLogic = (values: SetDepositDataManagerInput) => {
  parseArgs(setDepositDataManagerSchema, values)

  return values.contracts.base.depositDataRegistry
}
