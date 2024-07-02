import type { SetEigenPodOperatorInput } from './types'
import { validateArgs } from '../../../../utils'


export const commonLogic = async (values: SetEigenPodOperatorInput) => {
  const { contracts, ownerAddress, userAddress, vaultAddress } = values

  validateArgs.address({ ownerAddress, userAddress, vaultAddress })

  const eigenPodOwnerContract = contracts.helpers.createEigenPodOwner(ownerAddress)

  return { eigenPodOwnerContract }
}
