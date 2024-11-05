import { LockInput } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const lockEncode = async (values: LockInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = await commonLogic(values)

  return boostMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })
}


export default lockEncode
