import { commonLogic } from './common'
import type { ClaimRedeemerExitQueueInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const claimRedeemerExitQueueGas = async (values: ClaimRedeemerExitQueueInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, data } = commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    redeemerContract.multicall.estimateGas(data, { from: userAddress }),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default claimRedeemerExitQueueGas
