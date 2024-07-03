import { commonLogic } from './common'
import type { CreateRewardSplitter } from './types'
import createRewardSplitterGas from './createRewardSplitterGas'
import createRewardSplitterEncode from './createRewardSplitterEncode'


const createRewardSplitter: CreateRewardSplitter = async (values) => {
  const rewardSplitterFactory = await commonLogic(values)

  const result = await rewardSplitterFactory.createRewardSplitter(values.vaultAddress)

  return result.hash
}

createRewardSplitter.encode = createRewardSplitterEncode
createRewardSplitter.estimateGas = createRewardSplitterGas


export default createRewardSplitter
