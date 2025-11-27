import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'


const createRewardSplitter = async (values: CreateRewardSplitterInput) => {
  const rewardSplitterFactory = await commonLogic(values)

  const result = await rewardSplitterFactory.createRewardSplitter(values.vaultAddress)

  return result.hash
}


export default createRewardSplitter
