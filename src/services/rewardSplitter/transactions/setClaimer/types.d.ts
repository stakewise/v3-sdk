import type { BaseInput } from '../../../utils'


export type SetClaimerInput = Omit<BaseInput, 'vaultAddress'> & {
  claimerAddress: string
  rewardSplitterAddress: string
}

export interface ExtractSetClaimer {
  (values: StakeWise.ExtractInput<SetClaimerInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetClaimerInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetClaimerInput>) => Promise<StakeWise.TransactionData>
}
