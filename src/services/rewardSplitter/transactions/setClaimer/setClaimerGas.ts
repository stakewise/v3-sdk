import { commonLogic } from './common'
import { getGas } from '../../../../helpers'
import type { SetClaimerInput } from './types'


const setClaimerGas = async (values: SetClaimerInput) => {
  const { provider, claimerAddress } = values

  const rewardSplitterContract = await commonLogic(values)

  const estimatedGas = await rewardSplitterContract.setClaimer.estimateGas(claimerAddress)

  return getGas({ estimatedGas, provider })
}


export default setClaimerGas
