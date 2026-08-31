import type { ClaimRedeemerExitQueueArgs } from './validate'


export type ClaimRedeemerExitQueueInput = StakeWise.CommonParams & ClaimRedeemerExitQueueArgs

export interface ExtractClaimRedeemerExitQueue {
  (values: StakeWise.ExtractInput<ClaimRedeemerExitQueueInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimRedeemerExitQueueInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimRedeemerExitQueueInput>) => Promise<StakeWise.TransactionData>
}
