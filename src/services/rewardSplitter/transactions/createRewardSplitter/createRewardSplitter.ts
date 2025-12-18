import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const createRewardSplitter = async (values: CreateRewardSplitterInput) => {
  const rewardSplitterFactory = await commonLogic(values)

  const result = await wrapErrorHandler(
    rewardSplitterFactory.createRewardSplitter(values.vaultAddress),
    'transaction'
  )

  return result.hash
}


export default createRewardSplitter
