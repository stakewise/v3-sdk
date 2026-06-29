import { parseArgs } from '../../../../helpers'

import { setClaimerSchema, type SetClaimerInput } from './types'


export const commonLogic = async (values: SetClaimerInput) => {
  const { contracts, userAddress, rewardSplitterAddress, provider } = values

  parseArgs(setClaimerSchema, values)

  const signer = await provider.getSigner(userAddress)

  return contracts.helpers.createRewardSplitter(rewardSplitterAddress).connect(signer)
}
