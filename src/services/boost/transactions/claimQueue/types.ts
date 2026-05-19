import type { ClaimPosition } from '../../requests/getQueuePosition/modifyQueuePosition'


export type ClaimQueueInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  position: ClaimPosition
  leverageStrategyVersion?: number
}

export interface ExtractClaimQueue {
  (values: StakeWise.ExtractInput<ClaimQueueInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimQueueInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimQueueInput>) => Promise<StakeWise.TransactionData>
}

