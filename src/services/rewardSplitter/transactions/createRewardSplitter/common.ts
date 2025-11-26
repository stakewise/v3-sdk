import { validateArgs } from '../../../../utils'
import type { CreateRewardSplitterInput } from './types'
import { checkAdminAccess } from '../../../vault/transactions/util'


export const commonLogic = async (values: CreateRewardSplitterInput) => {
  const { contracts, userAddress, vaultAddress, provider } = values

  validateArgs.address({ vaultAddress, userAddress })

  await checkAdminAccess(values)

  const signer = await provider.getSigner(userAddress)

  return contracts.base.rewardSplitterFactory.connect(signer)
}
