import { validate } from './validate'
import { getDepositAndMintCalls } from '../helpers'
import type { DepositAndMintBatchInput } from './types'


const depositAndMintEncode = async (values: DepositAndMintBatchInput): Promise<StakeWise.BatchData> => {
  const { receiveShares } = validate(values)

  const calls = await getDepositAndMintCalls({ ...values, osTokenShares: receiveShares })

  return { calls }
}


export default depositAndMintEncode
