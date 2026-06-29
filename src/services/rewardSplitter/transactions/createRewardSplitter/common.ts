import { parseArgs, baseInputSchema } from '../../../../helpers'

import type { CreateRewardSplitterInput } from './types'


export const commonLogic = async (values: CreateRewardSplitterInput) => {
  const { contracts, userAddress, provider } = values

  parseArgs(baseInputSchema, values)

  const signer = await provider.getSigner(userAddress)

  return contracts.base.rewardSplitterFactory.connect(signer)
}
