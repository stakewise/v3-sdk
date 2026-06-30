import depositEncode from './depositEncode'
import { sendCalls } from '../helpers'
import type { DepositBatchInput } from './types'


const deposit = async (values: DepositBatchInput): Promise<StakeWise.TransactionHash> => {
  const { calls } = await depositEncode(values)

  return sendCalls({ ...values, calls })
}


export default deposit
