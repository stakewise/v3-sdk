import lockEncode from './lockEncode'
import { sendCalls } from '../helpers'
import type { LockBatchInput } from './types'


const lock = async (values: LockBatchInput): Promise<StakeWise.TransactionHash> => {
  const { calls } = await lockEncode(values)

  return sendCalls({ ...values, calls })
}


export default lock
