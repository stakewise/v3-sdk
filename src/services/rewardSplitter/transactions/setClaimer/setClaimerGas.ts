import { commonLogic } from './common'
import type { SetClaimerInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const setClaimerGas = async (values: SetClaimerInput) => {
  const { provider, claimerAddress } = values

  const rewardSplitterContract = await commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    rewardSplitterContract.setClaimer.estimateGas(claimerAddress),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default setClaimerGas
