import Utils from '../../../../utils'
import { commonLogic } from './common'
import { DepositInput } from '../types'


type DepositDataOutput = StakeWise.TransactionData & {
  value: bigint
}

const depositEncode = async (values: DepositInput): Promise<DepositDataOutput> => {
  const multicallArgs = commonLogic(values)

  const utils = new Utils(values)
  const data = await utils.getVaultMulticallEncode(multicallArgs)

  return {
    ...data,
    value: values.assets,
  }
}


export default depositEncode
