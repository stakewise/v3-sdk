import { commonLogic } from './common'
import { getGas } from '../../../../helpers'
import type { CreateRewardSplitterInput } from './types'


const createRewardSplitterGas = async (values: CreateRewardSplitterInput) => {
  const { provider } = values

  const rewardSplitterFactory = await commonLogic(values)

  const estimatedGas = await rewardSplitterFactory.createRewardSplitter.estimateGas(values.vaultAddress)

  return getGas({ estimatedGas, provider })
}


export default createRewardSplitterGas
