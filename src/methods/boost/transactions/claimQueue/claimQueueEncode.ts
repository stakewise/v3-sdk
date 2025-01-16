import { commonLogic } from './common'
import { ClaimQueueInput } from './types'
import { boostMulticall } from '../../../../contracts'


const claimQueueEncode = (values: ClaimQueueInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return boostMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })
}


export default claimQueueEncode
