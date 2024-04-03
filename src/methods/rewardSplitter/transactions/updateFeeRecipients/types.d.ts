import updateFeeRecipientsGas from './updateFeeRecipientsGas'
import updateFeeRecipientsEncode from './updateFeeRecipientsEncode'
import type { BaseInput } from '../../../utils'
import type { FeeRecipient as SubgraphFeeRecipient } from '../../../vault/requests/getRewardSplitters/types'


export type FeeRecipient = Pick<SubgraphFeeRecipient, 'address' | 'shares'> & {
  percent?: number
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
