import { commonLogic } from './common'
import updateFeeRecipientsGas from './updateFeeRecipientsGas'
import updateFeeRecipientsEncode from './updateFeeRecipientsEncode'
import type { UpdateFeeRecipients } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const updateFeeRecipients: UpdateFeeRecipients = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await rewardSplitterMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

updateFeeRecipients.encode = updateFeeRecipientsEncode
updateFeeRecipients.estimateGas = updateFeeRecipientsGas


export default updateFeeRecipients
