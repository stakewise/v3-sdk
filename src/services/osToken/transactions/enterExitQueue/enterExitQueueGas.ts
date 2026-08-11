import { commonLogic } from './common'
import type { EnterExitQueueInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const enterExitQueueGas = async (values: EnterExitQueueInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, shares } = commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    redeemerContract.enterExitQueue.estimateGas(shares, userAddress, { from: userAddress }),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default enterExitQueueGas
