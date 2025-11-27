import { commonLogic } from './common'
import type { UpdateFeeRecipientsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const updateFeeRecipients = async (values: UpdateFeeRecipientsInput) => {
  const multicallArgs = await commonLogic(values)

  const result = await rewardSplitterMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default updateFeeRecipients
