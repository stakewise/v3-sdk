import unlockEncode from './unlockEncode'
import { sendCalls } from '../helpers'
import type { UnlockBatchInput } from './types'


const unlock = async (values: UnlockBatchInput): Promise<StakeWise.TransactionHash> => {
  const { calls } = await unlockEncode(values)

  return sendCalls({ ...values, calls })
}


export default unlock
