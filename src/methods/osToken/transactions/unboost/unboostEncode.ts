import { UnboostInput } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const unboostEncode = (values: UnboostInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return boostMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })
}


export default unboostEncode