import { commonLogic } from './common'
import type { UpdateFeeRecipients } from './types'
import updateFeeRecipientsGas from './updateFeeRecipientsGas'
import { rewardSplitterMulticall } from '../../../../contracts'
import updateFeeRecipientsEncode from './updateFeeRecipientsEncode'


const updateFeeRecipients: UpdateFeeRecipients = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await rewardSplitterMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateFeeRecipients.encode = updateFeeRecipientsEncode
updateFeeRecipients.estimateGas = updateFeeRecipientsGas


export default updateFeeRecipients
