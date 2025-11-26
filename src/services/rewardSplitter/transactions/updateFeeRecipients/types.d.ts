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

export interface ExtractUpdateFeeRecipients {
  (values: StakeWise.ExtractInput<UpdateFeeRecipientsInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UpdateFeeRecipientsInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UpdateFeeRecipientsInput>) => Promise<StakeWise.TransactionData>
}
