import { SetDepositDataRootInput } from './types'
import { validateArgs } from '../../../../helpers'


export const commonLogic = (values: SetDepositDataRootInput) => {
  const { vaultAddress, depositDataRoot, userAddress } = values

  validateArgs.string({ depositDataRoot })
  validateArgs.address({ vaultAddress, userAddress })

  return values.contracts.base.depositDataRegistry
}
