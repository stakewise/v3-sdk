import { commonLogic } from './common'
import type { ClaimExitedAssetsInput } from './types'


const claimExitedAssetsEncode = async (values: ClaimExitedAssetsInput): Promise<StakeWise.TransactionData> => {
  const { redeemerContract, positionTicket, exitQueueIndex } = commonLogic(values)

  return redeemerContract.claimExitedAssets.populateTransaction(positionTicket, exitQueueIndex)
}


export default claimExitedAssetsEncode
