import { parseArgs } from '../../../../helpers'

import { setDepositDataRootSchema, type SetDepositDataRootInput } from './types'


export const commonLogic = (values: SetDepositDataRootInput) => {
  parseArgs(setDepositDataRootSchema, values)

  return values.contracts.base.depositDataRegistry
}
