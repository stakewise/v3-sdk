import depositAndMintEncode from './depositAndMintEncode'
import { sendCalls } from '../helpers'
import type { DepositAndMintBatchInput } from './types'


const depositAndMint = async (values: DepositAndMintBatchInput): Promise<StakeWise.TransactionHash> => {
  const { calls } = await depositAndMintEncode(values)

  return sendCalls({ ...values, calls })
}


export default depositAndMint
