import updateFeeRecipients from './updateFeeRecipients'
import updateFeeRecipientsGas from './updateFeeRecipientsGas'
import updateFeeRecipientsEncode from './updateFeeRecipientsEncode'
import type { UpdateFeeRecipientsInput, ExtractUpdateFeeRecipients } from './types'


export const createUpdateFeeRecipients = (params: StakeWise.CommonParams): ExtractUpdateFeeRecipients  => {
  const result = (values: StakeWise.ExtractInput<UpdateFeeRecipientsInput>) => updateFeeRecipients({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<UpdateFeeRecipientsInput>) => updateFeeRecipientsEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<UpdateFeeRecipientsInput>) => updateFeeRecipientsGas({ ...params, ...values })

  return result
}

export type { ExtractUpdateFeeRecipients } from './types'
