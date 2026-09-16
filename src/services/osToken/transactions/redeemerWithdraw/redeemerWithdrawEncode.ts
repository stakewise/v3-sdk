import { commonLogic } from './common'
import type { RedeemerWithdrawInput } from './types'


const redeemerWithdrawEncode = async (values: RedeemerWithdrawInput): Promise<StakeWise.TransactionData> => {
  const { redeemerContract, userAddress, shares } = commonLogic(values)

  return redeemerContract.enterExitQueue.populateTransaction(shares, userAddress)
}


export default redeemerWithdrawEncode
