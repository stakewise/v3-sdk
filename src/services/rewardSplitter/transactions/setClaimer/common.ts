import { validateArgs } from '../../../../helpers'
import type { SetClaimerInput } from './types'


export const commonLogic = async (values: SetClaimerInput) => {
  const { contracts, userAddress, rewardSplitterAddress, claimerAddress, provider } = values

  validateArgs.address({ userAddress, claimerAddress, rewardSplitterAddress })

  const signer = await provider.getSigner(userAddress)

  return contracts.helpers.createRewardSplitter(rewardSplitterAddress).connect(signer)
}
