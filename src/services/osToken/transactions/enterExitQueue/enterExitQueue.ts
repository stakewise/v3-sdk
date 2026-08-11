import { commonLogic } from './common'
import type { EnterExitQueueInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const enterExitQueue = async (values: EnterExitQueueInput) => {
  const { provider } = values

  const { redeemerContract, userAddress, shares } = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = redeemerContract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.enterExitQueue(shares, userAddress),
    'transaction'
  )

  return result.hash
}


export default enterExitQueue
