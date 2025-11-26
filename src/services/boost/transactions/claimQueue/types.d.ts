import type { ClaimPosition } from '../../requests/getQueuePosition/modifyQueuePosition'


export type ClaimQueueInput = {
  userAddress: string
  vaultAddress: string
  leverageStrategyVersion?: number
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
  position: ClaimPosition
}

export interface ExtractClaimQueue {
  (values: StakeWise.ExtractInput<ClaimQueueInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimQueueInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimQueueInput>) => Promise<StakeWise.TransactionData>
}

