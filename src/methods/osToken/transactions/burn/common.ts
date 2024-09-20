import type { BurnInput } from './types'
import { validateArgs } from '../../../../utils'


export const commonLogic = (values: BurnInput) => {
  const { contracts, vaultAddress, userAddress, shares } = values

  validateArgs.bigint({ shares })
  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  return vaultContract
}
