import { SetDepositDataRootInput } from './types'
import { validateArgs } from '../../../../utils'


export const commonLogic = (values: SetDepositDataRootInput) => {
  const { vaultAddress, validatorsRoot, userAddress } = values

  validateArgs.string({ validatorsRoot })
  validateArgs.address({ vaultAddress, userAddress })

  return values.contracts.base.depositDataRegistry
}
