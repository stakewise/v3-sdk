import { validate } from './validate'
import type { SetClaimerInput } from './types'


export const commonLogic = async (values: SetClaimerInput) => {
  const { contracts, provider } = values

  const { userAddress, rewardSplitterAddress } = validate(values)

  const signer = await provider.getSigner(userAddress)

  return contracts.helpers.createRewardSplitter(rewardSplitterAddress).connect(signer)
}
