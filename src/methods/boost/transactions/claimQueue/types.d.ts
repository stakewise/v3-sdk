import claimQueueGas from './claimQueueGas'
import claimQueueEncode from './claimQueueEncode'
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

export interface ClaimQueue {
  (values: ClaimQueueInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof claimQueueGas
  encode: typeof claimQueueEncode
}
