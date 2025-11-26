import { BaseInput } from '../../../utils'


export type ClaimExitQueueInput = BaseInput & {
  positions: Awaited<ReturnType<StakeWise.Services.Vault['getExitQueuePositions']>>['positions']
}

export interface ExtractClaimExitQueue {
  (values: StakeWise.ExtractInput<ClaimExitQueueInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimExitQueueInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimExitQueueInput>) => Promise<StakeWise.TransactionData>
}
