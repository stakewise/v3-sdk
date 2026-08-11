import { validate } from './validate'

import type { CreateRewardSplitterInput } from './types'


export const commonLogic = async (values: CreateRewardSplitterInput) => {
  const { contracts, provider } = values

  const { userAddress } = validate(values)

  const signer = await provider.getSigner(userAddress)

  return contracts.base.rewardSplitterFactory.connect(signer)
}
