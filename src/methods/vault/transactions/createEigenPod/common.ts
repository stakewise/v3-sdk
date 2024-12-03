import type { CreateEigenPodInput } from './types'
import { validateArgs } from '../../../../utils'


export const commonLogic = async (values: CreateEigenPodInput) => {
  const { contracts, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const contract = contracts.helpers.createVault({
    options: { isRestake: true },
    vaultAddress,
  })

  return contract
}
