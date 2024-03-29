import { commonLogic } from './common'
import { DepositInput } from '../types'
import { getMulticallEncode } from '../../../utils'


type DepositDataOutput = StakeWise.TransactionData & {
  value: bigint
}

const depositEncode = async (values: DepositInput): Promise<DepositDataOutput> => {
  const multicallArgs = commonLogic(values)

  const data = await getMulticallEncode(multicallArgs)

  return {
    ...data,
    value: values.assets,
  }
}


export default depositEncode
