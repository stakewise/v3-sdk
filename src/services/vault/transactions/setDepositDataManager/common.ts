import { SetDepositDataManagerInput } from './types'
import { validateArgs } from '../../../../helpers'


export const commonLogic = (values: SetDepositDataManagerInput) => {
  const { vaultAddress, managerAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress, managerAddress })

  return values.contracts.base.depositDataRegistry
}
