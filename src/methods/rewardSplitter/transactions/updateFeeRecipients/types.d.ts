import updateFeeRecipientsGas from './updateFeeRecipientsGas'
import updateFeeRecipientsEncode from './updateFeeRecipientsEncode'
import type { BaseInput } from '../../../utils'


export type FeeRecipient = {
  address: string
  percent: bigint
}

export type UpdateFeeRecipientsInput = BaseInput & {
  rewardSplitterAddress: string
  feeRecipients: FeeRecipient[]
  oldFeeRecipients?: FeeRecipient[]
}

export interface UpdateFeeRecipients {
  (values: UpdateFeeRecipientsInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof updateFeeRecipientsGas
  encode: typeof updateFeeRecipientsEncode
}
