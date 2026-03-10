import { commonLogic } from './common'
import type { UpdateFeeRecipientsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'
import { checkAccess } from '../../../vault/transactions/util'


const updateFeeRecipients = checkAccess<UpdateFeeRecipientsInput>(async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await rewardSplitterMulticall<{ hash: string }>(multicallArgs)

  return result.hash
})


export default updateFeeRecipients
