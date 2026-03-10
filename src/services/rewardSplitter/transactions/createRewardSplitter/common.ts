import { validateArgs } from '../../../../helpers'
import type { CreateRewardSplitterInput } from './types'


export const commonLogic = async (values: CreateRewardSplitterInput) => {
  const { contracts, userAddress, vaultAddress, provider } = values

  validateArgs.address({ vaultAddress, userAddress })

  const signer = await provider.getSigner(userAddress)

  return contracts.base.rewardSplitterFactory.connect(signer)
}
