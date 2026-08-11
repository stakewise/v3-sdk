import { commonLogic } from './common'
import type { EnterExitQueueInput } from './types'


const enterExitQueueEncode = async (values: EnterExitQueueInput): Promise<StakeWise.TransactionData> => {
  const { redeemerContract, userAddress, shares } = commonLogic(values)

  return redeemerContract.enterExitQueue.populateTransaction(shares, userAddress)
}


export default enterExitQueueEncode
