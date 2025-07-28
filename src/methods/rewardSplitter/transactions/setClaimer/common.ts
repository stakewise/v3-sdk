import { validateArgs } from '../../../../utils'
import type { SetClaimerInput } from './types'


export const commonLogic = async (values: SetClaimerInput) => {
  const {
    contracts, userAddress, vaultAddress,
    rewardSplitterAddress, claimerAddress, provider,
  } = values

  validateArgs.address({ vaultAddress, userAddress, claimerAddress, rewardSplitterAddress })

  const signer = await provider.getSigner(userAddress)

  return contracts.helpers.createRewardSplitter(rewardSplitterAddress).connect(signer)
}
