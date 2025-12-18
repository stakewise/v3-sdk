import { commonLogic } from './common'
import type { CreateRewardSplitterInput } from './types'
import { getGas, handleContractError } from '../../../../helpers'


const createRewardSplitterGas = async (values: CreateRewardSplitterInput) => {
  const { provider } = values

  const rewardSplitterFactory = await commonLogic(values)

  const estimatedGas = await handleContractError(
    rewardSplitterFactory.createRewardSplitter.estimateGas(values.vaultAddress),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default createRewardSplitterGas
