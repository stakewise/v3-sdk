import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'


const createRewardSplitterEncode = async (values: CreateRewardSplitterInput) => {
  const rewardSplitterFactory = await commonLogic(values)

  const rx = await rewardSplitterFactory.createRewardSplitter.populateTransaction(values.vaultAddress)

  return {
    data: rx.data,
    to: rx.to,
  }
}


export default createRewardSplitterEncode
