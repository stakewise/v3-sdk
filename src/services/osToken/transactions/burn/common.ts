import type { BurnInput } from './types'
import { validateArgs } from '../../../../helpers'


export const commonLogic = (values: BurnInput) => {
  const { contracts, vaultAddress, userAddress, shares } = values

  validateArgs.bigint({ shares })
  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  return vaultContract
}
