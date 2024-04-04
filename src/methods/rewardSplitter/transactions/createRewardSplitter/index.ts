import { commonLogic } from './common'
import createRewardSplitterGas from './createRewardSplitterGas'
import createRewardSplitterEncode from './createRewardSplitterEncode'
import type { CreateRewardSplitter } from './types'


const createRewardSplitter: CreateRewardSplitter = async (values) => {
  const rewardSplitterFactory = await commonLogic(values)

  const result = await rewardSplitterFactory.createRewardSplitter(values.vaultAddress)

  return result.hash
}

createRewardSplitter.encode = createRewardSplitterEncode
createRewardSplitter.estimateGas = createRewardSplitterGas


export default createRewardSplitter
