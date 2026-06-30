import depositAndBoostEncode from './depositAndBoostEncode'
import { sendCalls } from '../helpers'
import type { DepositAndBoostInput } from './types'


const depositAndBoost = async (values: DepositAndBoostInput): Promise<StakeWise.TransactionHash> => {
  const { calls } = await depositAndBoostEncode(values)

  return sendCalls({ ...values, calls })
}


export default depositAndBoost
