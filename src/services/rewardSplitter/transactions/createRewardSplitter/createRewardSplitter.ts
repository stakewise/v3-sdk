import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'
import { handleContractError } from '../../../../helpers'


const createRewardSplitter = async (values: CreateRewardSplitterInput) => {
  const rewardSplitterFactory = await commonLogic(values)

  const result = await handleContractError(
    rewardSplitterFactory.createRewardSplitter(values.vaultAddress),
    'transaction'
  )

  return result.hash
}


export default createRewardSplitter
