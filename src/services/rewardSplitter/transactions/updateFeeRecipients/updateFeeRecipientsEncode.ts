import { commonLogic } from './common'
import type { UpdateFeeRecipientsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const updateFeeRecipientsEncode = async (values: UpdateFeeRecipientsInput) => {
  const multicallArgs = await commonLogic(values)

  return rewardSplitterMulticall<{ data: string, to: string }>({
    ...multicallArgs,
    request: {
      ...multicallArgs.request,
      transactionData: true,
    },
  })
}


export default updateFeeRecipientsEncode
