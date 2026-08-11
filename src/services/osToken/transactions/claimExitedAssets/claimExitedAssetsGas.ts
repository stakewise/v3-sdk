import { commonLogic } from './common'
import type { ClaimExitedAssetsInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const claimExitedAssetsGas = async (values: ClaimExitedAssetsInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, positionTicket, exitQueueIndex } = commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    redeemerContract.claimExitedAssets.estimateGas(positionTicket, exitQueueIndex, { from: userAddress }),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default claimExitedAssetsGas
