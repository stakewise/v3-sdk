import { commonLogic } from './common'
import type { RedeemerWithdrawInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const redeemerWithdrawGas = async (values: RedeemerWithdrawInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, shares } = commonLogic(values)

  const estimatedGas = await wrapErrorHandler(
    redeemerContract.enterExitQueue.estimateGas(shares, userAddress, { from: userAddress }),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default redeemerWithdrawGas
