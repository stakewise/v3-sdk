import claimExitQueueGas from './claimExitQueueGas'
import claimExitQueueEncode from './claimExitQueueEncode'


export type ClaimExitQueueInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
  positions: Awaited<ReturnType<StakeWise.VaultMethods['getExitQueuePositions']>>['positions']
}

export interface ClaimExitQueue {
  (values: ClaimExitQueueInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof claimExitQueueGas
  encode: typeof claimExitQueueEncode
}
