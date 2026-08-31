import { commonLogic } from './common'
import type { ClaimRedeemerExitQueueInput } from './types'


const claimRedeemerExitQueueEncode = async (values: ClaimRedeemerExitQueueInput): Promise<StakeWise.TransactionData> => {
  const { redeemerContract, data } = commonLogic(values)

  return redeemerContract.multicall.populateTransaction(data)
}


export default claimRedeemerExitQueueEncode
