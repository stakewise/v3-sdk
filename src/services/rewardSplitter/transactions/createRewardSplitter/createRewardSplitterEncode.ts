import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'


const createRewardSplitterEncode = async (values: CreateRewardSplitterInput) => {
  const rewardSplitterFactory = await commonLogic(values)

  return rewardSplitterFactory.createRewardSplitter.populateTransaction(values.vaultAddress)
}


export default createRewardSplitterEncode
